import { SUBSYSTEMS } from '@/features/anatomy/data';
import { MISSION_STATES } from '@/features/home/data';
import type { PageId } from '@/types/course';
import type { SubsystemKey } from '@/types/subsystem';

export type Vec3 = readonly [number, number, number];

export type StoryStageFrame = {
  camera: Vec3;
  target: Vec3;
  shift: number;
  explode: number;
  highlight: SubsystemKey;
  wireframe: boolean;
  mission: boolean;
};

export type StoryItem = {
  code?: string;
  name: string;
  detail?: string;
  note?: string;
};

export type StoryScene = {
  id: string;
  chapter: PageId;
  eyebrow: string;
  title: string;
  titleAccent?: string;
  highlightWord?: string;
  body?: string;
  items?: readonly StoryItem[];
  side: 'left' | 'right';
  length: number;
  isFinal?: boolean;
  stage: StoryStageFrame;
};

export const SATELLITE_POSITION: Vec3 = [0, 1.25, 0];
export const EARTH: Vec3 = [0, 0, 0];

export const nearSatellite = (x: number, y: number, z: number): Vec3 => [
  SATELLITE_POSITION[0] + x,
  SATELLITE_POSITION[1] + y,
  SATELLITE_POSITION[2] + z,
];

export const frame = (
  camera: Vec3,
  target: Vec3,
  shift: number,
  extra: Partial<StoryStageFrame> = {},
): StoryStageFrame => ({
  camera,
  target,
  shift,
  explode: 0,
  highlight: 'all',
  wireframe: false,
  mission: false,
  ...extra,
});

const TOUR_RADIUS = 0.5;
const TOUR_ANGLES = [0.5, 1.3, 2.2, 3.1, 4, 4.9, 5.7];

const SUBSYSTEM_SCENES: StoryScene[] = SUBSYSTEMS.slice(1).map(
  (subsystem, index) => ({
    id: subsystem.id,
    chapter: 'anatomy',
    eyebrow: subsystem.label,
    title: subsystem.title,
    body: subsystem.purpose,
    items: subsystem.components.map((name) => ({ name })),
    side: 'left',
    length: 150,
    stage: frame(
      nearSatellite(
        TOUR_RADIUS * Math.sin(TOUR_ANGLES[index]),
        0.16,
        TOUR_RADIUS * Math.cos(TOUR_ANGLES[index]),
      ),
      SATELLITE_POSITION,
      -0.2,
      { explode: 1, highlight: subsystem.id },
    ),
  }),
);

export const STORY_SCENES: readonly StoryScene[] = [
  {
    id: 'hero',
    chapter: 'home',
    eyebrow: 'CUBSPACE / ENGINEERING ONBOARDING',
    title: 'Understand ACRUX-II.',
    titleAccent: 'Start your first assignment.',
    body: 'Explore the ACRUX-II 1U CubeSat and its ADCS, then practise system modelling and documenting design reviews.',
    side: 'left',
    length: 220,
    stage: frame([0, 0.15, 3.4], EARTH, -0.2),
  },
  {
    id: 'sequence',
    chapter: 'home',
    eyebrow: 'ACRUX-II / CONCEPTUAL SEQUENCE',
    title: 'Initial Mission Sequence',
    items: MISSION_STATES.map(({ code, name, detail }) => ({
      code,
      name,
      detail,
    })),
    side: 'right',
    length: 300,
    stage: frame([0, 1.6, 8.3], EARTH, 0.23, { mission: true }),
  },
  {
    id: 'problem',
    chapter: 'mission',
    eyebrow: 'THE CONTINUITY PROBLEM',
    title: 'People carry mission knowledge.',
    titleAccent: 'But people are temporary.',
    body: 'Team members change from semester to semester and as students graduate. If the rationale behind design decisions lives only in individual memories, the next team must solve the same problems again.',
    side: 'left',
    length: 220,
    stage: frame([-0.6, -0.25, 2.8], EARTH, -0.22),
  },
  {
    id: 'principle',
    chapter: 'mission',
    eyebrow: 'THE CUBSPACE PRINCIPLE',
    title: 'Engineers may leave.',
    titleAccent: 'The mission carries on.',
    highlightWord: 'mission',
    body: 'Connect models, documents, rules, task cards, evidence, and sign-offs so the next engineer can trace the basis for each decision.',
    side: 'right',
    length: 220,
    stage: frame([0.7, 0.3, 2.8], EARTH, 0.22),
  },
  {
    id: 'brief',
    chapter: 'mission',
    eyebrow: 'ACRUX-II / 1U TECHNOLOGY DEMONSTRATION',
    title: 'Verifying hardware from space with small satellites.',
    body: 'The primary success criteria are completing the deployment sequence and establishing ground communication. After separation, the spacecraft must survive, reduce its rotation, deploy its antennas, and connect to the ground before it can collect Deneb magnetorquer and solar-panel data.',
    items: [
      {
        code: '01',
        name: 'Initial Operations',
        detail:
          'Separation detection → thermal management → attitude determination and detumbling → antenna deployment (see the low-power exception below)',
      },
      {
        code: '02',
        name: 'Operational Phase',
        detail:
          'Ground communication, power-positive operation, technology verification data collection',
      },
      {
        code: '03',
        name: 'Extended Operations',
        detail: 'Accumulation of long-term data and mission knowledge',
      },
    ],
    side: 'left',
    length: 240,
    stage: frame(nearSatellite(0.3, 0.22, 0.6), SATELLITE_POSITION, -0.2),
  },
  {
    id: 'anatomy',
    chapter: 'anatomy',
    eyebrow: 'Satellite structure and components',
    title: '1U CubeSat Structure Exploration',
    body: 'Rotate/zoom the model and select items. Only selected systems are highlighted.',
    side: 'left',
    length: 200,
    stage: frame(nearSatellite(0.3, 0.14, 0.52), SATELLITE_POSITION, -0.2, {
      explode: 1,
    }),
  },
  ...SUBSYSTEM_SCENES,
  {
    id: 'model',
    chapter: 'model',
    eyebrow: 'SYSTEM MODELING 101',
    title: 'System modeling basics',
    body: 'Models answer engineering questions by linking requirements, functionality, implementation, and verification evidence.',
    side: 'right',
    length: 200,
    stage: frame(nearSatellite(-0.4, 0.3, 0.6), SATELLITE_POSITION, 0.2, {
      wireframe: true,
    }),
  },
  {
    id: 'definition',
    chapter: 'model',
    eyebrow: 'ONE SENTENCE DEFINITION',
    title:
      'System modelling represents why components are needed, what they connect to, and how they are verified.',
    side: 'left',
    length: 200,
    stage: frame(nearSatellite(0.35, 0.2, 0.55), SATELLITE_POSITION, -0.2, {
      explode: 1,
      wireframe: true,
    }),
  },
  {
    id: 'lenses',
    chapter: 'model',
    eyebrow: 'SYSTEM MODELING 101',
    title: 'System modeling basics',
    items: [
      {
        code: '01',
        name: 'REQUIREMENT',
        detail: 'What should I be satisfied with?',
        note: 'Mission objectives and success criteria',
      },
      {
        code: '02',
        name: 'FUNCTION',
        detail: 'What should I do?',
        note: 'Input → Conversion → Output',
      },
      {
        code: '03',
        name: 'PHYSICAL',
        detail: 'What part or code does it?',
        note: 'System → Subsystem → Component',
      },
      {
        code: '04',
        name: 'EVIDENCE',
        detail: 'How do you ensure requirements are met?',
        note: 'Test · Analysis · Review · Sign-off',
      },
    ],
    side: 'right',
    length: 240,
    stage: frame(nearSatellite(-0.1, 0.45, 0.7), SATELLITE_POSITION, 0.2, {
      wireframe: true,
    }),
  },
  {
    id: 'knowledge',
    chapter: 'handoff',
    eyebrow: 'MISSION KNOWLEDGE NETWORK',
    title: 'A design record that can be continued by the next team',
    body: 'Link model changes, business records and validation evidence and track the latest geometry.',
    items: [
      { code: '01', name: 'Live Technical Manual', detail: 'What do you know now?' },
      { code: '02', name: 'Task Card', detail: 'what to do next' },
      {
        code: '03',
        name: 'Human + AI Cell',
        detail: 'Records of work performed and evidence provided',
      },
      {
        code: '04',
        name: 'Human Sign-off',
        detail: 'Update baseline document after review',
      },
    ],
    side: 'left',
    length: 240,
    stage: frame([0, 2.2, 3], [0, 0.5, 0], -0.2),
  },
  {
    id: 'task',
    chapter: 'handoff',
    eyebrow: 'TASK-ADCS-001',
    title: 'ADCS Functional Model Draft Review',
    body: 'The detumbling process of reducing the rotation of the satellite with B-dot is accompanied by documentary evidence. Explain and indicate any inconclusive items.',
    side: 'right',
    length: 160,
    isFinal: true,
    stage: frame([0.4, 0.15, 3.6], EARTH, 0.2),
  },
];
