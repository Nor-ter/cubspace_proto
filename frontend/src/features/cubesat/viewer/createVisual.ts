import { isolateCanvasWheel } from '@/lib/isolateCanvasWheel';
import { createDispenser } from './dispenser';
import {
  EARTH_RADIUS_KM,
  EARTH_SIDEREAL_SECONDS,
  ORBIT_PRESETS,
  orbitPeriodSeconds,
  type OrbitReadout,
} from './orbit';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PARTS } from '@/features/subsystems/viewer/model';
import { partGeometry } from '@/features/subsystems/viewer/scene';
import { createAppearance } from '@/features/subsystems/viewer/appearance';
import { VISUAL_ITEMS } from './visuals';

export function createVisual(
  host: HTMLElement,
  kind: string,
  selected: number,
  preview: boolean,
  onSelect: (index: number) => void,
  onOrbitUpdate?: (readout: OrbitReadout) => void,
) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.append(renderer.domElement);
  const scene = new THREE.Scene();
  const appearance = createAppearance(renderer);
  scene.environment = appearance.environment;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x39404e, 2));
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(8, 12, 9);
  scene.add(light);
  const root = new THREE.Group();
  scene.add(root);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 1000);
  const controls = new OrbitControls(camera, renderer.domElement);
  const releaseWheel = preview
    ? () => {}
    : isolateCanvasWheel(renderer.domElement);
  controls.enableDamping = false;
  controls.enablePan = !preview;
  controls.enableZoom = !preview;
  controls.enabled = !preview;
  const items = VISUAL_ITEMS[kind] ?? [];
  const material = (colour: number, metalness = 0.3) =>
    new THREE.MeshStandardMaterial({
      color: colour,
      metalness,
      roughness: 0.38,
    });
  const metal = material(0xc4c7ca, 0.85);
  const accent = material(0xb7d47b);
  const dark = material(0x343b45);
  function box(
    parent: THREE.Object3D,
    size: number[],
    position: number[],
    mat = metal,
  ) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(size[0], size[1], size[2]),
      mat,
    );
    mesh.position.set(position[0], position[1], position[2]);
    parent.add(mesh);
    return mesh;
  }
  function tag(object: THREE.Object3D, index: number) {
    object.traverse((child) => {
      child.userData.item = index;
    });
  }
  function text(label: string, position: number[], size = 0.35) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 80;
    const ctx = canvas.getContext('2d')!;
    ctx.font = '600 44px sans-serif';
    ctx.fillStyle = '#fbf4e6';
    ctx.textAlign = 'center';
    ctx.fillText(label, 256, 52);
    const texture = new THREE.CanvasTexture(canvas);
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: texture, depthTest: false }),
    );
    sprite.position.set(position[0], position[1], position[2]);
    sprite.scale.set(size * 6.4, size, 1);
    root.add(sprite);
  }
  let template: THREE.Group | undefined;
  function spacecraft(
    dimensions: readonly number[],
    position: number[],
    index: number,
  ) {
    if (!template) {
      template = new THREE.Group();
      for (const part of PARTS) {
        const mesh = new THREE.Mesh(
          partGeometry(part),
          appearance.material(part),
        );
        mesh.position.set(...part.position);
        if (part.rotation) mesh.rotation.set(...part.rotation);
        template.add(mesh);
      }
      template.rotation.x = -Math.PI / 2;
      template.scale.setScalar(0.009);
    }
    const group = new THREE.Group();
    group.add(template.clone(true));
    group.scale.set(dimensions[0], dimensions[1], dimensions[2]);
    group.position.set(position[0], position[1], position[2]);
    tag(group, index);
    root.add(group);
    return group;
  }
  let updateOrbit: ((angle: number) => OrbitReadout) | undefined;
  if (kind === 'earth-orbits') {
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(1, 48, 32),
      material(0x527d9a),
    );
    const earthSpin = new THREE.Group();
    earthSpin.add(earth);
    root.add(earthSpin);
    const wire = new THREE.Mesh(
      new THREE.SphereGeometry(1.006, 16, 10),
      new THREE.MeshBasicMaterial({
        color: 0x9fd0dc,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      }),
    );
    earthSpin.add(wire);
    const orbit = ORBIT_PRESETS[selected];
    let selectedPlane = new THREE.Quaternion();
    let selectedRing: THREE.Mesh | undefined;
    ORBIT_PRESETS.forEach((preset, i) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(
          preset.displayRadius,
          i === selected ? 0.025 : 0.009,
          8,
          160,
        ),
        new THREE.MeshBasicMaterial({
          color: i === selected ? 0xcce68c : 0x566070,
          transparent: i !== selected,
          opacity: i === selected ? 1 : 0.4,
        }),
      );
      // A torus starts in XY; rotate its equatorial plane into XZ, then incline it.
      ring.rotation.x =
        -Math.PI / 2 + THREE.MathUtils.degToRad(preset.inclinationDeg);
      tag(ring, i);
      root.add(ring);
      if (i === selected) {
        selectedPlane = ring.quaternion.clone();
        selectedRing = ring;
      }
    });
    const cube = spacecraft(
      [0.3, 0.3, 0.3],
      [orbit.displayRadius, 0, 0],
      selected,
    );
    const outline = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(1.25, 1.25, 1.25)),
      new THREE.LineBasicMaterial({ color: 0xcce68c }),
    );
    cube.add(outline);
    const altitudeGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(orbit.displayRadius, 0, 0),
    ]);
    const altitudeLine = new THREE.Line(
      altitudeGeometry,
      new THREE.LineBasicMaterial({ color: 0xcce68c }),
    );
    root.add(altitudeLine);
    const groundPoint = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 12, 8),
      new THREE.MeshBasicMaterial({ color: 0xcce68c }),
    );
    root.add(groundPoint);
    const basePlane = selectedPlane.clone();
    const earthAxis = new THREE.Vector3(0, 1, 0);
    updateOrbit = (angle: number) => {
      const physicalSeconds =
        (angle / (Math.PI * 2)) * orbitPeriodSeconds(selected);
      earthSpin.rotation.y =
        (physicalSeconds * Math.PI * 2) / EARTH_SIDEREAL_SECONDS;
      if (selected === 4) {
        const node = (physicalSeconds * Math.PI * 2) / (365.2422 * 86400);
        selectedPlane = new THREE.Quaternion()
          .setFromAxisAngle(earthAxis, node)
          .multiply(basePlane);
        selectedRing?.quaternion.copy(selectedPlane);
      }
      const direction = new THREE.Vector3(
        Math.cos(angle),
        Math.sin(angle),
        0,
      ).applyQuaternion(selectedPlane);
      cube.position.copy(direction).multiplyScalar(orbit.displayRadius);
      cube.rotation.set(0, angle, 0);
      groundPoint.position.copy(direction).multiplyScalar(1.01);
      const points = altitudeGeometry.getAttribute('position');
      points.setXYZ(0, direction.x, direction.y, direction.z);
      points.setXYZ(1, cube.position.x, cube.position.y, cube.position.z);
      points.needsUpdate = true;
      altitudeGeometry.computeBoundingSphere();
      // Convert the compressed display radius back to its physical circular radius.
      const centreDistanceKm =
        (cube.position.length() / orbit.displayRadius) *
        (EARTH_RADIUS_KM + orbit.altitudeKm);
      return {
        altitudeKm: centreDistanceKm - EARTH_RADIUS_KM,
        angleDeg: THREE.MathUtils.radToDeg(angle) % 360,
      };
    };
    updateOrbit(0);
  } else if (
    kind === 'cp1-cp10' ||
    kind === 'unit-configurations' ||
    kind === 'mass-and-size'
  ) {
    items.forEach((item, i) => {
      const x = (i - (items.length - 1) / 2) * 2.2;
      spacecraft(item.units!, [x, item.units![1] / 2, 0], i);
      text(item.label, [x, -0.45, 0], 0.32);
      if (i === selected && !preview)
        box(root, [1.6, 0.05, 1.5], [x, -0.2, 0], accent);
    });
  } else if (kind === 'p-pod') {
    const { group, hinge } = createDispenser();
    root.add(group);
    hinge.rotation.x = selected === 1 ? -Math.PI * 0.6 : 0;
    spacecraft([0.7, 0.7, 0.7], [0, selected === 1 ? 2.7 : 1.1, 0], 1);
  } else if (kind === 'launch-vehicles') {
    const rocket = new THREE.Group();
    root.add(rocket);
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.45, 5, 40),
      metal,
    );
    body.position.y = 1;
    rocket.add(body);
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.3, 40), metal);
    nose.position.y = 4.15;
    rocket.add(nose);
    box(rocket, [0.92, 0.3, 0.92], [0, -0.4, 0], dark);
    tag(rocket, 0);
    const payload = box(
      root,
      [1.1, 0.6, 1.1],
      [2, 1.5, 0],
      selected === 1 ? accent : dark,
    );
    tag(payload, 1);
    spacecraft([1, 1, 1], [3.5, 1.5, 0], 2);
    text('LAUNCHER', [0, -2.1, 0]);
    text('DISPENSER', [2, 0.5, 0], 0.25);
    text('CUBESAT', [3.5, 0.5, 0], 0.25);
  } else if (kind === 'acceptance-checklist') {
    spacecraft([1, 1, 1], [0, 0, 0], selected);
    const envelope = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 1.5, 1.4),
      new THREE.MeshBasicMaterial({ color: 0xb7d47b, wireframe: true }),
    );
    root.add(envelope);
    if (selected === 1)
      for (const x of [-0.57, 0.57])
        for (const z of [-0.57, 0.57])
          box(root, [0.07, 1.4, 0.07], [x, 0, z], accent);
    if (selected === 2) box(root, [0.1, 0.1, 0.35], [0.65, 0.2, 0], accent);
    text(items[selected].label.toUpperCase(), [0, -1, 0]);
  } else if (kind === 'mission-timeline') {
    items.forEach((item, i) => {
      const duration = [1.6, 2, 1.2, 5, 2.5, 4, 3, 4.5, 0.5, 0.9, 1.3][i];
      const start = [0, 0.4, 2, 2.5, 3, 3, 2.3, 2.7, 7, 7.6, 8.5][i];
      const bar = box(
        root,
        [duration, 0.16, 0.45],
        [start + duration / 2, 0, i * 0.7],
        i === selected ? accent : dark,
      );
      tag(bar, i);
      text(item.label, [-1.3, 0, i * 0.7], 0.25);
    });
  } else {
    items.forEach((item, i) => {
      const x = (i % 3) * 2.5,
        y = Math.floor(i / 3) * 1.5;
      const page = box(
        root,
        [2.05, 1.12, 0.12],
        [x, -y, 0],
        i === selected ? accent : dark,
      );
      tag(page, i);
      for (let row = 0; row < 3; row++)
        box(root, [1.4, 0.025, 0.02], [x, -y + 0.25 - row * 0.19, 0.08]);
      text(item.label, [x, -y - 0.85, 0.12], 0.24);
    });
  }
  const bounds = new THREE.Box3().setFromObject(root);
  const centre = bounds.getCenter(new THREE.Vector3());
  root.position.sub(centre);
  const extent = Math.max(...bounds.getSize(new THREE.Vector3()).toArray());
  const distance = extent * 1.35;
  camera.position.set(distance * 0.65, distance * 0.4, distance);
  controls.target.set(0, 0, 0);
  controls.minDistance = extent * 0.65;
  controls.maxDistance = extent * 5;
  controls.update();
  function render() {
    renderer.render(scene, camera);
  }
  function resize() {
    const width = host.clientWidth,
      height = host.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.copy(
      new THREE.Vector3(0.65, 0.4, 1).multiplyScalar(
        distance * Math.max(1, 1 / camera.aspect),
      ),
    );
    camera.updateProjectionMatrix();
    controls.update();
    render();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  controls.addEventListener('change', render);
  const ray = new THREE.Raycaster();
  let down = [0, 0];
  function pointerDown(event: PointerEvent) {
    down = [event.clientX, event.clientY];
  }
  function pick(event: PointerEvent) {
    if (
      preview ||
      Math.hypot(event.clientX - down[0], event.clientY - down[1]) > 5
    )
      return;
    const rect = renderer.domElement.getBoundingClientRect();
    ray.setFromCamera(
      new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        (-(event.clientY - rect.top) / rect.height) * 2 + 1,
      ),
      camera,
    );
    const hit = ray
      .intersectObject(root, true)
      .find((result) => typeof result.object.userData.item === 'number');
    if (hit) onSelect(hit.object.userData.item);
  }
  renderer.domElement.addEventListener('pointerdown', pointerDown);
  renderer.domElement.addEventListener('pointerup', pick);
  resize();
  let frame = 0;
  let previousTime = 0;
  let lastReadoutTime = 0;
  let angle = 0;
  let playing = false;
  let disposed = false;
  function animate(now: number) {
    if (!playing || disposed || !updateOrbit) return;
    const dt = previousTime ? Math.min((now - previousTime) / 1000, 0.1) : 0;
    previousTime = now;
    angle += (dt * Math.PI * 2) / 24;
    const readout = updateOrbit?.(angle);

    if (now - lastReadoutTime > 150) {
      if (readout) onOrbitUpdate?.(readout);
      lastReadoutTime = now;
    }
    render();
    frame = requestAnimationFrame(animate);
  }
  function setPlaying(value: boolean) {
    playing = value && !!updateOrbit && !preview;
    cancelAnimationFrame(frame);
    previousTime = 0;
    if (playing) frame = requestAnimationFrame(animate);
  }
  if (updateOrbit) onOrbitUpdate?.(updateOrbit(0));
  return {
    setPlaying,

    reset: () => {
      root.rotation.set(0, 0, 0);
      controls.target.set(0, 0, 0);
      resize();
    },
    rotate: () => {
      root.rotation.y += Math.PI / 8;
      render();
    },
    zoom: (factor: number) => {
      camera.position.multiplyScalar(factor);
      camera.position.clampLength(controls.minDistance, controls.maxDistance);
      controls.update();
      render();
    },
    dispose() {
      disposed = true;
      playing = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      releaseWheel();
      controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', pointerDown);
      renderer.domElement.removeEventListener('pointerup', pick);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.Sprite ||
          object instanceof THREE.Line
        ) {
          if (object.geometry) geometries.add(object.geometry);
          const entries = Array.isArray(object.material)
            ? object.material
            : [object.material];
          entries.forEach((mat) => materials.add(mat));
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((mat) => {
        if ('map' in mat && mat.map instanceof THREE.Texture) mat.map.dispose();
        mat.dispose();
      });
      appearance.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
