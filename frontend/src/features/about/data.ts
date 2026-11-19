// Content from feat/onboarding-english-v2_1 (features/about).
// Source: melbournespace.com.au/who-we-are and /projects (read 13 Nov 2026).
// Entries marked `pending` wait for the MSP History deck (Standup-NOV-WK2 §D).

export type Purpose = { vision: string; mission: string };

export const MSP_STATEMENT = {
  headline: 'We develop future technology leaders.',
  // The site's sentence, split at its verbs: "The Melbourne Space Program
  // selects … and delivers … through …".
  name: 'Melbourne Space Program',
  points: [
    { label: 'Selects', text: 'Highly talented university students' },
    { label: 'Delivers', text: 'An unparalleled learning experience' },
    { label: 'Through', text: 'Complex technology projects' },
  ],
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
  /** One line under the card. */
  summary: string;
  /** `focus` is the CSS object-position for the card crop, when the
   * subject is not in the middle of the photograph. */
  image: { src: string; alt: string; focus?: string };
  isOurs?: boolean;
};

const image = (name: string) => `/images/projects/${name}`;

export const PROJECTS_TITLE = 'Three projects, one shared learning journey.';

export const PROJECTS: readonly Project[] = [
  {
    id: 'acrux-2',
    name: 'ACRUX-II',
    tagline: 'Improving performance',
    summary: 'In-orbit technology demonstration on a student-built 1U CubeSat.',
    isOurs: true,
    image: {
      src: image('acrux-msp.jpg'),
      alt: 'MSP CubeSat hardware with solar cells and an aluminium frame',
    },
  },
  {
    id: 'humanoid',
    name: 'Humanoid',
    tagline: 'Current project',
    summary: 'Bio-inspired robots for complex physical tasks.',
    image: {
      src: image('humanoid-msp.png'),
      alt: 'MSP robotics demonstration with a robot torso, articulated hand and engineering laptop',
      // A portrait photo in a landscape card: keep the people's heads in.
      focus: '50% 8%',
    },
  },
  {
    id: 'animatronics',
    name: 'Animatronics',
    tagline: 'Current project',
    summary: 'Companion robots for children’s hospitals.',
    image: {
      src: image('companion-robot-msp.jpg'),
      alt: 'An animal companion robot under development with exposed actuators and test equipment',
    },
  },
];
