import assert from 'node:assert/strict';
import { test } from 'node:test';
import { selectAgent } from '../scripts/agent-provider.mjs';

test('auto selects authenticated Codex before probing Claude', () => {
  const calls = [];
  const selected = selectAgent({}, (argv) => {
    calls.push(argv);
    return { code: 0, stdout: 'private authentication details' };
  });
  assert.deepEqual(selected, { provider: 'codex' });
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0].slice(-2), ['login', 'status']);
  assert.ok(!JSON.stringify(selected).includes('private'));
});

test('auto selects Claude when Codex is installed but not authenticated', () => {
  const calls = [];
  const selected = selectAgent({ provider: 'auto' }, (argv) => {
    calls.push(argv);
    return { code: calls.length === 1 ? 1 : 0, stdout: '' };
  });
  assert.deepEqual(selected, { provider: 'claude' });
  assert.deepEqual(calls[1].slice(-3), ['auth', 'status', '--json']);
});

test('missing or unauthenticated CLIs produce a VS Code hand-off', () => {
  let calls = 0;
  assert.deepEqual(
    selectAgent({}, () => {
      calls += 1;
      if (calls === 1) throw new Error('ENOENT private path');
      return { code: 1, stderr: 'private authentication details' };
    }),
    { provider: 'vscode' },
  );
  assert.equal(calls, 2);
  assert.deepEqual(
    selectAgent({}, () => {
      throw new Error('ENOENT');
    }),
    { provider: 'vscode' },
  );
});

test('explicit provider selection is preserved without authentication probes', () => {
  const probe = () => assert.fail('explicit selection must not probe');
  const selected = {
    provider: 'claude',
    command: ['custom-claude', '--profile', 'work'],
  };
  assert.deepEqual(selectAgent(selected, probe), selected);
  assert.deepEqual(
    selectAgent({ provider: 'codex', command: ['custom-codex'] }, probe),
    {
      provider: 'codex',
      command: ['custom-codex'],
    },
  );
  assert.deepEqual(selectAgent({ provider: 'vscode' }, probe), {
    provider: 'vscode',
  });
  assert.throws(() => selectAgent({ provider: 'unsupported' }, probe));
  assert.throws(() => selectAgent({ provider: 'codex', command: [] }, probe));
});
