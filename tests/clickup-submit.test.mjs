import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { submitClickup } from '../scripts/clickup.mjs';

const state = {
  id: 'TEST-1-run',
  fingerprint: 'reviewed-source-hash',
  ticket: { source: { provider: 'clickup', task_id: 'abc_123-xyz' } },
};
const token = 'synthetic-test-token';

function receiptFixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cubspace-submit-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const file = path.join(root, 'submission.json');
  return { file, read: () => JSON.parse(fs.readFileSync(file, 'utf8')) };
}

test('submission posts a comment once and reuses its receipt without leaking credentials', async (t) => {
  const { file, read } = receiptFixture(t);
  let calls = 0;
  const request = async (url, options) => {
    calls += 1;
    assert.equal(
      url,
      'https://api.clickup.com/api/v2/task/abc_123-xyz/comment',
    );
    assert.equal(options.method, 'POST');
    assert.equal(options.headers.Authorization, token);
    assert.equal(options.headers['Content-Type'], 'application/json');
    assert.deepEqual(JSON.parse(options.body), {
      comment_text: '검사 및 리뷰 완료',
      notify_all: false,
    });
    assert.equal(read().status, 'pending');
    return { ok: true, json: async () => ({ id: 12345 }) };
  };
  const sent = await submitClickup(
    state,
    '검사 및 리뷰 완료',
    token,
    file,
    request,
  );
  assert.equal(sent.status, 'sent');
  assert.equal(sent.comment_id, '12345');
  assert.ok(Number.isFinite(Date.parse(sent.submitted_at)));
  assert.deepEqual(read(), sent);
  assert.ok(!fs.readFileSync(file, 'utf8').includes(token));
  assert.deepEqual(
    await submitClickup(state, '검사 및 리뷰 완료', token, file, request),
    sent,
  );
  assert.equal(calls, 1);
  const audit = fs.readFileSync(
    file.replace(/\.json$/, '') + '.events.jsonl',
    'utf8',
  );
  assert.ok(!audit.includes(token));
  assert.equal(JSON.parse(audit.trim().split('\n').at(-1)).event, 'sent');
});

test('local tickets and malformed remote IDs are rejected before requests or receipt creation', async (t) => {
  const { file } = receiptFixture(t);
  const request = async () => assert.fail('invalid source must not fetch');
  await assert.rejects(
    submitClickup(
      { ...state, ticket: { source: { provider: 'local', task_id: 'abc' } } },
      '',
      token,
      file,
      request,
    ),
  );
  await assert.rejects(
    submitClickup(
      {
        ...state,
        ticket: { source: { provider: 'clickup', task_id: '../other' } },
      },
      '',
      token,
      file,
      request,
    ),
  );
  await assert.rejects(
    submitClickup({ ...state, ticket: {} }, '', token, file, request),
  );
  assert.equal(fs.existsSync(file), false);
});

test('a receipt cannot authorise submission for another source revision or task', async (t) => {
  const { file } = receiptFixture(t);
  await submitClickup(state, 'report', token, file, async () => ({
    ok: true,
    json: async () => ({ id: '1' }),
  }));
  const request = async () => assert.fail('mismatched receipt must not fetch');
  await assert.rejects(
    submitClickup(
      { ...state, fingerprint: 'changed' },
      'report',
      token,
      file,
      request,
    ),
  );
  await assert.rejects(
    submitClickup(
      { ...state, id: 'other-run' },
      'report',
      token,
      file,
      request,
    ),
  );
  await assert.rejects(
    submitClickup(
      {
        ...state,
        ticket: { source: { provider: 'clickup', task_id: 'other-task' } },
      },
      'report',
      token,
      file,
      request,
    ),
  );
});

test('network uncertainty preserves pending status and blocks automatic replay', async (t) => {
  const { file, read } = receiptFixture(t);
  let calls = 0;
  const request = async () => {
    calls += 1;
    throw new Error(`connection error with ${token}`);
  };
  await assert.rejects(
    submitClickup(state, 'report', token, file, request),
    (error) => !error.message.includes(token),
  );
  assert.equal(read().status, 'pending');
  await assert.rejects(submitClickup(state, 'report', token, file, request));
  assert.equal(calls, 1);
  const audit = fs.readFileSync(
    file.replace(/\.json$/, '') + '.events.jsonl',
    'utf8',
  );
  assert.ok(!audit.includes(token));
  assert.equal(
    JSON.parse(audit.trim().split('\n').at(-1)).event,
    'response_unknown',
  );
});

test('server failure preserves pending status, preventing an uncertain duplicate', async (t) => {
  const { file, read } = receiptFixture(t);
  await assert.rejects(
    submitClickup(state, 'report', token, file, async () => ({
      ok: false,
      status: 503,
    })),
    /HTTP 503/,
  );
  assert.equal(read().status, 'pending');
  await assert.rejects(
    submitClickup(state, 'report', token, file, async () =>
      assert.fail('must not retry'),
    ),
  );
});

test('a definite API rejection removes pending receipt so corrected submission can retry', async (t) => {
  const { file, read } = receiptFixture(t);
  await assert.rejects(
    submitClickup(state, 'report', token, file, async () => ({
      ok: false,
      status: 401,
    })),
    /HTTP 401/,
  );
  assert.equal(fs.existsSync(file), false);
  await submitClickup(state, 'report', token, file, async () => ({
    ok: true,
    json: async () => ({ id: 'retry-success' }),
  }));
  assert.equal(read().comment_id, 'retry-success');
  const audit = fs.readFileSync(
    file.replace(/\.json$/, '') + '.events.jsonl',
    'utf8',
  );
  assert.ok(!audit.includes(token));
  const events = audit
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line));
  assert.deepEqual(
    events.map((x) => x.event),
    ['attempted', 'rejected', 'attempted', 'sent'],
  );
  assert.equal(events[1].http_status, 401);
  assert.equal(events[1].run, state.id);
  assert.equal(events[1].task_id, state.ticket.source.task_id);
  assert.ok(Number.isFinite(Date.parse(events[1].at)));
});

test('a successful HTTP response without a comment ID never records success', async (t) => {
  const { file, read } = receiptFixture(t);
  await assert.rejects(
    submitClickup(state, 'report', token, file, async () => ({
      ok: true,
      json: async () => ({}),
    })),
  );
  assert.equal(read().status, 'pending');
  await assert.rejects(
    submitClickup(state, 'report', token, file, async () =>
      assert.fail('unknown comment ID must not retry'),
    ),
  );
});

test('an unreadable successful response retains pending status', async (t) => {
  const { file, read } = receiptFixture(t);
  await assert.rejects(
    submitClickup(state, 'report', token, file, async () => ({
      ok: true,
      json: async () => {
        throw new SyntaxError('invalid JSON');
      },
    })),
  );
  assert.equal(read().status, 'pending');
});

test('simultaneous processes claim one receipt and issue only one request', async (t) => {
  const { file, read } = receiptFixture(t);
  const root = path.dirname(file);
  const release = path.join(root, 'release');
  const requests = path.join(root, 'requests');
  const source = new URL('../scripts/clickup.mjs', import.meta.url).href;
  const worker = path.join(root, 'worker.mjs');
  fs.writeFileSync(
    worker,
    `
    import fs from 'node:fs';
    import { submitClickup } from ${JSON.stringify(source)};
    const [receipt, ready, release, requests] = process.argv.slice(2);
    const exists = fs.existsSync.bind(fs);
    fs.existsSync = (file) => {
      if (file !== receipt) return exists(file);
      fs.writeFileSync(ready, 'ready');
      const deadline = Date.now() + 5000;
      while (!exists(release)) {
        if (Date.now() > deadline) throw new Error('barrier timeout');
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 5);
      }
      return false;
    };
    try {
      await submitClickup(${JSON.stringify(state)}, 'report', 'fake-token', receipt, async () => {
        fs.appendFileSync(requests, 'POST;');
        return { ok: true, json: async () => ({ id: 'only-comment' }) };
      });
      process.stdout.write('sent');
    } catch (error) {
      process.stdout.write('blocked');
    }
  `,
  );
  const launch = (name) => {
    const ready = path.join(root, name);
    const child = spawn(
      process.execPath,
      [worker, file, ready, release, requests],
      {
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
    t.after(() => {
      if (child.exitCode === null) child.kill();
    });
    const done = new Promise((resolve, reject) => {
      let stdout = '';
      let stderr = '';
      child.stdout.on('data', (chunk) => {
        stdout += chunk;
      });
      child.stderr.on('data', (chunk) => {
        stderr += chunk;
      });
      child.on('error', reject);
      child.on('close', (code) =>
        code === 0 ? resolve(stdout) : reject(new Error(stderr)),
      );
    });
    done.catch(() => {});
    return { ready, done };
  };
  const first = launch('first-ready');
  const second = launch('second-ready');
  const deadline = Date.now() + 5000;
  while (!fs.existsSync(first.ready) || !fs.existsSync(second.ready)) {
    assert.ok(
      Date.now() < deadline,
      'both workers must reach the claim barrier',
    );
    await delay(5);
  }
  fs.writeFileSync(release, 'release');
  assert.deepEqual(
    (await Promise.all([first.done, second.done])).sort((a, b) =>
      a.localeCompare(b),
    ),
    ['blocked', 'sent'],
  );
  assert.equal(fs.readFileSync(requests, 'utf8'), 'POST;');
  assert.equal(read().status, 'sent');
});
