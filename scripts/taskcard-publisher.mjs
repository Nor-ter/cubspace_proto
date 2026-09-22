import fs from 'node:fs';
import path from 'node:path';
import { readJson, writeJson } from './ticket-lib.mjs';

const validId = (value) =>
  typeof value === 'string' && /^[a-zA-Z0-9_-]+$/.test(value);
const parentId = (task) => String(task.parent?.id ?? task.parent ?? '');
const normalise = (value) =>
  String(value ?? '')
    .replace(/\r\n/g, '\n')
    .trim();
const taskMarkdown = (task) =>
  task.markdown_description ?? task.description ?? task.text_content ?? '';

export async function publishTaskcard(
  state,
  settings,
  markdown,
  token,
  receiptPath,
  request = fetch,
) {
  const ticketId = state.ticket.id;
  const name = state.ticket.title;
  if (
    !validId(settings.parent_id) ||
    !validId(ticketId) ||
    !name?.trim() ||
    !settings.status?.trim()
  )
    throw new Error('Taskcard의 ID, 제목, 부모 task와 상태를 확인하세요.');
  const marker = `CubSpace task: ${ticketId}`;
  const content = `${normalise(markdown)}\n\n${marker}`;
  const owns = (task) =>
    normalise(taskMarkdown(task))
      .split('\n')
      .some((line) => line.trim() === marker);
  const lockPath = `${receiptPath}.lock`;
  fs.mkdirSync(path.dirname(receiptPath), { recursive: true });
  try {
    fs.writeFileSync(lockPath, `${process.pid}\n`, { flag: 'wx' });
  } catch (error) {
    if (error.code === 'EEXIST')
      throw new Error('같은 Taskcard를 다른 프로세스가 게시 중입니다.');
    throw error;
  }
  const record = (event, details = {}) =>
    fs.appendFileSync(
      `${receiptPath.replace(/\.json$/, '')}.events.jsonl`,
      JSON.stringify({
        event,
        run: state.id,
        ticket_id: ticketId,
        fingerprint: state.fingerprint,
        parent_id: settings.parent_id,
        at: new Date().toISOString(),
        ...details,
      }) + '\n',
    );
  const api = async (route, method = 'GET', body) => {
    let response;
    try {
      response = await request(`https://api.clickup.com/api/v2/${route}`, {
        method,
        headers: { Authorization: token, 'Content-Type': 'application/json' },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        signal: AbortSignal.timeout(15000),
      });
    } catch {
      throw new Error('ClickUp 응답을 받지 못했습니다.');
    }
    if (!response.ok) {
      const error = new Error(`ClickUp HTTP ${response.status}`);
      error.httpStatus = response.status;
      throw error;
    }
    try {
      return await response.json();
    } catch {
      throw new Error('ClickUp 응답 형식을 확인하지 못했습니다.');
    }
  };
  const detail = (id) =>
    api(`task/${encodeURIComponent(id)}?include_markdown_description=true`);
  try {
    let receipt = fs.existsSync(receiptPath) ? readJson(receiptPath) : null;
    if (
      receipt &&
      (receipt.ticket_id !== ticketId ||
        receipt.parent_id !== settings.parent_id ||
        receipt.run !== state.id)
    )
      throw new Error('기존 게시 기록과 Taskcard 또는 부모 task가 다릅니다.');
    const parent = await api(
      `task/${settings.parent_id}?include_subtasks=true`,
    );
    const listId = String(parent.list?.id ?? '');
    if (String(parent.id) !== settings.parent_id || !validId(listId))
      throw new Error('ClickUp 부모 task와 list를 확인하지 못했습니다.');
    const list = await api(`list/${listId}`);
    const status = list.statuses?.find(
      (entry) => entry.status === settings.status,
    )?.status;
    if (!status) throw new Error('지정한 상태가 ClickUp list에 없습니다.');
    const children = new Map();
    for (let page = 0; ; page++) {
      if (page >= 1000)
        throw new Error(
          'ClickUp task 목록이 너무 큽니다. 부모 범위를 확인하세요.',
        );
      const result = await api(
        `list/${listId}/task?subtasks=true&include_closed=true&page=${page}`,
      );
      if (!Array.isArray(result.tasks))
        throw new Error('ClickUp task 목록을 확인하지 못했습니다.');
      for (const task of result.tasks) {
        if (parentId(task) === settings.parent_id && validId(String(task.id)))
          children.set(String(task.id), task);
      }
      if (
        result.last_page === true ||
        (result.last_page !== false && result.tasks.length < 100)
      )
        break;
    }
    for (const task of parent.subtasks ?? []) {
      if (validId(String(task.id))) children.set(String(task.id), task);
    }
    if (receipt?.task_id)
      children.set(receipt.task_id, { id: receipt.task_id });
    const owned = [];
    let nameConflict = false;
    for (const id of children.keys()) {
      const task = await detail(id);
      if (String(task.id) !== id || parentId(task) !== settings.parent_id) {
        if (receipt?.task_id === id)
          throw new Error('기존 Taskcard의 부모가 변경됐습니다.');
        continue;
      }
      if (owns(task)) owned.push(task);
      else if (task.name === name || receipt?.task_id === id)
        nameConflict = true;
    }
    if (owned.length > 1 || nameConflict)
      throw new Error(
        '같은 이름 또는 식별자가 있는 Taskcard를 확인하세요. 기존 task를 변경하지 않았습니다.',
      );
    let task = owned[0];
    if (receipt?.task_id && task && receipt.task_id !== String(task.id))
      throw new Error('게시 기록과 ClickUp Taskcard ID가 다릅니다.');
    if (!task && receipt)
      throw new Error(
        '이전 생성 결과가 확인되지 않았습니다. 자동으로 다시 생성하지 않습니다.',
      );
    receipt = {
      run: state.id,
      ticket_id: ticketId,
      fingerprint: state.fingerprint,
      parent_id: settings.parent_id,
      status: 'pending',
      ...(task ? { task_id: String(task.id) } : {}),
    };
    writeJson(receiptPath, receipt);
    const body = { name, markdown_content: content, status };
    if (!task) {
      record('create_attempted');
      try {
        task = await api(`list/${listId}/task`, 'POST', {
          ...body,
          parent: settings.parent_id,
          notify_all: false,
        });
        if (!validId(String(task?.id ?? '')))
          throw new Error('ClickUp task ID를 확인하지 못했습니다.');
      } catch (error) {
        const rejected =
          error.httpStatus >= 400 &&
          error.httpStatus < 500 &&
          error.httpStatus !== 408;
        record(
          rejected ? 'create_rejected' : 'create_response_unknown',
          error.httpStatus ? { http_status: error.httpStatus } : {},
        );
        if (rejected) fs.rmSync(receiptPath);
        throw error;
      }
      receipt.task_id = String(task.id);
      writeJson(receiptPath, receipt);
      record('created', { task_id: receipt.task_id });
    } else if (
      task.name !== name ||
      task.status?.status !== status ||
      normalise(task.markdown_description) !== content
    ) {
      record('update_attempted', { task_id: receipt.task_id });
      try {
        await api(`task/${receipt.task_id}`, 'PUT', body);
      } catch (error) {
        record('update_unconfirmed', {
          task_id: receipt.task_id,
          ...(error.httpStatus ? { http_status: error.httpStatus } : {}),
        });
        throw error;
      }
    }
    const confirmed = await detail(receipt.task_id);
    if (
      String(confirmed.id) !== receipt.task_id ||
      parentId(confirmed) !== settings.parent_id ||
      confirmed.name !== name ||
      confirmed.status?.status !== status ||
      normalise(confirmed.markdown_description) !== content
    ) {
      record('readback_mismatch', { task_id: receipt.task_id });
      throw new Error('ClickUp 게시 내용과 상태가 아직 확인되지 않았습니다.');
    }
    const sent = {
      ...receipt,
      status: 'sent',
      task_status: status,
      url: `https://app.clickup.com/t/${receipt.task_id}`,
      submitted_at: new Date().toISOString(),
    };
    writeJson(receiptPath, sent);
    record('sent', { task_id: sent.task_id });
    return sent;
  } finally {
    fs.rmSync(lockPath, { force: true });
  }
}
