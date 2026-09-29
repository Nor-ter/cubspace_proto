export type Status =
  | 'Confirmed'
  | 'Assumption'
  | 'TBD'
  | 'Conflicting'
  | 'Historical';
export type SourceReference = {
  document: string;
  section: string;
  page?: number;
  note?: string;
};
export const conops = (section: string, page: number): SourceReference => ({
  document: 'ACRUX_2_ConOps.pdf',
  section,
  page,
});
export const model = (section: string): SourceReference => ({
  document: 'ACRUX-2 CubeSat MADE Modeling.docx',
  section,
});
export const spec = (section: string): SourceReference => ({
  document: 'Product & Engineering Specification v0.1',
  section,
});
export type FlowType = 'Material' | 'Energy' | 'Data';
export type Interface = { name: string; type: FlowType; properties: string[] };
export type Entity = {
  id: string;
  name: string;
  level: 'system' | 'subsystem' | 'component' | 'part-pair';
  parentId?: string;
  purpose: string;
  function: string;
  components: string[];
  inputs: Interface[];
  outputs: Interface[];
  connections: string[];
  failure: string;
  status: Status;
  sourceRefs: SourceReference[];
};
const flow = (
  name: string,
  type: FlowType,
  properties: string[],
): Interface => ({ name, type, properties });
export const subsystems: Entity[] = [
  {
    id: 'obc',
    name: 'OBC · Onboard Computer',
    level: 'subsystem',
    parentId: 'acrux',
    purpose: 'Assesses the satellite state and coordinates the mission sequence.',
    function: 'Performs command processing, data storage, health monitoring and the mission sequence.',
    components: [
      'Microprocessor',
      'B-dot software',
      'Flash memory',
      'FRAM backup memory',
      'Camera interface (camera inclusion: TBD)',
    ],
    inputs: [
      flow('Regulated DC power', 'Energy', ['Voltage (V)', 'Current (A)']),
      flow('Sensor measurements and ground commands', 'Data', [
        'Data rate (bit/s)',
        'Timestamp (s)',
      ]),
    ],
    outputs: [
      flow('Control commands, telemetry and stored data', 'Data', [
        'Latency (ms)',
        'Packet rate (packet/s)',
      ]),
    ],
    connections: ['adcs', 'eps', 'comms', 'box'],
    failure:
      'OBC halt → command and state processing stops. Review the EPS watchdog recovery concept.',
    status: 'Confirmed',
    sourceRefs: [model('§1.2, §2 OBC'), conops('§4.1.1', 4)],
  },
  {
    id: 'adcs',
    name: 'ADCS · Attitude Determination and Control System',
    level: 'subsystem',
    parentId: 'acrux',
    purpose: 'Reduces rotation to support antenna deployment and experiments.',
    function: 'Measures the magnetic field and generates control torque with the magnetorquer.',
    components: [
      'Deneb magnetorquer',
      'Magnetometer A',
      'Magnetometer B',
      'Linked to the B-dot software on the OBC',
    ],
    inputs: [
      flow('DC power and ambient magnetic field', 'Energy', [
        'Voltage (V)',
        'Field strength (µT)',
      ]),
      flow('Operating mode and control commands', 'Data', ['Command rate (Hz)']),
    ],
    outputs: [
      flow('Magnetic field measurements', 'Data', ['Sample rate (Hz)']),
      flow('Control torque', 'Energy', [
        'Torque (N·m)',
        'Angular acceleration (rad/s²)',
      ]),
    ],
    connections: ['obc', 'eps', 'box'],
    failure: 'Faulty magnetic field measurement → control command error → reduced rotation damping and delayed deployment.',
    status: 'Confirmed',
    sourceRefs: [model('§1.2, §2 ADCS'), conops('§3.1.2', 3)],
  },
  {
    id: 'eps',
    name: 'EPS · Electrical Power System',
    level: 'subsystem',
    parentId: 'acrux',
    purpose: 'Supplies the power the satellite needs to operate, including during eclipse and transient loads.',
    function: 'Performs power generation, storage, regulation and distribution, and battery thermal management.',
    components: [
      'Solar panels / antenna-face assembly',
      'MPPT',
      'Li-ion cells (3 vs 3–4: Conflicting)',
      'Temperature sensor',
      'Heater',
      'Voltage regulator',
      'Power distribution',
    ],
    inputs: [
      flow('Solar radiation and stored energy', 'Energy', [
        'Irradiance (W/m²)',
        'Energy (Wh)',
      ]),
      flow('Load commands and temperature measurements', 'Data', [
        'Temperature (°C)',
        'Sample rate (Hz)',
      ]),
    ],
    outputs: [
      flow('Regulated DC power', 'Energy', [
        'Voltage (V)',
        'Current (A)',
        'Power (W)',
      ]),
      flow('EPS health telemetry', 'Data', [
        'Temperature (°C)',
        'State of charge (%)',
      ]),
    ],
    connections: ['obc', 'adcs', 'comms', 'box'],
    failure: 'Generation or thermal management failure → energy shortfall and charging limits → risk of mission interruption.',
    status: 'Confirmed',
    sourceRefs: [model('§1.2, §2 EPS, §2.2'), conops('§2', 1)],
  },
  {
    id: 'comms',
    name: 'COMMS · Communications',
    level: 'subsystem',
    parentId: 'acrux',
    purpose: 'Sends performance data to the ground and receives commands.',
    function: 'Provides a two-way RF communication link with the ground station.',
    components: [
      'Antenna',
      'Radio / communications electronics',
      'Ground station (external system)',
    ],
    inputs: [
      flow('DC power and received RF', 'Energy', [
        'Voltage (V)',
        'Frequency (Hz)',
        'Received signal level (dBm)',
      ]),
      flow('Telemetry', 'Data', ['Data rate (bit/s)']),
    ],
    outputs: [
      flow('Transmitted RF', 'Energy', ['RF power (W)', 'Frequency (Hz)']),
      flow('Decoded ground commands', 'Data', [
        'Packet rate (packet/s)',
        'Bit-error rate',
      ]),
    ],
    connections: ['obc', 'eps', 'box'],
    failure:
      'Communication failure → loss of ground contact and command capability. Autonomous operation alone cannot replace successful communication.',
    status: 'Confirmed',
    sourceRefs: [model('§2 COMMS'), conops('§4.1.2', 4)],
  },
  {
    id: 'box',
    name: 'BOX · Structure',
    level: 'subsystem',
    parentId: 'acrux',
    purpose: 'Transfers launch loads and supports and protects internal hardware.',
    function: 'Provides hardware mounting, alignment, protection, load transfer and heat conduction.',
    components: [
      'CNC chassis',
      'PCB assemblies',
      'Deployment switches',
      'Bolt–nut / screw–insert pairs',
      'Rivet–hole pairs',
      'Plug–socket pairs',
    ],
    inputs: [
      flow('Mounted hardware', 'Material', ['Mass (kg)']),
      flow('Launch loads and thermal environment', 'Energy', [
        'Force (N)',
        'Acceleration (m/s²)',
        'Temperature (°C)',
      ]),
    ],
    outputs: [
      flow('Supported hardware', 'Material', ['Displacement (mm)']),
      flow('Transferred loads and conducted heat', 'Energy', [
        'Stress (Pa)',
        'Temperature gradient (K/m)',
      ]),
    ],
    connections: ['obc', 'adcs', 'eps', 'comms'],
    failure:
      'Loosened fasteners → PCB displacement and connection damage → possible loss of function in several subsystems.',
    status: 'Confirmed',
    sourceRefs: [model('§1.3, §2 BOX / Structure')],
  },
];
export const components: Entity[] = [
  {
    id: 'solar',
    name: 'Solar panel',
    level: 'component',
    parentId: 'eps',
    purpose: 'Power source for energy self-sufficiency',
    function: 'Converts solar radiation into DC power.',
    components: [],
    inputs: [
      flow('Solar radiation', 'Energy', [
        'Irradiance (W/m²)',
        'Incidence angle (°)',
      ]),
    ],
    outputs: [
      flow('DC electrical power', 'Energy', [
        'Voltage (V)',
        'Current (A)',
        'Power (W)',
        'Efficiency (%)',
      ]),
    ],
    connections: ['eps'],
    failure: 'Reduced generation → lower charge',
    status: 'Confirmed',
    sourceRefs: [model('§2 Solar panel')],
  },
  {
    id: 'magnetometer',
    name: 'Magnetometer',
    level: 'component',
    parentId: 'adcs',
    purpose: 'Magnetic field measurement needed for detumbling control',
    function: 'Measures the ambient magnetic field vector.',
    components: [],
    inputs: [
      flow('Magnetic field / regulated power', 'Energy', [
        'Field strength (µT)',
        'Voltage (V)',
      ]),
    ],
    outputs: [
      flow('Digitized magnetic-field data', 'Data', [
        'Sample rate (Hz)',
        'Resolution (µT)',
        'Noise (µT)',
        'Bias (µT)',
      ]),
    ],
    connections: ['adcs', 'obc', 'eps'],
    failure: 'Bias error → contaminated B-dot input',
    status: 'Confirmed',
    sourceRefs: [model('§2 Magnetometer A / B')],
  },
  {
    id: 'sensor',
    name: 'Battery temperature sensor',
    level: 'component',
    parentId: 'eps',
    purpose: 'Temperature measurement needed for battery thermal management decisions',
    function: 'Converts the temperature around the battery into a measurement.',
    components: [],
    inputs: [
      flow('Power and battery thermal state', 'Energy', [
        'Voltage (V)',
        'Temperature (°C)',
      ]),
    ],
    outputs: [
      flow('Temperature measurement', 'Data', [
        'Temperature (°C)',
        'Accuracy (°C)',
        'Sample rate (Hz)',
      ]),
    ],
    connections: ['eps', 'obc'],
    failure: 'Stuck value → heater control decision error',
    status: 'Confirmed',
    sourceRefs: [model('§2 Temperature sensor'), conops('§3.1.1', 2)],
  },
  {
    id: 'heater',
    name: 'Heater',
    level: 'component',
    parentId: 'eps',
    purpose: 'Keeps the battery temperature within a suitable operating range',
    function: 'Converts electrical energy into heat delivered to the battery area.',
    components: [],
    inputs: [
      flow('Electrical power', 'Energy', ['Voltage (V)', 'Current (A)']),
      flow('Heater command', 'Data', [
        'Duty cycle (%)',
        'Command threshold (°C)',
      ]),
    ],
    outputs: [
      flow('Thermal energy', 'Energy', [
        'Heater power (W)',
        'Heat flux (W/m²)',
        'Temperature rise (°C)',
      ]),
    ],
    connections: ['eps', 'obc', 'sensor'],
    failure: 'Stuck ON → overheating / stuck OFF → no heating',
    status: 'Confirmed',
    sourceRefs: [model('§2 Heater')],
  },
  {
    id: 'antenna',
    name: 'Antenna',
    level: 'component',
    parentId: 'comms',
    purpose: 'Exchanges RF energy with space',
    function: 'Converts between electrical RF signals and radiated electromagnetic energy.',
    components: [],
    inputs: [
      flow('Transmitter RF / incident RF field', 'Energy', [
        'Frequency (Hz)',
        'RF power (W)',
      ]),
      flow('Information carried on RF', 'Data', ['Data rate (bit/s)']),
    ],
    outputs: [
      flow('Radiated RF / received electrical RF', 'Energy', [
        'Gain (dBi)',
        'Received signal level (dBm)',
      ]),
      flow('Information carried on RF', 'Data', ['Data rate (bit/s)']),
    ],
    connections: ['comms', 'eps', 'box'],
    failure: 'Deployment failure → possible link failure',
    status: 'Confirmed',
    sourceRefs: [model('§2 Antenna')],
  },
];
export const phases = [
  {
    title: 'Initial Operations',
    ko: 'Survive first, then connect with the ground.',
    description:
      'Uses initial battery energy for thermal management, detumbling, antenna deployment and establishing communication.',
    active: ['box', 'eps', 'obc', 'adcs', 'comms'],
    success: 'Primary: deployment sequence complete and communication established',
    sourceRefs: [conops('§1.1–1.2', 1)],
  },
  {
    title: 'Operational Phase',
    ko: 'Run experiments while maintaining the energy balance.',
    description:
      'Maintains sustainable operation on harvested solar energy and collects performance data for the ETP solar panels and the Deneb magnetorquer.',
    active: ['eps', 'obc', 'adcs', 'comms'],
    success: 'Secondary: collect performance data for the two demonstration payloads',
    sourceRefs: [conops('§1.1–1.2', 1)],
  },
  {
    title: 'Extended Operations',
    ko: 'Understand change through long-term data.',
    description:
      'Records long-term hardware performance and system state. This is not an actual lifetime guarantee or a 30-day success determination model.',
    active: ['eps', 'obc', 'adcs', 'comms'],
    success: 'Tertiary: collect long-term hardware performance data',
    sourceRefs: [conops('§1.1–1.2', 1)],
  },
];
export const modes = [
  {
    name: 'Critical',
    range: '<10%',
    text: 'Maintains only essential systems and stops payload experiments.',
  },
  {
    name: 'Safe',
    range: '10–40%',
    text: 'Maintains basic functions. Limited payload activity is considered only when instructed from the ground.',
  },
  {
    name: 'Normal',
    range: '40–80%',
    text: 'Performs the nominal mission and experiments while checking power, attitude and health conditions.',
  },
  {
    name: 'High Power',
    range: '>80%',
    text: 'When power is sufficient, performs longer and more frequent experiments and data collection.',
  },
];
export const stages = [
  {
    title: 'Waiting inside the launch vehicle',
    en: 'Contained in deployer',
    text: 'The deployer, an external system, restrains the satellite. There is mechanical contact with the deployment switches.',
    active: ['box'],
    input: 'Mechanical restraint · Material / Energy',
    output: 'Switch restraint state · Data',
    risk: 'If the contact state is inaccurate, the deployment decision is hard to trust.',
    gate: 'Concept stage: inside the launch provider’s deployer',
    sourceRefs: [model('§2 Deployment switch, §2.2')],
  },
  {
    title: 'Separation and switch release',
    en: 'Separation & release',
    text: 'Starts the initial sequence after confirming that both deployment switches are released.',
    active: ['box', 'eps', 'obc'],
    input: 'Mechanical contact released · Energy',
    output: 'Released-state signal · Data',
    risk: 'If only one switch is released or the contacts bounce, the start condition may not be met.',
    gate: 'Current ConOps assumption: 2 switches released for 30 s',
    sourceRefs: [conops('§3.1', 2)],
  },
  {
    title: 'Initialisation and battery thermal management',
    en: 'Initialize & warm battery',
    text: 'Heats the battery while monitoring it with the temperature sensor. If the measurement does not change during heating, set sensor health to FALSE and consider a degraded thermal management mode.',
    active: ['eps', 'obc'],
    input: 'Stored power · Energy / Temperature measurement · Data',
    output: 'Heat delivered to the battery · Energy / Sensor health · Data',
    risk: 'Heating time and power limits are required. The exact heating consumption and recovery procedure are TBD.',
    gate: 'Current ConOps assumption: target 6°C, charge >0°C, reheat if the sensor is healthy and <3°C',
    sourceRefs: [conops('§3.1.1', 2), conops('§3.1.1 continued', 3)],
  },
  {
    title: 'Initial attitude determination and rotation reduction',
    en: 'Determine attitude & detumble',
    text: 'Attempts rotation reduction via magnetometer → OBC / B-dot → magnetorquer. First checks that power is sufficient.',
    active: ['adcs', 'obc', 'eps'],
    input: 'Magnetic field · Energy / Magnetic field measurement · Data',
    output: 'Magnetorquer command · Data / Control torque · Energy',
    risk: 'If energy is insufficient, it waits. The ConOps proposes emergency antenna deployment for communication if the charge is <2 Wh and does not increase for 90 min.',
    gate: 'Current ConOps assumption: at least 2 Wh at the start of initial detumbling',
    sourceRefs: [conops('§3.1.2', 3)],
  },
  {
    title: 'Antenna deployment and confirmation',
    en: 'Deploy & verify antenna',
    text: 'Deploys the antenna after rotation has been reduced sufficiently. Confirms with the deployment confirmation device and an initial transmission test.',
    active: ['comms', 'obc', 'eps', 'box'],
    input: 'Deployment command · Data / Drive power · Energy',
    output: 'Antenna Deployed state · Data',
    risk: 'Deployment failure can end the mission. No guaranteed redeployment procedure is defined.',
    gate: 'Current ConOps assumption: initial success criterion angular rate <5°/s. Detailed deployment thresholds and emergency exceptions need SME confirmation',
    sourceRefs: [conops('§3.1.3, §3.2', 3)],
  },
  {
    title: 'Establishing ground communication',
    en: 'Establish ground contact',
    text: 'The OBC collects and stores telemetry and sends it through the radio and antenna. Ground contact confirms the first mission success.',
    active: ['comms', 'obc', 'eps'],
    input: 'Telemetry packet · Data / Power · Energy',
    output: 'RF beacon · Energy / Data received on the ground · Data',
    risk: 'Antenna deployment alone does not guarantee link success. Ground reception and status confirmation are required.',
    gate: 'Current ConOps assumption: 1 s beacon transmission every 10 s',
    sourceRefs: [conops('§4.1.2', 4)],
  },
  {
    title: 'Nominal operations and payload experiments',
    en: 'Nominal & payload operations',
    text: 'Runs experiments after checking power, attitude, solar illumination, system health and storage capacity. Summaries are sent in the beacon, and detailed records via requested downlinks.',
    active: ['eps', 'obc', 'adcs', 'comms'],
    input: 'Operating conditions and ground commands · Data / Generated power · Energy',
    output: 'ETP / Deneb performance data · Data',
    risk: 'The stable angular rate threshold for the ETP experiment and file storage details are TBD.',
    gate: 'Current ConOps assumption: Deneb experiment 30 s, ETP measurement board stops after 30 s',
    sourceRefs: [conops('§5.1–5.2', 5), conops('§5.2–5.3', 6)],
  },
];
export const chains = [
  {
    name: 'EPS',
    nodes: [
      'Sunlight',
      'Solar Panel',
      'MPPT',
      'Battery / Bus',
      'Voltage Regulator',
      'Spacecraft Loads',
    ],
    edges: [
      'Energy · irradiance (W/m²)',
      'Energy · voltage (V), current (A)',
      'Energy · power (W)',
      'Energy · voltage (V)',
      'Energy · branch current (A)',
    ],
    sourceRefs: [model('§2.1 High-Level Functional Flow Chain')],
  },
  {
    name: 'ADCS',
    nodes: [
      'Magnetic Field',
      'Magnetometer',
      'OBC / B-dot',
      'Magnetorquer',
      'Control Torque',
      'Rotational Motion',
    ],
    edges: [
      'Energy · field strength (µT)',
      'Data · sample rate (Hz)',
      'Data · duty cycle (%)',
      'Energy · torque (N·m)',
      'Energy · angular acceleration (rad/s²)',
    ],
    sourceRefs: [model('§2.1 High-Level Functional Flow Chain')],
  },
  {
    name: 'COMMS',
    nodes: [
      'Ground Command',
      'RF',
      'Antenna',
      'Radio',
      'OBC',
      'Command Processing',
    ],
    edges: [
      'Data · packet rate (packet/s)',
      'Energy · frequency (Hz)',
      'Energy · received signal level (dBm)',
      'Data · data rate (bit/s)',
      'Data · latency (ms)',
    ],
    sourceRefs: [model('§2.1 High-Level Functional Flow Chain')],
  },
  {
    name: 'Thermal Control',
    nodes: [
      'Battery Temperature',
      'Temperature Sensor',
      'Controller',
      'Heater',
      'Battery',
    ],
    edges: [
      'Energy · temperature (°C)',
      'Data · sample rate (Hz)',
      'Data · command threshold (°C)',
      'Energy · heat flux (W/m²)',
    ],
    sourceRefs: [model('§2.1 High-Level Functional Flow Chain')],
  },
];
export const failures = [
  {
    id: 'antenna-failure',
    entityId: 'antenna',
    title: 'Antenna deployment failure',
    chain: [
      'Deployment mechanism fails to operate',
      'COMMS RF interface limited',
      'Communication not established → primary success criterion not met',
    ],
    detection: ['Check the deployment confirmation state', 'Initial transmission and ground reception test'],
    mitigation: [
      'Review deployment, power and angular rate conditions',
      'The emergency procedure needs detailed definition and SME review; successful recovery is not guaranteed',
    ],
    sourceRefs: [conops('§3.1.3', 3), conops('§7.1, §9.1', 8)],
  },
  {
    id: 'thermal-failure',
    entityId: 'sensor',
    title: 'Battery thermal management failure',
    chain: [
      'Stuck sensor value or heater failure',
      'Degraded EPS thermal management decisions and heating',
      'Charging limits and risk of permanent battery damage',
    ],
    detection: [
      'Monitor whether the temperature changes during heating',
      'Check heating timeout and sensor health',
    ],
    mitigation: [
      'Sensor health FALSE and degraded thermal management mode concept',
      'Heating time and power limits; detailed limit values are TBD',
    ],
    sourceRefs: [conops('§3.1.1', 2), conops('§7.1', 8)],
  },
  {
    id: 'comms-failure',
    entityId: 'comms',
    title: 'Communication failure',
    chain: [
      'Loss of radio / communication path function',
      'Cannot receive commands or downlink telemetry',
      'Loss of ground contact and mission data recovery',
    ],
    detection: ['Monitor communication timeout', 'Check beacon and ground reception status'],
    mitigation: [
      'Beacon restart and communication reinitialisation concept',
      'Autonomous operation during communication gaps; the detailed recovery procedure needs SME confirmation',
    ],
    sourceRefs: [conops('§6.3', 7), conops('§7', 8)],
  },
  {
    id: 'power-failure',
    entityId: 'eps',
    title: 'Power generation failure',
    chain: [
      'Reduced solar panel generation or power path failure',
      'Insufficient energy for charging and load supply',
      'Payload stopped → difficulty maintaining essential functions',
    ],
    detection: [
      'Check power and battery state telemetry trends (teaching example)',
      'Monitor whether the charge increases',
    ],
    mitigation: [
      'Low-power mode and load shedding',
      'Graceful degradation; exact diagnosis and recovery policy are TBD',
    ],
    sourceRefs: [conops('§3.1.2', 3), conops('§6.3', 7), conops('§7', 8)],
  },
];
export const rams = [
  {
    name: 'Reliability',
    ko: 'Performing over time',
    text: 'The probability of performing the required function for a specified period under specified conditions. Example: does the power supply function remain available throughout the mission?',
  },
  {
    name: 'Availability',
    ko: 'Ready when needed',
    text: 'The degree to which a service is ready and usable when needed. Example: is the communication function available during a required ground contact?',
  },
  {
    name: 'Maintainability',
    ko: 'Recovering after faults',
    text: 'The ability to restore and preserve function after a failure. In orbit, fault isolation, resets, software recovery and reconfiguration are considered rather than physical repair.',
  },
  {
    name: 'Safety',
    ko: 'Preventing unacceptable harm',
    text: 'Prevents unacceptable risk to people, the launch system, other satellites and the mission. Example: is battery overheating limited?',
  },
];
export const analyses = [
  {
    name: 'FMECA',
    text: 'Starts from each failure mode, traces local, higher-level and mission effects, and reviews criticality. Examines how the effect of an antenna deployment failure propagates to the whole mission.',
  },
  {
    name: 'RBD',
    text: 'Represents which elements are needed for the required function to be maintained. If both the antenna and the radio are needed, it is a series functional relationship. This diagram is not a probability calculation result.',
  },
  {
    name: 'Fault Tree',
    text: 'Starts from the top event and decomposes causes with OR / AND conditions. Teaching example: loss of communication ← loss of antenna function OR loss of radio function. An actual complete fault tree requires separate analysis.',
  },
  {
    name: 'PHM',
    text: 'Links condition monitoring, fault diagnosis and degradation and prognostic reasoning. Example: observing charge trends, temperature and current to raise a suspicion of degradation. Trends alone do not confirm causes or predict lifetime.',
  },
];
export const hierarchy = [
  {
    level: 'Part',
    name: 'Bolt',
    text: 'A physical item that is not assigned an independent mission function in this model.',
  },
  {
    level: 'Part-pair',
    name: 'Bolt–nut',
    text: 'Two interacting parts that together perform a function such as fastening.',
  },
  {
    level: 'Component',
    name: 'Microprocessor',
    text: 'A functional unit with defined inputs and outputs. A microprocessor and software are also Components.',
  },
  {
    level: 'Subsystem',
    name: 'OBC',
    text: 'A group of Components that provides a major satellite capability.',
  },
  {
    level: 'System',
    name: 'ACRUX-2 CubeSat',
    text: 'The whole satellite, integrating each subsystem to perform the mission.',
  },
];
export const uncertainties = [
  {
    status: 'Confirmed' as Status,
    title: '1U technology demonstration mission',
    text: 'ConOps §1 states the purpose of collecting ETP and Deneb hardware performance data. Confirmed means stated in the provided documents; it does not mean flight verified.',
    sourceRefs: [conops('§1', 1)],
  },
  {
    status: 'Conflicting' as Status,
    title: 'Battery cell count',
    text: 'ConOps §2.1 states 3 cells, and Modeling §1.2 and §2.2 state 3–4 cells, TBD. Vibration testing and the final design choice must be confirmed.',
    sourceRefs: [conops('§2.1', 1), model('§1.2, §2.2')],
  },
  {
    status: 'TBD' as Status,
    title: 'Camera inclusion',
    text: 'The Raspberry Pi camera is TBD in the Modeling document. Do not describe it as a confirmed ACRUX-2 payload.',
    sourceRefs: [model('§1.2, §2.2')],
  },
  {
    status: 'Assumption' as Status,
    title: 'Power mode boundaries',
    text: 'Current ConOps assumption. Safe 10–40% and Normal 40–80% overlap at 40%, and the autonomous payload condition is >40%. The relationship between the 40% maximum depth-of-discharge target and the SOC operating criteria also needs SME review.',
    sourceRefs: [
      conops('§2.1', 2),
      conops('§4.2', 4),
      conops('§4.2 continued', 5),
    ],
  },
  {
    status: 'TBD' as Status,
    title: 'Heater power, sensor details and experiment angular rate',
    text: 'Heating power consumption, sensor specifications, the stable angular rate threshold for the ETP experiment, and storage and recovery procedures are not complete.',
    sourceRefs: [conops('§8–9', 8), conops('§5.2', 6)],
  },
  {
    status: 'Assumption' as Status,
    title: 'Applicability of the mission duration',
    text: 'The Modeling document describes a 30-day LEO mission, but the ConOps phase success criteria do not set a fixed duration. Do not promote 30 days to a common verification criterion.',
    sourceRefs: [model('§1.1, §2 System'), conops('§1', 1)],
  },
];
export const questions = [
  {
    id: 'flow',
    type: 'Flow classification',
    question: 'What is the flow type of the solar radiation entering the solar panel?',
    options: ['Material', 'Energy', 'Data'],
    answer: 1,
    feedback:
      'Light carries electromagnetic energy. The solar panel converts it into DC power.',
    sourceRefs: [model('§2 Solar panel')],
  },
  {
    id: 'hierarchy',
    type: 'Hierarchy classification',
    question: 'Under the MADE convention, what is the level of a microprocessor?',
    options: ['Part', 'Part-pair', 'Component', 'Subsystem'],
    answer: 2,
    feedback:
      'A microprocessor with a clear function and inputs/outputs is a Component. Do not decompose it into arbitrary Parts just because its internals are unknown.',
    sourceRefs: [model('§1.1')],
  },
  {
    id: 'pair',
    type: 'Hierarchy classification',
    question: 'What is the level of a bolt–nut that together performs a fastening function?',
    options: ['Part-pair', 'System', 'Subsystem'],
    answer: 0,
    feedback:
      'It is a Part-pair, because the function is performed through the interaction of two physical Parts.',
    sourceRefs: [model('§1.1')],
  },
  {
    id: 'match',
    type: 'Match input to output',
    question: 'Which is the correct input-to-output link for the temperature sensor?',
    options: [
      'Temperature condition (Energy) → temperature measurement (Data)',
      'Temperature measurement (Data) → RF energy (Energy)',
      'Electrical energy (Energy) → mechanical fastening (Material)',
    ],
    answer: 0,
    feedback:
      'Distinguish the physical thermal state from the measurement data that represents it.',
    sourceRefs: [model('§2 Temperature sensor')],
  },
  {
    id: 'property',
    type: 'Measurable property',
    question: 'What is a measurable property of a DC power flow?',
    options: ['Mission success', 'Voltage (V)', 'Power system'],
    answer: 1,
    feedback:
      'Voltage can be measured in units. Mission success is an outcome, and the power system is an entity.',
    sourceRefs: [model('§2')],
  },
  {
    id: 'confirmed',
    type: 'Source status',
    question:
      'What is the source status of the primary success criterion stated in ConOps §1, deployment and establishing communication?',
    options: ['Confirmed (stated in documents)', 'TBD', 'Historical'],
    answer: 0,
    feedback:
      'It is stated in the provided documents. Confirmed does not mean actual flight verification is complete.',
    sourceRefs: [conops('§1.1', 1)],
  },
  {
    id: 'assumption',
    type: 'Source status',
    question:
      'How should the ConOps two-switch 30 s release be shown in the learning simulator?',
    options: [
      'Verified flight requirement',
      'Current ConOps assumption',
      'Historical',
    ],
    answer: 1,
    feedback:
      'This value is a sourced operating assumption. Do not present it as a verified flight software requirement.',
    sourceRefs: [conops('§3.1', 2), spec('§7 Module 3')],
  },
  {
    id: 'tbd',
    type: 'Source status',
    question: 'What is the current inclusion status of the Raspberry Pi camera?',
    options: ['Confirmed', 'TBD', 'Historical'],
    answer: 1,
    feedback: 'The Modeling document marks it as TBD, requiring confirmation of inclusion and qualification.',
    sourceRefs: [model('§2.2')],
  },
  {
    id: 'conflict',
    type: 'Source status',
    question:
      'The ConOps says 3 battery cells, and Modeling says 3–4 cells, TBD. How should this be recorded?',
    options: ['Automatically standardise on 3 cells', 'Conflicting · SME confirmation needed', 'Average of 3.5 cells'],
    answer: 1,
    feedback:
      'Preserve the conflict and confirm with the final design owner. Do not merge them arbitrarily.',
    sourceRefs: [conops('§2.1', 1), model('§2.2')],
  },
];
export const assignmentFields = [
  ['entity', 'Entity name'],
  ['level', 'Hierarchy level'],
  ['parent', 'Parent subsystem'],
  ['function', 'Function'],
  ['inputs', 'Inputs'],
  ['outputs', 'Outputs'],
  ['flowTypes', 'Flow types'],
  ['properties', 'Flow properties + units'],
  ['connections', 'Connected components'],
  ['assumptions', 'Known assumptions / TBDs'],
  ['failure', 'One possible failure mode'],
] as const;
export const moduleTitles = [
  'Mission overview',
  'Exploring the satellite structure',
  'Deployment sequence',
  'Exploring the MADE model',
  'RAMS and failure reasoning',
  'Modelling readiness',
];
export const moduleEnglish = [
  'MISSION OVERVIEW',
  'SYSTEM ANATOMY',
  'MISSION SEQUENCE',
  'MADE MODEL EXPLORER',
  'FAILURE REASONING',
  'MODELING READINESS',
];
