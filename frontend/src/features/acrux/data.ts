// Content from feat/onboarding-english-v2_1 (features/acrux).
// Sources: melbournespace.com.au/projects (ACRUX-2), Standup-NOV-WK2 §C.3
// (system model item hierarchy) and the v2.0 mission brief. `TBD` marks items
// the system model has not confirmed.

export const ACRUX_INTRO = {
  headline: 'A 1U CubeSat that proves student-built hardware in orbit.',
  paragraphs: [
    'ACRUX-II is the next major evolution in the Melbourne Space Program’s satellite capabilities. It is an interdisciplinary, student-designed technology demonstration platform that aims to improve the reliability and performance of small-scale space systems.',
    'It follows ACRUX-I, which MSP launched and communicated with in 2019. Built as a modular, adaptable flight bus, ACRUX-II is meant to prove flight heritage and refine onboard power, communications and attitude control, giving future student payloads a tested base to fly on.',
    'For members it links university engineering with the wider aerospace industry: hands-on work across the whole mission lifecycle, from concept and structural analysis to ground-station operations and data retrieval.',
  ],
};

export const MISSION_VIDEO = {
  id: 'cCGppiJOoZY',
  title: 'ACRUX-II mission video',
  url: 'https://www.youtube.com/watch?v=cCGppiJOoZY',
};

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
