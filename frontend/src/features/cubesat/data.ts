// Source: "CubeSat Mission and Subsystems: Contents for the onboarding web"
// (12 November 2026), section 1 "CubeSat mission", including Figure 1.
// Sentences are quoted verbatim; reference links as collected on
// feat/onboarding-english-v2_1 (features/theory/data.ts).

import { references } from '@/features/subsystems/data';

export const CUBESAT_MISSION = {
  title: 'CubeSat mission',
  objective:
    'Develop and launch a CubeSat into LEO and maximise its useful operational lifetime.',
};

/** The CubeSat format at a glance, from the guide's first paragraph. */
export const STATS: readonly (readonly [string, string])[] = [
  ['1U', 'Approximately a 10 cm cube, selected for this project'],
  ['1–10 kg', 'Nanosatellite mass category'],
  ['×3 · ×6', '3U and 6U: nominal unit volume'],
  ['LEO', 'Low Earth orbit'],
];

type Topic = {
  title: string;
  cites: readonly number[];
  /** [short label, the guide's own sentence] */
  points: readonly (readonly [string, string])[];
};

/**
 * The guide's two paragraphs, one sentence per row with a short label. The
 * sentences are the guide's own; only the opening line of the second
 * paragraph is left out, as it repeats the objective above.
 */
export const TOPICS: readonly Topic[] = [
  {
    title: 'What a CubeSat is',
    cites: [1, 2],
    points: [
      [
        'Standard',
        'CubeSats are small satellites built around standard physical units and a compatible deployment interface.',
      ],
      [
        'Mass',
        'Many are nanosatellites, a mass category typically covering 1 to 10 kg; larger CubeSats may fall outside this category.',
      ],
      ['Units', 'CubeSat sizes are expressed in units, or U.'],
      [
        '1U',
        'The basic 1U format, selected for this project, is approximately a 10 cm cube.',
      ],
      [
        '3U · 6U',
        'Larger formats, including 3U and 6U, provide roughly three and six times the nominal unit volume for additional hardware.',
      ],
      [
        'Deployer',
        'The precise dimensions must match the deployer, the device that secures and releases the spacecraft.',
      ],
    ],
  },
  {
    title: 'What the mission needs',
    cites: [3, 4],
    points: [
      [
        'One system',
        'This requires the structure, power, attitude control, computing, communications and payload functions to operate as an integrated system.',
      ],
      [
        'Example',
        'For example, a payload observation may require suitable pointing, sufficient energy and available storage, with data returned during a later ground contact.',
      ],
      [
        'Why it matters',
        'Understanding these connections provides the basis for defining subsystem tasks and evaluating design choices.',
      ],
      [
        'Lifetime',
        'Useful operational lifetime is the period during which the spacecraft meets its mission objectives.',
      ],
      [
        'Sustaining it',
        'Sustained operation depends on energy availability, temperature control, reliable hardware and fault recovery, alongside appropriate end-of-mission planning.',
      ],
    ],
  },
];

/** Figure 1: the six subsystems under the mission, with their role. */
export const FIGURE = {
  root: 'CubeSat mission: launch and sustained operation in LEO',
  leaf: 'Associated tasks, knowledge and workshops',
  caption:
    'Mission tree connecting subsystem responsibilities with associated tasks, knowledge and workshops.',
  subsystems: [
    { code: 'BOX', name: 'Structure', role: 'Mechanical support' },
    { code: 'EPS', name: 'EPS', role: 'Electrical power' },
    { code: 'ADCS', name: 'ADCS', role: 'Orientation' },
    { code: 'OBC', name: 'OBC', role: 'Computing' },
    { code: 'COM', name: 'COMMS', role: 'Ground link' },
    { code: 'PAY', name: 'Payload', role: 'Mission activity' },
  ],
} as const;

export const TASKS: readonly string[] = [
  'Define the mission through its subsystems, their functions and how they operate together.',
  'Use the mission tree to explore associated tasks, knowledge and workshops.',
  'Communicate and collaborate as a team to complete the mission.',
];

export const SKILLS: readonly string[] = [
  'Mission Tree',
  'Project Management',
  'Engineering Communication',
  'Critical Thinking',
];

export const REFERENCES = references(1, 2, 3, 4);
