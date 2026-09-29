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
    throw new Error('Enter CLICKUP_API_TOKEN in .clickup.env.');
  return token.trim();
}

export async function importClickup(id, template, token, request = fetch) {
  if (!/^[a-zA-Z0-9_-]+$/.test(id ?? ''))
    throw new Error('Specify the ClickUp task ID.');
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
    throw new Error('ClickUp connection failed. Check the network and API access.');
  }
  if (!response.ok) throw new Error(`ClickUp HTTP ${response.status}`);
  const task = await response.json();
  if (typeof task.name !== 'string' || !task.name.trim())
    throw new Error('The ClickUp task has no title.');
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
    throw new Error('Only tasks imported from ClickUp can be submitted.');
  if (fs.existsSync(receiptPath)) {
    const previous = readJson(receiptPath);
    if (
      previous.run !== state.id ||
      previous.fingerprint !== state.fingerprint ||
      previous.task_id !== taskId
    )
      throw new Error('The task differs from the existing submission record.');
    if (previous.status === 'sent') return previous;
    throw new Error(
      'The response to the previous submission was not confirmed. Check the comment on the ClickUp task, then clean up the submission record. It is not resent automatically.',
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
        'Another process is submitting the same task. Check the submission record.',
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
      'No response was received for the ClickUp submission. It is not resent automatically, to prevent duplicates.',
    );
  }
  if (!response.ok) {
    const rejected = response.status >= 400 && response.status < 500;
    record(rejected ? 'rejected' : 'response_unknown', {
      http_status: response.status,
    });
    if (rejected) fs.rmSync(receiptPath);
    throw new Error(`ClickUp submission HTTP ${response.status}`);
  }
  let result;
  try {
    result = await response.json();
  } catch {
    record('response_unknown', { reason: 'invalid_json' });
    throw new Error(
      'The ClickUp response format could not be confirmed. Check the original task.',
    );
  }
  if (!result?.id) {
    record('response_unknown', { reason: 'missing_comment_id' });
    throw new Error(
      'The ClickUp comment ID could not be confirmed. Check the original task.',
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
