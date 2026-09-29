import { createHash } from 'node:crypto';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  renameSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import {
  activeEnvironment,
  contained,
  environmentPaths,
} from './environment.mjs';
import { spawnSync } from 'node:child_process';

const provider = process.argv[2] || 'vscode';
if (
  process.argv.length > 3 ||
  !['codex', 'claude', 'vscode'].includes(provider)
)
  throw new Error(
    'Usage: node scripts/setup-environment.mjs [codex|claude|vscode]',
  );
const packages = {
  codex: '@openai/codex@0.155.1',
  claude: '@anthropic-ai/claude-code@2.1.278',
};

const prefix = activeEnvironment();
const conda = process.env.CONDA_EXE || 'conda';
const { npm, swipl, cache, browsers } = environmentPaths(prefix);
if (!contained(prefix, npm))
  throw new Error('npm inside the Conda environment could not be found.');
const env = {
  ...process.env,
  NPM_CONFIG_PREFIX: prefix,
  NPM_CONFIG_CACHE: cache,
  PLAYWRIGHT_BROWSERS_PATH: browsers,
};

function run(file, args) {
  const result = spawnSync(file, args, {
    env,
    stdio: 'inherit',
    timeout: 600_000,
  });
  if (result.error || result.status !== 0)
    throw result.error || new Error(`${file}: exit ${result.status}`);
}

async function download(name, sha256, destination) {
  const response = await fetch(
    `https://www.swi-prolog.org/download/stable/bin/${name}`,
    {
      signal: AbortSignal.timeout(180_000),
    },
  );
  if (!response.ok)
    throw new Error(`SWI-Prolog download failed: HTTP ${response.status}`);
  const data = Buffer.from(await response.arrayBuffer());
  if (createHash('sha256').update(data).digest('hex') !== sha256)
    throw new Error('SWI-Prolog SHA256 mismatch');
  writeFileSync(destination, data);
}

async function installProlog() {
  if (existsSync(swipl)) {
    if (!contained(prefix, swipl))
      throw new Error('First check the swipl that points outside the environment.');
    run(swipl, ['--version']);
    return;
  }
  if (['linux', 'win32'].includes(process.platform) && process.arch !== 'x64')
    throw new Error(
      'Automatic SWI-Prolog installation supports Windows/Linux x64. On this architecture, install SWI-Prolog inside the environment first.',
    );
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
  if (process.platform === 'win32') {
    const extractor = join(prefix, 'bin', '7z.exe');
    if (!contained(prefix, extractor))
      run(conda, [
        'install',
        '--prefix',
        prefix,
        '--override-channels',
        '-c',
        'conda-forge',
        '7zip=26.03',
        '-y',
      ]);
    if (!contained(prefix, extractor))
      throw new Error('7-Zip inside the environment could not be found.');
    const destination = join(prefix, 'opt', 'swipl');
    if (existsSync(destination))
      throw new Error(`Check the existing installation: ${destination}`);
    mkdirSync(dirname(destination), { recursive: true });
    const temporary = mkdtempSync(join(dirname(destination), '.swipl-'));
    try {
      const archive = join(temporary, 'swipl.exe');
      await download(
        'swipl-10.0.2-1.x64.exe',
        '2ec1f25be0eafb92e559004782b130774c12573fb4b7e8a917e534754a641ad6',
        archive,
      );
      const payload = join(temporary, 'payload');
      run(extractor, ['x', archive, `-o${payload}`, '-y']);
      rmSync(join(payload, '$PLUGINSDIR'), { recursive: true, force: true });
      run(join(payload, 'bin', 'swipl.exe'), [
        '-q',
        '-g',
        'use_module(library(plunit)),halt',
      ]);
      renameSync(payload, destination);
    } finally {
      rmSync(temporary, { recursive: true, force: true });
    }
    return;
  }
  if (process.platform !== 'darwin')
    throw new Error(`Unsupported platform: ${process.platform}`);
  const temporary = mkdtempSync(join(tmpdir(), 'cubspace-swipl-'));
  const mount = join(temporary, 'mount');
  const dmg = join(temporary, 'swipl.dmg');
  const destination = join(prefix, 'opt', 'SWI-Prolog.app');
  let mounted = false;
  try {
    await download(
      'swipl-10.0.2-1.fat.dmg',
      'bf775f0b8d7880f4908dee513316013ef42a73793be392814fde2a0a8e9ddc5d',
      dmg,
    );
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
      throw new Error(`Check the existing installation: ${destination}`);
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
if (packages[provider])
  run(process.execPath, [
    npm,
    'install',
    '--global',
    '--prefix',
    prefix,
    '--cache',
    cache,
    packages[provider],
  ]);
else console.log('Using VS Code: no additional agent CLI is installed.');
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
  throw new Error('Run npm ci in the project root, then install again.');
run(process.execPath, [playwright, 'install', 'chromium']);
run(swipl, [
  '-q',
  '-s',
  'prolog/run_rules.pl',
  '-g',
  'findall(R,reviewed_run(R),Rs),writeln(Rs),halt',
]);
console.log(
  'Setup complete. Run conda deactivate, then conda activate cubspace, and confirm with npm run environment:check.',
);
