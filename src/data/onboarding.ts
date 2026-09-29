export type SubsystemKey =
  | 'all'
  | 'structure'
  | 'solar'
  | 'eps'
  | 'obc'
  | 'comms'
  | 'adcs'
  | 'payload'
  | 'antennas';

export const subsystems = [
  {
    id: 'all' as const,
    label: 'Whole satellite',
    title: 'ACRUX-II 1U CubeSat',
    purpose: 'Integrates all subsystems into one mission system.',
    components: ['1U chassis', 'PCB stack', 'solar array', 'antennas'],
    input: 'Solar energy · Ground command · Space environment',
    output: 'Mission data · Telemetry · Controlled satellite behaviour',
    status: 'Teaching 3D model',
  },
  {
    id: 'adcs' as const,
    label: 'ADCS',
    title: 'Attitude Determination & Control',
    purpose:
      'Uses magnetic field information to reduce rotation. Precise attitude pointing requires separate sensor and control performance verification.',
    components: ['Magnetometer A/B', 'B-dot software', 'Deneb magnetorquer'],
    input: 'Regulated power · Magnetic field · Mode command',
    output: 'Magnetic-field data · Control torque',
    status: 'Core learning model',
  },
  {
    id: 'obc' as const,
    label: 'OBC',
    title: 'Onboard Computer',
    purpose: 'Processes sensor data and runs the B-dot algorithm and mission sequence.',
    components: ['Microprocessor', 'Flash', 'FRAM', 'Flight software'],
    input: 'Sensor data · Ground command · Power',
    output: 'Actuator command · Telemetry',
    status: 'Document-based concept · configuration to be confirmed',
  },
  {
    id: 'eps' as const,
    label: 'EPS',
    title: 'Electrical Power System',
    purpose: 'Generates, stores, regulates and distributes power to support the ADCS and other loads.',
    components: ['Solar panels', 'MPPT', 'Battery', 'Regulator'],
    input: 'Solar radiation · Load command',
    output: 'Regulated power · Health data',
    status: 'Supporting subsystem',
  },
  {
    id: 'comms' as const,
    label: 'COMMS',
    title: 'Communications',
    purpose: 'Provides a two-way command and telemetry link with the ground station.',
    components: ['Radio electronics', 'Antenna interface'],
    input: 'Telemetry · Received RF · Power',
    output: 'RF telemetry · Decoded command',
    status: 'Document-based concept · configuration to be confirmed',
  },
  {
    id: 'structure' as const,
    label: 'Structure',
    title: 'BOX / Structure',
    purpose: 'Aligns and secures hardware and transfers launch loads and heat.',
    components: ['CNC chassis', 'Rails', 'PCB mounts', 'Fastener pairs'],
    input: 'Launch load · Hardware mass · Heat',
    output: 'Maintained geometry · Load path',
    status: 'Teaching geometry',
  },
  {
    id: 'solar' as const,
    label: 'Solar array',
    title: 'Solar surfaces',
    purpose: 'Converts solar radiant energy into DC power.',
    components: ['Body panels', 'Deployable wings', 'Busbars'],
    input: 'Solar radiation',
    output: 'DC electrical power',
    status: 'Teaching model configuration · differs from the actual design',
  },
  {
    id: 'antennas' as const,
    label: 'Antenna',
    title: 'Antenna & deployment',
    purpose: 'Radiates and receives RF signals and opens the first ground communication path.',
    components: ['Deploy tray', 'Antenna rods', 'RF coax'],
    input: 'RF signal · Release command',
    output: 'Radiated/received RF',
    status: 'Teaching geometry',
  },
] as const;

export const learningPath = [
  [
    '01',
    'ORIENT',
    'Why CubSpace',
    'Mission knowledge must remain even when people change.',
  ],
  [
    '02',
    'SPACECRAFT',
    'CubeSat and ACRUX-II',
    'Examines the 1U platform and mission success conditions.',
  ],
  [
    '03',
    'ANATOMY',
    'Exploring the satellite structure',
    'Finds hardware and interfaces in the 3D model.',
  ],
  [
    '04',
    'SYSTEM MODEL',
    'System modelling fundamentals',
    'Examines the links between requirements, functions, hardware and verification.',
  ],
  [
    '05',
    'MADE',
    'ADCS functional model',
    'Learns MADE’s Function–Flow–Property relationships.',
  ],
  [
    '06',
    'PROLOG',
    'Reasoning over knowledge relationships',
    'Writes facts and rules and checks relationships with a query.',
  ],
  [
    '07',
    'HANDOFF',
    'First engineering task',
    'Learns the workflow that leaves evidence, review and approval behind.',
  ],
] as const;

export const adcsNodes = [
  {
    id: 'field',
    name: 'Earth Magnetic Field',
    type: 'environment',
    fn: 'Provides the geomagnetic field B at the orbital position.',
    flow: 'ENERGY',
    props: ['flux density B (µT)', 'body-frame vector Bx, By, Bz'],
  },
  {
    id: 'sensor',
    name: '3-axis Magnetometer',
    type: 'component',
    fn: 'Measures the magnetic field vector in the satellite body frame with a timestamp.',
    flow: 'DATA',
    props: ['B-body (µT)', 'sample rate (Hz)', 'noise & bias'],
  },
  {
    id: 'filter',
    name: 'Calibration & Filter',
    type: 'software',
    fn: 'Corrects sensor bias and hard/soft-iron errors and reduces measurement noise.',
    flow: 'DATA',
    props: ['calibrated B (µT)', 'timestamp (s)', 'filter bandwidth (Hz)'],
  },
  {
    id: 'logic',
    name: 'B-dot Controller',
    type: 'software',
    fn: 'Computes dB/dt and produces a magnetic dipole command in the opposite direction.',
    flow: 'DATA',
    props: ['dB/dt (T/s)', 'm-command (A·m²)', 'gain K & saturation'],
  },
  {
    id: 'driver',
    name: 'Current drive function (concept)',
    type: 'electronics',
    fn: 'Converts the magnetic dipole command into polarity and limited current for each axis coil.',
    flow: 'ENERGY',
    props: ['coil current Ix, Iy, Iz (A)', 'voltage (V)', 'PWM & duty cycle'],
  },
  {
    id: 'actuator',
    name: 'Deneb magnetorquer',
    type: 'component',
    fn: 'Produces a magnetic dipole m from the drive current. The actual axis configuration and maximum moment must be checked against the board specification.',
    flow: 'ENERGY',
    props: [
      'dipole moment m (A·m²)',
      'coil temperature (°C)',
      'axis alignment',
    ],
  },
  {
    id: 'motion',
    name: 'Rigid-body Dynamics',
    type: 'spacecraft state',
    fn: 'The m × B torque changes the rotational state, and rotational energy decreases under damping control conditions. The changed attitude is reflected in the sensor input.',
    flow: 'ENERGY',
    props: ['torque τ=m×B (N·m)', 'angular rate ω (°/s)', 'detumble threshold'],
  },
] as const;

export const prologFacts = `subsystem(acrux2, adcs).
component(adcs, magnetometer).
component(adcs, deneb_magnetorquer).
measures(magnetometer, magnetic_field).
commands(b_dot, deneb_magnetorquer).
requires(detumble_complete, adcs_operational).

contains(X, Y) :- subsystem(X, Y).
contains(X, Y) :- component(X, Y).
contains(X, Y) :- subsystem(X, Z), contains(Z, Y).
% Teaching review condition; not a flight readiness decision.
:- dynamic evidence/1, human_signed/1.
ready(detumble) :- evidence(adcs_test), human_signed(adcs_test).`;

export const sourceCards = [
  ['ACRUX_2_ConOps.pdf', 'Mission phases, early operations, detumbling, communications and operating assumptions'],
  [
    'ACRUX-2 CubeSat MADE Modeling.docx',
    'Hierarchy, functions, Material/Energy/Data flow and measured properties',
  ],
  [
    'Product & Engineering Specification',
    'Learning sequence for new engineers, UX and technical boundaries',
  ],
  [
    'Project CubSpace Overview',
    'MADE–Documentation–Prolog–Task–Sign-off knowledge continuity',
  ],
  ['Prolog Tutorials', 'Fact, Rule, Query, recursion and the CubeSat relationship model'],
] as const;

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
};

export const quizOrder = [
  'mission',
  'anatomy',
  'model',
  'made',
  'prolog',
  'handoff',
] as const;
export type QuizSection = (typeof quizOrder)[number];

export const quizzes: Record<
  QuizSection,
  { title: string; questions: QuizQuestion[] }
> = {
  mission: {
    title: 'Mission understanding check',
    questions: [
      {
        id: 'm1',
        prompt: 'What is the core problem CubSpace aims to solve?',
        options: [
          'Insufficient launch vehicle performance',
          'Loss of knowledge as students change over',
          'Increase in satellite size',
          'Ground station frequency selection',
        ],
        correct: 1,
        explanation:
          'CubSpace ensures that mission knowledge and the basis for decisions carry forward even when engineers change.',
      },
      {
        id: 'm2',
        prompt: 'What is the primary success criterion in the ConOps?',
        options: [
          'Camera imaging',
          'Completing the deployment sequence and establishing ground communication',
          'A new CAD model',
          'Translating all documents',
        ],
        correct: 1,
        explanation:
          'Primary success in ConOps §1.1 is completing the deployment sequence and establishing communication. Collecting demonstration data is a secondary success criterion, and the low-power exception procedure is defined separately.',
      },
      {
        id: 'm3',
        prompt: 'What is the core technical example in this onboarding?',
        options: [
          'EPS heater',
          'Payload camera',
          'ADCS detumbling',
          'Launch vehicle',
        ],
        correct: 2,
        explanation:
          'The central example is ADCS detumbling, running from magnetic field measurement through B-dot to the Deneb magnetorquer.',
      },
      {
        id: 'm4',
        prompt: 'What must be left behind so that the next team can reproduce the same decision?',
        options: [
          'Record only the conclusion',
          'Sources, assumptions, conditions and verification results',
          'Save only presentation figures',
          'Record only the owner’s name',
        ],
        correct: 1,
        explanation:
          'Only by leaving the applicable conditions and basis of a decision can it be reviewed whether the conclusion is still valid when the design changes.',
      },
      {
        id: 'm5',
        prompt: 'What is required before mission knowledge is added to the baseline?',
        options: [
          'Approval by AI alone',
          'Human review and sign-off',
          'A design change',
          'Creating a new account',
        ],
        correct: 1,
        explanation:
          'AI can assist, but authoritative mission-state changes require human review and approval.',
      },
    ],
  },
  anatomy: {
    title: 'Satellite structure understanding check',
    questions: [
      {
        id: 'a1',
        prompt: 'What is the main task of the ADCS?',
        options: [
          'Storing power',
          'Attitude determination and rotation control',
          'RF modulation',
          'Transferring structural loads',
        ],
        correct: 1,
        explanation: 'The ADCS measures the environment and controls the satellite’s rotation and attitude.',
      },
      {
        id: 'a2',
        prompt: 'Which component measures the magnetic field vector?',
        options: ['Magnetometer', 'Antenna', 'MPPT', 'Flash memory'],
        correct: 0,
        explanation:
          'The magnetometer outputs the local magnetic field vector as digital data.',
      },
      {
        id: 'a3',
        prompt: 'What is the output of the Deneb magnetorquer?',
        options: ['Image file', 'Control torque', 'RF packet', 'Stored charge'],
        correct: 1,
        explanation:
          'It produces a magnetic dipole from current, which interacts with the geomagnetic field to generate torque.',
      },
      {
        id: 'a4',
        prompt: 'Which statement about the 3D model is correct?',
        options: [
          'Finalised flight CAD',
          'A manufacturing model at exact scale',
          'A teaching concept model',
          'A launch approval drawing',
        ],
        correct: 2,
        explanation:
          'The provided model is for exploration and must not be treated as the actual finalised ACRUX-II CAD.',
      },
      {
        id: 'a5',
        prompt: 'What does the BOX / Structure provide to all hardware?',
        options: [
          'RF decoding',
          'Mounting and load path',
          'B-dot calculation',
          'Battery charge',
        ],
        correct: 1,
        explanation:
          'The structure provides mounting, alignment, protection, load transfer and heat conduction paths.',
      },
    ],
  },
  model: {
    title: 'System model understanding check',
    questions: [
      {
        id: 's1',
        prompt: 'What is the key reason a system model differs from a simple diagram?',
        options: [
          'It has more colours',
          'Requirements, functions, physical items and evidence are linked',
          'The file is larger',
          'Because it is 3D',
        ],
        correct: 1,
        explanation:
          'The value of a model lies in being able to trace and query items and relationships.',
      },
      {
        id: 's2',
        prompt: 'Which view represents the functions and transformations that turn inputs into outputs?',
        options: ['Requirement', 'Function', 'Physical', 'Evidence'],
        correct: 1,
        explanation:
          'The Function view describes the transformations and behaviour the system must perform.',
      },
      {
        id: 's3',
        prompt: 'At which level is the magnetometer modelled in the provided MADE document?',
        options: ['Part', 'Part-pair', 'Component', 'System'],
        correct: 2,
        explanation:
          'The provided model defines the magnetometer as a Component with inputs and outputs. The level of decomposition is chosen according to the model’s purpose and the available evidence.',
      },
      {
        id: 's4',
        prompt: 'Which level is appropriate for representing a bolt and nut joint?',
        options: ['Part-pair', 'Component', 'Subsystem', 'System'],
        correct: 0,
        explanation:
          'It is a Part-pair, because two physical Parts interact to create the fastening function.',
      },
      {
        id: 's5',
        prompt: 'What benefit does traceability provide when the design changes?',
        options: [
          'Deletes all tests',
          'Identifies affected functions, tests and documents',
          'Automatically approves values',
          'Removes human review',
        ],
        correct: 1,
        explanation:
          'Finding change impacts by following links is an important purpose of traceability.',
      },
    ],
  },
  made: {
    title: 'MADE functional model understanding check',
    questions: [
      {
        id: 'd1',
        prompt: 'What is the basic structure of a MADE functional model?',
        options: [
          'Part → Cost → Owner',
          'Function → Functional Flow → Flow Property',
          'Risk → Schedule → Budget',
          'Input → Document → Meeting',
        ],
        correct: 1,
        explanation:
          'It models functions, what moves and measurable properties separately.',
      },
      {
        id: 'd2',
        prompt: 'What is the Flow Type of the magnetometer measurement?',
        options: ['Material', 'Energy', 'Data', 'Structure'],
        correct: 2,
        explanation: 'A digitised magnetic field measurement is a Data flow.',
      },
      {
        id: 'd3',
        prompt: 'What is the Flow Type of the control torque?',
        options: ['Energy', 'Data', 'Material', 'Document'],
        correct: 0,
        explanation:
          'The provided model classifies mechanical interaction as Energy. Torque itself is not energy, and rotational power is the dot product of torque and angular velocity.',
      },
      {
        id: 'd4',
        prompt: 'Which is most appropriate as a Flow Property?',
        options: ['Good performance', 'Sufficient force', 'Torque (N·m)', 'Safe'],
        correct: 2,
        explanation:
          'Physical quantities need units, ranges and measurement conditions. For unitless properties such as state flags, define their meaning and allowed values.',
      },
      {
        id: 'd5',
        prompt: 'What does the B-dot software output?',
        options: ['Sunlight', 'Magnetorquer command', 'Mechanical part', 'RF antenna'],
        correct: 1,
        explanation:
          'It processes timestamped magnetic field measurements to produce a magnetorquer command.',
      },
    ],
  },
  prolog: {
    title: 'Prolog reasoning understanding check',
    questions: [
      {
        id: 'p1',
        prompt: 'Which construct expresses a relationship as a fact in Prolog?',
        options: ['Fact', 'Pixel', 'Frame', 'Shader'],
        correct: 0,
        explanation:
          'A Fact is a statement about a relationship. Whether what is entered as a fact is true in reality, or has been approved, must be reviewed separately.',
      },
      {
        id: 'p2',
        prompt: 'What derives a new state from several facts?',
        options: ['Asset', 'Rule', 'Canvas', 'Packet'],
        correct: 1,
        explanation:
          'A Rule combines facts that satisfy its conditions to infer a new relationship or state.',
      },
      {
        id: 'p3',
        prompt: 'In Prolog, what is X, which starts with an upper-case letter?',
        options: ['A fixed constant', 'A variable', 'A comment', 'An error'],
        correct: 1,
        explanation:
          'A name starting with an upper-case letter is a variable for which a query finds possible values.',
      },
      {
        id: 'p4',
        prompt: 'What is the correct interpretation of negation as failure?',
        options: [
          'Always false',
          'No evidence could be found to prove it',
          'Test failure confirmed',
          'Approval complete',
        ],
        correct: 1,
        explanation: 'It is important not to confuse unverified with failed verification.',
      },
      {
        id: 'p5',
        prompt: 'How do the roles of MADE and Prolog relate?',
        options: [
          'They are completely identical',
          'MADE is the system model; Prolog reasons over knowledge and progress',
          'Prolog is a 3D renderer',
          'MADE is a text editor',
        ],
        correct: 1,
        explanation:
          'The two tools play different roles, connected through model facts.',
      },
    ],
  },
  handoff: {
    title: 'Task handoff understanding check',
    questions: [
      {
        id: 'h1',
        prompt: 'What should a Task Card be traced to?',
        options: [
          'Arbitrary notes',
          'The engineering model and requirements',
          'Personal chats only',
          'A colour palette',
        ],
        correct: 1,
        explanation:
          'Work must be linked to mission objectives, requirements, model items, and failure or verification gaps.',
      },
      {
        id: 'h2',
        prompt: 'What should a Knowledge Commit include?',
        options: [
          'The reason for the change, its evidence and the reviewer',
          'Only the file name',
          'Only the AI answer',
          'A completion emoji',
        ],
        correct: 0,
        explanation:
          'It must record what changed and why, and what evidence and approval exist.',
      },
      {
        id: 'h3',
        prompt: 'What is the appropriate role of AI?',
        options: [
          'Final design authority',
          'Supporting analysis, tracing and drafting',
          'Replacing human sign-off',
          'Generating values without evidence',
        ],
        correct: 1,
        explanation:
          'AI supports the work, but decisions and baseline approval are the responsibility of people.',
      },
      {
        id: 'h4',
        prompt: 'How should it be handled if source documents disagree on the number of batteries?',
        options: [
          'Automatically choose the larger number',
          'Record both sources and the conflict, and confirm with the responsible reviewer',
          'Apply an arbitrary average',
          'Delete all related items',
        ],
        correct: 1,
        explanation:
          'The ConOps states 3, and the Modeling document states 3–4, TBD. Preserve the sources and versions, and update the baseline after confirming the actual design choice and test evidence.',
      },
      {
        id: 'h5',
        prompt: 'What is the completion condition for the first ADCS task?',
        options: [
          'Submit only a screenshot',
          'Includes evidence, Flow Properties and human sign-off',
          'Skip the quiz',
          'Delete all TBDs',
        ],
        correct: 1,
        explanation:
          'The model content, uncertainties, evidence and human approval must all be recorded together.',
      },
    ],
  },
};
