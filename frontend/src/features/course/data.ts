import type { PageId, QuizSection } from '@/types/course';

export const NAV: readonly (readonly [PageId, string])[] = [
  ['home', 'Start'],
  ['about', 'About'],
  ['acrux', 'ACRUX-II'],
  ['mission', 'Mission Context'],
  ['anatomy', 'Spacecraft Structure'],
  ['model', 'System Model'],
  ['handoff', 'First Task'],
  ['mission-tree', 'Mission Tree'],
];

export const QUIZ_ORDER: readonly QuizSection[] = [
  'mission',
  'anatomy',
  'model',
  'handoff',
];

// A page opens once the quiz before it is passed. Pages that are not in
// QUIZ_ORDER, and the first quiz page, are always open.
export function isPageOpen(id: PageId, completed: readonly QuizSection[]) {
  const index = QUIZ_ORDER.indexOf(id as QuizSection);
  return index <= 0 || completed.includes(QUIZ_ORDER[index - 1]);
}

export const PROGRESS_STORAGE_KEY = 'cubspace-quiz-progress-v1';
