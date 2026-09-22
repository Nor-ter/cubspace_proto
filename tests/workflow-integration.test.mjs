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
