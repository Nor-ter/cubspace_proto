import type { EngineeringNote } from '@/types/engineering';
import type { Quiz } from '@/types/quiz';

export const SOURCE_CARDS = [
  [
    'ACRUX_2_ConOps.pdf',
    'Mission phase, initial operations, detumbling, communications and operational assumptions',
  ],
  [
    'ACRUX-2 CubeSat MADE Modeling.docx',
    'Hierarchy, function, material/energy/data flow and measurement properties',
  ],
  [
    'Product & Engineering Specification',
    'Learning sequence for new engineers, UX and technology boundaries',
  ],
  [
    'Project CubSpace Overview',
    'Documentation–Task–Sign-off Knowledge Continuity',
  ],
] as const;

export const HANDOFF_NOTES: EngineeringNote[] = [
  {
    id: '05',
    section: 'handoff',
    title: 'Reproducibility conditions must remain in deliverable results.',
    principle:
      'Changes impact existing needs and interfaces. Maintain separate statuses for passing exams, approving changes, and completing lessons to prevent future teams from using incorrect baselines.',
    equation:
      'Change record = Target/Version + Reason + Impact + Reproduction Procedure/Results + Uncertainty + Reviewer',
    example:
      "In TASK-ADCS-001, write each input/output, unit, coordinate system, and source section for the magnetometer → OBC B-dot → magnetic actuator chain. If you don't find the current limit, leave a TBD and contact person/verification plan. Passing the quiz does not grant actual design approval or flight operation authorization.",
    checks: [
      'Link request ID, usage configuration, test input, expected results, and actual results.',
      'Record tolerance, uncertainty, action in case of failure, and review conditions.',
      'The completion check on this screen is for self-inspection. It does not update the authorization ledger or actual mission status.',
    ],
    source: 'NASA Systems Engineering Handbook; MADE Modeling §2.2',
    url: 'https://www.nasa.gov/reference/systems-engineering-handbook/',
    equationBlocks: [
      {
        name: 'Reproducible change record',
        statement:
          'Change record = Target/Version + Reason + Impact + Reproduction Procedure/Results + Uncertainty + Reviewer',
        purpose:
          'Leave the scope, rationale, results and responsibilities of change traceable to the next team.',
      },
    ],
  },
];

export const HANDOFF_QUIZ: Quiz = {
  title: 'Confirm understanding of task handover',
  questions: [
    {
      id: 'h1',
      prompt: 'Where should Task Cards be tracked?',
      options: [
        'random notes',
        'Engineering model and requirements',
        'Private chat only',
        'color palette',
      ],
      correct: 1,
      explanation:
        'Tasks must be linked to mission objectives, needs, model items, and breakdowns or verification gaps.',
    },
    {
      id: 'h2',
      prompt: 'What should a Knowledge Commit include?',
      options: [
        'Reason for change and basis/reviewer',
        'File name only',
        'AI answers only',
        'Done Emoji',
      ],
      correct: 0,
      explanation:
        'You need to leave behind what has changed and why and what the basis and approval is.',
    },
    {
      id: 'h3',
      prompt: 'What is the appropriate role for AI?',
      options: [
        'Final Design Authority',
        'Analysis/tracking/draft support',
        'Human sign-off replacement',
        'Generating unfounded figures',
      ],
      correct: 1,
      explanation:
        'AI supports the task, but judgment and baseline approval are left to humans.',
    },
    {
      id: 'h4',
      prompt:
        'What should I do if the number of batteries is different between the original documents?',
      options: [
        'Automatically select more numbers',
        'Log conflicts with both sources and check with responsible reviewer',
        'Arbitrarily apply average value',
        'Delete all related items',
      ],
      correct: 1,
      explanation:
        'ConOps is 3 and Modeling documents are 3–4 TBD. Preserve sources and versions and update the baseline by verifying actual design choices and testing rationale.',
    },
    {
      id: 'h5',
      prompt: 'What are the completion conditions for the first ADCS Task?',
      options: [
        'Submit only screen captures',
        'Including basis, flow property, and human sign-off',
        'Skip the quiz',
        'Delete all TBDs',
      ],
      correct: 1,
      explanation:
        'Model content, uncertainties, rationale and human approval must remain together.',
    },
  ],
};
