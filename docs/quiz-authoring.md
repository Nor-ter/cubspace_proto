# CubSpace Mini Quiz authoring

Quiz content is stored in `src/data/onboarding.ts` under the exported `quizzes` registry. The UI, scoring, section locking, reset behavior, and local progress storage are handled separately by `components/mini-quiz.tsx` and `app/page.tsx`.

## Add or replace a question

Each learning session must contain exactly five questions. A question follows this shape:

```ts
{
  id: 'd6',
  prompt: 'Question shown to the learner?',
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
  correct: 1,
  explanation: 'Why Option B is correct and why it matters.',
}
```

- `id` must be unique across all quizzes.
- `correct` is zero-based: `0` is the first option and `3` is the fourth.
- Keep one clearly correct answer.
- Explain the engineering reasoning, not just the answer.
- Do not invent ACRUX-II values. Mark assumptions and TBDs explicitly.

## Add a future learning session

1. Add the section id to `quizOrder` in the intended unlock order.
2. Add its five-question entry to `quizzes`.
3. Add the section id and label to `nav` in `app/page.tsx`.
4. Render a `MiniQuiz` at the end of the new section.
5. Use `isUnlocked(sectionId)` on the section and navigation control.

Resetting one session removes its pass state and all later pass states. **RESET** in the global header clears the complete learning path. Progress is stored only in the current browser under `cubspace-quiz-progress-v1`.
