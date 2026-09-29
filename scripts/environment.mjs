import { existsSync, realpathSync } from 'node:fs';
import path from 'node:path';

export function environmentPaths(prefix, platform = process.platform) {
  const p = platform === 'win32' ? path.win32 : path.posix;
  const modules =
    platform === 'win32'
      ? p.join(prefix, 'node_modules')
      : p.join(prefix, 'lib', 'node_modules');
  return {
    modules,
    npm: p.join(modules, 'npm', 'bin', 'npm-cli.js'),
    swipl:
      platform === 'win32'
        ? p.join(prefix, 'opt', 'swipl', 'bin', 'swipl.exe')
        : p.join(prefix, 'bin', 'swipl'),
    cache: p.join(prefix, 'var', 'npm-cache'),
    browsers: p.join(prefix, 'var', 'playwright'),
  };
}

export function contained(prefix, file) {
  if (!existsSync(file)) return false;
  const part = path.relative(realpathSync(prefix), realpathSync(file));
  return (
    part !== '..' && !part.startsWith(`..${path.sep}`) && !path.isAbsolute(part)
  );
}

export function activeEnvironment() {
  const prefix = process.env.CONDA_PREFIX;
  if (!prefix || !existsSync(path.join(prefix, 'conda-meta')))
    throw new Error('Run conda activate cubspace first.');
  if (!contained(prefix, process.execPath))
    throw new Error('The current Node.js is outside the active Conda environment.');
  return prefix;
}
