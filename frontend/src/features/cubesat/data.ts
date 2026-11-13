// Source: "CubeSat Mission and Subsystems: Contents for the onboarding web"
// (12 November 2026), section 1 "CubeSat mission", including Figure 1.
// Text is quoted verbatim; reference links as collected on
// feat/onboarding-english-v2_1 (features/theory/data.ts).

export type Reference = { id: number; title: string; url: string };

export const CUBESAT_MISSION = {
  title: 'CubeSat mission',
  objective:
    'Develop and launch a CubeSat into LEO and maximise its useful operational lifetime.',
};

/** The two guide paragraphs, each with the references it cites. */
export const PARAGRAPHS: readonly { text: string; cites: readonly number[] }[] =
  [
    {
      text: 'CubeSats are small satellites built around standard physical units and a compatible deployment interface. Many are nanosatellites, a mass category typically covering 1 to 10 kg; larger CubeSats may fall outside this category. CubeSat sizes are expressed in units, or U. The basic 1U format, selected for this project, is approximately a 10 cm cube. Larger formats, including 3U and 6U, provide roughly three and six times the nominal unit volume for additional hardware. The precise dimensions must match the deployer, the device that secures and releases the spacecraft.',
      cites: [1, 2],
    },
    {
      text: 'The mission aims to develop and launch the spacecraft into low Earth orbit (LEO) and maximise its useful operational lifetime. This requires the structure, power, attitude control, computing, communications and payload functions to operate as an integrated system. For example, a payload observation may require suitable pointing, sufficient energy and available storage, with data returned during a later ground contact. Understanding these connections provides the basis for defining subsystem tasks and evaluating design choices. Useful operational lifetime is the period during which the spacecraft meets its mission objectives. Sustained operation depends on energy availability, temperature control, reliable hardware and fault recovery, alongside appropriate end-of-mission planning.',
      cites: [3, 4],
    },
  ];

/** Terms defined in the paragraphs above, in the guide's own words. */
export const KEY_TERMS: readonly (readonly [string, string])[] = [
  [
    '1U',
    'The basic format, selected for this project: approximately a 10 cm cube.',
  ],
  [
    '3U and 6U',
    'Larger formats with roughly three and six times the nominal unit volume for additional hardware.',
  ],
  ['Nanosatellite', 'A mass category typically covering 1 to 10 kg.'],
  ['Deployer', 'The device that secures and releases the spacecraft.'],
  ['LEO', 'Low Earth orbit.'],
  [
    'Useful operational lifetime',
    'The period during which the spacecraft meets its mission objectives.',
  ],
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

export const REFERENCES: readonly Reference[] = [
  {
    id: 1,
    title: 'Cal Poly, CubeSat Design Specification, Rev. 14.1 (2022).',
    url: 'https://www.nasa.gov/wp-content/uploads/2018/01/cubesatdesignspecificationrev14_12022-02-09.pdf',
  },
  {
    id: 2,
    title: 'NASA, Small Spacecraft Technology: Introduction (2026).',
    url: 'https://www.nasa.gov/smallsat-institute/sst-soa/introduction/',
  },
  {
    id: 3,
    title: 'NASA, CubeSat 101 (2017).',
    url: 'https://science.nasa.gov/wp-content/uploads/2023/06/nasa_csli_cubesat_101_508.pdf',
  },
  {
    id: 4,
    title: 'NASA, Small Spacecraft Technology: Deorbit Systems (2026).',
    url: 'https://www.nasa.gov/smallsat-institute/sst-soa/deorbit-systems/',
  },
];
