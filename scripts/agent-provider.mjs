import fs from 'node:fs';
import path from 'node:path';
import { command } from './ticket-lib.mjs';
import {
  activeEnvironment,
  contained,
  environmentPaths,
} from './environment.mjs';

export function agentPrefix(settings, environment = activeEnvironment()) {
  const provider = settings?.provider ?? 'codex';
  if (!['codex', 'claude'].includes(provider))
    throw new Error('지원하는 에이전트: codex, claude');
  if (settings?.command !== undefined) {
    const prefix = Array.isArray(settings.command)
      ? [...settings.command]
      : [settings.command];
    if (
      !prefix.length ||
      prefix.some((x) => typeof x !== 'string' || !x.trim())
    )
      throw new Error('에이전트 command는 명령 또는 인수 배열이어야 합니다.');
    if (!path.isAbsolute(prefix[0]))
      prefix[0] = path.join(
        environment,
        process.platform === 'win32' ? '' : 'bin',
        prefix[0],
      );
    if (!contained(environment, prefix[0]))
      throw new Error(
        '에이전트 실행 파일은 활성 Conda 환경 안에 있어야 합니다.',
      );
    return prefix;
  }
  const packageName =
    provider === 'codex' ? '@openai/codex' : '@anthropic-ai/claude-code';
  const root = path.join(environmentPaths(environment).modules, packageName);
  const manifestPath = path.join(root, 'package.json');
  if (!contained(environment, manifestPath))
    throw new Error('Conda 환경의 에이전트 CLI를 설치하세요.');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const entry =
    typeof manifest.bin === 'string' ? manifest.bin : manifest.bin?.[provider];
  if (typeof entry !== 'string' || !entry.trim())
    throw new Error('Conda 환경의 에이전트 CLI를 설치하세요.');
  const file = path.resolve(root, entry);
  if (!contained(environment, file))
    throw new Error('에이전트 실행 파일이 Conda 환경 밖을 가리킵니다.');
  if (/\.[cm]?js$/.test(file)) {
    if (!contained(environment, process.execPath))
      throw new Error('현재 Node.js가 활성 Conda 환경 밖에 있습니다.');
    return [process.execPath, file];
  }
  return [file];
}

export function selectAgent(
  settings = {},
  probe = (argv) => command(argv, process.cwd(), { timeout: 10000 }),
  resolvePrefix = agentPrefix,
) {
  const provider = settings.provider ?? 'auto';
  if (provider === 'vscode') return { provider };
  if (provider !== 'auto') {
    resolvePrefix(settings);
    return settings;
  }
  for (const candidate of ['codex', 'claude']) {
    try {
      const args =
        candidate === 'codex'
          ? ['login', 'status']
          : ['auth', 'status', '--json'];
      const result = probe([
        ...resolvePrefix({ provider: candidate }),
        ...args,
      ]);
      if (result.code === 0) return { provider: candidate };
    } catch {
      /* Missing CLI is handled by the VS Code hand-off. */
    }
  }
  return { provider: 'vscode' };
}

export function agentInvocation(settings, role, prompt, destination, schema) {
  const provider = settings.provider;
  const prefix = agentPrefix(settings);
  if (provider === 'codex')
    return {
      provider,
      argv: [
        ...prefix,
        'exec',
        '--sandbox',
        role === 'reviewer' ? 'read-only' : 'workspace-write',
        ...(role === 'reviewer'
          ? ['--output-schema', 'workflow/review.schema.json']
          : []),
        '-o',
        destination,
        prompt,
      ],
    };
  return {
    provider,
    argv: [
      ...prefix,
      '-p',
      '--output-format',
      'json',
      '--no-session-persistence',
      '--strict-mcp-config',
      '--mcp-config',
      '{"mcpServers":{}}',
      '--permission-mode',
      role === 'reviewer' ? 'plan' : 'acceptEdits',
      '--tools',
      role === 'reviewer' ? 'Read,Glob,Grep' : 'Read,Glob,Grep,Edit,Write,Bash',
      ...(role === 'reviewer' ? ['--json-schema', JSON.stringify(schema)] : []),
      prompt,
    ],
  };
}

export function claudeResult(stdout, role) {
  const result = JSON.parse(stdout);
  if (result.is_error || result.subtype !== 'success')
    throw new Error('Claude 실행이 완료되지 않았습니다. 로그를 확인하세요.');
  if (role === 'reviewer') {
    if (
      !result.structured_output ||
      typeof result.structured_output !== 'object'
    )
      throw new Error('Claude 리뷰 JSON이 없습니다.');
    return result.structured_output;
  }
  if (typeof result.result !== 'string' || !result.result.trim())
    throw new Error('Claude 구현 보고서가 없습니다.');
  return result.result;
}
