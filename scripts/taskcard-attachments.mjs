import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { readJson, writeJson } from './ticket-lib.mjs';

const validId = (value) =>
  typeof value === 'string' && /^[a-zA-Z0-9_-]+$/.test(value);
const digest = (bytes) =>
  crypto.createHash('sha256').update(bytes).digest('hex');
const allowedPath = (file) =>
  !file
    .split(/[\\/]/)
    .some((part) =>
      /^(?:\.env(?:\..*)?|\.clickup\.env(?:\..*)?|\.git|\.ssh|\.codex|\.claude|credentials?)$/i.test(
        part,
      ),
    );

function attachmentFile(file) {
  if (
    typeof file.path !== 'string' ||
    !allowedPath(file.path) ||
    !fs.lstatSync(file.path).isFile()
  )
    throw new Error('첨부할 일반 파일 경로를 확인하세요.');
  const resolved = fs.realpathSync(file.path);
  const extension = path.extname(resolved);
  const expectedMime = { '.png': 'image/png', '.html': 'text/html' }[extension];
  if (
    !allowedPath(resolved) ||
    !expectedMime ||
    file.mime !== expectedMime ||
    !/^[a-f0-9]{64}$/.test(file.sha256 ?? '')
  )
    throw new Error('PNG 또는 HTML 파일과 SHA-256, MIME을 확인하세요.');
  const name = file.name?.match(
    /^([A-Z][A-Z0-9]*-\d+)-[a-zA-Z0-9_-]+-([a-f0-9]{12,64})\.(png|html)$/,
  );
  if (!name || `.${name[3]}` !== extension || !file.sha256.startsWith(name[2]))
    throw new Error('첨부 이름에는 ticket ID와 파일 hash가 필요합니다.');
  const bytes = fs.readFileSync(resolved);
  if (digest(bytes) !== file.sha256)
    throw new Error('첨부 파일의 SHA-256이 일치하지 않습니다.');
  if (
    extension === '.png' &&
    !bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    throw new Error('PNG 파일 형식을 확인하세요.');
  if (
    extension === '.html' &&
    !/^\s*(?:<!doctype html\b|<html\b)/i.test(bytes.toString('utf8'))
  )
    throw new Error('독립 실행 HTML 문서를 확인하세요.');
  return { ...file, bytes, size: bytes.length };
}

export async function uploadAttachments(
  taskId,
  files,
  token,
  receiptPath,
  request = fetch,
) {
  if (!validId(taskId) || !Array.isArray(files) || !files.length)
    throw new Error('Task ID와 첨부 파일을 지정하세요.');
  const uploads = files.map(attachmentFile);
  if (new Set(uploads.map((file) => file.name)).size !== uploads.length)
    throw new Error('첨부 이름이 중복됩니다.');
  fs.mkdirSync(path.dirname(receiptPath), { recursive: true });
  const lock = `${receiptPath}.lock`;
  try {
    fs.writeFileSync(lock, `${process.pid}\n`, { flag: 'wx' });
  } catch (error) {
    if (error.code === 'EEXIST')
      throw new Error('다른 프로세스가 첨부 파일을 제출 중입니다.');
    throw error;
  }
  const event = (name, details = {}) =>
    fs.appendFileSync(
      `${receiptPath.replace(/\.json$/, '')}.events.jsonl`,
      JSON.stringify({
        event: name,
        task_id: taskId,
        at: new Date().toISOString(),
        ...details,
      }) + '\n',
    );
  const api = async (method, body) => {
    let response;
    try {
      response = await request(
        `https://api.clickup.com/api/v2/task/${taskId}${method === 'POST' ? '/attachment' : ''}`,
        {
          method,
          headers: { Authorization: token },
          ...(body ? { body } : {}),
          signal: AbortSignal.timeout(60000),
        },
      );
    } catch {
      throw new Error('ClickUp 첨부 응답을 받지 못했습니다.');
    }
    if (!response.ok) {
      const error = new Error(`ClickUp 첨부 HTTP ${response.status}`);
      error.httpStatus = response.status;
      throw error;
    }
    try {
      return await response.json();
    } catch {
      throw new Error('ClickUp 첨부 응답 형식을 확인하지 못했습니다.');
    }
  };
  const remoteFiles = async () => {
    const task = await api('GET');
    if (String(task.id) !== taskId || !Array.isArray(task.attachments))
      throw new Error('ClickUp task의 첨부 목록을 확인하지 못했습니다.');
    return task.attachments;
  };
  const findRemote = async (remote, file, previous) => {
    const found = remote.filter(
      (item) => item.title === file.name || item.name === file.name,
    );
    if (found.length > 1)
      throw new Error(
        '같은 이름의 첨부가 여러 개입니다. 원격 파일을 확인하세요.',
      );
    if (!found.length) return null;
    const item = found[0];
    if (
      !validId(String(item.id ?? '')) ||
      typeof item.url !== 'string' ||
      !item.url.startsWith('https://') ||
      (previous?.id && previous.id !== String(item.id)) ||
      (item.size != null && Number(item.size) !== file.size)
    )
      throw new Error('ClickUp 첨부 ID, URL 또는 크기가 일치하지 않습니다.');
    let url;
    try {
      url = new URL(item.url);
    } catch {
      throw new Error('ClickUp 첨부 URL을 확인하세요.');
    }
    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password ||
      url.port ||
      !['clickup.com', 'clickup-attachments.com'].some(
        (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
      )
    )
      throw new Error('허용된 ClickUp HTTPS 첨부 URL이 아닙니다.');
    let response;
    let bytes;
    try {
      response = await request(url.href, {
        method: 'GET',
        redirect: 'error',
        signal: AbortSignal.timeout(60000),
      });
      if (!response.ok || response.redirected)
        throw new Error('download failed');
      bytes = Buffer.from(await response.arrayBuffer());
    } catch {
      throw new Error('ClickUp 첨부 원본을 직접 확인하지 못했습니다.');
    }
    const remoteHash = digest(bytes);
    if (bytes.length !== file.size || remoteHash !== file.sha256)
      throw new Error(
        'ClickUp 첨부 원본의 크기 또는 SHA-256이 일치하지 않습니다.',
      );
    return {
      id: String(item.id),
      name: file.name,
      sha256: remoteHash,
      size: bytes.length,
      url: item.url,
      status: 'sent',
    };
  };
  try {
    const receipt = fs.existsSync(receiptPath)
      ? readJson(receiptPath)
      : { task_id: taskId, status: 'pending', files: [] };
    if (receipt.task_id !== taskId || !Array.isArray(receipt.files))
      throw new Error('기존 첨부 기록의 task ID를 확인하세요.');
    for (const file of uploads) {
      const previous = receipt.files.find((entry) => entry.name === file.name);
      if (
        previous &&
        (previous.sha256 !== file.sha256 || previous.size !== file.size)
      )
        throw new Error('기존 첨부 기록과 파일이 다릅니다.');
    }
    const save = (file, entry) => {
      const index = receipt.files.findIndex((item) => item.name === file.name);
      if (index < 0) receipt.files.push(entry);
      else receipt.files[index] = entry;
      receipt.status = 'pending';
      writeJson(receiptPath, receipt);
    };
    for (const file of uploads) {
      const previous = receipt.files.find((entry) => entry.name === file.name);
      if (previous) save(file, { ...previous, status: 'pending' });
      const existing = await findRemote(await remoteFiles(), file, previous);
      if (existing) {
        save(file, existing);
        event('reconciled', { name: file.name, attachment_id: existing.id });
        continue;
      }
      if (previous)
        throw new Error(
          '이전 업로드 결과가 확인되지 않았습니다. 자동으로 다시 첨부하지 않습니다.',
        );
      const pending = {
        name: file.name,
        sha256: file.sha256,
        size: file.size,
        status: 'pending',
      };
      save(file, pending);
      const form = new FormData();
      form.append(
        'attachment',
        new Blob([file.bytes], { type: file.mime }),
        file.name,
      );
      event('upload_attempted', { name: file.name, sha256: file.sha256 });
      try {
        const result = await api('POST', form);
        if (!validId(String(result?.id ?? '')))
          throw new Error('ClickUp 첨부 ID를 확인하지 못했습니다.');
        pending.id = String(result.id);
        save(file, pending);
      } catch (error) {
        const rejected =
          error.httpStatus >= 400 &&
          error.httpStatus < 500 &&
          error.httpStatus !== 408;
        event(rejected ? 'upload_rejected' : 'upload_response_unknown', {
          name: file.name,
          ...(error.httpStatus ? { http_status: error.httpStatus } : {}),
        });
        if (rejected) {
          receipt.files = receipt.files.filter(
            (entry) => entry.name !== file.name,
          );
          writeJson(receiptPath, receipt);
        }
        throw error;
      }
      const confirmed = await findRemote(await remoteFiles(), file, pending);
      if (!confirmed)
        throw new Error(
          'ClickUp 첨부가 아직 원격 목록에서 확인되지 않았습니다.',
        );
      save(file, confirmed);
      event('confirmed', { name: file.name, attachment_id: confirmed.id });
    }
    receipt.status = 'sent';
    receipt.requested_names = uploads.map((file) => file.name);
    receipt.submitted_at = new Date().toISOString();
    writeJson(receiptPath, receipt);
    return {
      task_id: taskId,
      status: 'sent',
      files: uploads.map((file) =>
        receipt.files.find((entry) => entry.name === file.name),
      ),
    };
  } finally {
    fs.rmSync(lock, { force: true });
  }
}
