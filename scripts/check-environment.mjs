import { existsSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { isAbsolute, join, relative, sep } from 'node:path';
import { spawnSync } from 'node:child_process';

const prefix = process.env.CONDA_PREFIX;
if (!prefix || !existsSync(join(prefix, 'conda-meta')))
  throw new Error('먼저 conda activate cubspace를 실행하세요.');
const require = createRequire(import.meta.url);
const root = realpathSync(prefix);
let failures = 0;

function contained(path) {
  if (!existsSync(path)) return false;
  const part = relative(root, realpathSync(path));
  return part !== '..' && !part.startsWith(`..${sep}`) && !isAbsolute(part);
}

function check(label, path, args = ['--version'], optional = false) {
  if (!contained(path)) {
    if (optional)
      console.log(`SKIP ${label}: 선택 도구가 설치되지 않았습니다.`);
    else {
      console.error(
        `FAIL ${label}: 환경 내부 설치를 찾지 못했습니다 (${path})`,
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
const modules = windows
  ? join(prefix, 'node_modules')
  : join(prefix, 'lib', 'node_modules');
check('Node.js', process.execPath);
const npm = join(modules, 'npm', 'bin', 'npm-cli.js');
if (!contained(npm)) {
  console.error('FAIL npm: 환경 내부 npm이 없습니다.');
  failures++;
} else check('npm', process.execPath, [npm, '--version']);
const codex = join(modules, '@openai', 'codex', 'bin', 'codex.js');
if (!contained(codex)) {
  console.log('SKIP Codex: 선택 도구가 설치되지 않았습니다.');
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
  'INFO 에이전트 CLI는 선택 사항입니다. 버전 확인은 로그인 확인이 아닙니다.',
);
const swipl = join(bin, windows ? 'swipl.exe' : 'swipl');
check('SWI-Prolog', swipl);
check('Prolog 실행 이력', swipl, [
  '-q',
  '-s',
  'prolog/run_rules.pl',
  '-g',
  'findall(R,reviewed_run(R),Rs),writeln(Rs),halt',
]);
for (const [key, path] of Object.entries({
  NPM_CONFIG_PREFIX: prefix,
  NPM_CONFIG_CACHE: join(prefix, 'var', 'npm-cache'),
  PLAYWRIGHT_BROWSERS_PATH: join(prefix, 'var', 'playwright'),
})) {
  if (process.env[key] !== path) {
    console.error(`FAIL ${key}: Conda 환경을 다시 활성화하세요.`);
    failures++;
  } else console.log(`PASS ${key}: ${path}`);
}
try {
  const browser = require('playwright').chromium.executablePath();
  if (!contained(browser))
    throw new Error('Chromium이 Conda 환경 내부에 설치되지 않았습니다.');
  console.log(`PASS Chromium: ${browser}`);
} catch (error) {
  console.error(`FAIL Chromium: ${error.message}`);
  failures++;
}
process.exitCode = failures ? 1 : 0;
