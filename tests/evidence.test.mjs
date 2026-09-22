import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { test } from 'node:test';
import {
  captureEvidence,
  createHtmlReport,
  readEvidence,
  reportHtml,
  uiFingerprint,
} from '../scripts/evidence.mjs';
import { fingerprint, hash, writeJson } from '../scripts/ticket-lib.mjs';

const library = new URL('../scripts/ticket-lib.mjs', import.meta.url).href;
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cubspace-evidence-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  execFileSync('git', ['init', '-q', root]);
  fs.mkdirSync(path.join(root, 'app'));
  fs.writeFileSync(
    path.join(root, 'app/page.tsx'),
    'export default function Page() {}',
  );
  fs.writeFileSync(
    path.join(root, '.gitignore'),
    '.workflow/\nworkflow/runs/**/screenshots/\n',
  );
  const capture = path.join(root, '.workflow/browser');
  fs.mkdirSync(capture, { recursive: true });
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=',
    'base64',
  );
  const cases = [
    ['/?admin=1#home', 1440],
    ['/?admin=1#anatomy', 1440],
    ['/learn/05', 1440],
    ['/?admin=1#home', 390],
  ].map(([route, width], i) => {
    const screenshot = `${i}.png`;
    fs.writeFileSync(path.join(capture, screenshot), png);
    return { route, width, screenshot, sha256: hash(png) };
  });
  writeJson(path.join(capture, 'results.json'), {
    captured_at: '2026-09-23T00:00:00Z',
    failed: 0,
    ui_fingerprint: uiFingerprint(root),
    cases,
  });
  const state = {
    id: 'CUB-100',
    ticket: {
      id: 'CUB-100',
      description: '<script>alert(1)</script>',
      delivery_criteria: ['Verify attachments'],
    },
    fingerprint: 'source',
    checks: [{ name: 'unit', code: 0, duration_ms: 120 }],
    review: {
      reviewer: 'independent',
      decision: 'pass',
      fingerprint: 'source',
      evidence: ['Actual test result'],
    },
  };
  return {
    root,
    state,
    dir: path.join(root, 'workflow/runs/CUB-100'),
    capture,
  };
}

test('report embeds verified screenshots, escapes data and reflects review status', (t) => {
  const { root, state } = fixture(t);
  captureEvidence(state, root);
  state.fingerprint = fingerprint(root);
  state.review.fingerprint = state.fingerprint;
  const files = createHtmlReport(state, root, true);
  assert.equal(files.length, 5);
  const html = fs.readFileSync(files[0].path, 'utf8');
  assert.equal(html.match(/src="data:image\/png;base64,/g).length, 4);
  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('Code review passed'));
  assert.ok(!/<(?:img|script|link)[^>]+(?:src|href)="https?:/.test(html));
  assert.deepEqual(createHtmlReport(state, root, true), files);
  assert.ok(
    reportHtml({ ...state, review: null }, readEvidence(state, root)).includes(
      'Review pending',
    ),
  );
  assert.ok(
    reportHtml(
      { ...state, checks: [{ code: 1, name: 'unit', duration_ms: 2 }] },
      readEvidence(state, root),
    ).includes('FAIL'),
  );
});

test('required evidence rejects missing captures, altered browser results, PNG bytes and stale UI', (t) => {
  const { root, state, dir } = fixture(t);
  assert.throws(() => readEvidence(state, root, true), /evidence/);
  captureEvidence(state, root);
  const browserPath = path.join(dir, 'browser-results.json');
  const original = fs.readFileSync(browserPath);
  fs.appendFileSync(browserPath, '\n');
  assert.throws(() => readEvidence(state, root, true), /Browser/);
  fs.writeFileSync(browserPath, original);
  fs.appendFileSync(path.join(dir, 'screenshots/0.png'), 'changed');
  assert.throws(() => readEvidence(state, root, true), /Screenshot/);
  captureEvidence(state, root);
  fs.writeFileSync(path.join(root, 'app/page.tsx'), 'changed UI');
  assert.throws(() => readEvidence(state, root, true), /UI source/);
});

test('capture rejects failed checks, missing selected routes and changed screenshot bytes', (t) => {
  const { root, state, capture } = fixture(t);
  const file = path.join(capture, 'results.json');
  const browser = JSON.parse(fs.readFileSync(file));
  writeJson(file, { ...browser, failed: 1 });
  assert.throws(() => captureEvidence(state, root), /browser check/);
  writeJson(file, { ...browser, cases: browser.cases.slice(0, 2) });
  assert.throws(() => captureEvidence(state, root), /Screenshot/);
  writeJson(file, browser);
  fs.appendFileSync(path.join(capture, '0.png'), 'changed');
  assert.throws(() => captureEvidence(state, root), /capture/);
});

test('review fingerprint binds the manifest, while generated report does not invalidate it', (t) => {
  const { root, state, dir } = fixture(t);
  captureEvidence(state, root);
  const fingerprint = () =>
    execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `import {fingerprint} from ${JSON.stringify(library)};process.stdout.write(fingerprint());`,
      ],
      { cwd: root, encoding: 'utf8' },
    );
  const before = fingerprint();
  createHtmlReport(state, root, true);
  fs.writeFileSync(path.join(dir, 'report.md'), 'generated report');
  assert.equal(fingerprint(), before);
  const manifestPath = path.join(dir, 'evidence.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath));
  manifest.screenshots[0].label = 'Changed evidence';
  writeJson(manifestPath, manifest);
  assert.notEqual(fingerprint(), before);
});

test('HTML does not retain a passing review after non-UI source changes and preserves incomplete previews', (t) => {
  const { root, state } = fixture(t);
  captureEvidence(state, root);
  state.fingerprint = fingerprint(root);
  state.review.fingerprint = state.fingerprint;
  assert.ok(
    fs
      .readFileSync(createHtmlReport(state, root, true)[0].path, 'utf8')
      .includes('Code review passed'),
  );
  fs.writeFileSync(path.join(root, 'README.md'), 'Changed documentation');
  assert.ok(
    fs
      .readFileSync(createHtmlReport(state, root, true)[0].path, 'utf8')
      .includes('Review pending'),
  );
  fs.writeFileSync(path.join(root, 'app/page.tsx'), 'Changed UI');
  const preview = fs.readFileSync(
    createHtmlReport(state, root)[0].path,
    'utf8',
  );
  assert.ok(preview.includes('Review pending'));
  assert.ok(preview.includes('Evidence:'));
  assert.ok(!preview.includes('data:image/png'));
  assert.throws(() => createHtmlReport(state, root, true), /UI source/);
});
