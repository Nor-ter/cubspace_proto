import fs from 'node:fs';
import { parseEnv } from 'node:util';
import { validateTicket } from './ticket-lib.mjs';

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
