import type { PageId } from '@/types/course';

export const PROBLEMS = [
  ['01', 'Teams rotate', 'Members join, graduate and move on every semester.'],
  [
    '02',
    'Reasons stay in heads',
    'Why a design decision was made rarely makes it into the files.',
  ],
  [
    '03',
    'The next team starts over',
    'Problems that were already solved get solved again.',
  ],
] as const;

export const TRACE = [
  'Mission objective',
  'Detumble function',
  'Magnetometer data',
  'B-dot software',
  'Deneb magnetorquer',
  'Test evidence',
  'Human sign-off',
] as const;

export const MODULES_TITLE = 'Five steps from the mission to your first task.';

export const MODULES: readonly {
  id: PageId;
  index: string;
  title: string;
  desc: string;
}[] = [
  {
    id: 'about',
    index: '01',
    title: 'About',
    desc: 'Melbourne Space Program, its history and its projects.',
  },
  {
    id: 'acrux',
    index: '02',
    title: 'ACRUX-II',
    desc: 'What a CubeSat is, then the 1U technology demonstration, its success steps and the mission video.',
  },
  {
    id: 'subsystems',
    index: '03',
    title: 'Subsystems',
    desc: 'Take the 1U model apart and read what each of the six subsystems does.',
  },
  {
    id: 'quiz',
    index: '04',
    title: 'Quiz',
    desc: 'Five questions on the CubeSat mission and its subsystems.',
  },
  {
    id: 'mission-tree',
    index: '05',
    title: 'Mission Tree',
    desc: 'The 80 Tasks, and where your team’s work starts.',
  },
];
