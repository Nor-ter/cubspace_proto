// Source: melbournespace.com.au/who-we-are and /projects (read 13 Nov 2026).
// Entries marked `pending` wait for the MSP History deck (Standup-NOV-WK2 §D).

export const MSP_STATEMENT = {
  headline: 'We develop future technology leaders.',
  body: 'The Melbourne Space Program selects highly talented university students and delivers an unparalleled learning experience through complex technology projects.',
  vision: 'To supply the greatest innovators of the 21st Century.',
  mission:
    'Develop pioneers who change the world for the better through delivering the best education on the planet.',
};

export type JourneyEntry = {
  year: string;
  title: string;
  text: string;
  pending?: boolean;
};

export const JOURNEY: readonly JourneyEntry[] = [
  {
    year: '2014',
    title: 'How it started',
    text: 'Founded by a team of university students who wanted to build and launch a satellite.',
  },
  {
    year: '2016',
    title: 'How it evolved',
    text: 'Spun out as a not-for-profit focused on professional training for students using technology projects, and secured funding for ACRUX-1, the first satellite.',
  },
  {
    year: '2017–18',
    title: 'How it changed',
    text: 'Implemented Agile work practices, then developed and tested ACRUX-1, including the design of each subsystem except telecommunications.',
  },
  {
    year: '2019',
    title: 'Successes',
    text: 'Launched and communicated with ACRUX-1. Commenced ACRUX-2 and established the AI & Robotics team.',
  },
  {
    year: '2020–26',
    title: 'ACRUX-II and beyond',
    text: 'This chapter is being written with the MSP History deck.',
    pending: true,
  },
];

export type Project = {
  index: string;
  name: string;
  tagline: string;
  text: string;
  focus: readonly string[];
  isOurs?: boolean;
};

export const PROJECTS: readonly Project[] = [
  {
    index: '01',
    name: 'ACRUX-2',
    tagline: 'Improving performance',
    text: 'The next major evolution in MSP’s satellite capabilities: a student-designed, in-orbit technology demonstration platform for improving the reliability and performance of small-scale space systems.',
    focus: ['1U CubeSat', 'Flight heritage', 'Full mission lifecycle'],
    isOurs: true,
  },
  {
    index: '02',
    name: 'Humanoid',
    tagline: 'Current project',
    text: 'Multi-limbed, bio-inspired robots for complex physical tasks, combining precision mechanical engineering, advanced control systems and autonomous robotics.',
    focus: ['Actuators', 'Dexterous manipulation', 'Motion planning'],
  },
  {
    index: '03',
    name: 'Animatronics',
    tagline: 'Current project',
    text: 'Interactive animal companion robots for healthcare settings such as children’s hospitals, combining soft robotics, expressive mechanics and human-centred design.',
    focus: ['Soft robotics', 'Human factors', 'User testing'],
  },
  {
    index: '04',
    name: 'CubSpace Project',
    tagline: 'Knowledge into practice',
    text: 'A connected onboarding and engineering workspace for ACRUX-II: learn the mission, explore subsystem knowledge and find your next task in Mission Tree.',
    focus: ['Onboarding', 'Mission Tree', 'Engineering knowledge'],
  },
];
