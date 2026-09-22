import assert from 'node:assert/strict';
import {
  mkdtempSync,
  mkdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { agentPrefix, selectAgent } from '../scripts/agent-provider.mjs';
import { contained, environmentPaths } from '../scripts/environment.mjs';

test('Windows Conda paths retain spaces and point to native Prolog, not a shell shim', () => {
  const root = 'C:\\Users\\Research User\\envs\\cubspace';
  const paths = environmentPaths(root, 'win32');
  assert.equal(paths.npm, `${root}\\node_modules\\npm\\bin\\npm-cli.js`);
  assert.equal(paths.swipl, `${root}\\opt\\swipl\\bin\\swipl.exe`);
  assert.equal(paths.cache, `${root}\\var\\npm-cache`);
  assert.equal(paths.browsers, `${root}\\var\\playwright`);
});

test('Unix Conda layouts use environment bin and global npm modules', () => {
  for (const platform of ['darwin', 'linux']) {
    const paths = environmentPaths('/tmp/research env/cubspace', platform);
    assert.equal(
      paths.npm,
      '/tmp/research env/cubspace/lib/node_modules/npm/bin/npm-cli.js',
    );
    assert.equal(paths.swipl, '/tmp/research env/cubspace/bin/swipl');
  }
});

test('environment containment rejects sibling paths and symlinks escaping the environment', (t) => {
  const root = mkdtempSync(path.join(tmpdir(), 'cubspace environment '));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const prefix = path.join(root, 'env');
  const sibling = path.join(root, 'env-other');
  mkdirSync(prefix);
  mkdirSync(sibling);
  const local = path.join(prefix, 'runtime');
  const outside = path.join(sibling, 'runtime');
  writeFileSync(local, 'local');
  writeFileSync(outside, 'outside');
  assert.equal(contained(prefix, local), true);
  assert.equal(contained(prefix, outside), false);
  assert.equal(contained(prefix, path.join(prefix, 'missing')), false);
  const link = path.join(prefix, 'escaped');
  symlinkSync(sibling, link, process.platform === 'win32' ? 'junction' : 'dir');
  assert.equal(contained(prefix, path.join(link, 'runtime')), false);
});

test('agent resolution never probes a global CLI when it is missing from the environment', (t) => {
  const root = mkdtempSync(path.join(tmpdir(), 'cubspace agent '));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const prefix = path.join(root, 'env');
  const globalBin = path.join(root, 'global');
  mkdirSync(prefix);
  mkdirSync(globalBin);
  for (const name of ['codex', 'claude'])
    writeFileSync(path.join(globalBin, name), 'global CLI');
  const oldPath = process.env.PATH;
  process.env.PATH = `${globalBin}${path.delimiter}${oldPath}`;
  t.after(() => {
    process.env.PATH = oldPath;
  });
  assert.deepEqual(
    selectAgent(
      {},
      () => assert.fail('must not probe global CLI'),
      (s) => agentPrefix(s, prefix),
    ),
    { provider: 'vscode' },
  );
  assert.throws(
    () =>
      agentPrefix(
        { provider: 'codex', command: path.join(globalBin, 'codex') },
        prefix,
      ),
    /Conda/,
  );
  const modules = environmentPaths(prefix).modules;
  const packageRoot = path.join(modules, '@openai', 'codex');
  mkdirSync(packageRoot, { recursive: true });
  const local = path.join(packageRoot, 'codex.exe');
  writeFileSync(local, 'fixture executable');
  writeFileSync(
    path.join(packageRoot, 'package.json'),
    JSON.stringify({ bin: { codex: 'codex.exe' } }),
  );
  assert.deepEqual(agentPrefix({ provider: 'codex' }, prefix), [local]);
  writeFileSync(
    path.join(packageRoot, 'package.json'),
    JSON.stringify({ bin: { codex: path.join(globalBin, 'codex') } }),
  );
  assert.throws(() => agentPrefix({ provider: 'codex' }, prefix), /Conda/);
});
