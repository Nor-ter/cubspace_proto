import fs from 'node:fs';
import path from 'node:path';
import { parseEnv } from 'node:util';
import { readJson, validateTicket, writeJson } from './ticket-lib.mjs';

export function clickupToken(file = '.clickup.env', env = process.env) {
  const token =
    env.CLICKUP_API_TOKEN ||
    (fs.existsSync(file)
      ? parseEnv(fs.readFileSync(file, 'utf8')).CLICKUP_API_TOKEN
      : '');
  if (!token?.trim())
    throw new Error('.clickup.env에 CLICKUP_API_TOKEN을 입력하세요.');
  return token.trim();
}

export async function importClickup(id, template, token, request = fetch) {
  if (!/^[a-zA-Z0-9_-]+$/.test(id ?? ''))
    throw new Error('ClickUp task ID를 지정하세요.');
  let response;
  try {
    response = await request(
      `https://api.clickup.com/api/v2/task/${encodeURIComponent(id)}`,
      {
        headers: { Authorization: token },
        signal: AbortSignal.timeout(15000),
      },
    );
  } catch {
    throw new Error('ClickUp 연결 실패. 네트워크와 API 접근을 확인하세요.');
  }
  if (!response.ok) throw new Error(`ClickUp HTTP ${response.status}`);
  const task = await response.json();
  if (typeof task.name !== 'string' || !task.name.trim())
    throw new Error('ClickUp 작업 제목이 없습니다.');
  return validateTicket({
    ...template,
    title: task.name,
    description: task.text_content || task.description || task.name,
    source: { provider: 'clickup', task_id: id },
  });
}

export async function submitClickup(
  state,
  text,
  token,
  receiptPath,
  request = fetch,
) {
  const taskId = state.ticket.source?.task_id;
  if (
    state.ticket.source?.provider !== 'clickup' ||
    !/^[a-zA-Z0-9_-]+$/.test(taskId ?? '')
  )
    throw new Error('ClickUp에서 가져온 작업만 제출할 수 있습니다.');
  if (fs.existsSync(receiptPath)) {
    const previous = readJson(receiptPath);
    if (
      previous.run !== state.id ||
      previous.fingerprint !== state.fingerprint ||
      previous.task_id !== taskId
    )
      throw new Error('기존 제출 기록과 작업이 다릅니다.');
    if (previous.status === 'sent') return previous;
    throw new Error(
      '이전 제출의 응답이 확정되지 않았습니다. ClickUp 작업에서 댓글을 확인한 뒤 제출 기록을 정리하세요. 자동 재전송하지 않습니다.',
    );
  }
  const receipt = {
    run: state.id,
    fingerprint: state.fingerprint,
    task_id: taskId,
    status: 'pending',
  };
  fs.mkdirSync(path.dirname(receiptPath), { recursive: true });
  try {
    fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + '\n', {
      flag: 'wx',
    });
  } catch (error) {
    if (error.code === 'EEXIST')
      throw new Error(
        '다른 프로세스가 같은 작업을 제출 중입니다. 제출 기록을 확인하세요.',
      );
    throw error;
  }
  const record = (event, details = {}) =>
    fs.appendFileSync(
      receiptPath.replace(/\.json$/, '') + '.events.jsonl',
      JSON.stringify({
        run: state.id,
        task_id: taskId,
        fingerprint: state.fingerprint,
        at: new Date().toISOString(),
        event,
        ...details,
      }) + '\n',
    );
  record('attempted');
  let response;
  try {
    response = await request(
      `https://api.clickup.com/api/v2/task/${encodeURIComponent(taskId)}/comment`,
      {
        method: 'POST',
        headers: { Authorization: token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_text: text, notify_all: false }),
        signal: AbortSignal.timeout(15000),
      },
    );
  } catch {
    record('response_unknown', { reason: 'network' });
    throw new Error(
      'ClickUp 제출 응답을 받지 못했습니다. 중복 방지를 위해 자동 재전송하지 않습니다.',
    );
  }
  if (!response.ok) {
    const rejected = response.status >= 400 && response.status < 500;
    record(rejected ? 'rejected' : 'response_unknown', {
      http_status: response.status,
    });
    if (rejected) fs.rmSync(receiptPath);
    throw new Error(`ClickUp 제출 HTTP ${response.status}`);
  }
  let result;
  try {
    result = await response.json();
  } catch {
    record('response_unknown', { reason: 'invalid_json' });
    throw new Error(
      'ClickUp 응답 형식을 확인하지 못했습니다. 원본 작업을 확인하세요.',
    );
  }
  if (!result?.id) {
    record('response_unknown', { reason: 'missing_comment_id' });
    throw new Error(
      'ClickUp 댓글 ID를 확인하지 못했습니다. 원본 작업을 확인하세요.',
    );
  }
  const sent = {
    ...receipt,
    status: 'sent',
    comment_id: String(result.id),
    submitted_at: new Date().toISOString(),
  };
  writeJson(receiptPath, sent);
  record('sent', { comment_id: sent.comment_id });
  return sent;
}
