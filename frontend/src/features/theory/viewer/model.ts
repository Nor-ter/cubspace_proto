import type { AssemblySpec, PartSpec, SubsystemId, Vec3 } from './types';

// Educational mechanical layout, in millimetres, with z up and the origin at
// the spacecraft centre. Interfaces and components are schematic, not a
// manufacturing definition or a replica of flight hardware.
export const ASSEMBLIES: AssemblySpec[] = [
  {
    id: 'frame',
    name: 'Corner rails and stack supports',
    subsystem: 'structure',
    explode: [0, 0, 0],
  },
  {
    id: 'top-frame',
    name: 'Upper structural frame',
    subsystem: 'structure',
    explode: [0, 0, 145],
  },
  {
    id: 'bottom-frame',
    name: 'Lower structural frame',
    subsystem: 'structure',
    explode: [0, 0, -120],
  },
  {
    id: 'eps-board',
    name: 'Power electronics and batteries',
    subsystem: 'eps',
    explode: [-95, 0, -60],
  },
  {
    id: 'obc-board',
    name: 'Flight computer',
    subsystem: 'obc',
    explode: [-95, 0, 5],
  },
  {
    id: 'comms-board',
    name: 'Radio and RF connection',
    subsystem: 'comms',
    explode: [95, 0, -35],
  },
  {
    id: 'comms-antennas',
    name: 'Stowed antenna assembly',
    subsystem: 'comms',
    explode: [95, 0, -90],
  },
  {
    id: 'adcs-board',
    name: 'Attitude sensors and magnetic actuators',
    subsystem: 'adcs',
    explode: [95, 0, 55],
  },
  {
    id: 'payload',
    name: 'Illustrative camera payload',
    subsystem: 'payload',
    explode: [0, 0, 115],
  },
  {
    id: 'solar-x-positive',
    name: 'Positive x solar panel',
    subsystem: 'eps',
    explode: [130, 0, 0],
  },
  {
    id: 'solar-x-negative',
    name: 'Negative x solar panel',
    subsystem: 'eps',
    explode: [-130, 0, 0],
  },
  {
    id: 'solar-y-positive',
    name: 'Positive y solar panel',
    subsystem: 'eps',
    explode: [0, 130, 0],
  },
  {
    id: 'solar-y-negative',
    name: 'Negative y solar panel',
    subsystem: 'eps',
    explode: [0, -130, 0],
  },
  {
    id: 'sun-sensor',
    name: 'External coarse Sun sensor',
    subsystem: 'adcs',
    explode: [130, 0, 0],
  },
];

export const PARTS: PartSpec[] = [];

type Material = PartSpec['material'];
type Axis = 'x' | 'y' | 'z';

function box(
  id: string,
  name: string,
  assembly: string,
  subsystem: SubsystemId,
  position: Vec3,
  size: Vec3,
  material: Material,
  bevel = 0,
): void {
  PARTS.push({
    id,
    name,
    assembly,
    subsystem,
    position,
    material,
    shape: { kind: 'box', size, ...(bevel > 0 ? { bevel } : {}) },
  });
}

function cylinder(
  id: string,
  name: string,
  assembly: string,
  subsystem: SubsystemId,
  position: Vec3,
  radius: number,
  height: number,
  material: Material,
  axis: Axis = 'z',
): void {
  PARTS.push({
    id,
    name,
    assembly,
    subsystem,
    position,
    material,
    shape: { kind: 'cylinder', radius, height, axis },
  });
}

function ring(
  id: string,
  name: string,
  assembly: string,
  subsystem: SubsystemId,
  position: Vec3,
  outerRadius: number,
  innerRadius: number,
  height: number,
  material: Material,
  axis: Axis = 'z',
): void {
  PARTS.push({
    id,
    name,
    assembly,
    subsystem,
    position,
    material,
    shape: { kind: 'ring', outerRadius, innerRadius, height, axis },
  });
}

function screw(
  id: string,
  assembly: string,
  subsystem: SubsystemId,
  position: Vec3,
  axis: Axis = 'z',
  radius = 1.35,
): void {
  cylinder(
    id,
    'Recessed assembly fastener',
    assembly,
    subsystem,
    position,
    radius,
    0.8,
    'aluminium',
    axis,
  );
  const slotPosition: Vec3 = [...position];
  const slotSize: Vec3 = [radius * 1.35, 0.28, 0.06];
  if (axis === 'z') slotPosition[2] += Math.sign(position[2]) * 0.42;
  if (axis === 'x') {
    slotPosition[0] += Math.sign(position[0]) * 0.42;
    slotSize[0] = 0.06;
    slotSize[1] = radius * 1.35;
    slotSize[2] = 0.28;
  }
  if (axis === 'y') {
    slotPosition[1] += Math.sign(position[1]) * 0.42;
    slotSize[0] = radius * 1.35;
    slotSize[1] = 0.06;
    slotSize[2] = 0.28;
  }
  box(
    `${id}-slot`,
    'Fastener slot',
    assembly,
    subsystem,
    slotPosition,
    slotSize,
    'darkMetal',
  );
}

// A PCB assembled from coplanar regions leaves four genuine square clearances
// around the stack rods. Gold annuli represent the plated mounting lands.
function board(
  id: string,
  assembly: string,
  subsystem: SubsystemId,
  z: number,
  material: Material = 'board',
): void {
  box(
    `${id}-centre`,
    'Circuit board substrate',
    assembly,
    subsystem,
    [0, 0, z],
    [78, 64, 1.6],
    material,
  );
  for (const side of [-1, 1]) {
    box(
      `${id}-outer-${side}`,
      'Circuit board substrate',
      assembly,
      subsystem,
      [0, side * 37.5, z],
      [78, 3, 1.6],
      material,
    );
    for (const [index, x, width] of [
      [0, -37.5, 3],
      [1, 0, 64],
      [2, 37.5, 3],
    ]) {
      box(
        `${id}-bridge-${side}-${index}`,
        'Circuit board substrate',
        assembly,
        subsystem,
        [x, side * 34, z],
        [width, 4, 1.6],
        material,
      );
    }
  }
  for (const x of [-34, 34])
    for (const y of [-34, 34]) {
      ring(
        `${id}-mount-${x}-${y}`,
        'Plated mounting hole',
        assembly,
        subsystem,
        [x, y, z + 0.9],
        3,
        2,
        0.2,
        'gold',
      );
    }
}

function chip(
  id: string,
  name: string,
  assembly: string,
  subsystem: SubsystemId,
  x: number,
  y: number,
  surface: number,
  width: number,
  depth: number,
  height: number,
  pins = 3,
): void {
  box(
    id,
    name,
    assembly,
    subsystem,
    [x, y, surface + height / 2],
    [width, depth, height],
    'chip',
    0.18,
  );
  box(
    `${id}-mark`,
    'Component orientation mark',
    assembly,
    subsystem,
    [x - width * 0.28, y + depth * 0.28, surface + height + 0.04],
    [0.75, 0.75, 0.08],
    'white',
  );
  for (const side of [-1, 1])
    for (let pin = 0; pin < pins; pin += 1) {
      const pinY = y + ((pin - (pins - 1) / 2) * depth) / (pins + 1);
      box(
        `${id}-pin-${side}-${pin}`,
        'Integrated circuit terminal',
        assembly,
        subsystem,
        [x + side * (width / 2 + 0.65), pinY, surface + 0.2],
        [1.3, 0.5, 0.4],
        'gold',
      );
    }
}

function header(
  id: string,
  assembly: string,
  subsystem: SubsystemId,
  z: number,
): void {
  box(
    `${id}-housing`,
    'Board interface connector',
    assembly,
    subsystem,
    [0, -30, z + 1.9],
    [38, 4, 3.8],
    'chip',
    0.25,
  );
  for (let index = 0; index < 10; index += 1) {
    const x = (index - 4.5) * 3.4;
    cylinder(
      `${id}-pin-${index}`,
      'Gold interface contact',
      assembly,
      subsystem,
      [x, -30, z + 4.3],
      0.36,
      1,
      'gold',
    );
  }
}

// Rail contact pads define the 100 x 100 x 113.5 mm external envelope.
for (const x of [-46, 46])
  for (const y of [-46, 46]) {
    const corner = `${x}-${y}`;
    box(
      `rail-${corner}`,
      'Aluminium corner rail',
      'frame',
      'structure',
      [x, y, 0],
      [8, 8, 105.5],
      'aluminium',
      0.5,
    );
    for (const sign of [-1, 1]) {
      const assembly = sign > 0 ? 'top-frame' : 'bottom-frame';
      box(
        `foot-${corner}-${sign}`,
        'Deployer rail contact pad',
        assembly,
        'structure',
        [x, y, sign * 56],
        [8, 8, 1.5],
        'aluminium',
        0.2,
      );
    }
  }

for (const sign of [-1, 1]) {
  const assembly = sign > 0 ? 'top-frame' : 'bottom-frame';
  for (const side of [-1, 1]) {
    box(
      `${assembly}-x-${side}`,
      'End-frame member',
      assembly,
      'structure',
      [side * 46, 0, sign * 54],
      [8, 100, 2.5],
      'aluminium',
      0.3,
    );
    box(
      `${assembly}-y-${side}`,
      'End-frame member',
      assembly,
      'structure',
      [0, side * 46, sign * 54],
      [84, 8, 2.5],
      'aluminium',
      0.3,
    );
    box(
      `${assembly}-stack-bridge-${side}`,
      'Internal stack attachment beam',
      assembly,
      'structure',
      [0, side * 34, sign * 54],
      [84, 6, 2.5],
      'aluminium',
      0.2,
    );
    screw(
      `${assembly}-bolt-${side}`,
      assembly,
      'structure',
      [side * 46, side * 27, sign * 55.65],
      'z',
      1.7,
    );
  }
}

const spacerIntervals: [number, number][] = [
  [-52.75, -51.5],
  [-49.7, -40.8],
  [-39, -13.8],
  [-12, 4.2],
  [6, 23.2],
  [25, 41.2],
  [43, 52.75],
];
for (const x of [-34, 34])
  for (const y of [-34, 34]) {
    const corner = `${x}-${y}`;
    cylinder(
      `stack-rod-${corner}`,
      'Threaded board-stack rod',
      'frame',
      'structure',
      [x, y, 0],
      1.15,
      107,
      'darkMetal',
    );
    spacerIntervals.forEach(([lower, upper], index) => {
      ring(
        `spacer-${corner}-${index}`,
        'Board-stack spacer',
        'frame',
        'structure',
        [x, y, (lower + upper) / 2],
        2.7,
        1.2,
        upper - lower,
        'aluminium',
      );
    });
  }

// Power generation: four body-mounted panels, each with four cells. Cell
// busbars are deliberately modelled separately from the dark photovoltaic face.
for (const axis of ['x', 'y'] as const)
  for (const sign of [-1, 1]) {
    const assembly = `solar-${axis}-${sign > 0 ? 'positive' : 'negative'}`;
    const coordinates = (normal: number, along: number, z: number): Vec3 =>
      axis === 'x' ? [sign * normal, along, z] : [along, sign * normal, z];
    const dimensions = (normal: number, along: number, z: number): Vec3 =>
      axis === 'x' ? [normal, along, z] : [along, normal, z];
    box(
      `${assembly}-substrate`,
      'Body-mounted solar panel',
      assembly,
      'eps',
      coordinates(48.7, 0, 0),
      dimensions(1.2, 78, 96),
      'panel',
      0.25,
    );
    for (const along of [-18, 18])
      for (const z of [-21, 21]) {
        const cell = `${assembly}-${along}-${z}`;
        box(
          `${cell}-cell`,
          'Photovoltaic cell',
          assembly,
          'eps',
          coordinates(49.45, along, z),
          dimensions(0.3, 32, 36),
          'solar',
          0.15,
        );
        for (const offset of [-8, 8]) {
          box(
            `${cell}-busbar-${offset}`,
            'Solar-cell current collector',
            assembly,
            'eps',
            coordinates(49.63, along + offset, z),
            dimensions(0.06, 0.35, 33),
            'gold',
          );
        }
      }
    for (const along of [-34, 34])
      for (const z of [-44, 44]) {
        screw(
          `${assembly}-screw-${along}-${z}`,
          assembly,
          'eps',
          coordinates(49.3, along, z),
          axis,
          1.2,
        );
      }
  }

// EPS: power board, protection/regulation components and two flat battery cells.
board('eps', 'eps-board', 'eps', -40);
header('eps-interface', 'eps-board', 'eps', -39.2);
box(
  'battery-support',
  'Battery mounting platform',
  'eps-board',
  'eps',
  [0, 3, -36.2],
  [59, 32, 2],
  'darkMetal',
  0.5,
);
for (const x of [-25, 25]) {
  box(
    `battery-support-foot-${x}`,
    'Battery platform support',
    'eps-board',
    'eps',
    [x, 3, -38.2],
    [6, 26, 2],
    'aluminium',
    0.2,
  );
}
for (const x of [-13.5, 13.5]) {
  box(
    `battery-${x}`,
    'Rechargeable battery cell',
    'eps-board',
    'eps',
    [x, 3, -29.2],
    [25, 27, 12],
    'battery',
    0.7,
  );
  box(
    `battery-label-${x}`,
    'Battery identification area',
    'eps-board',
    'eps',
    [x, 3, -23.14],
    [16, 17, 0.12],
    'white',
    0.1,
  );
  box(
    `battery-strap-${x}`,
    'Battery restraint strap',
    'eps-board',
    'eps',
    [x, 3, -22.99],
    [3.2, 27, 0.18],
    'darkMetal',
  );
  box(
    `battery-terminal-${x}`,
    'Battery terminal',
    'eps-board',
    'eps',
    [x, 17.5, -29.2],
    [5, 2, 0.7],
    'gold',
  );
}
chip(
  'eps-regulator',
  'Voltage regulator',
  'eps-board',
  'eps',
  -19,
  -21.5,
  -39.2,
  10,
  8,
  3.5,
  2,
);
chip(
  'eps-protection',
  'Battery protection electronics',
  'eps-board',
  'eps',
  11,
  -21.5,
  -39.2,
  8,
  7,
  2.1,
  2,
);
box(
  'eps-inductor',
  'Power-converter inductor',
  'eps-board',
  'eps',
  [-3.5, -21, -36.2],
  [8, 8, 6],
  'darkMetal',
  0.6,
);
ring(
  'eps-inductor-winding',
  'Inductor winding',
  'eps-board',
  'eps',
  [-3.5, -21, -32.9],
  3,
  1.5,
  0.6,
  'copper',
);
for (const x of [23, 29])
  cylinder(
    `eps-capacitor-${x}`,
    'Power filtering capacitor',
    'eps-board',
    'eps',
    [x, -20, -36.7],
    2,
    5,
    'darkMetal',
  );

// OBC: processor, non-volatile memory and timing devices.
board('obc', 'obc-board', 'obc', -13);
header('obc-interface', 'obc-board', 'obc', -12.2);
chip(
  'obc-processor',
  'Flight-computer processor',
  'obc-board',
  'obc',
  -12,
  7,
  -12.2,
  15,
  15,
  2.8,
  4,
);
chip(
  'obc-memory',
  'Non-volatile data memory',
  'obc-board',
  'obc',
  15,
  10,
  -12.2,
  10,
  15,
  1.7,
  3,
);
chip(
  'obc-watchdog',
  'Independent watchdog',
  'obc-board',
  'obc',
  11,
  -14,
  -12.2,
  8,
  6,
  1.7,
  2,
);
box(
  'obc-clock',
  'Clock oscillator',
  'obc-board',
  'obc',
  [-20, -16, -10.8],
  [7, 5, 2.8],
  'aluminium',
  0.3,
);
box(
  'obc-service-port',
  'Ground-test interface',
  'obc-board',
  'obc',
  [28, -9, -10.7],
  [8, 10, 3],
  'darkMetal',
  0.3,
);
for (const x of [-23, -17, -11, -5])
  box(
    `obc-passive-${x}`,
    'Signal-conditioning component',
    'obc-board',
    'obc',
    [x, 24, -11.55],
    [3, 1.6, 1.3],
    'chip',
    0.1,
  );

// COMMS: shielding, RF chain and a coax route outside the board edges.
board('comms', 'comms-board', 'comms', 5);
header('comms-interface', 'comms-board', 'comms', 5.8);
box(
  'rf-shield',
  'Radio-frequency shielding enclosure',
  'comms-board',
  'comms',
  [-13, 6, 9.3],
  [26, 28, 7],
  'aluminium',
  0.8,
);
box(
  'rf-shield-lid',
  'RF enclosure lid',
  'comms-board',
  'comms',
  [-13, 6, 13.05],
  [27, 29, 0.5],
  'darkMetal',
  0.25,
);
chip(
  'rf-amplifier',
  'RF power amplifier',
  'comms-board',
  'comms',
  19,
  -16,
  5.8,
  10,
  8,
  2.2,
  2,
);
for (const x of [11, 18, 25])
  box(
    `rf-filter-${x}`,
    'RF filter',
    'comms-board',
    'comms',
    [x, 4, 7.3],
    [4, 8, 3],
    'aluminium',
    0.25,
  );
box(
  'rf-connector-mount',
  'Antenna connector mounting block',
  'comms-board',
  'comms',
  [30, 13, 8.3],
  [4, 7, 5],
  'darkMetal',
  0.3,
);
ring(
  'rf-connector',
  'Coaxial antenna connector',
  'comms-board',
  'comms',
  [35.5, 13, 8.3],
  2.3,
  0.75,
  7,
  'gold',
  'x',
);
cylinder(
  'coax-top',
  'Antenna feed cable',
  'comms-board',
  'comms',
  [39.5, 13, 8.3],
  0.65,
  1,
  'darkMetal',
  'x',
);
cylinder(
  'coax-down',
  'Antenna feed cable',
  'comms-board',
  'comms',
  [40, 13, -20.25],
  0.65,
  57.1,
  'darkMetal',
);
cylinder(
  'coax-bottom',
  'Antenna feed cable',
  'comms-board',
  'comms',
  [37.5, 13, -48.8],
  0.65,
  5,
  'darkMetal',
  'x',
);

board('antenna-tray', 'comms-antennas', 'comms', -50.7, 'darkMetal');
for (const side of [-1, 1]) {
  box(
    `antenna-tape-x-${side}`,
    'Stowed spring antenna element',
    'comms-antennas',
    'comms',
    [0, side * 27, -49.7],
    [54, 1.6, 0.4],
    'copper',
  );
  box(
    `antenna-tape-y-${side}`,
    'Stowed spring antenna element',
    'comms-antennas',
    'comms',
    [side * 27, 0, -49.7],
    [1.6, 50, 0.4],
    'copper',
  );
  for (const x of [-18, 18])
    box(
      `antenna-retainer-${side}-${x}`,
      'Antenna retention clip',
      'comms-antennas',
      'comms',
      [x, side * 27, -49.15],
      [3, 4, 0.7],
      'aluminium',
      0.2,
    );
}
chip(
  'antenna-release',
  'Antenna-release interface',
  'comms-antennas',
  'comms',
  0,
  0,
  -49.9,
  12,
  8,
  2.2,
  2,
);
box(
  'antenna-feed',
  'Antenna feed termination',
  'comms-antennas',
  'comms',
  [33, 13, -48.8],
  [4, 5, 2.2],
  'gold',
  0.2,
);

// ADCS baseline: a rate sensor and magnetometer with three magnetic axes.
// The planar coil produces a moment normal to the board; the two rods supply
// the other axes. No reaction-wheel or precision-pointing capability is implied.
board('adcs', 'adcs-board', 'adcs', 24);
header('adcs-interface', 'adcs-board', 'adcs', 24.8);
chip(
  'adcs-imu',
  'Angular-rate sensor',
  'adcs-board',
  'adcs',
  -10,
  -6,
  24.8,
  8,
  8,
  2.2,
  2,
);
chip(
  'adcs-controller',
  'Attitude-control processor',
  'adcs-board',
  'adcs',
  10,
  -7,
  24.8,
  8,
  8,
  2.2,
  2,
);
chip(
  'adcs-magnetometer',
  'Magnetic-field sensor',
  'adcs-board',
  'adcs',
  27,
  -23,
  24.8,
  5,
  5,
  1.4,
  0,
);
ring(
  'adcs-planar-coil',
  'Third-axis magnetic coil',
  'adcs-board',
  'adcs',
  [10, -7, 25.4],
  14,
  12.4,
  1.2,
  'copper',
);
for (const axis of ['x', 'y'] as const) {
  const centre: Vec3 = axis === 'x' ? [0, 26, 29] : [-26, -2, 29];
  cylinder(
    `torquer-${axis}-core`,
    'Magnetic torque-rod core',
    'adcs-board',
    'adcs',
    centre,
    1.6,
    50,
    'darkMetal',
    axis,
  );
  for (let index = 0; index < 8; index += 1) {
    const winding: Vec3 = [...centre];
    winding[axis === 'x' ? 0 : 1] += (index - 3.5) * 3.7;
    ring(
      `torquer-${axis}-winding-${index}`,
      'Torque-rod winding',
      'adcs-board',
      'adcs',
      winding,
      2.15,
      1.6,
      2.1,
      'copper',
      axis,
    );
  }
  for (const end of [-20, 20]) {
    const mounting: Vec3 = [...centre];
    mounting[axis === 'x' ? 0 : 1] += end;
    ring(
      `torquer-${axis}-mount-${end}`,
      'Torque-rod mounting collar',
      'adcs-board',
      'adcs',
      mounting,
      2.3,
      1.6,
      3,
      'aluminium',
      axis,
    );
    box(
      `torquer-${axis}-foot-${end}`,
      'Torque-rod mounting foot',
      'adcs-board',
      'adcs',
      [mounting[0], mounting[1], 25.75],
      [3, 3, 1.9],
      'aluminium',
      0.15,
    );
  }
}
box(
  'sun-sensor-base',
  'Coarse Sun-sensor package',
  'sun-sensor',
  'adcs',
  [49.5, 0, 44],
  [0.4, 5, 5],
  'darkMetal',
  0.12,
);
box(
  'sun-sensor-window',
  'Sun-sensor photodiode window',
  'sun-sensor',
  'adcs',
  [49.8, 0, 44],
  [0.2, 3.5, 3.5],
  'glass',
  0.1,
);

// A camera is an illustrative payload, not an assumption about the mission's
// final instrument. Its aperture is recessed within the top rail-contact plane.
board('payload-board', 'payload', 'payload', 42);
box(
  'camera-base',
  'Camera mounting block',
  'payload',
  'payload',
  [0, 0, 43.8],
  [26, 26, 2],
  'darkMetal',
  0.4,
);
ring(
  'camera-barrel',
  'Camera optical barrel',
  'payload',
  'payload',
  [0, 0, 50.15],
  11,
  8.4,
  10.7,
  'darkMetal',
);
ring(
  'camera-bezel',
  'Camera aperture bezel',
  'payload',
  'payload',
  [0, 0, 56],
  12,
  8.4,
  1,
  'aluminium',
);
cylinder(
  'camera-lens',
  'Camera lens',
  'payload',
  'payload',
  [0, 0, 54.9],
  8.4,
  0.8,
  'glass',
);
box(
  'camera-detector',
  'Image sensor',
  'payload',
  'payload',
  [0, 0, 45.2],
  [10, 10, 0.8],
  'chip',
  0.1,
);
for (const x of [-10.5, 10.5])
  for (const y of [-10.5, 10.5])
    screw(
      `camera-screw-${x}-${y}`,
      'payload',
      'payload',
      [x, y, 45.2],
      'z',
      1.1,
    );
chip(
  'payload-processor',
  'Payload interface electronics',
  'payload',
  'payload',
  -24,
  9,
  42.8,
  10,
  13,
  1.8,
  2,
);
chip(
  'payload-memory',
  'Payload data buffer',
  'payload',
  'payload',
  24,
  9,
  42.8,
  9,
  13,
  1.6,
  2,
);
box(
  'payload-connector',
  'Payload power and data connector',
  'payload',
  'payload',
  [0, -26, 44.3],
  [23, 4, 3],
  'chip',
  0.25,
);
for (let index = 0; index < 6; index += 1)
  cylinder(
    `payload-contact-${index}`,
    'Payload connector contact',
    'payload',
    'payload',
    [(index - 2.5) * 3.3, -26, 46.2],
    0.35,
    0.8,
    'gold',
  );
