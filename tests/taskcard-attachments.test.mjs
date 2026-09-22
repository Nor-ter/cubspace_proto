import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { uploadAttachments } from '../scripts/taskcard-attachments.mjs';

const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
function fixture(t, options = {}) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'taskcard-files-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const png = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 255, 17, 200]);
  const html = Buffer.from(
    '<!doctype html><html><body>Results: 56 passed</body></html>',
  );
  const files = [
    { bytes: png, ext: 'png', mime: 'image/png', label: 'desktop' },
    { bytes: html, ext: 'html', mime: 'text/html', label: 'report' },
  ].map(({ bytes, ext, mime, label }) => {
    const file = {
      path: path.join(directory, `${label}.${ext}`),
      name: `CUB-100-${label}-${hash(bytes).slice(0, 16)}.${ext}`,
      sha256: hash(bytes),
      mime,
    };
    fs.writeFileSync(file.path, bytes);
    return file;
  });
  const receiptPath = path.join(directory, 'receipt.json');
  const attachments = [];
  const calls = [];
  let failures = options.failure ? 1 : 0;
  let posts = 0;
  const request = async (url, init) => {
    calls.push({ url, method: init.method, headers: init.headers });
    if (!url.startsWith('https://api.clickup.com/api/v2/')) {
      assert.equal(init.headers, undefined);
      assert.equal(init.redirect, 'error');
      const file = files.find((entry) => url.endsWith(`/${entry.name}`));
      assert.ok(file);
      const bytes = fs.readFileSync(file.path);
      if (options.corruptRemoteBytes) bytes[bytes.length - 1] ^= 1;
      return {
        ok: true,
        redirected: options.redirected ?? false,
        arrayBuffer: async () => bytes,
      };
    }
    assert.deepEqual(init.headers, { Authorization: 'fake-token' });
    const ok = (value) => ({ ok: true, json: async () => value });
    if (init.method === 'GET') {
      assert.equal(url, 'https://api.clickup.com/api/v2/task/task-100');
      return ok({ id: 'task-100', attachments });
    }
    posts++;
    assert.equal(
      url,
      'https://api.clickup.com/api/v2/task/task-100/attachment',
    );
    assert.ok(init.body instanceof FormData);
    assert.deepEqual([...init.body.keys()], ['attachment']);
    const blob = init.body.get('attachment');
    const file = files.find((entry) => entry.name === blob.name);
    assert.ok(file);
    assert.equal(blob.type, file.mime);
    assert.deepEqual(
      Buffer.from(await blob.arrayBuffer()),
      fs.readFileSync(file.path),
    );
    const item = {
      id: `attachment-${posts}`,
      title: file.name,
      size: blob.size,
      url: `https://attachments.clickup.com/${posts}/${blob.name}`,
    };
    if (options.onPost) await options.onPost();
    if (failures > 0 && posts === (options.failAt ?? 1)) {
      failures--;
      if (options.visibleAfterFailure) attachments.push(item);
      if (options.failure === 'network')
        throw new Error('remote-secret-details');
      if (options.failure === 'invalid_json')
        return {
          ok: true,
          json: async () => {
            throw new Error('bad JSON');
          },
        };
      return { ok: false, status: options.failure };
    }
    attachments.push(
      options.wrongSize ? { ...item, size: item.size + 1 } : item,
    );
    return ok(item);
  };
  return {
    directory,
    files,
    receiptPath,
    attachments,
    calls,
    request,
    postCount: () => posts,
    upload: (selected = files) =>
      uploadAttachments(
        'task-100',
        selected,
        'fake-token',
        receiptPath,
        request,
      ),
  };
}

test('uploads original binary FormData and HTML, confirms remote records and does not repeat', async (t) => {
  const f = fixture(t);
  const receipt = await f.upload();
  assert.equal(receipt.status, 'sent');
  assert.equal(receipt.task_id, 'task-100');
  assert.deepEqual(
    receipt.files.map((file) => file.sha256),
    f.files.map((file) => file.sha256),
  );
  assert.ok(
    receipt.files.every(
      (file) => file.id && file.url && file.status === 'sent',
    ),
  );
  await f.upload();
  assert.equal(f.postCount(), 2);
  fs.rmSync(f.receiptPath);
  for (const attachment of f.attachments) {
    attachment.name = attachment.title;
    delete attachment.title;
  }
  await f.upload();
  assert.equal(f.postCount(), 2);
});

test('invalid bytes, name, MIME and sensitive paths fail before API access', async (t) => {
  const f = fixture(t);
  fs.writeFileSync(f.files[0].path, 'changed after review');
  await assert.rejects(f.upload(), /SHA-256/);
  for (const override of [
    { name: 'screenshot.png' },
    { name: `../${f.files[1].name}` },
    {
      name: f.files[1].name.replace(
        /[a-f0-9]{16}\.html$/,
        '0000000000000000.html',
      ),
    },
    { mime: 'application/octet-stream' },
    { path: path.join(f.directory, '.clickup.env') },
  ])
    await assert.rejects(f.upload([{ ...f.files[1], ...override }]));
  const secret = path.join(f.directory, '.ssh');
  fs.mkdirSync(secret);
  const secretFile = path.join(secret, 'secret.html');
  fs.copyFileSync(f.files[1].path, secretFile);
  await assert.rejects(f.upload([{ ...f.files[1], path: secretFile }]));
  const link = path.join(f.directory, 'linked-directory');
  fs.symlinkSync(
    secret,
    link,
    process.platform === 'win32' ? 'junction' : 'dir',
  );
  await assert.rejects(
    f.upload([{ ...f.files[1], path: path.join(link, 'secret.html') }]),
  );
  assert.equal(f.calls.length, 0);
});

test('receipts for another task and changed local file identity cannot be reused', async (t) => {
  const f = fixture(t);
  fs.writeFileSync(
    f.receiptPath,
    JSON.stringify({ task_id: 'another-task', files: [] }),
  );
  await assert.rejects(f.upload(), /task ID/);
  fs.writeFileSync(
    f.receiptPath,
    JSON.stringify({
      task_id: 'task-100',
      files: [{ name: f.files[0].name, sha256: 'wrong', size: 12 }],
    }),
  );
  await assert.rejects(f.upload(), /기존 첨부 기록과 파일/);
  assert.equal(f.calls.length, 0);
});

test('uncertain upload outcomes do not automatically POST again', async (t) => {
  for (const failure of ['network', 'invalid_json', 408, 503]) {
    const f = fixture(t, { failure });
    await assert.rejects(f.upload());
    await assert.rejects(f.upload(), /다시 첨부하지/);
    assert.equal(f.postCount(), 1);
    assert.equal(
      JSON.parse(fs.readFileSync(f.receiptPath)).files[0].status,
      'pending',
    );
  }
});

test('reconciles a visible upload after a lost response and resumes the remaining files', async (t) => {
  const f = fixture(t, {
    failure: 'network',
    failAt: 2,
    visibleAfterFailure: true,
  });
  await assert.rejects(f.upload());
  let receipt = JSON.parse(fs.readFileSync(f.receiptPath));
  assert.deepEqual(
    receipt.files.map((file) => file.status),
    ['sent', 'pending'],
  );
  receipt = await f.upload();
  assert.equal(receipt.status, 'sent');
  assert.equal(f.postCount(), 2);
  assert.deepEqual(
    receipt.files.map((file) => file.status),
    ['sent', 'sent'],
  );
});

test('known rejected uploads retry without repeating a previously confirmed file', async (t) => {
  const f = fixture(t, { failure: 400, failAt: 2 });
  await assert.rejects(f.upload(), /HTTP 400/);
  assert.equal(JSON.parse(fs.readFileSync(f.receiptPath)).files.length, 1);
  await f.upload();
  assert.equal(f.postCount(), 3);
  assert.equal(f.attachments.length, 2);
});

test('remote size mismatch and duplicate names do not count as confirmed evidence', async (t) => {
  const f = fixture(t, { wrongSize: true });
  await assert.rejects(f.upload(), /크기가 일치하지/);
  assert.equal(
    JSON.parse(fs.readFileSync(f.receiptPath)).files[0].status,
    'pending',
  );
  const duplicate = fixture(t);
  await duplicate.upload();
  duplicate.attachments.push({
    ...duplicate.attachments[0],
    id: 'unrelated-copy',
  });
  await assert.rejects(duplicate.upload(), /여러 개/);
  assert.equal(duplicate.postCount(), 2);
});

test('exclusive lock prevents simultaneous uploads from duplicating files', async (t) => {
  let entered;
  let release;
  const started = new Promise((resolve) => {
    entered = resolve;
  });
  const barrier = new Promise((resolve) => {
    release = resolve;
  });
  const f = fixture(t, {
    onPost: async () => {
      entered();
      await barrier;
    },
  });
  const first = f.upload();
  await started;
  await assert.rejects(f.upload(), /다른 프로세스/);
  release();
  await first;
  assert.equal(f.postCount(), 2);
});

test('same remote name and size cannot hide changed bytes, including fresh-clone reconciliation', async (t) => {
  const f = fixture(t, { corruptRemoteBytes: true });
  await assert.rejects(f.upload(), /SHA-256/);
  assert.equal(
    JSON.parse(fs.readFileSync(f.receiptPath)).files[0].status,
    'pending',
  );
  fs.rmSync(f.receiptPath);
  await assert.rejects(f.upload(), /SHA-256/);
  assert.equal(f.postCount(), 1);
});

test('attachment downloads omit API credentials and reject unsafe destinations or redirects', async (t) => {
  const f = fixture(t);
  await f.upload();
  const downloads = f.calls.filter(
    (call) => !call.url.startsWith('https://api.clickup.com/api/v2/'),
  );
  assert.equal(downloads.length, 2);
  assert.ok(downloads.every((call) => call.headers === undefined));
  const original = f.attachments[0].url;
  for (const url of [
    original.replace('https:', 'http:'),
    original.replace('attachments.clickup.com', 'clickup.com.attacker.example'),
    original.replace('https://', 'https://username:password@'),
    original.replace('attachments.clickup.com', 'attachments.clickup.com:8443'),
  ]) {
    f.attachments[0].url = url;
    const previousDownloads = f.calls.filter(
      (call) => !call.url.startsWith('https://api.clickup.com/api/v2/'),
    ).length;
    await assert.rejects(f.upload());
    assert.equal(
      f.calls.filter(
        (call) => !call.url.startsWith('https://api.clickup.com/api/v2/'),
      ).length,
      previousDownloads,
    );
  }
  const redirected = fixture(t, { redirected: true });
  await assert.rejects(redirected.upload(), /원본을 직접 확인/);
  assert.equal(
    JSON.parse(fs.readFileSync(redirected.receiptPath)).files[0].status,
    'pending',
  );
});
