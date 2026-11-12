import type { QuizQuestion } from '@/types/course';
import type { SubsystemId } from './viewer/types';

// Content sources
// - Descriptions, objectives, tasks, outcomes, references and the mission quiz:
//   CubeSat_Anatomy v1.0.1 `src/content.ts` (guide dated 12 November 2026).
// - Tool and skill priorities, ACRUX-II items and REF / TBD / VERIFY notes:
//   Standup-NOV-WK2 §C.3.
// - Video clips: ACRUX2_Subsystem_YouTube_Clips_10-15s.md (13 November 2026).

export type Reference = { id: number; title: string; url: string };

export const REFERENCES: Record<number, Reference> = {
  1: {
    id: 1,
    title: 'Cal Poly, CubeSat Design Specification, Rev. 14.1 (2022).',
    url: 'https://www.nasa.gov/wp-content/uploads/2018/01/cubesatdesignspecificationrev14_12022-02-09.pdf',
  },
  2: {
    id: 2,
    title: 'NASA, Small Spacecraft Technology: Introduction (2026).',
    url: 'https://www.nasa.gov/smallsat-institute/sst-soa/introduction/',
  },
  3: {
    id: 3,
    title: 'NASA, CubeSat 101 (2017).',
    url: 'https://science.nasa.gov/wp-content/uploads/2023/06/nasa_csli_cubesat_101_508.pdf',
  },
  4: {
    id: 4,
    title: 'NASA, Small Spacecraft Technology: Deorbit Systems (2026).',
    url: 'https://www.nasa.gov/smallsat-institute/sst-soa/deorbit-systems/',
  },
  5: {
    id: 5,
    title:
      'NASA, Small Spacecraft Technology: Structures, Materials, and Mechanisms (2026).',
    url: 'https://www.nasa.gov/smallsat-institute/sst-soa/structures-materials-and-mechanisms/',
  },
  6: {
    id: 6,
    title: 'NASA, Small Spacecraft Technology: Thermal Control (2026).',
    url: 'https://www.nasa.gov/smallsat-institute/sst-soa/thermal-control/',
  },
  7: {
    id: 7,
    title: 'NASA, Small Spacecraft Technology: Power (2026).',
    url: 'https://www.nasa.gov/smallsat-institute/sst-soa/power-subsystems/',
  },
  8: {
    id: 8,
    title:
      'NASA, Small Spacecraft Technology: Guidance, Navigation, and Control (2026).',
    url: 'https://www.nasa.gov/smallsat-institute/sst-soa/guidance-navigation-and-control/',
  },
  9: {
    id: 9,
    title: 'Peraire and Widnall, MIT 16.07 Dynamics, Lecture 28 (2009).',
    url: 'https://ocw.mit.edu/courses/16-07-dynamics-fall-2009/resources/mit16_07f09_lec28/',
  },
  10: {
    id: 10,
    title: 'NASA, Small Spacecraft Technology: Avionics (2026).',
    url: 'https://www.nasa.gov/smallsat-institute/sst-soa/small-spacecraft-avionics/',
  },
  11: {
    id: 11,
    title: 'ESA, Onboard Computers and Data Handling (undated).',
    url: 'https://www.esa.int/articles/onboard-computers-and-data-handling',
  },
  12: {
    id: 12,
    title: 'NASA, Small Spacecraft Technology: Communications (2026).',
    url: 'https://www.nasa.gov/smallsat-institute/sst-soa/soa-communications/',
  },
  13: {
    id: 13,
    title:
      'NASA, Small Spacecraft Technology: Ground Data Systems and Mission Operations (2026).',
    url: 'https://www.nasa.gov/smallsat-institute/sst-soa/ground-data-systems-and-mission-operations/',
  },
  14: {
    id: 14,
    title:
      'ACMA, Launch or communicate with a small satellite or CubeSat (2026).',
    url: 'https://www.acma.gov.au/launch-or-communicate-small-satellite-or-cubesat',
  },
  15: {
    id: 15,
    title: 'NASA, Systems Engineering Handbook, Rev. 2 (2016).',
    url: 'https://www.nasa.gov/reference/systems-engineering-handbook/',
  },
  16: {
    id: 16,
    title: 'NASA/JPL, PREFIRE mission.',
    url: 'https://www.jpl.nasa.gov/missions/prefire/',
  },
  17: {
    id: 17,
    title: 'ESA, OPS-SAT mission.',
    url: 'https://www.esa.int/Enabling_Support/Operations/OPS-SAT',
  },
};

export type TheoryVideo = {
  youtubeId: string;
  title: string;
  channel: string;
  /** Clip window in seconds. Omitted while the edit point is not chosen. */
  start?: number;
  end?: number;
  /** On-screen caption from the clip sheet. */
  caption: string;
  /** Which tool the clip shows and why the team uses it. */
  why: string;
  alternatives: readonly (readonly [string, string])[];
};

export type Skill = { name: string; tools?: string };

export type TheorySubsystem = {
  id: SubsystemId;
  code: string;
  /** Team code used by Mission Tree routes (`#/workflow/<team>`). */
  team: string;
  name: string;
  role: string;
  /** `draft` subsystems are placeholders until BOX, EPS and ADCS are reviewed. */
  status: 'ready' | 'draft';
  colour: string;
  objective: string;
  description: string;
  tasks: readonly string[];
  skills: readonly Skill[];
  items: readonly string[];
  modelNote: string;
  connects: string;
  outcome: string;
  references: readonly number[];
  video: TheoryVideo;
  quiz: readonly QuizQuestion[];
};

export const MISSION = {
  title: 'CubeSat mission',
  objective:
    'Develop and launch a CubeSat into LEO and maximise its useful operational lifetime.',
  paragraphs: [
    'CubeSats are small satellites built around standard physical units and a compatible deployment interface. Many are nanosatellites, a mass category typically covering 1 to 10 kg. CubeSat sizes are expressed in units, or U. The basic 1U format, selected for this project, is approximately a 10 cm cube. Larger formats, including 3U and 6U, provide roughly three and six times the nominal unit volume. The precise dimensions must match the deployer, the device that secures and releases the spacecraft.',
    'The mission aims to develop and launch the spacecraft into low Earth orbit (LEO) and maximise its useful operational lifetime. This requires the structure, power, attitude control, computing, communications and payload functions to operate as an integrated system. For example, a payload observation may require suitable pointing, sufficient energy and available storage, with data returned during a later ground contact. Understanding these connections is the basis for defining subsystem tasks and evaluating design choices.',
  ],
  references: [1, 2, 3, 4],
};

export const MISSION_QUIZ: readonly QuizQuestion[] = [
  {
    prompt: 'What does 1U identify?',
    options: [
      'Its orbital height and how it is launched.',
      'Its exact mass and electrical power.',
      'Its standard physical size format.',
      'The arrangement of its electronics and payload.',
    ],
    correct: 2,
  },
  {
    prompt: 'What is the main objective of this CubeSat mission?',
    options: [
      'Extend the period between deployment and atmospheric re-entry.',
      'Develop and launch the satellite into LEO and maximise its useful operational lifetime.',
      'Run the payload for as much of every orbit as possible.',
      'Store the largest possible amount of data onboard.',
    ],
    correct: 1,
  },
  {
    prompt:
      'Which function is primarily assigned to the onboard computer (OBC)?',
    options: [
      'Generate and distribute electrical power.',
      'Measure and control the spacecraft’s orientation.',
      'Send radio signals through the antenna.',
      'Coordinate spacecraft activities, handle commands and manage data.',
    ],
    correct: 3,
  },
  {
    prompt:
      'A CubeSat changes its pointing direction while continuing along essentially the same orbit. Which quantity has changed?',
    options: [
      'Its attitude, or orientation.',
      'Its height above Earth.',
      'Its speed along the orbit.',
      'Its orbital path around Earth.',
    ],
    correct: 0,
  },
  {
    prompt:
      'The payload is proposed to operate more frequently. Which assessment best supports the mission’s lifetime objective?',
    options: [
      'Review battery energy and retain the existing operating schedule.',
      'Review payload performance and select a suitable measurement rate.',
      'Review power, thermal conditions, storage and data return within a shared operating schedule.',
      'Review memory and radio capacity using the existing power budget.',
    ],
    correct: 2,
  },
];

const youtube = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const SUBSYSTEMS: readonly TheorySubsystem[] = [
  {
    id: 'structure',
    code: 'BOX',
    team: 'BOX',
    name: 'Structure',
    role: 'The body of the satellite. It holds every part in place and protects it through launch vibration and the thermal environment.',
    status: 'ready',
    colour: '#8b775d',
    objective:
      'Keep the hardware securely mounted and correctly aligned during launch and operation.',
    description:
      'The structural subsystem, or BOX, provides the mechanical framework that supports and positions the spacecraft hardware. It transfers loads during launch and maintains component alignment during operation. Its design balances mass, stiffness and strength while accommodating cables, assembly access and deployable components. Materials and mounting arrangements also influence heat transfer through the spacecraft, so structural design connects directly with every subsystem.',
    tasks: [
      'Create a CAD assembly showing where components fit and how they attach.',
      'Check mass, clearances, cable routes and assembly access.',
      'Estimate basic loads and plan checks of fit and strength.',
    ],
    skills: [
      { name: '3D CAD design', tools: 'SOLIDWORKS, Fusion 360' },
      { name: 'Drawings, tolerances and assembly design' },
      {
        name: 'Vibration and structural analysis',
        tools: 'ANSYS Mechanical, Abaqus',
      },
      { name: 'Thermal analysis' },
      { name: 'CNC manufacturing process' },
    ],
    items: [
      'Chassis',
      'PCB mounts',
      'Deployment switches SW1 · SW2',
      'Fastening and connecting part-pairs',
    ],
    modelNote:
      'Parts owned by other subsystems are not registered again under BOX; BOX only references (REF) where they mount. PCB mapping: VERIFY.',
    connects:
      'Every subsystem needs a mounting interface. The structure also provides paths for heat to move between components and external surfaces.',
    outcome:
      'Explain how the frame supports components, carries loads and fits the deployer.',
    references: [1, 5, 6],
    video: {
      youtubeId: 'CGpNf1Zi9AI',
      title: 'Performing Modal Analysis Using Ansys Mechanical, Lesson 1',
      channel: 'Ansys Learning',
      start: 99,
      end: 112,
      caption: 'BOX | CAD · Structural Dynamics · Assembly',
      why: 'Finite-element natural frequencies and mode shapes show why the BOX team analyses the frame before launch: the structure has to survive launch vibration.',
      alternatives: [
        ['CAD: Beginners Guide to SOLIDWORKS', youtube('XUeTB4DAJNk')],
      ],
    },
    quiz: [
      {
        prompt: 'What is the main job of the BOX subsystem?',
        options: [
          'Generate and store electrical energy.',
          'Keep the hardware securely mounted and correctly aligned during launch and operation.',
          'Decide which operating mode the spacecraft is in.',
          'Point the antennas at the ground station.',
        ],
        correct: 1,
        explanation:
          'BOX is the mechanical framework: it supports, positions and protects everything else.',
      },
      {
        prompt:
          'Why does the BOX team run vibration (modal) analysis on the frame?',
        options: [
          'To estimate how much power the solar panels produce.',
          'To choose the radio frequency.',
          'To check that the structure withstands launch loads and vibration.',
          'To measure the spacecraft’s rotation in orbit.',
        ],
        correct: 2,
        explanation:
          'Launch is the harshest mechanical environment the structure sees, so its natural frequencies and loads are checked first.',
      },
    ],
  },
  {
    id: 'eps',
    code: 'EPS',
    team: 'EPS',
    name: 'Electrical Power',
    role: 'The satellite’s power supply. It generates electricity from sunlight, stores it in batteries and feeds every other unit.',
    status: 'ready',
    colour: '#9b7437',
    objective:
      'Supply the energy needed for spacecraft activities and maintain enough reserve for periods without sunlight.',
    description:
      'The electrical power subsystem (EPS) generates, stores and distributes the energy required for spacecraft operation. Solar panels generate electricity in sunlight, batteries supply stored energy during eclipse, and power electronics provide suitable voltages and protect connected equipment. An eclipse occurs when Earth blocks sunlight from reaching the spacecraft. EPS design considers both instantaneous power demand and energy consumption over time.',
    tasks: [
      'Estimate the power used by each subsystem and activity.',
      'Compare solar generation and battery energy with expected demand.',
      'Check how power is supplied and how low-energy conditions are handled.',
    ],
    skills: [
      {
        name: 'PCB design: schematic, layout and design-rule check',
        tools: 'Altium Designer, KiCad',
      },
      { name: 'Power budget' },
      {
        name: 'Power distribution, battery and solar-cell analysis',
        tools: 'MATLAB, Simulink',
      },
      { name: 'Electrical verification and testing' },
    ],
    items: [
      'Solar panels SP1–SP5',
      'MPPT',
      'Battery cells CELL1–3 (CELL4 TBD)',
      'Temperature sensor and heater',
      'Regulator and PDU',
    ],
    modelNote:
      'The watchdog (WDOG) is a functional placeholder, not confirmed as separate hardware. The ETP measurement board belongs to PAY.',
    connects:
      'ADCS affects how much sunlight reaches the panels. The onboard computer schedules activities within the energy available, while battery temperature affects safe operation.',
    outcome:
      'Explain how solar panels, batteries and power electronics work together through sunlight, eclipse and changing demand.',
    references: [6, 7],
    video: {
      youtubeId: '13SJ9RY1Wvc',
      title: 'Solar battery charger design and assembly demonstration',
      channel: 'DIY GUY Chris',
      start: 78,
      end: 91,
      caption: 'EPS | Power Generation · PCB · Battery Management',
      why: 'Schematic capture in Altium for a solar battery charger: the same PCB design workflow the EPS team uses for power boards.',
      alternatives: [
        ['PCB layout: 5 V regulated supply in KiCad', youtube('N8GpnRF9Cvg')],
        ['Battery charger schematic in KiCad', youtube('POPvclRAKOQ')],
      ],
    },
    quiz: [
      {
        prompt: 'Where does the spacecraft get its power during eclipse?',
        options: [
          'Directly from the solar panels.',
          'From energy stored in the batteries.',
          'From the ground station.',
          'From the magnetorquers.',
        ],
        correct: 1,
        explanation:
          'In eclipse Earth blocks the Sun, so the batteries supply the energy stored while in sunlight.',
      },
      {
        prompt: 'What does a power budget compare?',
        options: [
          'The mass of each component against the launch limit.',
          'Solar generation and battery energy against the demand of each subsystem and activity.',
          'The radio data rate against the contact time.',
          'The body rotation rate before and after detumbling.',
        ],
        correct: 1,
        explanation:
          'A power budget checks that generation and storage cover what the spacecraft consumes, with reserve.',
      },
    ],
  },
  {
    id: 'adcs',
    code: 'ADCS',
    team: 'ADCS',
    name: 'Attitude Determination and Control',
    role: 'Works out how fast the satellite is rotating and slows it down. It keeps the attitude stable.',
    status: 'ready',
    colour: '#8e6b39',
    objective:
      'Manage orientation and rotation to support power generation, communication and payload activities.',
    description:
      'The attitude determination and control system (ADCS) determines and controls spacecraft orientation, called attitude, and angular motion. Sensors provide information about rotation, magnetic field and reference directions. Control devices, such as magnetorquers, apply torques to change rotational motion. Appropriate orientation supports solar generation, antenna coverage and payload observations. Attitude control concerns spacecraft rotation and is distinct from changing its orbital trajectory.',
    tasks: [
      'Identify when the satellite needs to control its pointing or rotation.',
      'Model simple rotational motion and compare sensor and control options.',
      'Simulate a control method and evaluate its pointing and rotational response.',
    ],
    skills: [
      { name: 'Orbit and attitude analysis', tools: 'Orekit' },
      {
        name: 'Orbit and space-environment simulation',
        tools: 'Ansys STK, NASA GMAT',
      },
      {
        name: 'Magnetic field and rotational dynamics',
        tools: 'MATLAB, Simulink',
      },
      { name: 'B-dot control and detumbling analysis' },
    ],
    items: ['Magnetometer A · B', 'Deneb Space magnetorquer'],
    modelNote:
      'The B-dot control software belongs to OBC/FSW and is referenced (REF) here. Rotational dynamics is a separate analysis context. Magnetorquer product model: VERIFY.',
    connects:
      'ADCS needs power, timely sensor processing and known component alignment. Its required performance depends on antenna coverage and payload pointing needs.',
    outcome:
      'Explain how the satellite measures and changes its orientation, and why this matters to other subsystems.',
    references: [8, 9],
    video: {
      youtubeId: '2dyBu7NOyTw',
      title:
        'Satellite Attitude Control Design with MATLAB, Simulink, FlightGear',
      channel: 'VDEngineering',
      caption: 'ADCS | Attitude Dynamics · B-dot Control · Orbit Analysis',
      why: 'An attitude controller modelled in Simulink with its attitude response: how the ADCS team designs and checks control before flight.',
      alternatives: [
        [
          'Satellite magnetorquers (University of Bristol)',
          youtube('r2Ep3aZ630U'),
        ],
        ['Orbit analysis: simple orbit in NASA GMAT', youtube('jvF7rSYQ8WI')],
        ['STK tip: using the Orbit Tuner', youtube('BFA8f_a9IPQ')],
      ],
    },
    quiz: [
      {
        prompt: 'What does B-dot detumbling reduce?',
        options: [
          'The spacecraft’s orbital speed.',
          'The spacecraft’s body rotation rate.',
          'The battery temperature.',
          'The distance to the ground station.',
        ],
        correct: 1,
        explanation:
          'Detumbling damps rotation about the spacecraft’s own axes. The orbit is unchanged.',
      },
      {
        prompt:
          'Which ACRUX-II actuator produces the control torque, and what does it push against?',
        options: [
          'A reaction wheel, pushing against the atmosphere.',
          'A thruster, pushing against exhaust gas.',
          'A magnetorquer, pushing against Earth’s magnetic field.',
          'The solar panels, pushing against sunlight.',
        ],
        correct: 2,
        explanation:
          'The Deneb magnetorquer creates a magnetic dipole that interacts with Earth’s field, measured by the magnetometers.',
      },
    ],
  },
  {
    id: 'obc',
    code: 'OBC',
    team: 'OBC',
    name: 'Onboard Computer and Flight Software',
    role: 'The brain of the satellite. It processes sensor data, commands each unit and stores data.',
    status: 'draft',
    colour: '#67727f',
    objective:
      'Coordinate the satellite’s activities and manage commands and data reliably.',
    description:
      'The onboard computer (OBC) coordinates spacecraft activities and manages commands and data. Its flight software selects operating modes, collects health telemetry, maintains timing and stores information for later transmission. The OBC also supports fault detection and recovery during periods without ground contact.',
    tasks: [
      'Plan the sequence of spacecraft activities and the commands needed.',
      'Read sensor data, store useful information and prepare it for transmission.',
      'Test how software responds to normal operation and simple faults.',
    ],
    skills: [
      { name: 'Programming', tools: 'C/C++, Python' },
      { name: 'PCB design', tools: 'Altium Designer, KiCad' },
      { name: 'Data handling' },
      { name: 'Software testing' },
    ],
    items: ['MCU', 'B-dot software', 'FLASH', 'FRAM'],
    modelNote:
      'B-dot runs on the MCU. The camera is a PAY reference, not a confirmed OBC item; inclusion TBD.',
    connects:
      'The OBC exchanges commands and measurements with all subsystems. It coordinates payload activity with power availability, attitude control and the next ground contact.',
    outcome:
      'Explain how the computer coordinates activities, handles data and helps the satellite recover from faults.',
    references: [10, 11],
    video: {
      youtubeId: 'kcpHuuEt1xs',
      title: '#49 Embedded Unit Testing',
      channel: 'Quantum Leaps',
      start: 510,
      end: 523,
      caption: 'OBS / OBC | Flight Software · Telemetry · Testing',
      why: 'Automated embedded C unit tests running and reporting results: flight software is trusted because it is tested.',
      alternatives: [['UART programming on STM32', youtube('2K4HBhpptaw')]],
    },
    quiz: [],
  },
  {
    id: 'comms',
    code: 'COMMS',
    team: 'COM',
    name: 'Communications',
    role: 'The link between the ground and the satellite. It receives commands and sends status and experiment data.',
    status: 'draft',
    colour: '#657574',
    objective:
      'Provide a reliable way to send commands and receive spacecraft health information and mission data.',
    description:
      'The communications subsystem (COMMS) provides the radio connection between the spacecraft and its ground station. It receives commands and transmits spacecraft health telemetry and payload results. A reliable connection depends on transmitter power, antenna orientation, signal losses and compatible ground equipment.',
    tasks: [
      'Identify the commands and data that must pass between satellite and ground.',
      'Estimate contact opportunities and how much data can be returned.',
      'Check radio and antenna compatibility, review spectrum requirements, and test data transfer.',
    ],
    skills: [
      { name: 'Ground-contact analysis', tools: 'STK, NASA GMAT' },
      { name: 'Link-budget calculations', tools: 'STK, MATLAB' },
      { name: 'Radio communication' },
      { name: 'Antenna testing' },
    ],
    items: ['Radio', 'Antenna'],
    modelNote:
      'The ground station is an external reference (REF), not a spacecraft item. Exact LoRa and Endurosat models: VERIFY.',
    connects:
      'The OBC supplies data, EPS powers the radio and ADCS influences antenna coverage. Contact duration and data rate determine how much information can be returned.',
    outcome:
      'Explain how commands reach the satellite and how health information and payload results return to the ground.',
    references: [12, 13, 14],
    video: {
      youtubeId: 'a7Cn7M_MnBk',
      title:
        'Satellite Link Budget Analysis with Satellite Communications Toolbox',
      channel: 'MATLAB',
      start: 120,
      end: 133,
      caption: 'COMMS | RF Link Budget · Ground Station · Telemetry',
      why: 'A link-budget app walkthrough: the calculation that tells the COMMS team whether the ground station can hear the satellite.',
      alternatives: [
        ['CubeSat telemetry demo with SDR', youtube('1j34i2eeW60')],
        ['CubeSatSim ground station', youtube('1lo9LD_2hlU')],
      ],
    },
    quiz: [],
  },
  {
    id: 'payload',
    code: 'PAYLOAD',
    team: 'PAY',
    name: 'Payload',
    role: 'The part of the mission that tests equipment in orbit and collects the experiment data.',
    status: 'draft',
    colour: '#9a814e',
    objective:
      'Carry out the chosen experiment or measurement and produce useful results.',
    description:
      'The payload performs the mission-specific measurement, experiment or technology demonstration. The supporting spacecraft platform, called the bus, provides mounting, electrical power, computing, orientation control and communications. Payload requirements can therefore influence the design and operation of every subsystem.',
    tasks: [
      'Define the experiment or measurement and what a successful result looks like.',
      'Estimate the space, power, pointing and data resources it needs.',
      'Plan how results will be collected, checked and interpreted.',
    ],
    skills: [
      { name: 'Experimental design' },
      { name: 'Calibration and data analysis', tools: 'MATLAB, Python' },
      { name: 'CAD', tools: 'SOLIDWORKS, Fusion 360' },
      { name: 'Thermal modelling where the experiment requires it' },
    ],
    items: ['ETP solar-panel measurement board', 'Camera (TBD)'],
    modelNote:
      'The ETP board is distinct from the EPS solar panels. The Deneb magnetorquer stays an ADCS item and the payload experiment references it (REF). Camera adoption: TBD.',
    connects:
      'The spacecraft provides mounting, power, orientation, data storage and a ground link. The payload’s measurement requirements determine how much of each service it needs.',
    outcome:
      'Explain what result the payload should produce and which spacecraft services it needs.',
    references: [15, 16, 17],
    video: {
      youtubeId: 'cmXpm6EZGM8',
      title:
        'I–V & P–V Characteristics Curve | Solar PV Modeling | MATLAB Simulation',
      channel: 'Sun Innovative',
      start: 903,
      end: 916,
      caption: 'PAYLOAD | Experimental Design · Calibration · Data Analysis',
      why: 'Modelled current–voltage and power–voltage curves of a solar cell: the kind of result the ETP panel characterisation is after.',
      alternatives: [
        ['Solar cell curves in MATLAB Simscape', youtube('qKYBmBNcX_g')],
      ],
    },
    quiz: [],
  },
];

export const FAQ: readonly (readonly [string, string])[] = [
  [
    'What do REF, TBD and VERIFY mean?',
    'REF is a reference to an item owned by another subsystem. TBD means the item is not decided yet. VERIFY means the entry still needs to be checked against the real hardware or documents.',
  ],
  [
    'Why are the Sun, the ground station and the launch vehicle not subsystems?',
    'They are outside the spacecraft. The system model treats the Sun, ground station, space environment and launch vehicle or deployer as external references, not as items inside ACRUX-II.',
  ],
  [
    'Is this 3D model the real ACRUX-II?',
    'No. It is educational geometry for a generic 1U CubeSat: 433 graphical parts in 14 assemblies. It is not manufacturing CAD, and the exploded motion is an inspection aid, not a disassembly sequence.',
  ],
  [
    'Why are OBC, COMMS and PAYLOAD marked as draft?',
    'BOX, EPS and ADCS are being reviewed first. The other three show guide content as a placeholder, without a quiz, until their teams review it.',
  ],
  [
    'Where do I practise these skills?',
    'In Mission Tree. This page introduces what each team does and why it uses its tools; the hands-on workshops and Task Cards live in Mission Tree.',
  ],
];
