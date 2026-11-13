import type { QuizSection } from '@/types/course';

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

export const MODULES: readonly {
  id: QuizSection;
  index: string;
  title: string;
  desc: string;
}[] = [
  {
    id: 'mission',
    index: '01',
    title: 'Mission Context',
    desc: 'Why CubSpace exists and what ACRUX-II has to achieve in orbit.',
  },
  {
    id: 'anatomy',
    index: '02',
    title: 'Spacecraft Structure',
    desc: 'Take the 1U CubeSat apart in 3D and see what each subsystem does.',
  },
  {
    id: 'model',
    index: '03',
    title: 'System Model',
    desc: 'Link requirements, functions, parts and evidence into one traceable model.',
  },
  {
    id: 'handoff',
    index: '04',
    title: 'First Task',
    desc: 'Pick up TASK-ADCS-001 and leave a record the next team can continue.',
  },
];
