// Content from feat/onboarding-english-v2_1 (features/mission-tree).
// Source: MissionTree_README.md and cubspace_missiontree-frontend-prototype
// (frontend_v3: `teams.ts`, `api.ts`, `reviews.ts`, `pmCards.ts`).

export const MISSION_TREE_INTRO = {
  headline: 'Learn through small tasks. Build a 1U satellite.',
  lead: 'And pass the knowledge on to the next cohort.',
  paragraphs: [
    'Student satellite teams change as members move through semesters, exams and graduation, and documents and design decisions scatter with them. Mission Tree keeps the whole ACRUX-II mission in one structure you can walk through, so a new member can understand the mission, find their team’s next piece of work and open what they need to learn it.',
    'It connects the mission’s Phases, each team’s Task Cards, technical manuals and workshops that run in your browser. You learn in the order Manual → Workshop → Tasks: read the manual, practise in a notebook, then take on the real project task. Onboarding gave you the picture; Mission Tree is where the work starts.',
  ],
};

/** One example path from the mission down to a single task. */
export const STRUCTURE: readonly (readonly [string, string])[] = [
  ['Mission', 'ACRUX-II'],
  ['Phase', 'A · Concept and Technology Development'],
  ['Subsystem / team', 'ADCS'],
  ['Task Card', 'A2 · B-dot study and simulation'],
  ['Task', 'A2.1 · Run the detumbling simulation'],
];

export const LEARNING_FLOW_TITLE = 'Manual, then Workshop, then Tasks.';

export const LEARNING_FLOW: readonly (readonly [string, string])[] = [
  ['Manual', 'Read the technical manual attached to your team and Phase.'],
  [
    'Workshop',
    'Practise in a notebook that runs in the browser. Nothing to install.',
  ],
  ['Tasks', 'Do the real project task on the card.'],
];

export const TREE_INTRO = {
  title: 'One mission. Your path through it.',
  body: 'Open a Phase, choose a team and explore its Task Cards. These are the 80 cards from the Mission Tree prototype.',
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

export const LIMITS_TITLE = 'It is a prototype.';

export const LIMITS = [
  'It is a frontend prototype backed by static data. There are no accounts: the Admin / Junior entry screen is a demo choice.',
  'Manuals and workshops are attached to ADCS first: two reference PDFs and three detumbling notebooks.',
  'Cards describe work to be done. They are not records of completed tests or approvals, and nothing you do is submitted or saved to a server.',
];

export const HANDOFF = {
  title: 'Continue in Mission Tree.',
  body: 'Manuals, executable workshops and project work continue in the separate Mission Tree app.',
  unavailable:
    'The Mission Tree link is not set up in this build. Set VITE_MISSION_TREE_URL to enable it.',
};
