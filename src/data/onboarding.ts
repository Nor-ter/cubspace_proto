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
    label: 'full satellite',
    title: 'ACRUX-II 1U CubeSat',
    purpose: 'Integrates all subsystems into one mission system.',
    components: ['1U chassis', 'PCB stack', 'solar array', 'antennas'],
    input: 'Solar energy · Ground command · Space environment',
    output: 'Mission data · Telemetry · Controlled satellite behavior',
    status: 'Educational 3D model',
  },
  {
    id: 'adcs' as const,
    label: 'ADCS',
    title: 'Attitude Determination & Control',
    purpose:
      'It uses magnetic field information to reduce rotation. Precision posture orientation requires separate sensor and control performance verification.',
    components: ['Magnetometer A/B', 'B-dot software', 'Deneb magnetorquer'],
    input: 'Regulated power · Magnetic field · Mode command',
    output: 'Magnetic-field data · Control torque',
    status: 'Core learning model',
  },
  {
    id: 'obc' as const,
    label: 'OBC',
    title: 'Onboard Computer',
    purpose:
      'Processes sensor data and executes B-dot algorithms and mission sequences.',
    components: ['Microprocessor', 'Flash', 'FRAM', 'Flight software'],
    input: 'Sensor data · Ground command · Power',
    output: 'Actuator command · Telemetry',
    status: 'Document-based concept/shape confirmation required',
  },
  {
    id: 'eps' as const,
    label: 'EPS',
    title: 'Electrical Power System',
    purpose:
      'It generates, stores, regulates, and distributes power to support ADCS and other loads.',
    components: ['Solar panels', 'MPPT', 'Battery', 'Regulator'],
    input: 'Solar radiation · Load command',
    output: 'Regulated power · Health data',
    status: 'Support subsystem',
  },
  {
    id: 'comms' as const,
    label: 'COMMS',
    title: 'Communications',
    purpose:
      'It connects the ground station and command/telemetry in two directions.',
    components: ['Radio electronics', 'Antenna interface'],
    input: 'Telemetry · Received RF · Power',
    output: 'RF telemetry · Decoded command',
    status: 'Document-based concept/shape confirmation required',
  },
  {
    id: 'structure' as const,
    label: 'Structure',
    title: 'BOX / Structure',
    purpose: 'Aligns and secures hardware and transfers launch loads and heat.',
    components: ['CNC chassis', 'Rails', 'PCB mounts', 'Fastener pairs'],
    input: 'Launch load · Hardware mass · Heat',
    output: 'Maintained geometry · Load path',
    status: 'Educational Geometry',
  },
  {
    id: 'solar' as const,
    label: 'Solar array',
    title: 'Solar surfaces',
    purpose: 'Converts solar radiation energy into DC power.',
    components: ['Body panels', 'Deployable wings', 'Busbars'],
    input: 'Solar radiation',
    output: 'DC electrical power',
    status: 'Construction of educational model · Different from actual design',
  },
  {
    id: 'antennas' as const,
    label: 'Antenna',
    title: 'Antenna & deployment',
    purpose:
      'It radiates and receives RF signals and opens the first terrestrial communication path.',
    components: ['Deploy tray', 'Antenna rods', 'RF coax'],
    input: 'RF signal · Release command',
    output: 'Radiated/received RF',
    status: 'Educational Geometry',
  },
] as const;

export const learningPath = [
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
    'MADE',
    'ADCS functional model',
    'Learn MADE’s Function–Flow–Property relationship.',
  ],
  [
    '06',
    'PROLOG',
    'knowledge relationship reasoning',
    'Create facts and rules and check relationships with queries.',
  ],
  [
    '07',
    'HANDOFF',
    'First Engineering Challenge',
    'Learn the work flow of providing evidence, review, and approval.',
  ],
] as const;

export const adcsNodes = [
  {
    id: 'field',
    name: 'Earth Magnetic Field',
    type: 'environment',
    fn: "Provides the Earth's magnetic field B at its orbital location.",
    flow: 'ENERGY',
    props: ['flux density B (µT)', 'body-frame vector Bx, By, Bz'],
  },
  {
    id: 'sensor',
    name: '3-axis Magnetometer',
    type: 'component',
    fn: 'The magnetic field vector in the coordinate system of the satellite body is measured with time indication.',
    flow: 'DATA',
    props: ['B-body (µT)', 'sample rate (Hz)', 'noise & bias'],
  },
  {
    id: 'filter',
    name: 'Calibration & Filter',
    type: 'software',
    fn: 'Compensates for sensor bias and hard/soft-iron errors and reduces measurement noise.',
    flow: 'DATA',
    props: ['calibrated B (µT)', 'timestamp (s)', 'filter bandwidth (Hz)'],
  },
  {
    id: 'logic',
    name: 'B-dot Controller',
    type: 'software',
    fn: 'Calculate dB/dt to create an opposing magnetic dipole command.',
    flow: 'DATA',
    props: ['dB/dt (T/s)', 'm-command (A·m²)', 'gain K & saturation'],
  },
  {
    id: 'driver',
    name: 'Current drive function (concept)',
    type: 'electronics',
    fn: 'Converts magnetic dipole commands into polarity and limited current for each axis coil.',
    flow: 'ENERGY',
    props: ['coil current Ix, Iy, Iz (A)', 'voltage (V)', 'PWM & duty cycle'],
  },
  {
    id: 'actuator',
    name: 'Deneb magnetic actuator',
    type: 'component',
    fn: 'The driving current creates a magnetic dipole m. You must check the board specifications for actual axis configuration and maximum moment.',
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
    fn: 'The m × B torque changes the rotational state, and under damping control conditions the rotational energy is reduced. Changed posture is reflected in sensor input.',
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
% Educational Review Terms; This is not a flight readiness check.
:- dynamic evidence/1, human_signed/1.
ready(detumble) :- evidence(adcs_test), human_signed(adcs_test).`;

export const sourceCards = [
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
    'MADE–Documentation–Prolog–Task–Sign-off Knowledge Continuity',
  ],
  [
    'Prolog Tutorials',
    'Fact, Rule, Query, recursion and CubeSat relationship model',
  ],
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
  },
  anatomy: {
    title: 'Check understanding of satellite structure',
    questions: [
      {
        id: 'a1',
        prompt: 'What is the main mission of ADCS?',
        options: [
          'power storage',
          'Posture judgment and rotation control',
          'RF modulation',
          'Structural load transfer',
        ],
        correct: 1,
        explanation:
          "ADCS measures the environment and controls the satellite's rotation and attitude.",
      },
      {
        id: 'a2',
        prompt: 'Which component measures the magnetic field vector?',
        options: ['Magnetometer', 'Antenna', 'MPPT', 'Flash memory'],
        correct: 0,
        explanation:
          'Magnetometer outputs local magnetic field vectors as digital data.',
      },
      {
        id: 'a3',
        prompt: 'What is the output of Deneb magnetorquer?',
        options: ['Image file', 'Control torque', 'RF packet', 'Stored charge'],
        correct: 1,
        explanation:
          "The electric current creates a magnetic dipole and interacts with the Earth's magnetic field to produce torque.",
      },
      {
        id: 'a4',
        prompt: 'What is the correct description of a 3D model?',
        options: [
          'Confirmed Flight CAD',
          'Accurate scale manufacturing model',
          'Conceptual model for education',
          'launch approval drawing',
        ],
        correct: 2,
        explanation:
          'The models provided are for exploratory purposes only and should not be treated as actual ACRUX-II definitive CAD.',
      },
      {
        id: 'a5',
        prompt: 'What does BOX/Structure offer in all its hardware?',
        options: [
          'RF decoding',
          'Mounting and load path',
          'B-dot calculation',
          'Battery charge',
        ],
        correct: 1,
        explanation:
          'Structure provides mounting, alignment, protection, load transfer and heat conduction paths.',
      },
    ],
  },
  model: {
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
          'In the provided MADE document, which layer models the Magnetometer?',
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
  },
  made: {
    title: 'Ensure understanding of the MADE functional model',
    questions: [
      {
        id: 'd1',
        prompt: 'What is the basic structure of the MADE functional model?',
        options: [
          'Part → Cost → Owner',
          'Function → Functional Flow → Flow Property',
          'Risk → Schedule → Budget',
          'Input → Document → Meeting',
        ],
        correct: 1,
        explanation:
          'Model features, moving things, and measurable attributes separately.',
      },
      {
        id: 'd2',
        prompt: 'What is the flow type of magnetometer measurements?',
        options: ['Material', 'Energy', 'Data', 'Structure'],
        correct: 2,
        explanation: 'Digitized magnetic field measurements are data flow.',
      },
      {
        id: 'd3',
        prompt: 'What is the flow type of control torque?',
        options: ['Energy', 'Data', 'Material', 'Document'],
        correct: 0,
        explanation:
          'The presented model categorizes mechanical interactions into Energy. Torque itself is not energy, rotational power is the dot product of torque and angular velocity.',
      },
      {
        id: 'd4',
        prompt: 'What is the most appropriate Flow Property?',
        options: ['good performance', 'enough power', 'Torque (N·m)', 'safe'],
        correct: 2,
        explanation:
          'Physical quantities require units, ranges, and measurement conditions. Unitless properties, such as status flags, define their meaning and permitted values.',
      },
      {
        id: 'd5',
        prompt: 'What does B-dot software output?',
        options: [
          'solar power',
          'Magnetorquer command',
          'machine parts',
          'RF antenna',
        ],
        correct: 1,
        explanation:
          'Create a magnetorquer command that processes time-stamped magnetic field measurements.',
      },
    ],
  },
  prolog: {
    title: 'Check your understanding of Prolog inference',
    questions: [
      {
        id: 'p1',
        prompt: 'What syntax expresses a relationship as a fact in Prolog?',
        options: ['Fact', 'Pixel', 'Frame', 'Shader'],
        correct: 0,
        explanation:
          'Fact is a statement about a relationship. In fact, you must separately review whether the information entered in the statement is true or approved in reality.',
      },
      {
        id: 'p2',
        prompt: 'How to derive a new state from several facts?',
        options: ['Asset', 'Rule', 'Canvas', 'Packet'],
        correct: 1,
        explanation:
          'Rule infers new relationships or states by combining facts that satisfy conditions.',
      },
      {
        id: 'p3',
        prompt: 'What capital letter X starts with in Prolog?',
        options: ['fixed constant', 'variable', 'tin', 'error'],
        correct: 1,
        explanation:
          'Names that start with an uppercase letter are variables for which the query finds possible values.',
      },
      {
        id: 'p4',
        prompt: 'What is the correct interpretation of Negation as failure?',
        options: [
          'always false',
          "Couldn't find any evidence to prove it",
          'Test failure confirmed',
          'Approved',
        ],
        correct: 1,
        explanation:
          'It is important not to confuse non-verification with verification failure.',
      },
      {
        id: 'p5',
        prompt: 'What is the role relationship between MADE and Prolog?',
        options: [
          'completely identical to each other',
          'MADE is a system model, Prolog is knowledge and progress inference.',
          'Prolog is a 3D renderer',
          'MADE is a text editor',
        ],
        correct: 1,
        explanation:
          'The two tools perform different roles through model facts.',
      },
    ],
  },
  handoff: {
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
  },
};
