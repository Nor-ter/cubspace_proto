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
    '환경 내부에 SWI-Prolog가 없습니다. environment:setup을 실행하세요.',
  );
const result = spawnSync(swipl, process.argv.slice(2), { stdio: 'inherit' });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
