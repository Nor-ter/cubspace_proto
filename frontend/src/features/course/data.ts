import type { PageId } from '@/types/course';

export const NAV: readonly (readonly [PageId, string])[] = [
  ['home', 'Start'],
  ['about', 'About'],
  ['acrux', 'CubeSat'],
  ['subsystems', 'Subsystems'],
  ['quiz', 'Quiz'],
  ['mission-tree', 'Mission Tree'],
];

/** Whether the quiz was passed, kept in this browser only. */
export const QUIZ_STORAGE_KEY = 'cubspace-mission-quiz-v1';

export function readQuizPassed() {
  try {
    return localStorage.getItem(QUIZ_STORAGE_KEY) === 'passed';
  } catch {
    return false;
  }
}

export const COPYRIGHT = 'Copyright © CubSpace. All rights reserved.';
