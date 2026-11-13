import type { SubsystemKey } from '@/types/subsystem';

// Mesh-name fragments in the CubeSat model that belong to each subsystem.
export const SUBSYSTEM_MESH_KEYS: Record<SubsystemKey, string[]> = {
  all: [],
  structure: ['structure', 'skin'],
  solar: ['solar_array', 'solar_cell', 'wing_'],
  eps: ['eps_board', 'battery'],
  obc: ['obc_board', 'obc_'],
  comms: ['comms_'],
  adcs: [
    'adcs_board',
    'magnetometer',
    'imu_',
    'reaction_wheel',
    'magnetorquer',
  ],
  payload: ['payload'],
  antennas: ['antennas'],
};

// The subsystem tour used by the storytelling page. Moved here from the
// former Spacecraft Structure page (features/anatomy) when that page was
// removed; the story still narrates it.
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
