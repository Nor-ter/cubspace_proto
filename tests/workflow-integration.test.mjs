import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const script = fileURLToPath(new URL('../scripts/ticket.mjs', import.meta.url));
function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cubspace-workflow-'));
  const exec = (args) =>
    spawnSync(args[0], args.slice(1), { cwd: root, encoding: 'utf8' });
  exec(['git', 'init', '-b', 'ticket-test']);
  exec(['git', 'config', 'user.email', 'test@example.invalid']);
  exec(['git', 'config', 'user.name', 'Workflow Test']);
  fs.mkdirSync(path.join(root, 'workflow'));
  fs.mkdirSync(path.join(root, 'prolog'));
  fs.writeFileSync(path.join(root, '.gitignore'), '.workflow/\n');
  fs.writeFileSync(path.join(root, 'obsolete.txt'), 'old');
  fs.writeFileSync(
    path.join(root, 'ticket.json'),
    JSON.stringify({
      id: 'TEST-1',
      title: 'fixture',
      description: 'local test',
      target_branch: 'ticket-test',
      scope: [
        'source.txt',
        'obsolete.txt',
        'ticket.json',
        'mds/',
        'workflow/config.json',
      ],
      acceptance_criteria: ['works'],
      qa_cases: ['a', 'b', 'c'],
      qa_seed: 7,
    }),
  );
  const configure = (code) =>
    fs.writeFileSync(
      path.join(root, 'workflow/config.json'),
      JSON.stringify({
        checks: [
          {
            name: 'unit',
            command: [process.execPath, '-e', `process.exit(${code})`],
          },
        ],
        remote: 'origin',
      }),
    );
  configure(0);
  exec(['git', 'add', '.']);
  exec(['git', 'commit', '-m', 'initial']);
  const cli = (...args) => exec([process.execPath, script, ...args]);
  const id = cli('generate').stdout.trim();
  const state = () =>
    JSON.parse(
      fs.readFileSync(path.join(root, 'workflow/runs', id, 'state.json')),
    );
  const review = (patch = {}) => {
    const file = path.join(root, '.workflow/review.json');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(
      file,
      JSON.stringify({
        reviewer: 'independent-test',
        fingerprint: state().fingerprint,
        decision: 'pass',
        evidence: ['fixture command passed'],
        findings: [],
        ...patch,
      }),
    );
    return cli('review', id, file);
  };
  return { root, exec, cli, id, state, review, configure };
}
test('real Git release remains valid after deleting tracked files', () => {
  const f = fixture();
  try {
    fs.unlinkSync(path.join(f.root, 'obsolete.txt'));
    fs.writeFileSync(path.join(f.root, 'source.txt'), 'new');
    assert.equal(f.cli('check', f.id).status, 0);
    assert.equal(f.review().status, 0);
    assert.equal(f.cli('report', f.id).status, 0);
    assert.equal(f.cli('commit', f.id).status, 0);
    const receipt = JSON.parse(
      fs.readFileSync(path.join(f.root, '.workflow/receipts', `${f.id}.json`)),
    );
    assert.equal(
      receipt.commit,
      f.exec(['git', 'rev-parse', 'HEAD']).stdout.trim(),
    );
    const remote = path.join(f.root, '.workflow/remote.git');
    f.exec(['git', 'init', '--bare', remote]);
    f.exec(['git', 'remote', 'add', 'origin', remote]);
    const pushed = f.cli('push', f.id);
    assert.equal(pushed.status, 0, pushed.stderr);
  } finally {
    fs.rmSync(f.root, { recursive: true, force: true });
  }
});
test('failed checks and review block release, stale code requires another review', () => {
  const f = fixture();
  try {
    f.configure(1);
    assert.equal(f.cli('check', f.id).status, 1);
    assert.notEqual(f.review().status, 0);
    assert.equal(f.cli('report', f.id).status, 0);
    f.configure(0);
    assert.equal(f.cli('check', f.id).status, 0);
    assert.notEqual(f.review({ evidence: [' '] }).status, 0);
    assert.equal(
      f.review({ decision: 'fail', findings: ['must fix'] }).status,
      1,
    );
    assert.notEqual(f.cli('commit', f.id).status, 0);
    assert.equal(f.review().status, 0);
    fs.writeFileSync(path.join(f.root, 'source.txt'), 'changed');
    assert.notEqual(f.cli('commit', f.id).status, 0);
  } finally {
    fs.rmSync(f.root, { recursive: true, force: true });
  }
});

test('Claude CLI response is imported and a failed re-review invalidates old approval', () => {
  const f = fixture();
  try {
    const configPath = path.join(f.root, 'workflow/config.json');
    const config = JSON.parse(fs.readFileSync(configPath));
    fs.copyFileSync(
      fileURLToPath(new URL('../workflow/review.schema.json', import.meta.url)),
      path.join(f.root, 'workflow/review.schema.json'),
    );
    const agentFile = path.join(f.root, 'fake-agent.mjs');
    fs.writeFileSync(
      agentFile,
      `import fs from 'node:fs';
      const state = JSON.parse(fs.readFileSync('workflow/runs/${f.id}/state.json'));
      if (process.argv.includes('--fail')) process.exit(2);
      console.log(JSON.stringify({subtype:'success',structured_output:{reviewer:'fake-claude',fingerprint:state.fingerprint,decision:'pass',evidence:['fixture-only review'],findings:[]}}));`,
    );
    config.agents = {
      reviewer: { provider: 'claude', command: [process.execPath, agentFile] },
    };
    fs.writeFileSync(configPath, JSON.stringify(config));
    assert.equal(f.cli('check', f.id).status, 0);
    const reviewed = f.cli('agent', f.id, 'reviewer');
    assert.equal(reviewed.status, 0, reviewed.stderr);
    assert.equal(f.state().review.reviewer, 'fake-claude');
    config.agents.reviewer.command.push('--fail');
    fs.writeFileSync(configPath, JSON.stringify(config));
    assert.equal(f.cli('check', f.id).status, 0);
    assert.equal(f.review().status, 0);
    assert.notEqual(f.cli('agent', f.id, 'reviewer').status, 0);
    assert.equal(f.state().review, null);
    assert.notEqual(f.cli('commit', f.id).status, 0);
  } finally {
    fs.rmSync(f.root, { recursive: true, force: true });
  }
});

test('VS Code hand-off pauses implementation and review without inventing completion', () => {
  const f = fixture();
  try {
    const file = path.join(f.root, 'workflow/config.json');
    const config = JSON.parse(fs.readFileSync(file));
    config.agent = 'vscode';
    fs.writeFileSync(file, JSON.stringify(config));
    assert.equal(f.cli('check', f.id).status, 0);
    assert.equal(f.review().status, 0);
    assert.equal(f.cli('agent', f.id, 'implementer').status, 0);
    assert.equal(f.state().status, 'awaiting_vscode_implementer');
    assert.equal(f.state().review, null);
    assert.deepEqual(f.state().checks, []);
    const dir = path.join(f.root, 'workflow/runs', f.id);
    assert.match(
      fs.readFileSync(path.join(dir, 'implementer.prompt.md'), 'utf8'),
      /prolog\/run_memory.pl/,
    );
    assert.equal(f.cli('continue', f.id).status, 0);
    assert.equal(f.state().status, 'awaiting_vscode_reviewer');
    assert.equal(f.state().review, null);
    assert.ok(fs.existsSync(path.join(dir, 'reviewer.prompt.md')));
    assert.notEqual(f.cli('submit', f.id).status, 0);
    assert.notEqual(f.cli('commit', f.id).status, 0);
  } finally {
    fs.rmSync(f.root, { recursive: true, force: true });
  }
});

test('ClickUp submission rejects failed or stale review before reading credentials', () => {
  const f = fixture();
  try {
    const statePath = path.join(f.root, 'workflow/runs', f.id, 'state.json');
    const state = f.state();
    state.ticket.source = { provider: 'clickup', task_id: 'test-id' };
    fs.writeFileSync(statePath, JSON.stringify(state));
    assert.match(f.cli('submit', f.id).stderr, /검사|코드/);
    assert.equal(f.cli('check', f.id).status, 0);
    assert.equal(f.review({ decision: 'fail' }).status, 1);
    assert.match(f.cli('submit', f.id).stderr, /리뷰/);
    assert.equal(f.review().status, 0);
    fs.writeFileSync(path.join(f.root, 'source.txt'), 'changed');
    assert.match(f.cli('submit', f.id).stderr, /코드가 변경/);
    assert.ok(!fs.existsSync(path.join(f.root, '.workflow/submissions')));
  } finally {
    fs.rmSync(f.root, { recursive: true, force: true });
  }
});
