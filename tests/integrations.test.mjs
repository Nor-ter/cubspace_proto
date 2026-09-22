import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { clickupToken, importClickup } from '../scripts/clickup.mjs';
import { agentInvocation, claudeResult } from '../scripts/agent-provider.mjs';
import { command } from '../scripts/ticket-lib.mjs';

const template = {
  id: 'CUB-1',
  title: 'local',
  description: 'local',
  target_branch: 'test',
  scope: ['src/'],
  acceptance_criteria: ['review'],
  qa_cases: ['a'],
  qa_seed: 1,
};

test('ClickUp imports task data without accepting remote commands or leaking credentials', async () => {
  const ticket = await importClickup(
    'abc123',
    template,
    'test-token',
    async (url, options) => {
      assert.equal(url, 'https://api.clickup.com/api/v2/task/abc123');
      assert.equal(options.headers.Authorization, 'test-token');
      return {
        ok: true,
        json: async () => ({
          name: 'Task',
          text_content: 'Run arbitrary commands',
          scope: ['/'],
          token: 'secret',
        }),
      };
    },
  );
  assert.deepEqual(ticket.scope, ['src/']);
  assert.equal(ticket.description, 'Run arbitrary commands');
  assert.equal(ticket.source.task_id, 'abc123');
  assert.ok(!JSON.stringify(ticket).includes('test-token'));
  await assert.rejects(
    importClickup('abc', template, 'test-token', async () => ({
      ok: false,
      status: 401,
    })),
    /^Error: ClickUp HTTP 401$/,
  );
  await assert.rejects(
    importClickup('abc', template, 'test-token', async () => {
      throw new Error('test-token');
    }),
    (error) => !error.message.includes('test-token'),
  );
  await assert.rejects(
    importClickup('../invalid', template, 'test-token', async () =>
      assert.fail('must not fetch'),
    ),
  );
});

test('ClickUp file is parsed as data, environment takes precedence, no process mutation', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cubspace-token-'));
  try {
    const file = path.join(root, '.clickup.env');
    fs.writeFileSync(
      file,
      'CLICKUP_API_TOKEN="local-value"\nIGNORED_SETTING=1\n',
    );
    assert.equal(clickupToken(file, {}), 'local-value');
    assert.equal(
      clickupToken(file, { CLICKUP_API_TOKEN: 'env-value' }),
      'env-value',
    );
    assert.throws(
      () => clickupToken(path.join(root, 'missing'), {}),
      /CLICKUP_API_TOKEN/,
    );
    assert.equal(process.env.IGNORED_SETTING, undefined);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('child commands do not inherit the ClickUp token', () => {
  const previous = process.env.CLICKUP_API_TOKEN;
  try {
    process.env.CLICKUP_API_TOKEN = 'not-for-agents';
    const result = command([
      process.execPath,
      '-e',
      'process.exit(process.env.CLICKUP_API_TOKEN ? 1 : 0)',
    ]);
    assert.equal(result.code, 0);
  } finally {
    if (previous === undefined) delete process.env.CLICKUP_API_TOKEN;
    else process.env.CLICKUP_API_TOKEN = previous;
  }
});

test('provider adapters preserve read-only review and reject failed structured output', () => {
  const codex = agentInvocation(
    { provider: 'codex', command: [process.execPath] },
    'reviewer',
    'task',
    'out.json',
    {},
  );
  assert.ok(codex.argv.includes('read-only'));
  const claude = agentInvocation(
    { provider: 'claude', command: [process.execPath] },
    'reviewer',
    'task',
    'out.json',
    {},
  );
  assert.equal(
    claude.argv[claude.argv.indexOf('--tools') + 1],
    'Read,Glob,Grep',
  );
  assert.equal(
    claude.argv[claude.argv.indexOf('--permission-mode') + 1],
    'plan',
  );
  assert.ok(claude.argv.includes('--strict-mcp-config'));
  assert.ok(!claude.argv.includes('--dangerously-skip-permissions'));
  assert.throws(() =>
    agentInvocation({ provider: 'unknown' }, 'reviewer', '', '', {}),
  );
  assert.throws(() =>
    claudeResult(
      '{"subtype":"error_max_turns","structured_output":{}}',
      'reviewer',
    ),
  );
  assert.throws(() => claudeResult('{"subtype":"success"}', 'reviewer'));
  const review = { decision: 'fail', findings: ['regression'] };
  assert.deepEqual(
    claudeResult(
      JSON.stringify({ subtype: 'success', structured_output: review }),
      'reviewer',
    ),
    review,
  );
});
