# CubSpace quiz authoring

The quiz page (`#quiz`) shows the five questions from section 3 of "CubeSat Mission and Subsystems: Contents for the onboarding web" (12 November 2026). Its content is `MISSION_QUIZ` in `frontend/src/features/quiz/data.ts`. The card deck UI and scoring live in `frontend/src/components/MiniQuiz.tsx` and `frontend/src/components/QuizDeck.tsx`.

There is no lock: every page is open, and passing the quiz only adds a tick to the Quiz step. The result is stored in the current browser under `cubspace-mission-quiz-v1`.

## Add or replace a question

A question follows this shape:

```ts
{
  id: 'cubesat-q6',
  prompt: 'Question shown to the learner?',
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
  correct: 1,
  explanation: 'Why Option B is correct, in the guide’s own words. [n]',
}
```

- `id` must be unique.
- `correct` is zero-based: `0` is the first option and `3` is the fourth.
- Keep one clearly correct answer.
- The explanation appears on the back of the card. Quote or closely follow the source text and give its reference number; add the reference to `QUIZ_REFERENCES` if it is new.
- Do not invent ACRUX-II values. Mark assumptions and TBDs explicitly.
