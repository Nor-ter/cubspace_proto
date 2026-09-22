import { createHash } from 'node:crypto';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';

const prefix = process.env.CONDA_PREFIX;
if (!prefix || !existsSync(join(prefix, 'conda-meta')))
  throw new Error('먼저 conda activate cubspace를 실행하세요.');
const inside = relative(realpathSync(prefix), realpathSync(process.execPath));
if (inside.startsWith(`..${sep}`) || inside === '..')
  throw new Error('현재 Node.js가 활성 Conda 환경 밖에 있습니다.');
if (process.platform === 'win32')
  throw new Error(
    '자동 설치는 macOS와 Linux를 지원합니다. Windows는 docs/environment.md의 WSL 절차를 사용하세요.',
  );
const conda = process.env.CONDA_EXE || 'conda';
const cache = join(prefix, 'var', 'npm-cache');
const browsers = join(prefix, 'var', 'playwright');
const env = {
  ...process.env,
  NPM_CONFIG_PREFIX: prefix,
  NPM_CONFIG_CACHE: cache,
  PLAYWRIGHT_BROWSERS_PATH: browsers,
};
const npm = join(prefix, 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js');
const swipl = join(prefix, 'bin', 'swipl');

function run(file, args) {
  const result = spawnSync(file, args, {
    env,
    stdio: 'inherit',
    timeout: 600_000,
  });
  if (result.error || result.status !== 0)
    throw result.error || new Error(`${file}: exit ${result.status}`);
}

async function installProlog() {
  if (existsSync(swipl)) {
    const local = relative(realpathSync(prefix), realpathSync(swipl));
    if (local.startsWith(`..${sep}`) || local === '..')
      throw new Error('환경 밖을 가리키는 swipl을 먼저 확인하세요.');
    run(swipl, ['--version']);
    return;
  }
  if (process.platform === 'linux') {
    run(conda, [
      'install',
      '--prefix',
      prefix,
      '--override-channels',
      '-c',
      'conda-forge',
      'swi-prolog=10',
      '-y',
    ]);
    return;
  }
  if (process.platform !== 'darwin')
    throw new Error(`지원하지 않는 플랫폼: ${process.platform}`);
  const temporary = mkdtempSync(join(tmpdir(), 'cubspace-swipl-'));
  const mount = join(temporary, 'mount');
  const dmg = join(temporary, 'swipl.dmg');
  const destination = join(prefix, 'opt', 'SWI-Prolog.app');
  let mounted = false;
  try {
    const response = await fetch(
      'https://www.swi-prolog.org/download/stable/bin/swipl-10.0.2-1.fat.dmg',
      { signal: AbortSignal.timeout(180_000) },
    );
    if (!response.ok)
      throw new Error(`SWI-Prolog 다운로드 실패: HTTP ${response.status}`);
    const data = Buffer.from(await response.arrayBuffer());
    if (
      createHash('sha256').update(data).digest('hex') !==
      'bf775f0b8d7880f4908dee513316013ef42a73793be392814fde2a0a8e9ddc5d'
    )
      throw new Error('SWI-Prolog SHA256 불일치');
    writeFileSync(dmg, data);
    run('/usr/bin/hdiutil', [
      'attach',
      '-nobrowse',
      '-readonly',
      '-mountpoint',
      mount,
      dmg,
    ]);
    mounted = true;
    if (existsSync(destination))
      throw new Error(`기존 설치를 확인하세요: ${destination}`);
    mkdirSync(dirname(destination), { recursive: true });
    cpSync(join(mount, 'SWI-Prolog.app'), destination, {
      recursive: true,
      verbatimSymlinks: true,
    });
    run(join(destination, 'Contents', 'MacOS', 'swipl'), ['--version']);
    symlinkSync(
      relative(dirname(swipl), join(destination, 'Contents', 'MacOS', 'swipl')),
      swipl,
    );
  } finally {
    if (mounted) run('/usr/bin/hdiutil', ['detach', mount]);
    rmSync(temporary, { recursive: true, force: true });
  }
}

mkdirSync(cache, { recursive: true });
mkdirSync(browsers, { recursive: true });
await installProlog();
run(process.execPath, [
  npm,
  'install',
  '--global',
  '--prefix',
  prefix,
  '--cache',
  cache,
  '@openai/codex@0.155.1',
  '@anthropic-ai/claude-code@2.1.278',
]);
run(process.execPath, [npm, 'ci']);
run(conda, [
  'env',
  'config',
  'vars',
  'set',
  '--prefix',
  prefix,
  `NPM_CONFIG_PREFIX=${prefix}`,
  `NPM_CONFIG_CACHE=${cache}`,
  `PLAYWRIGHT_BROWSERS_PATH=${browsers}`,
]);
const playwright = resolve('node_modules/playwright/cli.js');
if (!existsSync(playwright))
  throw new Error('프로젝트 루트에서 npm ci를 실행한 다음 다시 설치하세요.');
run(process.execPath, [playwright, 'install', 'chromium']);
run(swipl, [
  '-q',
  '-s',
  'prolog/run_rules.pl',
  '-g',
  'findall(R,reviewed_run(R),Rs),writeln(Rs),halt',
]);
console.log(
  '설치 완료. conda deactivate 후 conda activate cubspace를 실행하고 npm run environment:check로 확인하세요.',
);
