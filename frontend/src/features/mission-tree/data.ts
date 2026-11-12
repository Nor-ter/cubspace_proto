import type { MissionTreeTarget } from './link';

// Source: MissionTree_README.md and cubspace_missiontree-frontend-prototype
// (frontend_v3: `teams.ts`, `api.ts`, `reviews.ts`, `pmCards.ts`).

export const INTRO_PARAGRAPHS = [
  'Student satellite teams change as members move through semesters, exams and graduation, and documents and design decisions scatter with them. Mission Tree keeps the whole ACRUX-II mission in one structure you can walk through, so a new member can understand the mission, find their team’s next piece of work and open what they need to learn it.',
  'It connects the mission’s Phases, each team’s Task Cards, technical manuals and workshops that run in your browser. You learn in the order Manual → Workshop → Tasks: read the manual, practise in a notebook, then take on the real project task. Onboarding gave you the picture; Mission Tree is where the work starts.',
];

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

/** NASA life-cycle Phases with the provisional review that closes each. */
export const PHASES: readonly (readonly [string, string, string])[] = [
  ['Pre-A', 'Concept Studies', 'MCR'],
  ['A', 'Concept and Technology Development', 'SRR · MDR'],
  ['B', 'Preliminary Design and Technology Completion', 'PDR'],
  ['C', 'Final Design and Fabrication', 'CDR · SIR'],
  ['D', 'Assembly, Integration, Test and Launch', 'ORR · FRR'],
  ['E', 'Operations and Sustainment', 'DR'],
  ['F', 'Closeout', 'DRR'],
];

export const STRUCTURE: readonly (readonly [string, string])[] = [
  ['Mission', 'ACRUX-II'],
  ['Phase', 'A · Concept and Technology Development'],
  ['Subsystem / team', 'ADCS'],
  ['Task Card', 'A2 · B-dot study and simulation'],
  ['Task', 'A2.1 · Run the detumbling simulation'],
];

export const LEARNING_FLOW: readonly (readonly [string, string])[] = [
  ['Manual', 'Read the technical manual attached to your team and Phase.'],
  ['Workshop', 'Practise in a notebook that runs in the browser. Nothing to install.'],
  ['Tasks', 'Do the real project task on the card.'],
];

export const INSIDE: readonly (readonly [string, string])[] = [
  ['7', 'Phases, Pre-A to F'],
  ['7', 'teams, including Systems'],
  ['80', 'Task Cards'],
  ['2', 'views: Step by step and Whole sheet'],
];

export const LIMITS = [
  'It is a frontend prototype backed by static data. There are no accounts: the Admin / Junior entry screen is a demo choice.',
  'Manuals and workshops are attached to ADCS first: two reference PDFs and three detumbling notebooks.',
  'Cards describe work to be done. They are not records of completed tests or approvals, and nothing you do is submitted or saved to a server.',
];

export type Destination = {
  id: string;
  title: string;
  text: string;
  /** Destinations that depend on the chosen team build their target from it. */
  target: (team: string | null) => MissionTreeTarget;
  needsTeam?: boolean;
};

export const DESTINATIONS: readonly Destination[] = [
  {
    id: 'workflow',
    title: 'My team’s workflow',
    text: 'Your team’s Task Cards across every Phase.',
    target: (team) =>
      team ? { kind: 'workflow', team } : { kind: 'tree' },
    needsTeam: true,
  },
  {
    id: 'tree',
    title: 'The whole mission tree',
    text: 'Start at the top and open the mission one step at a time.',
    target: () => ({ kind: 'tree' }),
  },
  {
    id: 'workshop',
    title: 'ADCS detumbling workshop',
    text: 'Task Card A2, step A2.1: run the B-dot detumbling simulation.',
    target: () => ({
      kind: 'card',
      phase: 'A',
      card: 'TC-ADCS-A2',
      tab: 'workshop',
      step: 'A2.1',
    }),
  },
];
