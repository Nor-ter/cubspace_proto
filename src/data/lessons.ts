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
    lead: 'Links the basis for decisions to system relationships so that mission knowledge does not live only in people’s memories.',
    chapters: [
      {
        title: 'Linking the evidence behind documents and models',
        body: 'Systems engineering information becomes reusable when requirements, functions, physical configuration and verification results are linked to one another.',
        points: [
          'Record decisions together with assumptions',
          'Trace from model elements to test evidence',
          'Record so that the next team can see the background to design decisions',
        ],
      },
      {
        title: 'Goals of onboarding',
        body: 'Rather than memorising everything, the goal is to learn where to find trustworthy information and how to leave evidence behind.',
        points: [
          'Understand the mission context',
          'Learn the shared modelling language',
          'Complete a first task and have it reviewed',
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
    lead: 'Within a small, standardised platform, power, communications, attitude control and computing operate as one mission system.',
    chapters: [
      {
        title: '1U means more than size',
        body: 'The CubeSat standard lowers the barrier to entry by standardising the mechanical interface between the launch vehicle and the satellite.',
        points: [
          'Form factor of about 10 cm',
          'Limited mass, power and thermal budgets',
          'Interfaces between subsystems are central to the design',
        ],
      },
      {
        title: 'Initial success conditions for ACRUX-II',
        body: 'After separation, the satellite must survive, reduce its rotation and connect with the ground before technology demonstration data can be collected.',
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
    title: 'Exploring the satellite structure',
    visual: 'anatomy',
    lead: 'Examines how the boards and devices inside the structure are connected and which mission functions they perform.',
    chapters: [
      {
        title: 'From structure to function',
        body: 'The chassis supports the components, the OBC processes state and commands, the EPS supplies energy, and the ADCS estimates and controls attitude.',
        points: [
          'Structure: loads and layout',
          'OBC and COMMS: commands and data',
          'ADCS: sensing and torque generation',
        ],
      },
      {
        title: 'Find the interfaces first',
        body: 'Checking what goes in and what comes out, rather than component names, gives a quick understanding of system boundaries.',
        points: [
          'Power: voltage/current',
          'Data: command/telemetry',
          'Physical interfaces: loads, heat transfer, torque (temperature is a state variable)',
        ],
      },
      {
        title: 'Power and heat meet in the same energy balance',
        body: 'Electrical input power is P=VI, and much of the energy consumed becomes heat. In a single-node thermal approximation, C·dT/dt=Q_in−Q_out (C: J/K, Q: W). In vacuum, external air convection cannot be relied upon; heat is transferred by conduction within the structure and by surface radiation.',
        points: [
          'Do not conclude a sensor failure from the heater temperature change alone. Check heat capacity, conduction losses, input power and measurement uncertainty.',
          'The ConOps 0°C charging condition and 6°C heating target are project document values. The manufacturer specification of the selected cell and the control hysteresis must be verified.',
          'Source: NASA Small Spacecraft Thermal Control, https://www.nasa.gov/smallsat-institute/sst-soa/thermal-control/',
        ],
      },
      {
        title: 'Antenna deployment and communication success are separate checks',
        body: 'A deployment switch shows the mechanism state. Actual communication success must be confirmed by receiving a valid packet on the ground. A link budget is needed that sums transmit power, both antenna gains, distance, polarisation and feed losses, and the required receive performance.',
        points: [
          'Link margin is the difference between the receive performance and the required receive performance, calculated on the same basis.',
          'Also check data rate, modulation and coding, ground station visibility time and antenna pointing error.',
          'Source: NASA Small Spacecraft Communications, https://www.nasa.gov/smallsat-institute/sst-soa/soa-communications/',
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
    title: 'System modelling fundamentals',
    visual: 'trace',
    lead: 'Represents requirements, functions, physical implementation and verification evidence as a single traceable network of relationships.',
    chapters: [
      {
        title: 'A model must answer questions',
        body: 'A good model goes beyond what exists to show why it is needed, what it connects to and how it is verified.',
        points: [
          'Requirement: what must be satisfied',
          'Function: what transformation is needed',
          'Physical: what performs it',
          'Evidence: how it is confirmed',
        ],
      },
      {
        title: 'Boundaries and traceability',
        body: 'Stating the system boundary makes inputs and outputs clear and makes it easier to find change impacts and missing verification.',
        points: [
          'Link from top-level purpose to lower-level configuration',
          'State interface types',
          'Link verification evidence to every claim',
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
    lead: 'Reads the information and energy transformations in the detumbling process using MADE’s Function–Flow–Property structure.',
    chapters: [
      {
        title: 'Distinguish block types from the meaning of connections',
        body: 'A function transforms inputs into outputs. This teaching diagram also includes the environment, devices, software and satellite state, so read each block’s type and the energy, data and physical interactions.',
        points: [
          'The magnetometer measures the magnetic field',
          'The B-dot logic computes the control command',
          'Drive current → magnetic moment → interaction with the geomagnetic field generates torque',
        ],
      },
      {
        title: 'Add acceptance criteria and verification conditions to properties',
        body: 'Properties with units, such as data rate, voltage, current and torque, are needed to review whether interfaces are compatible.',
        points: [
          'Matching flow types',
          'Record units and allowable ranges',
          'Show source and confirmation status',
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
    title: 'Reasoning over knowledge relationships',
    visual: 'prolog',
    lead: 'Represents system facts and rules in a queryable form to reason about relationships beyond document search.',
    chapters: [
      {
        title: 'Fact, Rule, Query',
        body: 'Prolog stores facts, defines relationships with rules and then searches for solutions that match a query.',
        points: [
          'Fact: component(adcs, magnetometer)',
          'Rule: contains(X,Y) :- component(X,Y).',
          'Query: ?- contains(adcs, X).',
        ],
      },
      {
        title: 'Why it suits this project',
        body: 'It preserves the relationships, evidence and constraints of the system model in a form close to human-readable sentences, while also allowing questions in the reverse direction.',
        points: [
          'Express trace relationships directly',
          'Query for omissions and conflicts',
          'Record rule-based results and their supporting evidence separately',
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
    title: 'First engineering task',
    visual: 'handoff',
    lead: 'Completes the first link of knowledge continuity with a small model change that leaves evidence and review status behind.',
    chapters: [
      {
        title: 'Even a small change becomes a complete record',
        body: 'A task must record its purpose, the affected model elements, the sources used, the verification method and the approver.',
        points: [
          'Agree on scope and completion conditions',
          'Update models, documents and rules',
          'Attach evidence',
          'Peer review and sign-off',
        ],
      },
      {
        title: 'Definition of done',
        body: 'Done does not mean saving a file; it means the next engineer can reproduce the reasoning behind a decision and trace the impact of a change.',
        points: [
          'No broken links',
          'Assumptions and TBDs are clear',
          'Owner and next task are stated',
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
