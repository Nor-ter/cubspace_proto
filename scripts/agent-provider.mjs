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
    throw new Error('Supported agents: codex, claude');
  if (settings?.command !== undefined) {
    const prefix = Array.isArray(settings.command)
      ? [...settings.command]
      : [settings.command];
    if (
      !prefix.length ||
      prefix.some((x) => typeof x !== 'string' || !x.trim())
    )
      throw new Error('The agent command must be a command or an argument array.');
    if (!path.isAbsolute(prefix[0]))
      prefix[0] = path.join(
        environment,
        process.platform === 'win32' ? '' : 'bin',
        prefix[0],
      );
    if (!contained(environment, prefix[0]))
      throw new Error(
        'The agent executable must be inside the active Conda environment.',
      );
    return prefix;
  }
  const packageName =
    provider === 'codex' ? '@openai/codex' : '@anthropic-ai/claude-code';
  const root = path.join(environmentPaths(environment).modules, packageName);
  const manifestPath = path.join(root, 'package.json');
  if (!contained(environment, manifestPath))
    throw new Error('Install the agent CLI in the Conda environment.');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const entry =
    typeof manifest.bin === 'string' ? manifest.bin : manifest.bin?.[provider];
  if (typeof entry !== 'string' || !entry.trim())
    throw new Error('Install the agent CLI in the Conda environment.');
  const file = path.resolve(root, entry);
  if (!contained(environment, file))
    throw new Error('The agent executable points outside the Conda environment.');
  if (/\.[cm]?js$/.test(file)) {
    if (!contained(environment, process.execPath))
      throw new Error('The current Node.js is outside the active Conda environment.');
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
    throw new Error('The Claude run did not complete. Check the log.');
  if (role === 'reviewer') {
    if (
      !result.structured_output ||
      typeof result.structured_output !== 'object'
    )
      throw new Error('The Claude review JSON is missing.');
    return result.structured_output;
  }
  if (typeof result.result !== 'string' || !result.result.trim())
    throw new Error('The Claude implementation report is missing.');
  return result.result;
}
