import fs from 'node:fs';
import path from 'node:path';

export function agentInvocation(settings, role, prompt, destination, schema) {
  const provider = settings?.provider ?? 'codex';
  if (!['codex', 'claude'].includes(provider))
    throw new Error('지원하는 에이전트: codex, claude');
  let prefix = settings?.command ?? provider;
  prefix = Array.isArray(prefix) ? prefix : [prefix];
  if (!prefix.length || prefix.some((x) => typeof x !== 'string' || !x.trim()))
    throw new Error('에이전트 command는 명령 또는 인수 배열이어야 합니다.');
  if (
    process.platform === 'win32' &&
    prefix.length === 1 &&
    prefix[0] === provider &&
    process.env.CONDA_PREFIX
  ) {
    const packageName =
      provider === 'codex' ? '@openai/codex' : '@anthropic-ai/claude-code';
    const root = path.join(
      process.env.CONDA_PREFIX,
      'node_modules',
      packageName,
    );
    const manifest = JSON.parse(
      fs.readFileSync(path.join(root, 'package.json'), 'utf8'),
    );
    const entry =
      typeof manifest.bin === 'string'
        ? manifest.bin
        : manifest.bin?.[provider];
    if (!entry) throw new Error('Conda 환경의 에이전트 CLI를 설치하세요.');
    const file = path.join(root, entry);
    prefix = /\.[cm]?js$/.test(file) ? [process.execPath, file] : [file];
  }
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
