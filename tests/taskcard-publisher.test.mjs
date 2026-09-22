import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  comparableMarkdown,
  publishTaskcard,
} from '../scripts/taskcard-publisher.mjs';

const state = {
  id: 'CUB-100',
  fingerprint: 'abc',
  ticket: { id: 'CUB-100', title: 'Taskcard 100' },
};
const settings = { parent_id: 'parent', status: 'review' };
const marker = 'CubSpace task: CUB-100';
const report = '# Results\n\nChecks: passed\nReview: passed';
const child = (id, extra = {}) => ({
  id,
  parent: 'parent',
  name: 'CUB-100',
  status: { status: 'review' },
  markdown_description: `${report}\n\n${marker}`,
  ...extra,
});
function fixture(t, options = {}) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'taskcard-publish-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const receiptPath = path.join(directory, 'receipt.json');
  const tasks = new Map((options.tasks ?? []).map((task) => [task.id, task]));
  const calls = [];
  let failures = options.createFailure ? 1 : 0;
  const request = async (url, init) => {
    const parsed = new URL(url);
    const route = parsed.pathname.replace('/api/v2/', '');
    const method = init.method;
    const body = init.body ? JSON.parse(init.body) : null;
    calls.push({ route, method, body, page: parsed.searchParams.get('page') });
    assert.equal(init.headers.Authorization, 'fake-token');
    const ok = (value) => ({ ok: true, json: async () => value });
    if (route === 'task/parent')
      return ok({ id: 'parent', list: { id: 'list' }, subtasks: [] });
    if (route === 'list/list')
      return ok({
        statuses: (options.statuses ?? ['review']).map((status) => ({
          status,
        })),
      });
    if (route === 'list/list/task' && method === 'GET') {
      const page = Number(parsed.searchParams.get('page'));
      if (options.paginated && page === 0)
        return ok({ tasks: [], last_page: false });
      return ok({ tasks: [...tasks.values()], last_page: true });
    }
    if (route === 'list/list/task' && method === 'POST') {
      if (options.onCreate) await options.onCreate();
      if (failures-- > 0) {
        if (options.visibleAfterFailure)
          tasks.set(
            'created',
            child('created', { markdown_description: body.markdown_content }),
          );
        if (options.createFailure === 'network')
          throw new Error('private remote detail');
        return { ok: false, status: options.createFailure };
      }
      const task = child('created', {
        name: body.name,
        status: { status: body.status },
        markdown_description: body.markdown_content,
      });
      tasks.set(task.id, task);
      return ok(task);
    }
    if (route.startsWith('task/')) {
      const id = route.slice(5);
      const task = tasks.get(id);
      if (!task) return { ok: false, status: 404 };
      if (method === 'PUT')
        tasks.set(id, {
          ...task,
          name: body.name,
          status: { status: body.status },
          markdown_description: body.markdown_content,
        });
      if (options.transformReadback)
        return ok({
          ...tasks.get(id),
          markdown_description: options.transformReadback(
            tasks.get(id).markdown_description,
          ),
        });
      return ok(
        options.readbackMismatch && id === 'created'
          ? { ...tasks.get(id), markdown_description: marker }
          : tasks.get(id),
      );
    }
    throw new Error(`Unexpected fake route ${method} ${route}`);
  };
  return {
    receiptPath,
    tasks,
    calls,
    request,
    publish: () =>
      publishTaskcard(
        state,
        settings,
        options.report ?? report,
        'fake-token',
        receiptPath,
        request,
      ),
    mutations: () => calls.filter((call) => call.method !== 'GET'),
  };
}

test('creates a subtask, confirms remote content and status, and repeated submissions do not mutate', async (t) => {
  const f = fixture(t);
  const receipt = await f.publish();
  assert.equal(receipt.status, 'sent');
  assert.equal(receipt.task_status, 'review');
  assert.equal(receipt.parent_id, 'parent');
  assert.equal(receipt.url, 'https://app.clickup.com/t/created');
  assert.deepEqual(f.mutations()[0].body, {
    name: 'CUB-100',
    markdown_content: `${report}\n\n${marker}`,
    status: 'review',
    parent: 'parent',
    notify_all: false,
  });
  await f.publish();
  assert.equal(f.mutations().length, 1);
  assert.match(
    fs.readFileSync(f.receiptPath.replace('.json', '.events.jsonl'), 'utf8'),
    /"sent"/,
  );
});

test('fresh checkout discovers a marked subtask across pages and updates it', async (t) => {
  const f = fixture(t, {
    paginated: true,
    tasks: [
      child('existing', {
        name: 'Old name',
        status: { status: 'open' },
        markdown_description: `Old report\n\n${marker}`,
      }),
    ],
  });
  const receipt = await f.publish();
  assert.equal(receipt.task_id, 'existing');
  assert.deepEqual(
    f.mutations().map((call) => call.method),
    ['PUT'],
  );
  assert.ok(f.calls.some((call) => call.page === '1'));
});

test('never mutates an unmarked manual task with the same name', async (t) => {
  const f = fixture(t, {
    tasks: [child('manual', { markdown_description: 'Manually created task' })],
  });
  await assert.rejects(f.publish(), /같은 이름/);
  assert.equal(f.mutations().length, 0);
});

test('rejects duplicate ownership markers and invalid list status before mutation', async (t) => {
  const duplicate = fixture(t, { tasks: [child('one'), child('two')] });
  await assert.rejects(duplicate.publish(), /식별자/);
  assert.equal(duplicate.mutations().length, 0);
  const invalid = fixture(t, { statuses: ['open'] });
  await assert.rejects(invalid.publish(), /상태/);
  assert.equal(invalid.mutations().length, 0);
});

test('known rejected creates can retry but uncertain outcomes cannot create again', async (t) => {
  const rejected = fixture(t, { createFailure: 400 });
  await assert.rejects(rejected.publish(), /HTTP 400/);
  assert.equal(fs.existsSync(rejected.receiptPath), false);
  await rejected.publish();
  assert.equal(rejected.mutations().length, 2);
  for (const failure of ['network', 408, 503]) {
    const uncertain = fixture(t, { createFailure: failure });
    await assert.rejects(uncertain.publish());
    await assert.rejects(uncertain.publish(), /다시 생성하지/);
    assert.equal(uncertain.mutations().length, 1);
    assert.equal(
      JSON.parse(fs.readFileSync(uncertain.receiptPath)).status,
      'pending',
    );
  }
});

test('unknown create outcome reconciles a visible marked task without another POST', async (t) => {
  const f = fixture(t, { createFailure: 'network', visibleAfterFailure: true });
  await assert.rejects(f.publish());
  const receipt = await f.publish();
  assert.equal(receipt.status, 'sent');
  assert.equal(f.mutations().length, 1);
});

test('parallel publications are excluded while the first create is in flight', async (t) => {
  let release;
  let entered;
  const started = new Promise((resolve) => {
    entered = resolve;
  });
  const barrier = new Promise((resolve) => {
    release = resolve;
  });
  const f = fixture(t, {
    onCreate: async () => {
      entered();
      await barrier;
    },
  });
  const first = f.publish();
  await started;
  await assert.rejects(f.publish(), /다른 프로세스/);
  release();
  await first;
  assert.equal(f.mutations().length, 1);
});

test('readback must confirm the report, not just its ownership marker', async (t) => {
  const f = fixture(t, { readbackMismatch: true });
  await assert.rejects(f.publish(), /게시 내용과 상태/);
  const receipt = JSON.parse(fs.readFileSync(f.receiptPath));
  assert.equal(receipt.status, 'pending');
  assert.equal(receipt.task_id, 'created');
});

test('receipt with another parent or ticket is rejected before API access', async (t) => {
  const f = fixture(t);
  fs.writeFileSync(
    f.receiptPath,
    JSON.stringify({ run: state.id, parent_id: 'other', ticket_id: 'CUB-100' }),
  );
  await assert.rejects(f.publish(), /게시 기록/);
  assert.equal(f.calls.length, 0);
});

const markdownReport = [
  '# Results',
  '',
  '',
  '- unit 52 passed',
  '',
  '- acceptance_criteria: passed',
  '',
  'Read AGENTS.md.',
  '',
  '| Check | Count |',
  '| :--- | ---: |',
  '| unit | 52 |',
  '',
  '[Commit abc](https://github.com/example/cubspace_proto/commit/abc)',
  '',
  '`literal\\_value - x`',
  '',
  '```js',
  'const count = 52;',
  '',
  '',
  '- literal\\_value',
  '```',
].join('\n');
function clickupFormatting(value) {
  return value
    .replace(
      '- unit 52 passed\n\n- acceptance_criteria: passed',
      '*   unit 52 passed\n*   acceptance\\_criteria: passed',
    )
    .replace('# Results\n\n\n', '# Results\n\n')
    .replace('Read AGENTS.md.', 'Read [AGENTS.md](http://AGENTS.md).')
    .replace('| :--- | ---: |', '| ---| --- |');
}

test('ClickUp formatting roundtrip confirms content and retries without PUT or POST', async (t) => {
  const f = fixture(t, {
    report: markdownReport,
    transformReadback: clickupFormatting,
  });
  const receipt = await f.publish();
  assert.equal(receipt.status, 'sent');
  fs.writeFileSync(
    f.receiptPath,
    JSON.stringify({ ...receipt, status: 'pending' }),
  );
  assert.equal((await f.publish()).status, 'sent');
  assert.deepEqual(
    f.mutations().map((call) => call.method),
    ['POST'],
  );
});

test('Markdown equivalence preserves numbers, Git targets, code and report content', () => {
  const expected = `${markdownReport}\n\n${marker}`;
  const actual = clickupFormatting(expected);
  assert.equal(comparableMarkdown(expected), comparableMarkdown(actual));
  for (const changed of [
    actual.replace('unit 52 passed', 'unit 53 passed'),
    actual.replace('/commit/abc)', '/commit/def)'),
    actual.replace('http://AGENTS.md', 'https://example.com/AGENTS.md'),
    actual.replace('`literal\\_value - x`', '`literal_value - x`'),
    actual.replace('const count = 52;', 'const count = 53;'),
    actual.replace('52;\n\n\n', '52;\n\n'),
    actual.replace('- literal\\_value', '*   literal\\_value'),
    actual.replace('Read [AGENTS.md](http://AGENTS.md).', ''),
    actual.replace('CubSpace task: CUB-100', 'CubSpace task: CUB-101'),
    `${actual}\nUnrequested extra content`,
  ])
    assert.notEqual(comparableMarkdown(expected), comparableMarkdown(changed));
});

test('remote content changes remain unconfirmed despite equivalent formatting', async (t) => {
  for (const change of [
    (text) => text.replace('unit 52 passed', 'unit 53 passed'),
    (text) => text.replace('/commit/abc)', '/commit/def)'),
    (text) => text.replace('const count = 52;', 'const count = 53;'),
    () => marker,
  ]) {
    const f = fixture(t, {
      report: markdownReport,
      transformReadback: (text) => change(clickupFormatting(text)),
    });
    await assert.rejects(f.publish(), /게시 내용과 상태/);
    assert.equal(JSON.parse(fs.readFileSync(f.receiptPath)).status, 'pending');
    assert.equal(f.mutations().length, 1);
  }
});

test('multiline inline code preserves escapes, bullets and empty lines', () => {
  const original = 'Text ``literal\\_value\n\n\n- literal\\_value\nend`` after';
  for (const changed of [
    original.replace('\\_', '_'),
    original.replace('- literal', '*   literal'),
    original.replace('\n\n\n', '\n\n'),
  ]) {
    assert.notEqual(comparableMarkdown(original), comparableMarkdown(changed));
  }
});
