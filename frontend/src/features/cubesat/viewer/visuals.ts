import { ORBIT_PRESETS } from './orbit';
export type VisualItem = {
  label: string;
  detail: string;
  units?: [number, number, number];
};
const formats: VisualItem[] = [
  {
    label: '1U',
    detail: 'One nominal unit. Typical maximum mass in CDS Rev. 14.1: 2 kg.',
    units: [1, 1, 1],
  },
  {
    label: '1.5U',
    detail: 'One and a half nominal units. Typical maximum: 3 kg.',
    units: [1, 1.5, 1],
  },
  {
    label: '2U',
    detail: 'Two nominal units. Typical maximum: 4 kg.',
    units: [1, 2, 1],
  },
  {
    label: '3U',
    detail: 'Three nominal units. Typical maximum: 6 kg.',
    units: [1, 3, 1],
  },
  {
    label: '6U',
    detail: 'Six nominal units. Typical maximum: 12 kg.',
    units: [1, 3, 2],
  },
  {
    label: '12U',
    detail: 'Twelve nominal units. Typical maximum: 24 kg.',
    units: [2, 3, 2],
  },
];
const documents = [
  ['Orbital debris', 'Debris-mitigation assessment and compliance inputs.'],
  [
    'Transmitters',
    'Radio transmitter information for coordination and safety.',
  ],
  ['Materials', 'Materials and processes used in flight hardware.'],
  [
    'Mass properties',
    'Measured mass, centre of gravity and inertia information.',
  ],
  ['Batteries', 'Battery design, safety and supporting test evidence.'],
  [
    'Dimensions',
    'Evidence of compliance with the dispenser interface envelope.',
  ],
  ['Electrical', 'Electrical design and interface verification.'],
  ['Venting', 'Analysis of trapped volumes and pressure equalisation.'],
  ['Testing', 'Procedures and reports demonstrating verification.'],
  ['Compliance', 'Formal summary of mission requirement compliance.'],
  ['Safety package', 'Inputs requested by the mission safety review process.'],
];
export const VISUAL_ITEMS: Record<string, VisualItem[]> = {
  'launch-sequence': [
    {
      label: 'Launch',
      detail:
        'Full-scale view: a representative 70 m launcher with a 3.7 m body diameter. The 1U CubeSat and its dispenser are small payloads inside the fairing.',
    },
    {
      label: 'Fairing separation',
      detail:
        'The protective payload fairing opens after ascent. The dispenser remains attached to the upper-stage payload interface.',
    },
    {
      label: 'Dispenser',
      detail:
        'Separate enlarged orbital-deployment example inspired by the ISS footage. The dispenser remains fixed to its mount while the door opens.',
    },
    {
      label: 'CubeSat release',
      detail:
        'The 1U travels along the guide rails, then coasts away in a straight relative path with gentle residual rotation. The dispenser stays on its mount.',
    },
  ],
  'cp1-cp10': [
    {
      label: 'CP1 · 1U',
      detail:
        'Generic 1U representation of the CP1 form factor. CP1 is listed at 1 kg; use the mission link for flight hardware information.',
      units: [1, 1, 1],
    },
    {
      label: 'CP10 · 3U',
      detail:
        'Generic 3U representation of ExoCube / CP10. CP10 is listed at 4 kg; this is not a replica of its hardware.',
      units: [1, 3, 1],
    },
  ],
  'unit-configurations': formats,
  'mass-and-size': formats,
  'earth-orbits': ORBIT_PRESETS.map(({ label, detail }) => ({ label, detail })),
  'p-pod': [
    {
      label: 'Stowed',
      detail:
        'The dispenser restrains the spacecraft and interfaces with the launcher. This is a schematic rail-based dispenser, not a P-POD engineering model.',
    },
    {
      label: 'Released',
      detail:
        'The door opens and the spacecraft separates. This static separation view illustrates the deployment interface.',
    },
  ],
  'launch-vehicles': [
    {
      label: 'Launcher',
      detail:
        'A schematic launch vehicle transports the integrated payload system toward its target orbit.',
    },
    {
      label: 'Payload interface',
      detail:
        'The dispenser mounts within the launch payload system. Actual placement and interfaces depend on the provider.',
    },
    {
      label: 'CubeSat',
      detail:
        'The dispenser releases the CubeSat after the appropriate mission conditions are met.',
    },
  ],
  'flight-documentation': documents.map(([label, detail]) => ({
    label,
    detail,
  })),
  'acceptance-checklist': [
    {
      label: 'Envelope',
      detail:
        'Verify the as-built envelope, protrusions and dimensions against the mission interface drawing.',
    },
    {
      label: 'Rails',
      detail:
        'Check rail geometry, surface condition and contact areas against dispenser requirements.',
    },
    {
      label: 'Inhibits',
      detail:
        'Verify deployment switches, remove-before-flight provisions and restrained deployables.',
    },
  ],
  'technical-references': [
    {
      label: 'Range safety',
      detail:
        'The launch range and provider establish applicable safety requirements and revisions.',
    },
    {
      label: 'Materials',
      detail:
        'Materials and processes requirements may include NASA-STD-6016 when invoked by the mission.',
    },
    {
      label: 'Orbital debris',
      detail:
        'Apply the mission’s current debris-mitigation requirements, rather than a historical reference revision.',
    },
    {
      label: 'Environment & EMC',
      detail:
        'Environmental and electromagnetic verification follow the mission-specific verification plan.',
    },
    {
      label: 'Battery safety',
      detail:
        'Battery qualification and safety evidence must meet the selected mission’s requirements.',
    },
  ],
  'mission-timeline': [
    ['Concept', 'Define the mission, feasibility and resources.'],
    ['Funding', 'Secure resources and develop the proposal.'],
    [
      'Selection',
      'Selection and manifesting establish the launch opportunity.',
    ],
    [
      'Coordination',
      'Coordinate interfaces and mission changes with the integrator.',
    ],
    [
      'Licensing',
      'Complete applicable licensing and communications coordination.',
    ],
    [
      'Documents',
      'Develop and submit verification evidence throughout the mission.',
    ],
    ['Ground station', 'Develop and test the ground segment.'],
    ['Flight hardware', 'Fabricate, integrate and verify flight hardware.'],
    ['Reviews', 'Demonstrate readiness through the mission’s review process.'],
    ['Integration', 'Complete dispenser and launch-vehicle integration.'],
    ['Operations', 'Launch, commission and operate the mission.'],
  ].map(([label, detail]) => ({ label, detail })),
};
