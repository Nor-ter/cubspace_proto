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

/** Sub-sections shown in each nav item's hover menu (selector is resolved inside the page). */
export const NAV_SECTIONS: Record<
  PageId,
  readonly { label: string; target: string }[]
> = {
  home: [
    { label: 'Mission overview', target: '#home .hero-copy' },
    { label: 'Mission sequence simulator', target: '#home .mission-console' },
  ],
  mission: [
    { label: 'Why CubSpace?', target: '#mission .thesis-grid' },
    { label: 'Learning path', target: '#mission .learning-cards' },
    { label: 'ACRUX-II mission brief', target: '#mission .mission-brief' },
    { label: 'Quiz', target: '#mission .mini-quiz' },
  ],
  anatomy: [
    { label: '3D structure explorer', target: '#anatomy .anatomy-workspace' },
    { label: 'Engineering notes', target: '#anatomy .engineering-note' },
    { label: 'Quiz', target: '#anatomy .mini-quiz' },
  ],
  model: [
    { label: 'Four modelling lenses', target: '#model .four-lenses' },
    { label: 'Traceability', target: '#model .trace-demo' },
    { label: 'Physical hierarchy', target: '#model .hierarchy' },
    { label: 'Quiz', target: '#model .mini-quiz' },
  ],
  handoff: [
    { label: 'Knowledge loop', target: '#handoff .knowledge-loop' },
    { label: 'Prompt manual', target: '#handoff .manual-frame' },
    { label: 'First task: TASK-ADCS-001', target: '#handoff .first-task' },
    { label: 'Quiz', target: '#handoff .mini-quiz' },
  ],
};
