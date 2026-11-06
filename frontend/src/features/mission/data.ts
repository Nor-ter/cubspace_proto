import type { Quiz } from '@/types/quiz';

export const LEARNING_PATH = [
  [
    '01',
    'ORIENT',
    'Why CubSpace',
    'Even if people change, mission knowledge must remain.',
  ],
  [
    '02',
    'SPACECRAFT',
    'CubeSat and ACRUX-II',
    'A look at the 1U platform and mission success conditions.',
  ],
  [
    '03',
    'ANATOMY',
    'satellite structure navigation',
    'Find hardware and interfaces in your 3D model.',
  ],
  [
    '04',
    'SYSTEM MODEL',
    'System Modeling Fundamentals',
    'We explore the connection between requirements, functionality, hardware and verification.',
  ],
  [
    '05',
    'HANDOFF',
    'First Engineering Challenge',
    'Learn the work flow of providing evidence, review, and approval.',
  ],
] as const;

export const MISSION_QUIZ: Quiz = {
  title: 'Ensure understanding of mission',
  questions: [
    {
      id: 'm1',
      prompt: 'What is the core problem CubSpace is trying to solve?',
      options: [
        'Poor projectile performance',
        'Knowledge disconnection due to student change',
        'Satellite size increases',
        'Ground station frequency selection',
      ],
      correct: 1,
      explanation:
        'CubSpace ensures that mission knowledge and basis for judgment are maintained even when engineers change.',
    },
    {
      id: 'm2',
      prompt: 'What is the primary success criterion for ConOps?',
      options: [
        'camera shooting',
        'Complete deployment sequence and secure ground communications',
        'New CAD model',
        'Translate all documents',
      ],
      correct: 1,
      explanation:
        'The primary success of ConOps §1.1 is completing the deployment sequence and securing communications. Empirical data collection is a secondary success criterion, and low-power exception procedures are separately defined.',
    },
    {
      id: 'm3',
      prompt: 'What are examples of key skills for this onboarding?',
      options: [
        'EPS heater',
        'Payload camera',
        'ADCS detumbling',
        'Launch vehicle',
      ],
      correct: 2,
      explanation:
        'ADCS detumbling leading to magnetic field measurements, B-dots, and Deneb magnetorquers are central examples.',
    },
    {
      id: 'm4',
      prompt:
        'What should be left for the next team to replicate the same judgment?',
      options: [
        'Record only the conclusion',
        'Source, assumption, conditions, verification result',
        'Save only pictures for presentation purposes',
        'Record only the person in charge',
      ],
      correct: 1,
      explanation:
        'You must leave the application conditions and basis for the judgment so that you can review whether the conclusion is valid even if the design is changed.',
    },
    {
      id: 'm5',
      prompt:
        'What is needed before incorporating mission knowledge into the baseline?',
      options: [
        'AI-only approval',
        'Human review and sign-off',
        'design changes',
        'Create a new account',
      ],
      correct: 1,
      explanation:
        'AI can assist, but authoritative mission-state changes require human review and approval.',
    },
  ],
};
