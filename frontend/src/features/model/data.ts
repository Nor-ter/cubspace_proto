import type { EngineeringNote } from '@/types/engineering';
import type { Quiz } from '@/types/quiz';

const FORMULAS = [
  '\\lVert\\boldsymbol\\omega\\rVert<\\omega_{\\mathrm{lim}},\\qquad t\\leq T_{\\mathrm{lim}}',
];

export const MODEL_NOTES: EngineeringNote[] = [
  {
    id: '04',
    section: 'model',
    title:
      "Don't treat features, requirements, and implementation as the same thing",
    principle:
      'A function is a transformation or action to be performed, and requirements are measurable conditions that the function must satisfy. Hardware and software are implementations with assigned functions. Multiple functions can be linked to one part, and a function can be linked to multiple parts.',
    equation:
      'Requirement example: Achieve ‖ω‖ < ωlim within Tlim under specified initial conditions.\nFunction: Rotation reduction / Implementation: Sensor + OBC control SW + magnetic actuator',
    example:
      'We do not fill ωlim and Tlim with arbitrary fixed values. ConOps §3.2 suggests <5°/s, but whether it is vector size or axis-specific, holding time and verification conditions must be checked separately. A link without success criteria alone will not complete the verification.',
    checks: [
      'Part-pair < Component < Subsystem < System is a modeling convention in the provided system model and is not a universal law of physics.',
      'B-dot software assigns to OBCs and displays connections to ADCS functions. Distinguish between functional affiliation and physical mounting location.',
      'Number of batteries: 3 for ConOps §2, 3–4 TBD in parallel for Modeling §1. The camera is also TBD and will not be marked as a confirmed configuration prior to verification.',
    ],
    source:
      'MADE Modeling §1, §2.2; ConOps §3.2; NASA Systems Engineering Handbook',
    url: 'https://www.nasa.gov/reference/systems-engineering-handbook/',
    equationBlocks: [
      {
        name: 'Detumbling acceptance condition',
        formula: FORMULAS[0],
        purpose:
          'Expresses whether the rotation state has reached the allowable limit within a given time.',
        notation:
          'ω: Angular velocity (rad/s or °/s) ωlim: Tolerance limit Tlim: Completion time limit',
      },
      {
        name: 'Function-to-implementation allocation',
        statement:
          'Function: Rotation reduction / Implementation: Sensor + OBC control SW + magnetic actuator',
        purpose:
          'Distinguish between necessary functions and the hardware/software that performs those functions.',
      },
    ],
  },
];

export const MODEL_QUIZ: Quiz = {
  title: 'Ensure understanding of the system model',
  questions: [
    {
      id: 's1',
      prompt:
        'What is the key reason why a System Model is different from a simple picture?',
      options: [
        'There are a lot of colors',
        'Requirements, functions, physics, and evidence are connected',
        'The file is large',
        "Because it's 3D",
      ],
      correct: 1,
      explanation:
        'The value of models lies in being able to track and interrogate items and relationships.',
    },
    {
      id: 's2',
      prompt:
        'What is the function that turns input into output and what perspective represents the transformation?',
      options: ['Requirement', 'Function', 'Physical', 'Evidence'],
      correct: 1,
      explanation:
        'The Function perspective describes the transformations and behaviors that the system must perform.',
    },
    {
      id: 's3',
      prompt:
        'In the provided system model, which layer models the Magnetometer?',
      options: ['Part', 'Part-pair', 'Component', 'System'],
      correct: 2,
      explanation:
        'The provided model defines the magnetometer as a Component with inputs and outputs. The level of decomposition is determined based on the model purpose and available evidence.',
    },
    {
      id: 's4',
      prompt:
        'What is the appropriate layer to express the combination of Bolt and Nut?',
      options: ['Part-pair', 'Component', 'Subsystem', 'System'],
      correct: 0,
      explanation:
        'It is a part-pair because the two physical parts interact to create a fastening function.',
    },
    {
      id: 's5',
      prompt: 'How does traceability benefit design changes?',
      options: [
        'Delete all tests',
        'Identify affected features, tests, and documentation',
        'Automatically approve figures',
        'Remove human review',
      ],
      correct: 1,
      explanation:
        'Finding the impact of changes along connections is an important goal of traceability.',
    },
  ],
};
