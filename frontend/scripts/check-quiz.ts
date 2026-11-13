// Guards quiz content before build. Run: npm run check:quiz
// data.ts only has a type-only `@/` import, which type stripping erases.
import assert from 'node:assert/strict';
import { MISSION_QUIZ } from '../src/features/quiz/data.ts';
import type { QuizQuestion } from '../src/types/quiz.ts';

function check(questions: QuizQuestion[]): void {
  const ids = new Set<string>();
  for (const q of questions) {
    assert.ok(q.id, `question without id: ${q.prompt}`);
    assert.ok(!ids.has(q.id), `${q.id}: duplicate question id`);
    ids.add(q.id);
    assert.ok(q.options.length >= 2, `${q.id}: needs at least 2 options`);
    assert.equal(new Set(q.options).size, q.options.length, `${q.id}: duplicate options`);
    assert.ok(
      Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.options.length,
      `${q.id}: answer index ${q.correct} outside 0..${q.options.length - 1}`,
    );
    assert.ok(q.explanation?.trim(), `${q.id}: missing explanation`);
  }
}

// Self-test: the checker must reject a bad sample, or a passing run means nothing.
const bad: QuizQuestion = { id: 'bad', prompt: 'p', options: ['a', 'b'], correct: 2, explanation: 'e' };
assert.throws(() => check([bad]), /bad: answer index 2/);

try {
  check(MISSION_QUIZ.questions);
} catch (err) {
  console.error(`check:quiz FAILED: ${(err as Error).message}`);
  process.exit(1);
}
console.log(`check:quiz OK: ${MISSION_QUIZ.questions.length} questions in "${MISSION_QUIZ.title}"`);
