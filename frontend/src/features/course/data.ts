import type { PageId } from '@/types/course';

export const NAV: readonly (readonly [PageId, string])[] = [
  ['home', 'Start'],
  ['about', 'About'],
  ['cubesat', 'CubeSat'],
  ['acrux', 'ACRUX-II'],
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

/** Documents behind this onboarding, listed in the footer. */
export const SOURCE_CARDS = [
  [
    'ACRUX_2_ConOps.pdf',
    'Mission phase, initial operations, detumbling, communications and operational assumptions',
  ],
  [
    'ACRUX-2 CubeSat MADE Modeling.docx',
    'Hierarchy, function, material/energy/data flow and measurement properties',
  ],
  [
    'Product & Engineering Specification',
    'Learning sequence for new engineers, UX and technology boundaries',
  ],
  [
    'Project CubSpace Overview',
    'Documentation–Task–Sign-off Knowledge Continuity',
  ],
] as const;
