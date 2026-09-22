import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { hash } from '../scripts/ticket-lib.mjs';
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
  fs.mkdirSync(path.join(root, 'inputs'));
  fs.writeFileSync(path.join(root, '.gitignore'), '.workflow/\n');
  fs.writeFileSync(path.join(root, 'obsolete.txt'), 'old');
  fs.writeFileSync(
    path.join(root, 'inputs/ticket.json'),
    JSON.stringify({
      id: 'TEST 001',
      title: 'fixture',
      description: 'local test',
      target_branch: 'ticket-test',
      scope: [
        'source.txt',
        'obsolete.txt',
        'inputs/ticket.json',
        'outputs/',
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
  const reference = JSON.parse(
    fs.readFileSync(path.join(root, 'inputs/ticket.json')),
  );
  fs.writeFileSync(
    path.join(root, 'inputs/reference.json'),
    JSON.stringify({ ...reference, id: 'TEST REF', title: 'TEST REF' }),
  );
  configure(0);
  exec(['git', 'add', '.']);
  exec(['git', 'commit', '-m', 'initial']);
  const cli = (...args) => exec([process.execPath, script, ...args]);
  const id = cli('generate').stdout.trim();
  const state = () =>
    JSON.parse(fs.readFileSync(path.join(root, 'outputs', id, 'state.json')));
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
      const state = JSON.parse(fs.readFileSync('outputs/${f.id}/state.json'));
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
    const dir = path.join(f.root, 'outputs', f.id);
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
    const statePath = path.join(f.root, 'outputs', f.id, 'state.json');
    const state = f.state();
    state.ticket.source = { provider: 'clickup', task_id: 'test-id' };
    state.ticket_hash = hash(JSON.stringify(state.ticket));
    fs.writeFileSync(
      path.join(f.root, 'outputs', f.id, 'ticket.json'),
      JSON.stringify(state.ticket),
    );
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

test('short ticket IDs preserve the existing run and document on repeated generation', () => {
  const f = fixture();
  try {
    assert.equal(f.id, 'TEST 001');
    const before = JSON.stringify(f.state());
    const document = fs.readFileSync(
      path.join(f.root, 'outputs/TEST 001/task.md'),
      'utf8',
    );
    const retry = f.cli('generate');
    assert.notEqual(retry.status, 0);
    assert.match(retry.stderr, /continue "TEST 001"/);
    assert.equal(JSON.stringify(f.state()), before);
    assert.equal(
      fs.readFileSync(path.join(f.root, 'outputs/TEST 001/task.md'), 'utf8'),
      document,
    );
    fs.mkdirSync(path.join(f.root, 'outputs/archive'));
    fs.renameSync(
      path.join(f.root, 'outputs', f.id),
      path.join(f.root, 'outputs/archive', f.id),
    );
    assert.notEqual(f.cli('generate').status, 0);
    assert.ok(
      fs.existsSync(path.join(f.root, 'outputs/archive', f.id, 'ticket.json')),
    );
  } finally {
    fs.rmSync(f.root, { recursive: true, force: true });
  }
});

test('automatic publication starts only after gated push and preserves a successful push on publication failure', () => {
  const f = fixture();
  const remote = fs.mkdtempSync(
    path.join(os.tmpdir(), 'cubspace-publish-remote-'),
  );
  try {
    f.exec(['git', 'init', '--bare', remote]);
    f.exec(['git', 'remote', 'add', 'origin', remote]);
    const file = path.join(f.root, 'workflow/config.json');
    const config = JSON.parse(fs.readFileSync(file));
    config.clickup = {
      parent_id: 'fixture-parent',
      status: 'review',
      publish_on_push: true,
    };
    fs.writeFileSync(file, JSON.stringify(config));
    assert.notEqual(f.cli('push', f.id).status, 0);
    assert.notEqual(
      f.exec([
        'git',
        '--git-dir',
        remote,
        'rev-parse',
        '--verify',
        'refs/heads/ticket-test',
      ]).status,
      0,
    );
    assert.equal(f.cli('check', f.id).status, 0);
    assert.equal(f.review().status, 0);
    assert.equal(f.cli('report', f.id).status, 0);
    const committed = f.cli('commit', f.id);
    assert.equal(committed.status, 0, committed.stderr);
    const pushed = f.cli('push', f.id);
    assert.notEqual(pushed.status, 0);
    assert.match(pushed.stderr, /Git push 완료.*ClickUp 게시 미완료/);
    assert.match(pushed.stderr, /github.com/);
    const receipt = JSON.parse(
      fs.readFileSync(path.join(f.root, '.workflow/receipts', `${f.id}.json`)),
    );
    assert.ok(receipt.pushed_at);
    assert.equal(
      f
        .exec([
          'git',
          '--git-dir',
          remote,
          'rev-parse',
          'refs/heads/ticket-test',
        ])
        .stdout.trim(),
      receipt.commit,
    );
    assert.equal(f.exec(['git', 'status', '--porcelain']).stdout.trim(), '');
    assert.ok(!fs.existsSync(path.join(f.root, '.workflow/taskcards')));
  } finally {
    fs.rmSync(f.root, { recursive: true, force: true });
    fs.rmSync(remote, { recursive: true, force: true });
  }
});

test('browser evidence is required for release but missing evidence does not suppress pending reports', () => {
  const f = fixture();
  try {
    const configPath = path.join(f.root, 'workflow/config.json');
    const config = JSON.parse(fs.readFileSync(configPath));
    config.agent = 'vscode';
    config.evidence = { browser: true };
    fs.writeFileSync(configPath, JSON.stringify(config));
    assert.equal(f.cli('agent', f.id, 'implementer').status, 0);
    assert.equal(f.cli('report', f.id).status, 0);
    assert.ok(
      fs
        .readFileSync(path.join(f.root, `outputs/${f.id}/report.html`), 'utf8')
        .includes('Review pending'),
    );
    const resumed = f.cli('continue', f.id);
    assert.notEqual(resumed.status, 0);
    assert.match(resumed.stderr, /evidence/);
    assert.ok(fs.existsSync(path.join(f.root, 'outputs', f.id, 'report.md')));
    assert.equal(f.review().status, 0);
    const before = f.exec(['git', 'rev-parse', 'HEAD']).stdout;
    assert.match(f.cli('commit', f.id).stderr, /evidence/);
    assert.match(f.cli('submit', f.id).stderr, /evidence/);
    assert.equal(f.exec(['git', 'rev-parse', 'HEAD']).stdout, before);
    assert.ok(!fs.existsSync(path.join(f.root, '.workflow/taskcards')));
    assert.ok(!fs.existsSync(path.join(f.root, '.workflow/attachments')));
  } finally {
    fs.rmSync(f.root, { recursive: true, force: true });
  }
});

test('rechecking immediately replaces old passing reports and archives the previous HTML', () => {
  const f = fixture();
  try {
    assert.equal(f.cli('check', f.id).status, 0);
    assert.equal(f.review().status, 0);
    const htmlPath = path.join(f.root, `outputs/${f.id}/report.html`);
    assert.ok(fs.readFileSync(htmlPath, 'utf8').includes('Code review passed'));
    const previous = fs.readFileSync(htmlPath);
    fs.writeFileSync(path.join(f.root, 'source.txt'), 'new source');
    assert.equal(f.cli('check', f.id).status, 0);
    const pending = fs.readFileSync(htmlPath, 'utf8');
    assert.ok(pending.includes('Review pending'));
    assert.ok(pending.includes(f.state().fingerprint));
    assert.ok(
      fs
        .readFileSync(path.join(f.root, 'outputs', f.id, 'report.md'), 'utf8')
        .includes('미완료 또는 재검증 필요'),
    );
    const history = path.join(path.dirname(htmlPath), 'history');
    assert.ok(
      fs
        .readdirSync(history)
        .some((file) =>
          fs.readFileSync(path.join(history, file)).equals(previous),
        ),
    );
    assert.equal(f.review().status, 0);
    assert.ok(fs.readFileSync(htmlPath, 'utf8').includes('Code review passed'));
    assert.equal(
      f.review({ decision: 'fail', findings: ['fix needed'] }).status,
      1,
    );
    assert.ok(fs.readFileSync(htmlPath, 'utf8').includes('Review pending'));
  } finally {
    fs.rmSync(f.root, { recursive: true, force: true });
  }
});

test('new tasks preserve reference and prior snapshots and protect unsaved inputs', () => {
  const f = fixture();
  try {
    const inputPath = path.join(f.root, 'inputs/ticket.json');
    const referencePath = path.join(f.root, 'inputs/reference.json');
    const savedPath = path.join(f.root, 'outputs', f.id, 'ticket.json');
    const reference = fs.readFileSync(referencePath, 'utf8');
    const saved = fs.readFileSync(savedPath, 'utf8');
    assert.equal(f.cli('generate', 'inputs/reference.json').status, 0);
    assert.equal(f.cli('new', 'TEST 002', 'Next feature').status, 0);
    assert.equal(JSON.parse(fs.readFileSync(inputPath)).id, 'TEST 002');
    assert.equal(fs.readFileSync(savedPath, 'utf8'), saved);
    assert.equal(fs.readFileSync(referencePath, 'utf8'), reference);
    assert.notEqual(f.cli('new', 'TEST 003').status, 0);
    assert.equal(f.cli('generate').stdout.trim(), 'TEST 002');
    const input = JSON.parse(fs.readFileSync(inputPath));
    input.description = 'Updated acceptance scope';
    fs.writeFileSync(inputPath, JSON.stringify(input));
    assert.notEqual(f.cli('new', 'TEST 003').status, 0);
    assert.notEqual(f.cli('revise', 'TEST 001').status, 0);
    assert.equal(f.cli('check', 'TEST 002').status, 0);
    const before = JSON.parse(
      fs.readFileSync(path.join(f.root, 'outputs/TEST 002/state.json')),
    );
    assert.equal(before.ticket.description, 'local test');
    assert.equal(f.cli('revise', 'TEST 002').status, 0);
    const after = JSON.parse(
      fs.readFileSync(path.join(f.root, 'outputs/TEST 002/state.json')),
    );
    assert.equal(after.ticket.description, input.description);
    assert.deepEqual(after.checks, []);
    assert.equal(after.review, null);
    assert.equal(after.fingerprint, undefined);
    const history = fs.readdirSync(
      path.join(f.root, 'outputs/TEST 002/history'),
    );
    assert.equal(history.length, 1);
    assert.equal(f.cli('new', 'TEST 003').status, 0);
    assert.equal(fs.readFileSync(referencePath, 'utf8'), reference);
    assert.equal(fs.readFileSync(savedPath, 'utf8'), saved);
    assert.match(
      fs.readFileSync(path.join(f.root, 'prolog/run_memory.pl'), 'utf8'),
      /TEST 001/,
    );
    assert.match(
      fs.readFileSync(path.join(f.root, 'prolog/run_memory.pl'), 'utf8'),
      /TEST 002/,
    );
  } finally {
    fs.rmSync(f.root, { recursive: true, force: true });
  }
});

test('editing a saved snapshot directly is rejected and --git-only suppresses configured ClickUp publication', () => {
  const f = fixture();
  const remote = fs.mkdtempSync(path.join(os.tmpdir(), 'cubspace-git-only-'));
  try {
    const snapshot = path.join(f.root, 'outputs', f.id, 'ticket.json');
    const saved = fs.readFileSync(snapshot);
    const altered = JSON.parse(saved);
    altered.description = 'Tampered snapshot';
    fs.writeFileSync(snapshot, JSON.stringify(altered));
    assert.match(f.cli('check', f.id).stderr, /저장된 입력/);
    fs.writeFileSync(snapshot, saved);
    f.exec(['git', 'init', '--bare', remote]);
    f.exec(['git', 'remote', 'add', 'origin', remote]);
    const configPath = path.join(f.root, 'workflow/config.json');
    const config = JSON.parse(fs.readFileSync(configPath));
    config.clickup = { publish_on_push: true, parent_id: 'should-not-be-used' };
    fs.writeFileSync(configPath, JSON.stringify(config));
    assert.equal(f.cli('check', f.id).status, 0);
    assert.equal(f.review().status, 0);
    assert.equal(f.cli('commit', f.id).status, 0);
    const pushed = f.cli('push', f.id, '--git-only');
    assert.equal(pushed.status, 0, pushed.stderr);
    assert.ok(!fs.existsSync(path.join(f.root, '.workflow/taskcards')));
    assert.ok(!fs.existsSync(path.join(f.root, '.workflow/attachments')));
    assert.ok(!fs.existsSync(path.join(f.root, '.workflow/submissions')));
    const receipt = JSON.parse(
      fs.readFileSync(path.join(f.root, '.workflow/receipts', `${f.id}.json`)),
    );
    assert.ok(receipt.pushed_at);
    assert.equal(
      f
        .exec([
          'git',
          '--git-dir',
          remote,
          'rev-parse',
          'refs/heads/ticket-test',
        ])
        .stdout.trim(),
      receipt.commit,
    );
  } finally {
    fs.rmSync(f.root, { recursive: true, force: true });
    fs.rmSync(remote, { recursive: true, force: true });
  }
});
