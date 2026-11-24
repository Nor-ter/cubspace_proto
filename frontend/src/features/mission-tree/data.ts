// Content from feat/onboarding-english-v2_1 (features/mission-tree).
// Source: MissionTree_README.md and cubspace_missiontree-frontend-prototype
// (frontend_v3: `teams.ts`, `api.ts`, `reviews.ts`, `pmCards.ts`).

export const MISSION_TREE_INTRO = {
  // "Build a 1U satellite." stays on one line on wide screens (see
  // MissionTreeSection.css) and wraps on a phone.
  headline: 'Learn through small tasks. Build a 1U satellite.',
  lead: 'And pass the knowledge on to the next cohort.',
  paragraphs: [
    'Student satellite teams change as members move through semesters, exams and graduation, and documents and design decisions scatter with them. Mission Tree keeps the whole ACRUX-II mission in one structure you can walk through, so a new member can understand the mission, find their team’s next piece of work and open what they need to learn it.',
    'It connects the mission’s Phases, each team’s Tasks, technical manuals and workshops that run in your browser. You learn in the order Manual → Workshop → Tasks: read the manual, practise in a notebook, then take on the real project task. Onboarding gave you the picture; Mission Tree is where the work starts.',
  ],
};

/** The levels from the mission down to the work. */
export const STRUCTURE = [
  'Mission',
  'Phase',
  'Subsystem / team',
  'Manual / Workshop',
  'Tasks',
] as const;

export const LEARNING_FLOW_TITLE = 'Manual, then Workshop, then Tasks.';

export const LEARNING_FLOW: readonly (readonly [string, string])[] = [
  ['Manual', 'Read the technical manual attached to your team and Phase.'],
  [
    'Workshop',
    'Practise in a notebook that runs in the browser. Nothing to install.',
  ],
  ['Tasks', 'Perform tasks associated with the Mission Tree.'],
];

export const SCREENS_TITLE = 'Inside Mission Tree.';

/** Screenshots of the Mission Tree app: [image, title, one line]. */
export const SCREENS: readonly (readonly [string, string, string])[] = [
  [
    '/images/mission-tree/whole-sheet.jpg',
    'Whole sheet',
    'Every Phase from Pre-A to F on one page, with each team’s Tasks and whether their manual and workshop are ready.',
  ],
  [
    '/images/mission-tree/step-by-step.jpg',
    'Step by step',
    'Open a Phase, then a team, then a Task to see the steps inside it.',
  ],
  [
    '/images/mission-tree/manual.jpg',
    'Manual',
    'Each Task opens on its technical reading, here NASA’s B-dot paper for the detumble study.',
  ],
  [
    '/images/mission-tree/workshop.jpg',
    'Workshop',
    'A Jupyter notebook runs in the browser, so you practise the calculation before the real Task.',
  ],
];

export const HANDOFF = {
  title: 'Continue in Mission Tree.',
  body: 'Manuals, executable workshops and project work continue in the separate Mission Tree app.',
};
