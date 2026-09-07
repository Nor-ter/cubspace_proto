import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file);
  const source = fs.readFileSync(new URL(file, import.meta.url), 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const compiledModule = { exports: {} };
  vm.runInNewContext(output, {
    module: compiledModule,
    exports: compiledModule.exports,
    require: (name) => {
      if (name === './data/content') return load('../src/data/content.ts');
      throw new Error(name);
    },
    console,
  });
  cache.set(file, compiledModule.exports);
  return compiledModule.exports;
}
const data = load('../src/data/content.ts');
const { freshState, restoreState, grade, moveItem } =
  load('../src/learning.ts');
test('all six modules, five subsystems, seven stages and four failure scenarios are present', () => {
  assert.equal(data.moduleTitles.length, 6);
  assert.equal(data.subsystems.length, 5);
  assert.equal(data.stages.length, 7);
  assert.equal(data.failures.length, 4);
});
test('source-backed entities and interfaces remain connected and typed', () => {
  const entities = [...data.subsystems, ...data.components];
  const ids = new Set(entities.map((e) => e.id));
  for (const e of entities) {
    assert.ok(e.function && e.purpose && e.sourceRefs.length);
    for (const id of e.connections) assert.ok(ids.has(id), id);
    for (const f of [...e.inputs, ...e.outputs]) {
      assert.ok(['Material', 'Energy', 'Data'].includes(f.type));
      assert.ok(f.properties.length);
    }
  }
  for (const s of data.stages) {
    assert.ok(s.sourceRefs.length);
    s.active.forEach((id) => assert.ok(ids.has(id)));
  }
  for (const f of data.failures) {
    assert.ok(ids.has(f.entityId));
    assert.equal(f.chain.length, 3);
    assert.ok(f.detection.length && f.mitigation.length && f.sourceRefs.length);
  }
});
test('every chain edge matches a pair of nodes', () => {
  for (const c of data.chains) assert.equal(c.edges.length, c.nodes.length - 1);
});
test('source conflicts are preserved', () => {
  assert.ok(
    data.uncertainties.some(
      (u) => u.status === 'Conflicting' && u.title.includes('배터리'),
    ),
  );
  assert.ok(
    data.uncertainties.some(
      (u) => u.status === 'TBD' && u.title.includes('Camera'),
    ),
  );
});
test('empty and corrupt storage cannot unlock readiness', () => {
  for (const raw of [
    null,
    '{broken',
    'null',
    '[]',
    '{"version":9}',
    '{"version":1,"completed":[5,99,-1,"x"],"drafts":[null,2]}',
  ]) {
    assert.equal(grade(restoreState(raw)).ready, false);
  }
  assert.equal(
    restoreState('{"version":1,"completed":[0,0,2,5]}').completed.join(','),
    '0,2',
  );
});
test('storage restores drafts and answers but rejects invalid ordering', () => {
  const s = freshState();
  s.answers.flow = '1';
  s.drafts[0].function = '온도를 측정한다';
  s.order = ['fake'];
  const r = restoreState(JSON.stringify(s));
  assert.equal(r.answers.flow, '1');
  assert.equal(r.drafts[0].function, '온도를 측정한다');
  assert.equal(r.order.length, 6);
});
test('chain ordering works at both boundaries and supports correction', () => {
  const x = ['a', 'b', 'c'];
  assert.equal(moveItem(x, 0, -1).join(','), 'a,b,c');
  assert.equal(moveItem(x, 2, 1).join(','), 'a,b,c');
  assert.equal(moveItem(x, 1, -1).join(','), 'b,a,c');
  assert.equal(x.join(','), 'a,b,c');
});
test('readiness requires quiz, ordered chain, explanation, 22 fields and self review', () => {
  const s = freshState();
  assert.equal(grade(s).missing.length, 22);
  for (const q of data.questions) s.answers[q.id] = String(q.answer);
  s.order = [...data.chains[0].nodes];
  assert.equal(grade(s).score, 10);
  assert.equal(grade(s).ready, false);
  s.explanation =
    '목적, 입출력, 연결 및 불확실성을 검토하는 교육용 설명입니다. 정확성은 지도자가 확인해야 합니다.';
  s.drafts = [0, 1].map(() =>
    Object.fromEntries(
      data.assignmentFields.map(([k]) => [k, '작성된 교육 초안']),
    ),
  );
  assert.equal(grade(s).ready, false);
  s.reviewed = true;
  assert.equal(grade(s).ready, true);
  s.drafts[1].inputs = ' ';
  assert.equal(grade(s).ready, false);
  s.drafts[1].inputs = 'Energy';
  s.answers.flow = '0';
  assert.equal(grade(s).ready, false);
});
