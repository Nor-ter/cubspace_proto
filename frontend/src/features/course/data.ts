import type { PageId, QuizSection } from '@/types/course';

export const NAV: readonly (readonly [PageId, string])[] = [
  ['home', 'Start'],
  ['mission', 'Mission Context'],
  ['anatomy', 'Spacecraft Structure'],
  ['model', 'System Model'],
  ['handoff', 'First Task'],
];

export const QUIZ_ORDER: readonly QuizSection[] = [
  'mission',
  'anatomy',
  'model',
  'handoff',
];

export const PROGRESS_STORAGE_KEY = 'cubspace-quiz-progress-v1';
