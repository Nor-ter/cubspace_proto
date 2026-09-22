import fs from 'node:fs';
import path from 'node:path';
import {
  assertReady,
  command,
  fingerprint,
  hash,
  readJson,
  writeJson,
} from './ticket-lib.mjs';

const escape = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ],
  );
const pngHeader = Buffer.from('89504e470d0a1a0a', 'hex');
const selectedViews = [
  ['/?admin=1#home', 1440, 'Overview'],
  ['/?admin=1#anatomy', 1440, 'CubeSat geometry'],
  ['/learn/05', 1440, 'ADCS lesson'],
  ['/?admin=1#home', 390, 'Mobile overview'],
];

export function uiFingerprint(root = process.cwd()) {
  const result = command(
    ['git', 'ls-files', '-co', '--exclude-standard', '-z'],
    root,
  );
  if (result.code) throw new Error('UI source 목록을 확인할 수 없습니다.');
  const files = [...new Set(result.stdout.split('\0'))]
    .filter(
      (file) =>
        /^(app|components|src|lib|public|\.openai)\//.test(file) ||
        [
          'package.json',
          'package-lock.json',
          'vite.config.ts',
          'tsconfig.json',
          'postcss.config.mjs',
        ].includes(file),
    )
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  return hash(
    files
      .map(
        (file) =>
          `${file}\0${fs.existsSync(path.join(root, file)) ? hash(fs.readFileSync(path.join(root, file))) : 'deleted'}`,
      )
      .join('\n'),
  );
}

function runDirectory(root, id) {
  if (!/^[A-Z][A-Z0-9]*-\d+(?:-\d{14}-[a-f0-9]{8})?$/.test(id))
    throw new Error('잘못된 task ID입니다.');
  return path.join(root, 'workflow', 'runs', id);
}

export function captureEvidence(state, root = process.cwd()) {
  const dir = runDirectory(root, state.id);
  const capture = path.join(root, '.workflow', 'browser');
  const browser = readJson(path.join(capture, 'results.json'));
  if (
    browser.failed !== 0 ||
    !browser.cases?.length ||
    browser.ui_fingerprint !== uiFingerprint(root)
  )
    throw new Error('현재 UI source의 browser check를 통과해야 합니다.');
  fs.mkdirSync(path.join(dir, 'screenshots'), { recursive: true });
  const screenshots = selectedViews.map(([route, width, label]) => {
    const item = browser.cases.find(
      (c) => c.route === route && c.width === width,
    );
    if (
      !item ||
      !item.screenshot ||
      path.basename(item.screenshot) !== item.screenshot
    )
      throw new Error('Screenshot 결과가 없습니다.');
    const bytes = fs.readFileSync(path.join(capture, item.screenshot));
    if (!bytes.subarray(0, 8).equals(pngHeader) || hash(bytes) !== item.sha256)
      throw new Error('Screenshot 파일이 capture 이후 변경됐습니다.');
    const relative = `screenshots/${item.screenshot}`;
    fs.writeFileSync(path.join(dir, relative), bytes);
    return { path: relative, sha256: hash(bytes), label, route, width };
  });
  writeJson(path.join(dir, 'browser-results.json'), browser);
  const manifest = {
    captured_at: browser.captured_at,
    ui_fingerprint: browser.ui_fingerprint,
    browser_sha256: hash(
      fs.readFileSync(path.join(dir, 'browser-results.json')),
    ),
    screenshots,
  };
  writeJson(path.join(dir, 'evidence.json'), manifest);
  return manifest;
}

export function readEvidence(state, root = process.cwd(), required = false) {
  const dir = runDirectory(root, state.id);
  const manifestPath = path.join(dir, 'evidence.json');
  if (!fs.existsSync(manifestPath)) {
    if (required) throw new Error(`먼저 evidence ${state.id}를 실행하세요.`);
    return { browser: null, screenshots: [] };
  }
  const manifest = readJson(manifestPath);
  if (manifest.ui_fingerprint !== uiFingerprint(root))
    throw new Error('UI source가 변경됐습니다. evidence를 다시 실행하세요.');
  const browserBytes = fs.readFileSync(path.join(dir, 'browser-results.json'));
  if (hash(browserBytes) !== manifest.browser_sha256)
    throw new Error('Browser 결과가 변경됐습니다.');
  const browser = JSON.parse(browserBytes);
  if (
    browser.failed !== 0 ||
    !browser.cases?.length ||
    browser.ui_fingerprint !== manifest.ui_fingerprint ||
    !manifest.screenshots?.length
  )
    throw new Error('통과한 browser evidence가 없습니다.');
  const screenshots = manifest.screenshots.map((item) => {
    if (!/^screenshots\/[^/\\]+\.png$/.test(item.path))
      throw new Error('Screenshot 경로가 올바르지 않습니다.');
    const file = path.join(dir, item.path);
    const relative = path.relative(fs.realpathSync(dir), fs.realpathSync(file));
    if (relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative))
      throw new Error('Screenshot이 실행 폴더 밖을 가리킵니다.');
    const bytes = fs.readFileSync(file);
    if (!bytes.subarray(0, 8).equals(pngHeader) || hash(bytes) !== item.sha256)
      throw new Error('Screenshot 파일이 변경됐습니다.');
    const test = browser.cases.find(
      (c) =>
        c.route === item.route &&
        c.width === item.width &&
        c.sha256 === item.sha256,
    );
    if (!test) throw new Error('Screenshot의 browser check 기록이 없습니다.');
    return { ...item, file, bytes };
  });
  return { browser, screenshots, captured_at: manifest.captured_at };
}

export function reportHtml(state, evidence, passed = false) {
  const rows = (state.checks ?? [])
    .map(
      (c) =>
        `<tr><td>${escape(c.name)}</td><td>${c.code === 0 ? 'PASS' : 'FAIL'}</td><td>${(c.duration_ms / 1000).toFixed(2)} s</td></tr>`,
    )
    .join('');
  const images = evidence.screenshots
    .map(
      (s) =>
        `<figure><figcaption><strong>${escape(s.label)}</strong><span>${escape(s.route)} · ${s.width}px</span></figcaption><img style="max-width:${Number(s.width)}px" alt="${escape(s.label)}" src="data:image/png;base64,${s.bytes.toString('base64')}"></figure>`,
    )
    .join('');
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'"><title>${escape(state.ticket.id)} · Results</title><style>
*{box-sizing:border-box}body{margin:0;background:#f4f6f8;color:#172b3a;font:15px/1.65 system-ui,sans-serif}main{max-width:1120px;margin:auto;padding:40px 24px}header{border-bottom:2px solid #172b3a;padding-bottom:24px;margin-bottom:24px}.brand{font-size:12px;letter-spacing:.14em;color:#536674}h1{font-size:32px;line-height:1.2;margin:12px 0}h2{font-size:19px;margin:0 0 16px}p{margin:8px 0}.meta{color:#536674}.status{display:inline-block;background:#e4efea;padding:4px 12px;border-radius:4px;font-weight:600}.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}section,figure{background:#fff;border:1px solid #dbe2e8;border-radius:6px;padding:24px;margin:0 0 20px}table{width:100%;border-collapse:collapse}td,th{text-align:left;border-bottom:1px solid #e6ebef;padding:10px 4px}th{font-size:12px;color:#536674}ul{padding-left:20px}li{margin-bottom:8px}.hash{overflow-wrap:anywhere;font:12px/1.6 monospace}figcaption{display:flex;justify-content:space-between;gap:16px;margin-bottom:16px}figcaption span{font-size:12px;color:#536674}img{display:block;width:100%;height:auto;margin:auto;background:#f4f6f8}footer{font-size:12px;color:#536674}@media(max-width:700px){main{padding:24px 12px}.grid{grid-template-columns:1fr}section,figure{padding:18px}figcaption{display:block}figcaption span{display:block}}@media print{body{background:white}main{padding:0}figure{break-inside:avoid}img{max-height:700px}}
</style></head><body><main><header><div class="brand">CUBSPACE · TASK REPORT</div><h1>${escape(state.ticket.id)}</h1><p>${escape(state.ticket.description)}</p><p class="status">${passed ? 'Code review passed' : 'Review pending'}</p><p class="meta">Browser capture: ${escape(evidence.captured_at ?? 'Not supplied')} · ${evidence.browser ? `${evidence.browser.cases.length} checks / ${evidence.browser.failed} failed` : 'No browser evidence'}</p>${evidence.issue ? `<p class="meta">Evidence: ${escape(evidence.issue)}</p>` : ''}</header><div class="grid"><section><h2>Checks</h2><table><thead><tr><th>Check</th><th>Result</th><th>Duration</th></tr></thead><tbody>${rows}</tbody></table></section><section><h2>Review</h2><p>${escape(state.review?.reviewer ?? 'Pending')}</p><p>Decision: ${escape(state.review?.decision ?? 'pending')}</p><p>Duration: ${state.metrics?.reviewer_duration_ms == null ? 'Not measured' : `${(state.metrics.reviewer_duration_ms / 1000).toFixed(2)} s`}</p><p class="hash">Source SHA-256: ${escape(state.fingerprint ?? 'Not checked')}</p></section></div><section><h2>Review evidence</h2><ul>${(state.review?.evidence ?? []).map((text) => `<li>${escape(text)}</li>`).join('')}</ul></section><section><h2>Delivery checks</h2><ul>${(state.ticket.delivery_criteria ?? []).map((text) => `<li>${escape(text)}</li>`).join('')}</ul><p class="meta">이 report는 code review 결과입니다. 실제 publish 결과는 ClickUp task와 local delivery 기록에서 확인합니다.</p></section>${images}<footer>Standalone report · Images embedded · LLM 사용량과 비용은 측정된 값만 보고합니다.</footer></main></body></html>`;
}

export function createHtmlReport(
  state,
  root = process.cwd(),
  required = false,
) {
  let evidence;
  try {
    evidence = readEvidence(state, root, required);
  } catch (error) {
    if (required) throw error;
    evidence = { browser: null, screenshots: [], issue: error.message };
  }
  let passed = false;
  try {
    const configPath = path.join(root, 'workflow/config.json');
    const config = fs.existsSync(configPath) ? readJson(configPath) : {};
    assertReady(
      state,
      fingerprint(root),
      (config.checks ?? []).map((c) => c.name),
    );
    passed =
      !evidence.issue &&
      (!(required || config.evidence?.browser) || Boolean(evidence.browser));
  } catch {
    /* An incomplete report remains available for inspection. */
  }
  const html = reportHtml(state, evidence, passed);
  const output = path.join(
    root,
    '.workflow',
    'results',
    state.id,
    `${state.id}.html`,
  );
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, html);
  const files = [
    {
      path: output,
      name: `${state.id}-report-${hash(html).slice(0, 12)}.html`,
      sha256: hash(html),
      mime: 'text/html',
    },
  ];
  for (const item of evidence.screenshots)
    files.push({
      path: item.file,
      name: `${state.id}-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${item.sha256.slice(0, 12)}.png`,
      sha256: item.sha256,
      mime: 'image/png',
    });
  return files;
}
