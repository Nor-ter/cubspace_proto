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

type TimelineStop = {
  when: string;
  name: string;
  text: string;
  /** Where the stop sits: done, the current mission, or still ahead. */
  state: 'past' | 'now' | 'next';
};

/**
 * The rest of the introduction as the line it describes: ACRUX-I before,
 * ACRUX-II now, the payloads that will fly on it, and the member who joins
 * the work (no date label). The text is the introduction's own, split by stop.
 */
export const ACRUX_TIMELINE: readonly TimelineStop[] = [
  {
    when: '2019',
    name: 'ACRUX-I',
    text: 'MSP launched it and communicated with it in orbit.',
    state: 'past',
  },
  {
    when: 'Now',
    name: 'ACRUX-II',
    text: 'A modular, adaptable flight bus that proves flight heritage and refines onboard power, communications and attitude control.',
    state: 'now',
  },
  {
    when: 'Next',
    name: 'Payloads',
    text: 'A tested base for future student payloads to fly on.',
    state: 'next',
  },
  {
    when: '',
    name: 'MSP members',
    text: 'Hands-on work across the whole mission lifecycle, from concept and structural analysis to ground-station operations and data retrieval, linking university engineering with the wider aerospace industry.',
    state: 'next',
  },
];

export const MISSION_VIDEO = {
  id: 'cCGppiJOoZY',
  title: 'ACRUX-II mission video',
  url: 'https://www.youtube.com/watch?v=cCGppiJOoZY',
};
