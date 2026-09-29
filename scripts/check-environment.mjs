import { realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import {
  activeEnvironment,
  contained as inside,
  environmentPaths,
} from './environment.mjs';
import { spawnSync } from 'node:child_process';

const prefix = activeEnvironment();
const require = createRequire(import.meta.url);
let failures = 0;
const contained = (file) => inside(prefix, file);

function check(label, path, args = ['--version'], optional = false) {
  if (!contained(path)) {
    if (optional)
      console.log(`SKIP ${label}: optional tool is not installed.`);
    else {
      console.error(
        `FAIL ${label}: installation inside the environment was not found (${path})`,
      );
      failures++;
    }
    return;
  }
  const result = spawnSync(path, args, { encoding: 'utf8', timeout: 30_000 });
  if (result.error || result.status !== 0) {
    console.error(
      `${optional ? 'WARN' : 'FAIL'} ${label}: ${result.error?.message || result.stderr.trim()}`,
    );
    if (!optional) failures++;
  } else
    console.log(
      `PASS ${label}: ${result.stdout.trim()} (${realpathSync(path)})`,
    );
}

const windows = process.platform === 'win32';
const bin = windows ? prefix : join(prefix, 'bin');
const { modules, npm, swipl, cache, browsers } = environmentPaths(prefix);
check('Node.js', process.execPath);
if (!contained(npm)) {
  console.error('FAIL npm: npm is not present inside the environment.');
  failures++;
} else check('npm', process.execPath, [npm, '--version']);
const codex = join(modules, '@openai', 'codex', 'bin', 'codex.js');
if (!contained(codex)) {
  console.log('SKIP Codex: optional tool is not installed.');
} else check('Codex', process.execPath, [codex, '--version'], true);
check(
  'Claude Code',
  windows
    ? join(modules, '@anthropic-ai', 'claude-code', 'bin', 'claude.exe')
    : join(bin, 'claude'),
  ['--version'],
  true,
);
console.log(
  'INFO Agent CLIs are optional. A version check is not a login check.',
);
check('SWI-Prolog', swipl);
check('Prolog run history', swipl, [
  '-q',
  '-s',
  'prolog/run_rules.pl',
  '-g',
  'findall(R,reviewed_run(R),Rs),writeln(Rs),halt',
]);
for (const [key, path] of Object.entries({
  NPM_CONFIG_PREFIX: prefix,
  NPM_CONFIG_CACHE: cache,
  PLAYWRIGHT_BROWSERS_PATH: browsers,
})) {
  if (process.env[key] !== path) {
    console.error(`FAIL ${key}: reactivate the Conda environment.`);
    failures++;
  } else console.log(`PASS ${key}: ${path}`);
}
try {
  const browser = require('playwright').chromium.executablePath();
  if (!contained(browser))
    throw new Error('Chromium is not installed inside the Conda environment.');
  console.log(`PASS Chromium: ${browser}`);
} catch (error) {
  console.error(`FAIL Chromium: ${error.message}`);
  failures++;
}
process.exitCode = failures ? 1 : 0;
