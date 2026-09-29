import { spawnSync } from 'node:child_process';
import {
  activeEnvironment,
  contained,
  environmentPaths,
} from './environment.mjs';

const prefix = activeEnvironment();
const { swipl } = environmentPaths(prefix);
if (!contained(prefix, swipl))
  throw new Error(
    'SWI-Prolog is not present inside the environment. Run environment:setup.',
  );
const result = spawnSync(swipl, process.argv.slice(2), { stdio: 'inherit' });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
