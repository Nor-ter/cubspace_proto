// Content from feat/onboarding-english-v2_1 (features/mission-tree).
// Source: MissionTree_README.md and cubspace_missiontree-frontend-prototype
// (frontend_v3: `teams.ts`, `api.ts`, `reviews.ts`, `pmCards.ts`).

export const MISSION_TREE_INTRO = {
  // No-break spaces keep "Build a 1U satellite." on one line.
  headline: 'Learn through small tasks. Build\u00a0a\u00a01U\u00a0satellite.',
  lead: 'And pass the knowledge on to the next cohort.',
  paragraphs: [
    'We are student engineers and availability may affect throughout semesters, exams and graduation, and documents and design decisions scatter with them. So, the Problem is that Engineers are leaving the team with their knowledge have built. Mission Tree keeps the whole ACRUX-II mission in one structure you can walk through, so leave a knowledge for a new member can understand the mission, find their team\u2019s work history and open what they need to learn it.',
    'It connects the mission\u2019s Phases, each subsys\u2019s Tasks, technical manuals and workshops that run in your browser. You learn in the order Manual \u2192 Workshop \u2192 Tasks: read the manual, solve the workshop, then take on the real project task assigned by your lead. Onboarding gave you the picture; Mission Tree is where the work starts, and we can finally achieve our goal.',
    'Engineers may leave, the mission carries on.',
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

export const TREE_INTRO = {
  title: 'One mission. Your path through it.',
  body: 'Choose a Phase from left to right, grow a subsystem branch and explore its task leaves. All 80 task cards from the Mission Tree prototype are available.',
  note: 'Explore the project structure here. Manuals, executable workshops and project work continue in the separate Mission Tree app.',
};

/** Team codes and names as Mission Tree v3 defines them. */
export const TEAMS: readonly (readonly [string, string])[] = [
  ['SYS', 'Mission & Systems'],
  ['BOX', 'Structure & Thermal'],
  ['EPS', 'Electrical Power'],
  ['ADCS', 'Attitude Control'],
  ['COM', 'Comms & Ground'],
  ['OBC', 'Computer & Flight SW'],
  ['PAY', 'Payload'],
];

/** NASA life-cycle Phases. */
export const PHASES: readonly (readonly [string, string])[] = [
  ['Pre-A', 'Concept Studies'],
  ['A', 'Concept and Technology Development'],
  ['B', 'Preliminary Design and Technology Completion'],
  ['C', 'Final Design and Fabrication'],
  ['D', 'Assembly, Integration, Test and Launch'],
  ['E', 'Operations and Sustainment'],
  ['F', 'Closeout'],
];

export const HANDOFF = {
  title: 'Continue in Mission Tree.',
  body: 'Manuals, executable workshops and project work continue in the separate Mission Tree app.',
};
