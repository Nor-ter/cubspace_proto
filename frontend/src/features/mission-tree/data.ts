// Content from feat/onboarding-english-v2_1 (features/mission-tree).
// Source: MissionTree_README.md and cubspace_missiontree-frontend-prototype
// (frontend_v3: `teams.ts`, `api.ts`, `reviews.ts`, `pmCards.ts`).

export const MISSION_TREE_INTRO = {
  // No-break spaces keep "Build a 1U satellite." on one line.
  headline: 'Learn through small tasks. Build\u00a0a\u00a01U\u00a0satellite.',
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

export const TREE_INTRO = {
  title: 'One mission. Your path through it.',
  body: 'Open a Phase, choose a team and explore its Tasks. These are the 80 Tasks from the Mission Tree prototype.',
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
  unavailable:
    'The Mission Tree link is not set up in this build. Set VITE_MISSION_TREE_URL to enable it.',
};
