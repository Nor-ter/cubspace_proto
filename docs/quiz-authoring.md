# CubSpace Mini Quiz authoring

Each learning section keeps its quiz in its own feature folder, for example `MISSION_QUIZ` in `frontend/src/features/mission/data.ts`. The quiz UI and scoring live in `frontend/src/components/MiniQuiz.tsx`. Section order, locking, reset behavior, and local progress storage live in the course feature (`frontend/src/features/course/`).

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

1. Add the section id to `PageId` in `frontend/src/types/course.ts`.
2. Add the section id to `QUIZ_ORDER`, and the id and label to `NAV`, in `frontend/src/features/course/data.ts`.
3. Create `frontend/src/features/<section>/` with a `data.ts` that exports the five-question quiz and a section component in `components/`.
4. Render a `MiniQuiz` at the end of the new section and use `course.isUnlocked(sectionId)` on the section.
5. Add the section component to `frontend/src/pages/HomePage.tsx`.

Resetting one session removes its pass state and all later pass states. **RESET** in the global header clears the complete learning path. Progress is stored only in the current browser under `cubspace-quiz-progress-v1`.
