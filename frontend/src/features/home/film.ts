// From feat/onboarding-english-v2_1 (features/start/film.ts): the 40-second
// launch-to-contact mission film. Clear colour set to the v1 warm black.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import mspLogoSource from '@/assets/msp-logo-wordmark.png';

// One continuous, deterministic mission film: every frame is a pure function
// of the playback time, so play, pause, replay and scrubbing all share one
// code path. Geometry, sizes and timing are illustrative and not to scale.

export const FILM_SECONDS = 40;
/** Negative time is the hold on the pad before lift-off (onboarding v1). */
export const FILM_START = -3;

export type FilmChapter = { at: number; name: string; caption: string };

export const FILM_CHAPTERS: readonly FilmChapter[] = [
  {
    at: 0,
    name: 'Launch',
    caption:
      'Lift-off. A rideshare launch vehicle carries ACRUX-II off the pad.',
  },
  {
    at: 4,
    name: 'Ascent',
    caption:
      'The first stage separates, the fairing opens and the second stage climbs to low Earth orbit.',
  },
  {
    at: 12,
    name: 'Deployment',
    caption:
      'The deployer releases the 1U CubeSat. It leaves the launch vehicle tumbling.',
  },
  {
    at: 16,
    name: 'Detumble',
    caption:
      'Magnetorquers push against Earth’s magnetic field. B-dot control damps the body rotation, not the orbital speed.',
  },
  {
    at: 26,
    name: 'Antennas',
    caption: 'With the rotation low, the antennas deploy.',
  },
  {
    at: 31,
    name: 'Contact',
    caption:
      'A ground station comes into view. Commands go up and telemetry comes down.',
  },
];

export function chapterIndexAt(time: number) {
  let index = FILM_CHAPTERS.length - 1;
  while (index > 0 && time < FILM_CHAPTERS[index].at) index -= 1;
  return index;
}

export type FilmTelemetry = {
  /** Illustrative body rate in degrees per second; null before deployment. */
  bodyRate: number | null;
  linked: boolean;
};

export type MissionFilm = {
  render: (time: number) => FilmTelemetry;
  dispose: () => void;
};

const EARTH_RADIUS = 1;
const ORBIT_RADIUS = 1.6;
const INSERTION = 12;
const DETUMBLE_START = 16;
const ANTENNA_START = 26;
const CONTACT_START = 31;
const STAGE_SEPARATION = 7.5;
const FAIRING_SEPARATION = 9.5;

// The ground station sits near 37.8° S, 145° E and is overhead at 35 s.
const STATION_LATITUDE = -0.66;
const STATION_LONGITUDE = 2.531;
const OVERHEAD_AT = 35;

// In-plane angles, measured from +X towards +Y (north). The spacecraft flies
// south, so its angle decreases.
// Onboarding v1: lift-off from Melbourne, under the ground station (v2_1
// launched 87° up-track, near Japan). Forty seconds cover a quarter orbit, so
// between the antennas and contact the camera pulls back to the whole Earth
// and the orbit runs as a time-lapse until the spacecraft is back over
// Melbourne. The pad sits just down-range of the Melbourne pin.
const LAUNCH_ANGLE = STATION_LATITUDE - 0.045;
const ORBIT_RATE = 0.04366;
const ASCENT_SWEEP = ORBIT_RATE * (INSERTION / 2);
const INSERTION_ANGLE = LAUNCH_ANGLE - ASCENT_SWEEP;
const LAPSE_START = 28.5;
const LAPSE_SECONDS = 5;
// Extra sweep that brings the spacecraft overhead at OVERHEAD_AT, one lap on.
const LAPSE_SWEEP =
  INSERTION_ANGLE -
  ORBIT_RATE * (OVERHEAD_AT - INSERTION) -
  STATION_LATITUDE +
  Math.PI * 2;

// Earth turns once for roughly fifteen of these orbits.
const EARTH_RATE = ORBIT_RATE / 15;

const TUMBLE_RATE = 3.2;
const DAMPING = 0.45;
const DISPLAY_RATE = 18;
const SAT_SIZE = 0.07;
// Onboarding v1: the CubeSat stays small beside the vehicle and grows into
// view gently after it leaves the deployer (v2_1: full size within 1 s).
const SAT_SCALE = 0.4;
const SAT_GROW_SECONDS = 2.5;
// The vehicle origin is the second-stage engine, this far above the pad.
const PAD_HEIGHT = 0.1;

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const smooth = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};
const lapse = (time: number) => smooth((time - LAPSE_START) / LAPSE_SECONDS);
const orbitAngle = (time: number) =>
  INSERTION_ANGLE - ORBIT_RATE * (time - INSERTION) - LAPSE_SWEEP * lapse(time);
const inPlane = (angle: number, radius: number) =>
  new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);

function vehiclePosition(time: number) {
  if (time >= INSERTION) return inPlane(orbitAngle(time), ORBIT_RADIUS);
  const u = clamp01(time / INSERTION);
  return inPlane(
    LAUNCH_ANGLE - ASCENT_SWEEP * u * u,
    EARTH_RADIUS +
      PAD_HEIGHT +
      (ORBIT_RADIUS - EARTH_RADIUS - PAD_HEIGHT) * smooth(u),
  );
}

function tumbleAngle(time: number) {
  if (time < DETUMBLE_START) return TUMBLE_RATE * (time - INSERTION);
  return (
    TUMBLE_RATE * (DETUMBLE_START - INSERTION) +
    (TUMBLE_RATE / DAMPING) * (1 - Math.exp(-DAMPING * (time - DETUMBLE_START)))
  );
}

function bodyRate(time: number) {
  if (time < INSERTION) return null;
  if (time < DETUMBLE_START) return DISPLAY_RATE;
  return DISPLAY_RATE * Math.exp(-DAMPING * (time - DETUMBLE_START));
}

// [time, follow, radial, forward, normal]: the camera sits at these offsets in
// the subject's local frame and looks at a point `follow` of the way from
// Earth's centre to the subject.
const CAMERA_KEYS: readonly (readonly number[])[] = [
  // Onboarding v1: a wide establishing shot of the pad on Earth's limb,
  // held under the page title, that closes in during the countdown.
  [FILM_START, 1.26, 0.46, -0.62, 1.8],
  // Onboarding v1: lift-off and ascent framed wider, so Earth stays in view
  // under a smaller rocket (v2_1: [0, 1, 0.05, -0.1, 0.42], [4, 1, 0.08,
  // -0.14, 0.55]).
  [0, 0.99, 0.26, -0.34, 1.05],
  [4, 0.98, 0.16, -0.3, 1.45],
  [9, 1, 0.2, -0.25, 0.9],
  // Onboarding v1: held further back once the CubeSat is out, so the small
  // spacecraft and its surroundings stay in frame (v2_1 normal offsets:
  // 0.32, 0.24, 0.24, 0.32).
  [12, 1, 0.1, -0.12, 0.4],
  [16, 1, 0.08, 0.03, 0.3],
  [26, 1, 0.08, -0.03, 0.3],
  [LAPSE_START, 1, 0.1, 0, 0.38],
  // Onboarding v1: pull back to the whole Earth for the orbit time-lapse,
  // then close in on the pass over Melbourne (v2_1: [30, 1, 0.1, 0, 0.38]).
  [30.5, 0.2, 1.4, 0, 3.4],
  [32.5, 0.2, 1.4, 0, 3.4],
  [35, 0.75, 0.5, 0, 1.6],
  [FILM_SECONDS, 0.6, 0.7, 0, 2.3],
];

function cameraKey(time: number) {
  let index = CAMERA_KEYS.length - 2;
  while (index > 0 && time < CAMERA_KEYS[index][0]) index -= 1;
  const from = CAMERA_KEYS[index];
  const to = CAMERA_KEYS[index + 1];
  const blend = smooth((time - from[0]) / (to[0] - from[0]));
  return from.map((value, i) => value + (to[i] - value) * blend);
}

// Onboarding v1: the fairing and the upper stage carry the Melbourne Space
// Program mark, reading bottom to top on the side that faces the camera.
const VEHICLE_WHITE = '#eef0f2';
const logoImage = () => {
  const image = new Image();
  image.src = mspLogoSource;
  return image;
};

/**
 * A skin for a surface of revolution: canvas x runs once around it with the
 * camera-facing side (+Z) at the centre, canvas y runs top to bottom. The mark
 * fills `length` world units along the band [bandBottom, bandTop] of v.
 */
function logoSkin(
  circumference: number,
  bandBottom: number,
  bandTop: number,
  bandHeight: number,
  length: number,
) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 2048;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  const context = canvas.getContext('2d');
  if (!context) return texture;
  context.fillStyle = VEHICLE_WHITE;
  context.fillRect(0, 0, canvas.width, canvas.height);
  const logo = logoImage();
  logo.onload = () => {
    const bandPixels = (bandTop - bandBottom) * canvas.height;
    const lengthPixels = (length / bandHeight) * bandPixels;
    const thicknessPixels =
      ((length * logo.height) / logo.width / circumference) * canvas.width;
    context.save();
    context.translate(
      canvas.width / 2,
      canvas.height * (1 - (bandBottom + bandTop) / 2),
    );
    context.rotate(-Math.PI / 2);
    // Multiply keeps the navy ink and drops the white backing; a second
    // pass darkens the thin strokes so they hold at this small size.
    context.globalCompositeOperation = 'multiply';
    for (let pass = 0; pass < 2; pass++)
      context.drawImage(
        logo,
        -lengthPixels / 2,
        -thicknessPixels / 2,
        lengthPixels,
        thicknessPixels,
      );
    context.restore();
    texture.needsUpdate = true;
  };
  return texture;
}

const skinMaterial = (map: THREE.Texture) =>
  new THREE.MeshStandardMaterial({ map, metalness: 0.15, roughness: 0.5 });

function buildLaunchVehicle() {
  const white = new THREE.MeshStandardMaterial({
    color: 0xeef0f2,
    metalness: 0.15,
    roughness: 0.5,
  });
  const dark = new THREE.MeshStandardMaterial({
    color: 0x1b1d20,
    metalness: 0.4,
    roughness: 0.55,
  });
  const fire = new THREE.MeshBasicMaterial({ color: 0xffb54d });
  const radius = 0.008;
  const vehicle = new THREE.Group();

  // Two-stage vehicle with landing legs, grid fins, a black interstage and a
  // wider payload fairing, after the Falcon 9 layout. The second-stage engine
  // sits at the group origin so the vehicle follows the stage that reaches orbit.
  const first = new THREE.Group();
  first.position.y = -0.1;
  vehicle.add(first);
  const booster = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, 0.085, 24),
    white,
  );
  booster.position.y = 0.0425;
  first.add(booster);
  const interstage = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 1.01, radius * 1.01, 0.014, 24),
    dark,
  );
  interstage.position.y = 0.092;
  first.add(interstage);
  for (let i = 0; i < 4; i++) {
    const turn = (i * Math.PI) / 2 + Math.PI / 4;
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.0035, 0.03, 0.0016),
      dark,
    );
    leg.position.set(
      Math.cos(turn) * (radius + 0.0006),
      0.016,
      Math.sin(turn) * (radius + 0.0006),
    );
    leg.rotation.y = -turn + Math.PI / 2;
    first.add(leg);
    const fin = new THREE.Mesh(
      new THREE.BoxGeometry(0.006, 0.0012, 0.004),
      dark,
    );
    fin.position.set(
      Math.cos(turn) * (radius + 0.003),
      0.08,
      Math.sin(turn) * (radius + 0.003),
    );
    fin.rotation.y = -turn;
    first.add(fin);
  }
  // Nine engines: eight in a ring around one in the centre.
  for (let i = 0; i < 9; i++) {
    const turn = (i * Math.PI) / 4;
    const ring = i === 8 ? 0 : radius * 0.66;
    const nozzle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0011, 0.0019, 0.005, 10),
      dark,
    );
    nozzle.position.set(Math.cos(turn) * ring, -0.0025, Math.sin(turn) * ring);
    first.add(nozzle);
  }
  const firstFlame = new THREE.Mesh(
    new THREE.ConeGeometry(radius * 0.95, 0.05, 16),
    fire,
  );
  firstFlame.rotation.z = Math.PI;
  firstFlame.position.y = -0.03;
  first.add(firstFlame);

  const second = new THREE.Group();
  vehicle.add(second);
  // Cylinder u = 0 faces +Z; the skin is centred there by half a turn.
  const tankSkin = logoSkin(Math.PI * 2 * radius, 0.06, 0.94, 0.03, 0.025);
  tankSkin.offset.x = 0.5;
  const tank = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, 0.03, 32),
    skinMaterial(tankSkin),
  );
  tank.position.y = 0.015;
  second.add(tank);
  const vacuumNozzle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.003, 0.0062, 0.012, 16),
    dark,
  );
  vacuumNozzle.position.y = -0.006;
  second.add(vacuumNozzle);
  const adapter = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.55, radius, 0.006, 16),
    dark,
  );
  adapter.position.y = 0.033;
  second.add(adapter);
  const secondFlame = new THREE.Mesh(
    new THREE.ConeGeometry(0.0055, 0.034, 16),
    fire,
  );
  secondFlame.rotation.z = Math.PI;
  secondFlame.position.y = -0.029;
  second.add(secondFlame);

  const fairingRadius = radius * 1.32;
  const profile = [
    new THREE.Vector2(radius, 0),
    new THREE.Vector2(fairingRadius, 0.006),
    new THREE.Vector2(fairingRadius, 0.03),
    new THREE.Vector2(fairingRadius * 0.86, 0.042),
    new THREE.Vector2(fairingRadius * 0.55, 0.052),
    new THREE.Vector2(0.0004, 0.058),
  ];
  // The mark sits on the straight section (profile points 1 to 2, v 0.2 to
  // 0.4). Each half covers half a turn of the shared skin and starts at +Z.
  const fairing = [0, Math.PI].map((start, i) => {
    const map = logoSkin(Math.PI * 2 * fairingRadius, 0.2, 0.4, 0.024, 0.021);
    map.repeat.x = 0.5;
    map.offset.x = i ? 1 : 0.5;
    const material = skinMaterial(map);
    material.side = THREE.DoubleSide;
    const half = new THREE.Mesh(
      new THREE.LatheGeometry(profile, 32, start, Math.PI),
      material,
    );
    half.position.y = 0.03;
    second.add(half);
    return half;
  });

  return { vehicle, first, firstFlame, secondFlame, fairing };
}

export function createMissionFilm(host: HTMLElement): MissionFilm {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.setClearColor(0x161612);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 200);
  scene.add(new THREE.HemisphereLight(0x9fc4e8, 0x0b0f18, 0.55));
  const sun = new THREE.DirectionalLight(0xfff6e8, 3.4);
  sun.position.set(2.2, 1.2, 3);
  scene.add(sun);

  const textures: THREE.Texture[] = [];
  const earthMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a4d74,
    roughness: 0.92,
  });
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(EARTH_RADIUS, 96, 64),
    earthMaterial,
  );
  scene.add(earth);
  new THREE.TextureLoader().load(
    `${import.meta.env.BASE_URL}textures/earth-blue-marble.jpg`,
    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      textures.push(texture);
      earthMaterial.map = texture;
      earthMaterial.color.set(0xffffff);
      earthMaterial.needsUpdate = true;
    },
  );
  scene.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS * 1.025, 64, 48),
      new THREE.MeshBasicMaterial({
        color: 0x4d9bff,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    ),
  );

  // Fixed pseudo-random star positions keep every replay identical.
  let seed = 20261113;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const starPositions: number[] = [];
  for (let i = 0; i < 1400; i++) {
    const direction = new THREE.Vector3(
      random() * 2 - 1,
      random() * 2 - 1,
      random() * 2 - 1,
    );
    if (direction.lengthSq() < 0.05) continue;
    direction.normalize().multiplyScalar(60);
    starPositions.push(direction.x, direction.y, direction.z);
  }
  const stars = new THREE.Points(
    new THREE.BufferGeometry().setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starPositions, 3),
    ),
    new THREE.PointsMaterial({
      color: 0xdfeaff,
      size: 1.6,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.8,
    }),
  );
  scene.add(stars);

  const orbitLine = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(
      Array.from({ length: 180 }, (_, i) =>
        inPlane((i / 180) * Math.PI * 2, ORBIT_RADIUS),
      ),
    ),
    new THREE.LineBasicMaterial({
      color: 0x75bad3,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    }),
  );
  scene.add(orbitLine);

  // Dipole field lines, r = L cos²(latitude), shown while detumbling.
  const fieldMaterial = new THREE.LineBasicMaterial({
    color: 0xefbe91,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const field = new THREE.Group();
  for (const shell of [1.7, 2.3, 3.2]) {
    for (const side of [1, -1]) {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 80; i++) {
        const latitude = -1.45 + (i / 80) * 2.9;
        const radius = shell * Math.cos(latitude) ** 2;
        if (radius < EARTH_RADIUS) continue;
        points.push(
          new THREE.Vector3(
            side * radius * Math.cos(latitude),
            radius * Math.sin(latitude),
            0,
          ),
        );
      }
      field.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(points),
          fieldMaterial,
        ),
      );
    }
  }
  scene.add(field);

  const { vehicle, first, firstFlame, secondFlame, fairing } =
    buildLaunchVehicle();
  scene.add(vehicle);

  const satellite = new THREE.Group();
  scene.add(satellite);
  const placeholder = new THREE.Mesh(
    new THREE.BoxGeometry(SAT_SIZE, SAT_SIZE, SAT_SIZE),
    new THREE.MeshStandardMaterial({
      color: 0x25282b,
      metalness: 0.3,
      roughness: 0.5,
    }),
  );
  satellite.add(placeholder);
  let disposed = false;
  new GLTFLoader().load(
    `${import.meta.env.BASE_URL}models/cubesat-1u-subsystems.glb`,
    (gltf) => {
      if (disposed) return;
      const asset = gltf.scene;
      // Normalise to the chassis, not the already deployed GLB antennas.
      // Including those antennas shrank the body and detached the film rods.
      asset.updateMatrixWorld(true);
      const box = new THREE.Box3();
      asset.traverse((object) => {
        if (/^rail_[1-4]$/.test(object.name))
          box.union(new THREE.Box3().setFromObject(object));
        if (object.name.startsWith('antenna_rod_')) object.visible = false;
      });
      if (box.isEmpty()) box.setFromObject(asset);
      const size = box.getSize(new THREE.Vector3());
      const holder = new THREE.Group();
      asset.position.sub(box.getCenter(new THREE.Vector3()));
      holder.add(asset);
      holder.scale.setScalar(SAT_SIZE / Math.max(size.x, size.y, size.z));
      satellite.remove(placeholder);
      satellite.add(holder);
      holder.updateWorldMatrix(true, true);
      rods.forEach((rod, index) => {
        const spool = asset.getObjectByName(`antenna_spool_${index + 1}`);
        if (!spool) return;
        rod.position.copy(
          satellite.worldToLocal(spool.getWorldPosition(new THREE.Vector3())),
        );
        const direction = new THREE.Vector3(
          rod.position.x,
          0,
          rod.position.z,
        ).normalize();
        rod.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          direction,
        );
      });
    },
  );

  const rodMaterial = new THREE.MeshStandardMaterial({
    color: 0xdce8ef,
    metalness: 0.6,
    roughness: 0.35,
  });
  const rods = Array.from({ length: 4 }, (_, index) => {
    const turn = (index * Math.PI) / 2;
    const direction = new THREE.Vector3(Math.cos(turn), 0, Math.sin(turn));
    const rod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.00045, 0.00045, 1, 8).translate(0, 0.5, 0),
      rodMaterial,
    );
    // Geometry starts at the mount: growing it never moves the root.
    rod.position.set(
      direction.x * SAT_SIZE * 0.3,
      -SAT_SIZE * 0.55,
      direction.z * SAT_SIZE * 0.3,
    );
    rod.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    satellite.add(rod);
    return rod;
  });

  const station = new THREE.Group();
  const stationUnit = new THREE.Vector3(
    Math.cos(STATION_LATITUDE) * Math.cos(STATION_LONGITUDE),
    Math.sin(STATION_LATITUDE),
    -Math.cos(STATION_LATITUDE) * Math.sin(STATION_LONGITUDE),
  );
  station.position.copy(stationUnit).multiplyScalar(EARTH_RADIUS);
  station.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    stationUnit,
  );
  // Melbourne: a glossy map pin that turns to face the camera.
  const PIN_HEIGHT = 0.05;
  const PIN_RADIUS = PIN_HEIGHT * 0.36;
  const pinCentre = PIN_HEIGHT - PIN_RADIUS;
  const tangent = Math.acos(PIN_RADIUS / pinCentre);
  const pinShape = new THREE.Shape();
  pinShape.moveTo(0, 0);
  pinShape.absarc(
    0,
    pinCentre,
    PIN_RADIUS,
    -Math.PI / 2 + tangent,
    (3 * Math.PI) / 2 - tangent,
    false,
  );
  pinShape.lineTo(0, 0);
  const pinHole = new THREE.Path();
  pinHole.absarc(0, pinCentre, PIN_RADIUS * 0.45, 0, Math.PI * 2, true);
  pinShape.holes.push(pinHole);
  const pinBevel = PIN_RADIUS * 0.28;
  const pinGeometry = new THREE.ExtrudeGeometry(pinShape, {
    depth: PIN_RADIUS * 0.3,
    bevelEnabled: true,
    bevelThickness: pinBevel,
    bevelSize: pinBevel * 0.8,
    bevelSegments: 6,
    curveSegments: 40,
  });
  pinGeometry.translate(0, pinBevel * 0.8, -PIN_RADIUS * 0.15);
  const pin = new THREE.Mesh(
    pinGeometry,
    new THREE.MeshPhysicalMaterial({
      color: 0xb3121b,
      roughness: 0.28,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    }),
  );
  station.add(pin);

  earth.add(station);

  const signal = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]),
    new THREE.LineBasicMaterial({
      color: 0x9fd0dc,
      transparent: true,
      opacity: 0.55,
    }),
  );
  signal.frustumCulled = false;
  scene.add(signal);
  const packets = Array.from({ length: 6 }, (_, i) => {
    const packet = new THREE.Mesh(
      new THREE.SphereGeometry(0.008, 10, 8),
      new THREE.MeshBasicMaterial({ color: i % 2 ? 0xa6d86f : 0x9fd0dc }),
    );
    scene.add(packet);
    return packet;
  });

  const up = new THREE.Vector3(0, 1, 0);
  const normal = new THREE.Vector3(0, 0, 1);
  const stationWorld = new THREE.Vector3();

  function resize() {
    const { clientWidth: width, clientHeight: height } = host;
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(height, 1);
    // Keep the subject framed on portrait screens.
    camera.fov = camera.aspect < 1 ? 52 : 38;
    camera.updateProjectionMatrix();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();

  function render(time: number): FilmTelemetry {
    const t = Math.min(Math.max(time, 0), FILM_SECONDS);
    // Melbourne is under the orbit plane at lift-off and again at contact;
    // the time-lapse absorbs the small difference in between.
    earth.rotation.y =
      -STATION_LONGITUDE + EARTH_RATE * (t - OVERHEAD_AT * lapse(t));

    const subject = vehiclePosition(t);
    const heading = vehiclePosition(t + 0.05).sub(subject);
    if (heading.lengthSq() < 1e-10) heading.copy(subject);
    heading.normalize();
    const radial = subject.clone().normalize();

    // The upper stage coasts on behind the spacecraft after deployment.
    const lag = t > INSERTION ? 0.02 * (t - INSERTION) : 0;
    const stagePosition =
      lag > 0 ? inPlane(orbitAngle(t) + lag, ORBIT_RADIUS) : subject;
    vehicle.position.copy(stagePosition);
    // The spent upper stage drops out of view as the time-lapse starts.
    vehicle.visible = t < LAPSE_START + 0.5;
    vehicle.quaternion.setFromUnitVectors(up, heading);
    const separated = t - STAGE_SEPARATION;
    first.visible = separated < 4;
    first.position.set(
      0,
      -0.1 - Math.max(separated, 0) * 0.035,
      Math.max(separated, 0) * 0.008,
    );
    first.rotation.x = Math.max(separated, 0) * 0.12;
    firstFlame.visible = t > 0.3 && separated < 0;
    firstFlame.scale.y = 0.85 + 0.15 * Math.sin(t * 40);
    secondFlame.visible = separated > 0.4 && t < INSERTION - 0.4;
    secondFlame.scale.y = 0.85 + 0.15 * Math.sin(t * 46);
    const opened = t - FAIRING_SEPARATION;
    fairing.forEach((half, i) => {
      const side = i ? -1 : 1;
      half.visible = opened < 2;
      half.position.set(0, 0.03 - Math.max(opened, 0) * 0.02, 0);
      half.position.z = side * Math.max(opened, 0) * 0.03;
      half.rotation.x = side * Math.max(opened, 0) * 0.35;
    });

    // The spacecraft is drawn far larger than the vehicle that carries it, so
    // it grows as it leaves the deployer instead of appearing at full size.
    satellite.visible = t >= INSERTION;
    satellite.position.copy(subject);
    satellite.scale.setScalar(
      SAT_SCALE * (0.15 + 0.85 * smooth((t - INSERTION) / SAT_GROW_SECONDS)),
    );
    const spin = tumbleAngle(Math.max(t, INSERTION));
    satellite.rotation.set(0.3 + spin * 0.65, spin, spin * 0.3);
    const deployed = smooth((t - ANTENNA_START) / 3.5);
    rods.forEach((rod) => {
      rod.visible = deployed > 0;
      rod.scale.y = SAT_SIZE * 1.3 * deployed;
    });

    fieldMaterial.opacity =
      0.4 *
      smooth((t - DETUMBLE_START + 1) / 2) *
      (1 - smooth((t - ANTENNA_START) / 3));
    field.visible = fieldMaterial.opacity > 0.01;
    orbitLine.material.opacity = 0.5 * smooth((t - INSERTION) / 3);

    earth.updateMatrixWorld();
    station.getWorldPosition(stationWorld);
    const stationUp = stationWorld.clone().normalize();
    const linked =
      t >= CONTACT_START && satellite.position.dot(stationUp) > EARTH_RADIUS;
    signal.visible = linked;
    if (linked)
      signal.geometry.setFromPoints([stationWorld, satellite.position]);
    packets.forEach((packet, i) => {
      packet.visible = linked;
      let along = (t * 0.45 + i / packets.length) % 1;
      if (i % 2) along = 1 - along;
      packet.position.lerpVectors(stationWorld, satellite.position, along);
    });

    const [, follow, radialOffset, forwardOffset, normalOffset] = cameraKey(
      Math.min(Math.max(time, FILM_START), FILM_SECONDS),
    );
    const lookAt = subject.clone().multiplyScalar(follow);
    camera.position
      .copy(lookAt)
      .addScaledVector(radial, radialOffset)
      .addScaledVector(heading, forwardOffset)
      .addScaledVector(normal, normalOffset);
    camera.up.copy(radial);
    camera.lookAt(lookAt);
    // The pin turns about its own axis to face the camera, like a map marker.
    const cameraLocal = station.worldToLocal(camera.position.clone());
    pin.rotation.y = Math.atan2(cameraLocal.x, cameraLocal.z);
    renderer.render(scene, camera);

    return { bodyRate: bodyRate(t), linked };
  }

  function dispose() {
    disposed = true;
    observer.disconnect();
    scene.traverse((object) => {
      if (
        object instanceof THREE.Mesh ||
        object instanceof THREE.Line ||
        object instanceof THREE.Points
      ) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];
        materials.forEach((material: THREE.Material) => {
          if ('map' in material && material.map instanceof THREE.Texture)
            material.map.dispose();
          material.dispose();
        });
      }
    });
    textures.forEach((texture) => texture.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  }

  return { render, dispose };
}
