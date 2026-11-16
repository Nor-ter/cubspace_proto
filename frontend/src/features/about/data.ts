// Content from feat/onboarding-english-v2_1 (features/about).
// Source: melbournespace.com.au/who-we-are and /projects (read 13 Nov 2026).
// Entries marked `pending` wait for the MSP History deck (Standup-NOV-WK2 §D).

export type Purpose = { vision: string; mission: string };

export const MSP_STATEMENT = {
  headline: 'We develop future technology leaders.',
  body: 'The Melbourne Space Program selects highly talented university students and delivers an unparalleled learning experience through complex technology projects.',
  vision: 'To supply the greatest innovators of the 21st Century.',
  mission:
    'Develop pioneers who change the world for the better through delivering the best education on the planet.',
};

type JourneyEntry = {
  year: string;
  title: string;
  text: string;
  pending?: boolean;
};

export const JOURNEY_TITLE = 'Twelve years, started by students.';

export const JOURNEY: readonly JourneyEntry[] = [
  {
    year: '2014',
    title: 'How it started',
    text: 'Founded by a team of university students who wanted to build and launch a satellite.',
  },
  {
    year: '2016',
    title: 'How it evolved',
    text: 'Spun out as a not-for-profit focused on professional training for students using technology projects, and secured funding for ACRUX-I, the first satellite.',
  },
  {
    year: '2017–18',
    title: 'How it changed',
    text: 'Implemented Agile work practices, then developed and tested ACRUX-I, including the design of each subsystem except telecommunications.',
  },
  {
    year: '2019',
    title: 'Successes',
    text: 'Launched and communicated with ACRUX-I. Commenced ACRUX-II and established the AI & Robotics team.',
  },
  {
    year: '2020–26',
    title: 'ACRUX-II and beyond',
    text: 'This chapter is being written with the MSP History deck.',
    pending: true,
  },
];

export type Project = {
  id: string;
  name: string;
  tagline: string;
  text: string;
  focus: readonly string[];
  cover: string;
  isOurs?: boolean;
};

const image = (name: string) => `/images/projects/${name}`;

export const PROJECTS_TITLE = 'Three projects, one shared learning journey.';

export const PROJECTS: readonly Project[] = [
  {
    id: 'acrux-2',
    name: 'ACRUX-II',
    tagline: 'Improving performance',
    text: 'The next major evolution in MSP’s satellite capabilities: a student-designed, in-orbit technology demonstration platform for improving the reliability and performance of small-scale space systems.',
    focus: ['1U CubeSat', 'Flight heritage', 'Full mission lifecycle'],
    isOurs: true,
    cover: image('acrux-msp.jpg'),
  },
  {
    id: 'humanoid',
    name: 'Humanoid',
    tagline: 'Current project',
    text: 'Multi-limbed, bio-inspired robots for complex physical tasks, combining precision mechanical engineering, advanced control systems and autonomous robotics.',
    focus: ['Actuators', 'Dexterous manipulation', 'Motion planning'],
    cover: image('humanoid-msp.png'),
  },
  {
    id: 'animatronics',
    name: 'Animatronics',
    tagline: 'Current project',
    text: 'Interactive animal companion robots for healthcare settings such as children’s hospitals, combining soft robotics, expressive mechanics and human-centred design.',
    focus: ['Soft robotics', 'Human factors', 'User testing'],
    cover: image('companion-robot-msp.jpg'),
  },
];
