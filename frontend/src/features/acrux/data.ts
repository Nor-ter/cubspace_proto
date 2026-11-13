// Content from feat/onboarding-english-v2_1 (features/acrux).
// Sources: melbournespace.com.au/projects (ACRUX-2), Standup-NOV-WK2 §C.3
// (system model item hierarchy) and the v2.0 mission brief. `TBD` marks items
// the system model has not confirmed.

export const ACRUX_INTRO = {
  headline: 'A 1U CubeSat that proves student-built hardware in orbit.',
  paragraphs: [
    'ACRUX-II (ACRUX-2) is the next major evolution in the Melbourne Space Program’s satellite capabilities. It is an interdisciplinary, student-designed technology demonstration platform that aims to improve the reliability and performance of small-scale space systems.',
    'It follows ACRUX-1, which MSP launched and communicated with in 2019. Built as a modular, adaptable flight bus, ACRUX-II is meant to prove flight heritage and refine onboard power, communications and attitude control, giving future student payloads a tested base to fly on.',
    'For members it links university engineering with the wider aerospace industry: hands-on work across the whole mission lifecycle, from concept and structural analysis to ground-station operations and data retrieval.',
  ],
};

export const MISSION_VIDEO = {
  id: 'cCGppiJOoZY',
  title: 'ACRUX-II mission video',
  url: 'https://www.youtube.com/watch?v=cCGppiJOoZY',
};

export const ACRUX_FACTS: readonly (readonly [string, string])[] = [
  ['Form factor', '1U CubeSat, about a 10 cm cube'],
  ['Orbit', 'Low Earth orbit (LEO)'],
  ['Mission type', 'In-orbit technology demonstration'],
  ['Predecessor', 'ACRUX-1, launched 2019'],
  ['System model', 'System → Subsystem → Component'],
  ['Teams', 'BOX · EPS · ADCS · OBC · COMMS · PAY + Systems'],
];

export const SUCCESS = {
  title: 'Each step unlocks the next.',
  body: 'The primary success criteria are completing the deployment sequence and establishing ground communication. Only then can the spacecraft collect its demonstration data.',
};

export const SUCCESS_STEPS: readonly (readonly [string, string])[] = [
  ['Survive', 'Detect separation from the deployer and manage temperature.'],
  ['Detumble', 'Measure the body rotation and damp it with B-dot control.'],
  ['Deploy', 'Release the antennas once the rotation is low.'],
  ['Connect', 'Establish communication with the ground station.'],
  ['Demonstrate', 'Collect technology-demonstration data and return it.'],
];

export const OPERATIONS_TITLE = 'Three phases in orbit.';

export const OPERATIONS: readonly (readonly [string, string])[] = [
  [
    'Initial operations',
    'Separation detection → thermal management → attitude determination and detumbling → antenna deployment.',
  ],
  [
    'Operational phase',
    'Ground communication, power-positive operation and technology-verification data collection.',
  ],
  [
    'Extended operations',
    'Long-term data accumulates and mission knowledge is handed to the next cohort.',
  ],
];

type Experiment = { name: string; text: string; status?: 'TBD' };

export const EXPERIMENTS_TITLE = 'What ACRUX-II tests in space.';

export const EXPERIMENTS: readonly Experiment[] = [
  {
    name: 'ETP solar-panel measurement',
    text: 'A measurement board characterises solar-panel behaviour in orbit. It is a payload item and is modelled separately from the EPS solar panels that power the spacecraft.',
  },
  {
    name: 'Deneb magnetorquer demonstration',
    text: 'The Deneb Space magnetorquer is the ADCS actuator used for detumbling. The payload experiment references it rather than duplicating it.',
  },
  {
    name: 'Camera',
    text: 'The MSP website describes an Earth-observation RGB camera. The current system model lists the camera as not yet confirmed.',
    status: 'TBD',
  },
];
