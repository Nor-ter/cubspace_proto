import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  assertReady,
  markdown,
  prologAtom,
  readJson,
  sampleCases,
  validateTicket,
} from '../scripts/ticket-lib.mjs';
const ticket = readJson(new URL('../inputs/ticket.json', import.meta.url));
test('ticket generator preserves acceptance criteria without inventing sign-off', () => {
  const text = markdown(ticket);
  assert.ok(text.includes('AC-1:'));
  assert.ok(text.includes('리뷰나 사람의 승인을 의미하지 않음'));
  assert.equal(text, markdown(ticket));
});
test('ticket paths and identifiers reject traversal', () => {
  for (const bad of [
    { id: '../CUB-1' },
    { scope: ['../secrets'] },
    { scope: ['/tmp'] },
    { acceptance_criteria: [] },
    { qa_seed: NaN },
  ])
    assert.throws(() => validateTicket({ ...ticket, ...bad }));
});
test('QA selection is reproducible and does not mutate the source', () => {
  const input = ['a', 'b', 'c', 'd', 'e'];
  assert.deepEqual(sampleCases(input, 42), sampleCases(input, 42));
  assert.equal(new Set(sampleCases(input, 42)).size, 3);
  assert.equal(input.length, 5);
});
test('release rejects failed checks, missing review and stale source', () => {
  const state = {
    fingerprint: 'a',
    checks: [{ code: 0 }],
    review: {
      reviewer: 'independent-reviewer',
      decision: 'pass',
      fingerprint: 'a',
      evidence: ['test evidence'],
    },
  };
  assert.doesNotThrow(() => assertReady(state, 'a'));
  assert.throws(() => assertReady(state, 'b'));
  assert.throws(() => assertReady({ ...state, checks: [{ code: 1 }] }, 'a'));
  assert.throws(() => assertReady({ ...state, review: null }, 'a'));
  assert.throws(() =>
    assertReady(
      { ...state, review: { ...state.review, fingerprint: 'b' } },
      'a',
    ),
  );
});
test('Prolog strings remain a single quoted atom', () => {
  assert.equal(prologAtom("O'Brien\n\\done"), "'O\\'Brien\\n\\\\done'");
});

test('release requires every configured check and nonblank review evidence', () => {
  const state = {
    fingerprint: 'a',
    checks: [{ name: 'unit', code: 0 }],
    review: {
      reviewer: 'independent',
      decision: 'pass',
      fingerprint: 'a',
      evidence: ['checked'],
    },
  };
  assert.throws(() => assertReady(state, 'a', ['unit', 'build']));
  assert.throws(() =>
    assertReady(
      { ...state, review: { ...state.review, evidence: [' '] } },
      'a',
      ['unit'],
    ),
  );
});
