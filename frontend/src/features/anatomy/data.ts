import type { EngineeringNote } from '@/types/engineering';
import type { Quiz } from '@/types/quiz';

export const SUBSYSTEMS = [
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

const FORMULAS = [
  '\\boldsymbol H=\\mathbf I\\boldsymbol\\omega',
  '\\mathbf I\\frac{\\mathrm{d}\\boldsymbol\\omega}{\\mathrm{d}t}+\\boldsymbol\\omega\\times(\\mathbf I\\boldsymbol\\omega)=\\boldsymbol\\tau_{\\mathrm{ext}}',
  '\\boldsymbol\\tau_{\\mathrm{mag}}=\\boldsymbol m\\times\\boldsymbol B,\\qquad |\\boldsymbol\\tau|=|\\boldsymbol m|\\,|\\boldsymbol B|\\sin\\theta',
];

export const ANATOMY_NOTES: EngineeringNote[] = [
  {
    id: '03',
    section: 'anatomy',
    title: 'External torque is required to reduce rotation',
    principle:
      'When a rigid body is not subjected to external torque, its angular momentum is conserved in an inertial frame. The mere fact that the center of mass is different from the geometric center does not automatically increase spin. Actual disturbance torques such as gravity gradient, aerodynamic force, solar radiation pressure, and residual magnetic moment must be reviewed.',
    equation:
      'H = Iω;  I·dω/dt + ω×(Iω) = τexternal\nτself = m×B;  |τ| = |m||B|sinθ',
    example:
      'Educational example: If m=0.1 A·m², B=30 µT and perpendicular to each other, the torque is 3 µN·m. If parallel, it is 0. These are not Deneb board performance values. Complete detumbling does not imply precise 3-axis orientation, as magnetic field directional torque cannot be created instantaneously.',
    workedExample: {
      assumption: 'Educational assumptions Deneb Not actual performance values',
      inputFormula:
        'm=0.1\\,\\mathrm A\\!\\cdot\\!\\mathrm m^2,\\quad B=30\\,\\mu\\mathrm T,\\quad \\theta=90^\\circ',
      calculationFormula:
        '|\\tau|=|m||B|\\sin\\theta=0.1\\times(30\\times10^{-6})\\times\\sin90^\\circ\\,\\mathrm N\\!\\cdot\\!\\mathrm m',
      resultFormula:
        '|\\tau|=3\\times10^{-6}\\,\\mathrm N\\!\\cdot\\!\\mathrm m=3\\,\\mu\\mathrm N\\!\\cdot\\!\\mathrm m',
      limitations: [
        { formula: 'm\\perp B', label: 'Maximum torque' },
        { formula: 'm\\parallel B', label: 'Zero torque' },
      ],
      meaning: [
        '3 µN·m is the amount of instantaneous torque generated under given conditions.',
        'This torque value alone cannot determine detumbling performance.',
      ],
      bridge:
        "To evaluate detumbling, we need to calculate how this torque changes the satellite's rotational state over time.",
      practice: [
        {
          index: '01',
          title: 'Rotational response',
          formula: '\\tau=I\\alpha',
          description:
            "Torque and the satellite's inertia determine how quickly its rotational state changes.",
        },
        {
          index: '02',
          title: 'Real spacecraft',
          formula: '\\text{3-axis inertia matrix}+\\text{axis coupling}',
          description:
            'A real satellite rotates not on one independent axis, but on three axes that are coupled together.',
        },
        {
          index: '03',
          title: 'Engineering simulation',
          formula: '\\text{MATLAB}/\\text{Simulink}',
          description:
            '3-axis dynamics are calculated over time to verify ω(t), attitude response, and detumbling behavior.',
        },
      ],
    },
    checks: [
      "ConOps' three-axis detumbling energy of 1.083 Wh is three times that of the single-axis estimate. It cannot be used as a guaranteed value without verification considering the coupled rotational dynamics and current limits. The rotation state is recorded in angular velocity (rad/s or °/s), the inertia matrix in kg·m², and the torque in N·m.",
      'A single vector at one point in the magnetometer cannot uniquely determine all postural degrees of freedom. Check reference vectors, sensors, estimators and observability.',
      "The GLB's deployable wing is a feature included in the educational 3D model. This is not a model that reproduces the five panel + antenna combination surfaces in Modeling §1 of the original text with confirmed CAD.",
    ],
    reviewChecks: [
      {
        label: 'Energy Estimate',
        text: "ConOps' three-axis detumbling energy of 1.083 Wh is three times that of the single-axis estimate. It cannot be used as a guaranteed value without verification considering the coupled rotational dynamics and current limits.",
      },
      {
        label: 'Units to Record',
        text: 'The rotation state is recorded in angular velocity (rad/s or °/s), the inertia matrix in kg·m², and the torque in N·m.',
      },
      {
        label: 'Attitude Observability Limit',
        text: 'A single vector at one point in the magnetometer cannot uniquely determine all postural degrees of freedom. Check reference vectors, sensors, estimators and observability.',
      },
      {
        label: '3D Model Limitation',
        text: "The GLB's deployable wing is a feature included in the educational 3D model. This is not a model that reproduces the five panel + antenna combination surfaces in Modeling §1 of the original text with confirmed CAD.",
      },
    ],
    source: 'Review spin description in ConOps §5.1; NASA Small Spacecraft GNC',
    url: 'https://www.nasa.gov/smallsat-institute/sst-soa/guidance-navigation-and-control/',
    collapseEquations: true,
    equationBlocks: [
      {
        name: 'Angular momentum',
        formula: FORMULAS[0],
        purpose:
          "We relate the satellite's inertial properties and its current rotation state to its angular momentum.",
        notation:
          'H: Angular momentum (kg·m²/s) · I: Inertia matrix (kg·m²) · ω: Angular velocity (rad/s)',
      },
      {
        name: 'Rigid-body rotational dynamics',
        formula: FORMULAS[1],
        purpose:
          "Describes how external torque changes the satellite's angular velocity over time.",
        notation:
          'I: Inertia matrix (kg·m²) · ω: Angular velocity (rad/s) · τext: External torque (N·m) · t: Time (s)',
      },
      {
        name: 'Magnetic torque',
        formula: FORMULAS[2],
        purpose:
          'Calculate the torque produced by the commanded magnetic dipole and the environmental magnetic field.',
        notation:
          'm: magnetic dipole (A·m²) · B: magnetic field (T) · θ: angle between two vectors · τmag: magnetic torque (N·m)',
      },
    ],
  },
];

export const ANATOMY_QUIZ: Quiz = {
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
};
