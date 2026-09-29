export type Lesson = {
  id: string;
  label: string;
  title: string;
  lead: string;
  visual:
    | 'continuity'
    | 'orbit'
    | 'anatomy'
    | 'trace'
    | 'made'
    | 'prolog'
    | 'handoff';
  chapters: { title: string; body: string; points: string[] }[];
  source: { label: string; href: string };
};

export const lessons: Lesson[] = [
  {
    id: '01',
    label: 'ORIENT',
    title: 'Why CubSpace',
    visual: 'continuity',
    lead: 'We connect the basis for judgment and system relationships so that mission knowledge does not remain in human memory.',
    chapters: [
      {
        title: 'Link documentation and model rationale',
        body: 'Systems engineering information can be reused when requirements, functionality, physical configuration, and verification results are linked together.',
        points: [
          'Document decisions and assumptions together',
          'Tracking from model elements to test evidence',
          'Record so the next team can see the background to your design judgments',
        ],
      },
      {
        title: 'Onboarding Goals',
        body: 'Instead of memorizing everything, the goal is to learn where to find reliable information and how to stay grounded.',
        points: [
          'Understand mission context',
          'Common model language acquisition',
          'Complete your first assignment and receive a review',
        ],
      },
    ],
    source: {
      label: 'NASA Systems Engineering Handbook',
      href: 'https://www.nasa.gov/reference/systems-engineering-handbook/',
    },
  },
  {
    id: '02',
    label: 'SPACECRAFT',
    title: 'CubeSat and ACRUX-II',
    visual: 'orbit',
    lead: 'Within a small, standardized platform, power, communications, attitude control, and computing operate as a single mission system.',
    chapters: [
      {
        title: '1U is not just about size',
        body: 'The CubeSat standard standardizes the mechanical interface between launch vehicle and satellite, lowering the barrier to entry for development.',
        points: [
          'Approximately 10 cm form factor',
          'Limited mass, power and heat budget',
          'Interfaces between subsystems are the key to design',
        ],
      },
      {
        title: "ACRUX-II's initial success conditions",
        body: 'It must survive separation, slow down, and connect to the ground to collect technical verification data.',
        points: [
          'Deployment detection',
          'ADCS detumbling',
          'Antenna deployment and first contact',
        ],
      },
    ],
    source: {
      label: 'NASA CubeSat 101',
      href: 'https://www.nasa.gov/wp-content/uploads/2017/03/nasa_csli_cubesat_101_508.pdf',
    },
  },
  {
    id: '03',
    label: 'ANATOMY',
    title: 'satellite structure navigation',
    visual: 'anatomy',
    lead: 'We look at how the boards and devices within the structure are connected and what mission functions they perform.',
    chapters: [
      {
        title: 'From structure to function',
        body: 'Chassis supports components, OBC processes status and commands, EPS supplies energy, and ADCS estimates and controls attitude.',
        points: [
          'Structure: load and placement',
          'OBC·COMMS: Commands and data',
          'ADCS: Sensing and Torque Generation',
        ],
      },
      {
        title: 'Find the interface first',
        body: "Seeing what's coming in and what's going out rather than just the part names can help you quickly understand system boundaries.",
        points: [
          'Power: voltage/current',
          'Data: command/telemetry',
          'Physics interface: load, heat transfer, torque (temperature is a state quantity)',
        ],
      },
      {
        title: 'Power and heat meet at the same energy budget',
        body: 'The electrical input power is P=VI and a significant portion of the energy consumed becomes heat. In the single temperature node approximation, C·dT/dt=Qin−Qout (C: J/K, Q: W). In a vacuum, no external air convection can be expected; internal conduction of the structure and surface radiation transfer heat.',
        points: [
          'A change in heater temperature alone does not determine sensor failure. Determine heat capacity, conduction losses, input power and measurement uncertainty.',
          "ConOps' 0°C charging conditions and 6°C heating targets are project document values. The manufacturer specifications and control hysteresis of the selected cell must be verified.",
          'Source: NASA Small Spacecraft Thermal Control — https://www.nasa.gov/smallsat-institute/sst-soa/thermal-control/',
        ],
      },
      {
        title:
          'Antenna deployment and successful communication are two different checks',
        body: 'The deploy switch shows instrument status. Actual communication success must be confirmed by receiving valid packets on the ground. A link budget is required that combines transmit power, antenna gain on both sides, distance, polarization, feed loss, and reception required performance.',
        points: [
          'Link slack is the difference between the reception performance calculated from the same criteria and the required reception performance.',
          'Data rate, modulation/coding, ground station visual time, and antenna direction error are checked together.',
          'Source: NASA Small Spacecraft Communications — https://www.nasa.gov/smallsat-institute/sst-soa/soa-communications/',
        ],
      },
    ],
    source: {
      label: 'NASA Small Spacecraft Systems',
      href: 'https://www.nasa.gov/smallsat-institute/sst-soa/',
    },
  },
  {
    id: '04',
    label: 'SYSTEM MODEL',
    title: 'System Modeling Fundamentals',
    visual: 'trace',
    lead: 'Requirements, functionality, physical implementation, and verification evidence are expressed as a single, traceable network of relationships.',
    chapters: [
      {
        title: 'The model must answer questions',
        body: 'A good model goes beyond what exists and shows why it is needed, what it connects to, and how it can be verified.',
        points: [
          'Requirement: What must be satisfied',
          'Function: What conversion is needed?',
          'Physical: Who does it?',
          'Evidence: How to check',
        ],
      },
      {
        title: 'Boundaries and traceability',
        body: 'Specifying system boundaries clarifies inputs and outputs and makes it easier to find the impact of changes and missed validations.',
        points: [
          'Link from parent purpose to child configuration',
          'Specify interface type',
          'Link verification evidence to each claim',
        ],
      },
    ],
    source: {
      label: 'NASA Systems Engineering Handbook',
      href: 'https://www.nasa.gov/reference/systems-engineering-handbook/',
    },
  },
  {
    id: '05',
    label: 'MADE',
    title: 'ADCS functional model',
    visual: 'made',
    lead: "Read the information and energy conversion of the detumbling process with MADE's Function–Flow–Property structure.",
    chapters: [
      {
        title:
          'Distinguish between the types of blocks and the meaning of connections.',
        body: 'A function converts input into output. This training schematic also includes the environment, device, software, and satellite states, so you need to read the type of each block and its energy, data, and physical interactions.',
        points: [
          'Magnetometer measures magnetic fields',
          'B-dot logic calculates control commands',
          "Driving current → magnetic moment → generates torque by interacting with the Earth's magnetic field",
        ],
      },
      {
        title:
          'Add acceptance criteria and validation conditions to properties',
        body: 'Properties with units such as data rate, voltage, current, and torque must be present to check whether the interfaces are compatible.',
        points: [
          'Match flow type',
          'Record units and tolerances',
          'Indicate source and confirmation status',
        ],
      },
    ],
    source: {
      label: 'PHM Technology — MADe',
      href: 'https://phmtechnology.com/products/maintenance-aware-design-environment-made/',
    },
  },
  {
    id: '06',
    label: 'PROLOG',
    title: 'knowledge relationship reasoning',
    visual: 'prolog',
    lead: 'Express system facts and rules in a queryable form to infer relationships beyond document retrieval.',
    chapters: [
      {
        title: 'Fact, Rule, Query',
        body: 'Prolog stores facts, defines relationships with rules, and searches for a solution that matches the query.',
        points: [
          'Fact: component(adcs, magnetometer)',
          'Rule: contains(X,Y) :- component(X,Y).',
          'Query: ?- contains(adcs, X).',
        ],
      },
      {
        title: "Why it's right for this project",
        body: 'You can even ask backward questions while preserving the relationships, rationale, and constraints of your system model in close to human-readable sentences.',
        points: [
          'Express tracking relationships directly',
          'Query omissions and conflicts',
          'Separately record the results and grounds for use according to the rules',
        ],
      },
    ],
    source: {
      label: 'SWI-Prolog Quick Start',
      href: 'https://www.swi-prolog.org/pldoc/man?section=quickstart',
    },
  },
  {
    id: '07',
    label: 'HANDOFF',
    title: 'First Engineering Challenge',
    visual: 'handoff',
    lead: 'Small model changes that leave evidence and review status complete the first link in the knowledge continuum.',
    chapters: [
      {
        title: 'Even small changes turn into a complete record.',
        body: 'A Task must be accompanied by its purpose, model elements affected, sources used, verification method and approvers.',
        points: [
          'Agree on scope and completion conditions',
          'Model, document, and rule updates',
          'Evidence attached',
          'Peer review and sign-off',
        ],
      },
      {
        title: 'Definition of Done',
        body: "It's done when the next engineer can reproduce the reasons for the decision and track the impact of the change, rather than just saving the file.",
        points: [
          'Link is not broken',
          'Assumptions and TBD are clear',
          'Name of person in charge and next action',
        ],
      },
    ],
    source: {
      label: 'NASA Systems Engineering Handbook',
      href: 'https://www.nasa.gov/reference/systems-engineering-handbook/',
    },
  },
];

export const lessonById = Object.fromEntries(
  lessons.map((lesson) => [lesson.id, lesson]),
);
