// Source: "CubeSat Mission and Subsystems: Contents for the onboarding web"
// (12 November 2026), section 2 "Subsystems", as transcribed in
// CubeSat_Anatomy v1.0.1 (src/content.ts). Guide text is verbatim; `parts`
// lists what each subsystem covers in the 3D model.
import type { SubsystemContent } from './viewer/types';

interface Reference {
  id: number;
  title: string;
  url: string;
}

// Numbering and URLs follow the supplied guide and its PDF link annotations.
const REFERENCES: Record<number, Reference> = {
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

export const references = (...ids: number[]): Reference[] =>
  ids.map((id) => REFERENCES[id]);

export const SUBSYSTEMS: SubsystemContent[] = [
  {
    id: 'structure',
    code: 'BOX',
    title: 'Structural / BOX',
    summary:
      'The structural subsystem, or BOX, provides the mechanical framework that supports and positions the spacecraft hardware. It transfers loads during launch and maintains component alignment during operation. Its design balances mass, stiffness and strength while accommodating cables, assembly access and deployable components. Materials and mounting arrangements also influence heat transfer through the spacecraft. Structural design therefore connects directly with every subsystem, including battery attachment, sensor alignment, electronics mounting and antenna clearance. [1, 5, 6]',
    objective:
      'Keep the hardware securely mounted and correctly aligned during launch and operation.',
    tasks: [
      'Create a CAD assembly showing where components fit and how they attach.',
      'Check mass, clearances, cable routes and assembly access.',
      'Estimate basic loads and plan checks of fit and strength.',
    ],
    skills:
      'CAD modelling (i.e., SOLIDWORKS, Fusion 360), structural analysis (i.e., ANSYS Mechanical, Abaqus), engineering drawings and practical assembly.',
    learningOutcome:
      'Explain how the frame supports components, carries loads and fits the deployer.',
    parts: ['Corner rails', 'End frames', 'Mounting standoffs', 'Fasteners'],
    colour: '#dba8d8',
    sources: references(1, 5, 6),
  },
  {
    id: 'eps',
    code: 'EPS',
    title: 'EPS',
    summary:
      'The electrical power subsystem (EPS) generates, stores and distributes the energy required for spacecraft operation. Solar panels generate electricity in sunlight, batteries supply stored energy during eclipse, and power electronics provide suitable voltages and protect connected equipment. An eclipse occurs when Earth blocks sunlight from reaching the spacecraft. EPS design considers both instantaneous power demand and energy consumption over time. It integrates with attitude control through panel orientation, with the onboard computer through activity scheduling, and with thermal design through battery and electronics temperature limits. [6, 7]',
    objective:
      'Supply the energy needed for spacecraft activities and maintain enough reserve for periods without sunlight.',
    tasks: [
      'Estimate the power used by each subsystem and activity.',
      'Compare solar generation and battery energy with expected demand.',
      'Check how power is supplied and how low-energy conditions are handled.',
    ],
    skills:
      'Circuit and PCB design (i.e., Altium Designer, KiCad), power and energy modelling (i.e., MATLAB, Simulink), electrical measurements and testing.',
    learningOutcome:
      'Explain how solar panels, batteries and power electronics work together through sunlight, eclipse and changing demand.',
    parts: [
      'Body-mounted solar panels',
      'Battery pack',
      'Power board',
      'Power distribution',
    ],
    colour: '#eba7a2',
    sources: references(6, 7),
  },
  {
    id: 'adcs',
    code: 'ADCS',
    title: 'ADCS',
    summary:
      'The attitude determination and control system (ADCS) determines and controls spacecraft orientation, called attitude, and angular motion. Sensors provide information about rotation, magnetic field and reference directions. Control devices, such as magnetorquers or reaction wheels, apply torques to change rotational motion. Appropriate orientation supports solar generation, antenna coverage and payload observations. ADCS design therefore depends on structural mass properties, electrical power, sensor alignment and software timing. Attitude control concerns spacecraft rotation and is distinct from changing its orbital trajectory. [8, 9]',
    objective:
      'Manage orientation and rotation to support power generation, communication and payload activities.',
    tasks: [
      'Identify when the satellite needs to control its pointing or rotation.',
      'Model simple rotational motion and compare sensor and control options.',
      'Simulate a control method and evaluate its pointing and rotational response.',
    ],
    skills:
      'Dynamics and control modelling (i.e., MATLAB, Simulink), attitude and pointing analysis (i.e., STK, MATLAB), orbit and mission analysis (i.e., NASA GMAT, STK), and sensor testing.',
    learningOutcome:
      'Explain how the satellite measures and changes its orientation, and why this matters to other subsystems.',
    parts: [
      'Magnetometer',
      'Angular-rate sensor',
      'Magnetorquer rods',
      'Control electronics',
    ],
    colour: '#efbe91',
    sources: references(8, 9),
  },
  {
    id: 'obc',
    code: 'OBC',
    title: 'OBC',
    summary:
      'The onboard computer (OBC) coordinates spacecraft activities and manages commands and data. Its flight software selects operating modes, collects health telemetry, maintains timing and stores information for later transmission. Health telemetry includes measurements such as battery voltage and component temperatures. The OBC also supports fault detection and recovery during periods without ground contact. Reliable operation requires clearly defined connections with the other subsystems, together with sufficient processing time and memory. For example, a payload observation must be coordinated with power availability, attitude control, data storage and communications. [10, 11]',
    objective:
      'Coordinate the satellite’s activities and manage commands and data reliably.',
    tasks: [
      'Plan the sequence of spacecraft activities and the commands needed.',
      'Read sensor data, store useful information and prepare it for transmission.',
      'Test how software responds to normal operation and simple faults.',
    ],
    skills:
      'Programming (i.e., C/C++, Python), PCB design (i.e., Altium Designer, KiCad), data handling and software testing.',
    learningOutcome:
      'Explain how the computer coordinates activities, handles data and helps the satellite recover from faults.',
    parts: ['Processor', 'Memory', 'Data interfaces', 'Flight software'],
    colour: '#aab6e8',
    sources: references(10, 11),
  },
  {
    id: 'comms',
    code: 'COMMS',
    title: 'COMMS',
    summary:
      'The communications subsystem (COMMS) provides the radio connection between the spacecraft and its ground station. It receives commands and transmits spacecraft health telemetry and payload results. Typical hardware includes a radio, antennas and connecting cables. A reliable connection depends on transmitter power, antenna orientation, signal losses and compatible ground equipment. COMMS therefore integrates with EPS, ADCS and the OBC. Available contact periods and achievable data-transfer rates determine how much information can be returned during spacecraft operations. [12, 13]',
    objective:
      'Provide a reliable way to send commands and receive spacecraft health information and mission data.',
    tasks: [
      'Identify the commands and data that must pass between satellite and ground.',
      'Estimate contact opportunities and how much data can be returned.',
      'Check radio and antenna compatibility, review spectrum requirements, and test data transfer. [13, 14]',
    ],
    skills:
      'Ground-contact analysis (i.e., STK, NASA GMAT), link-budget calculations (i.e., STK, MATLAB), radio communication and antenna testing.',
    learningOutcome:
      'Explain how commands reach the satellite and how health information and payload results return to the ground.',
    parts: [
      'Radio transceiver',
      'RF electronics',
      'Antenna system',
      'RF connections',
    ],
    colour: '#9fd0dc',
    sources: references(12, 13, 14),
  },
  {
    id: 'payload',
    code: 'PAYLOAD',
    title: 'PAYLOAD',
    summary:
      'The payload performs the mission-specific measurement, experiment or technology demonstration. Examples include imaging instruments, radiation sensors, materials experiments and experimental computing hardware. The supporting spacecraft platform, called the bus, provides mounting, electrical power, computing, orientation control and communications. Payload requirements can therefore influence the design and operation of every subsystem. The payload for this project remains to be selected; its purpose, resource requirements and success criteria should be defined before detailed integration. NASA PREFIRE’s infrared instruments and ESA OPS-SAT’s experimental computer illustrate different payload roles. [15, 16, 17]',
    objective:
      'Carry out the chosen experiment or measurement and produce useful results.',
    tasks: [
      'Define the experiment or measurement and what a successful result looks like.',
      'Estimate the space, power, pointing and data resources it needs.',
      'Plan how results will be collected, checked and interpreted.',
    ],
    skills:
      'Experimental design, calibration and data analysis (i.e., MATLAB, Python); CAD (i.e., SOLIDWORKS, Fusion 360) and fluid-flow or thermal modelling (i.e., ANSYS Fluent, OpenFOAM) where required by the payload.',
    learningOutcome:
      'Explain what result the payload should produce and which spacecraft services it needs.',
    parts: [
      'Example imager',
      'Optics and baffle',
      'Image sensor',
      'Interface electronics',
    ],
    colour: '#e6d595',
    sources: references(15, 16, 17),
  },
];
