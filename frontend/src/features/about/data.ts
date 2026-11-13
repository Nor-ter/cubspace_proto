// Content from feat/onboarding-english-v2_1 (features/about).
// Source: melbournespace.com.au/who-we-are and /projects (read 13 Nov 2026).
// Entries marked `pending` wait for the MSP History deck (Standup-NOV-WK2 §D).
import logo from '@/assets/cubspace-logo.png';

export type Purpose = { vision: string; mission: string };

export const MSP_STATEMENT = {
  headline: 'We develop future technology leaders.',
  body: 'The Melbourne Space Program selects highly talented university students and delivers an unparalleled learning experience through complex technology projects.',
  vision: 'To supply the greatest innovators of the 21st Century.',
  mission:
    'Develop pioneers who change the world for the better through delivering the best education on the planet.',
};

export const CUBSPACE_STATEMENT = {
  headline: 'From learning the mission to building it together.',
  body: 'CubSpace connects ACRUX-II onboarding, subsystem knowledge and the Mission Tree workspace. It helps MSP members find their first task, practise engineering skills and pass what they learn to the next team.',
  vision: 'A shared engineering journey that every new team can build on.',
  mission:
    'Connect mission knowledge, practical learning and project tasks so MSP members can contribute with confidence.',
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

type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
  source?: string;
};

export type Project = {
  id: string;
  name: string;
  tagline: string;
  text: string;
  focus: readonly string[];
  images: readonly GalleryImage[];
  isOurs?: boolean;
};

const MSP_PROJECTS_URL = 'https://www.melbournespace.com.au/projects';
const image = (name: string) => `/images/projects/${name}`;

export const PROJECTS_TITLE = 'Four projects, one shared learning journey.';

export const PROJECTS: readonly Project[] = [
  {
    id: 'acrux-2',
    name: 'ACRUX-2',
    tagline: 'Improving performance',
    text: 'The next major evolution in MSP’s satellite capabilities: a student-designed, in-orbit technology demonstration platform for improving the reliability and performance of small-scale space systems.',
    focus: ['1U CubeSat', 'Flight heritage', 'Full mission lifecycle'],
    isOurs: true,
    images: [
      {
        src: image('acrux-msp.jpg'),
        alt: 'MSP CubeSat hardware with solar cells and an aluminium frame',
        caption:
          'ACRUX flight heritage. MSP uses this ACRUX-1 hardware photograph on its ACRUX-2 project page.',
        source: MSP_PROJECTS_URL,
      },
    ],
  },
  {
    id: 'humanoid',
    name: 'Humanoid',
    tagline: 'Current project',
    text: 'Multi-limbed, bio-inspired robots for complex physical tasks, combining precision mechanical engineering, advanced control systems and autonomous robotics.',
    focus: ['Actuators', 'Dexterous manipulation', 'Motion planning'],
    images: [
      {
        src: image('humanoid-msp.png'),
        alt: 'MSP robotics demonstration with a robot torso, articulated hand and engineering laptop',
        caption:
          'Robotics hardware and a project demonstration from the MSP projects page.',
        source: MSP_PROJECTS_URL,
      },
    ],
  },
  {
    id: 'animatronics',
    name: 'Animatronics',
    tagline: 'Current project',
    text: 'Interactive animal companion robots for healthcare settings such as children’s hospitals, combining soft robotics, expressive mechanics and human-centred design.',
    focus: ['Soft robotics', 'Human factors', 'User testing'],
    images: [
      {
        src: image('companion-robot-msp.jpg'),
        alt: 'An animal companion robot under development with exposed actuators and test equipment',
        caption:
          'An animatronic companion prototype with its mechanical and electrical test setup.',
        source: MSP_PROJECTS_URL,
      },
    ],
  },
  {
    id: 'cubspace',
    name: 'CubSpace Project',
    tagline: 'Knowledge into practice',
    text: 'A connected onboarding and engineering workspace for ACRUX-II: learn the mission, explore subsystem knowledge and find your next task in Mission Tree.',
    focus: ['Onboarding', 'Mission Tree', 'Engineering knowledge'],
    // This onboarding site's own mark and screens, not the v2.1 screenshots.
    images: [
      {
        src: image('cubspace-onboarding.jpg'),
        alt: 'CubSpace onboarding start screen: Understand ACRUX-II. Start your first assignment.',
        caption: 'CubSpace Onboarding Web: the start screen.',
      },
      {
        src: image('cubspace-structure.jpg'),
        alt: 'CubSpace Spacecraft Structure page with the interactive 1U model',
        caption:
          'Spacecraft Structure: explore the 1U model and what each subsystem does.',
      },
      {
        src: logo,
        alt: 'CubSpace mark',
        caption: 'The CubSpace mark.',
      },
    ],
  },
];

export const SOURCE_NOTE =
  'MSP text and project photographs: Melbourne Space Program (Who we are, Projects). CubSpace images show this project.';

export const MSP_SOURCE_URL = 'https://www.melbournespace.com.au/who-we-are';
