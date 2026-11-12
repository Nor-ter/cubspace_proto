# CubSpace v2.1 Quiz authoring

Questions live in frontend/src/features/theory/data.ts: MISSION_QUIZ and each SUBSYSTEMS entry. UI/scoring live in features/theory/components/Quiz.tsx. QuizQuestion is defined in src/types/course.ts.

Each question has prompt, options (string array), correct (zero-based option index), and explanation. Keep one clearly correct answer and unique prompt/option text within a quiz. The component does not require exactly five questions. Preserve engineering assumptions and REF/TBD/VERIFY qualifications.

Mission ID: theory-mission. Subsystem IDs: theory-${subsystem.id}; BOX uses structure. BOX/EPS/ADCS are the initial set; OBC/COMMS/PAY keep empty arrays until review. Non-empty quizzes require every answer before checking and all correct answers to pass.

Use existing course.passQuiz callbacks. Passes persist under cubspace-onboarding-progress-v2_1 without locking navigation. Retry clears current answers, not an existing pass. Keyed subsystem quiz components reset answers on team changes. Substantial content changes may require new quiz IDs or an explicit storage migration.

Run npm run lint and npm run build from frontend/, then verify correct/incorrect scoring, retry, switching subsystems and reload persistence in a browser.
