// From CubeSat_Anatomy v1.0.1 (src/scene.ts), the standalone 1U explorer.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { createAppearance } from './appearance';
import { createSpacecraftBranding } from './branding';
import type { AssemblySpec, PartSpec, Selection, SubsystemId } from './types';

type SceneOptions = {
  onSelect: (id: SubsystemId) => void;
  onHover: (text: string | null) => void;
  onFailure: () => void;
};

export interface ModelScene {
  setExplode(value: number): void;
  setSelection(value: Selection): void;
  setActive(value: boolean): void;
  reset(): void;
  orbit(horizontal: number, vertical: number): void;
  zoom(factor: number): void;
  dispose(): void;
}

function partGeometry(part: PartSpec): THREE.BufferGeometry {
  const shape = part.shape;
  if (shape.kind === 'box') {
    const [x, y, z] = shape.size;
    return shape.bevel
      ? new RoundedBoxGeometry(
          x,
          y,
          z,
          2,
          Math.min(shape.bevel, x / 3, y / 3, z / 3),
        )
      : new THREE.BoxGeometry(x, y, z);
  }
  let geometry: THREE.BufferGeometry;
  if (shape.kind === 'cylinder') {
    geometry = new THREE.CylinderGeometry(
      shape.radius,
      shape.radius,
      shape.height,
      48,
    );
    geometry.rotateX(Math.PI / 2);
  } else {
    const outline = new THREE.Shape();
    outline.absarc(0, 0, shape.outerRadius, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, shape.innerRadius, 0, Math.PI * 2, true);
    outline.holes.push(hole);
    geometry = new THREE.ExtrudeGeometry(outline, {
      depth: shape.height,
      bevelEnabled: false,
      curveSegments: 48,
    });
    geometry.translate(0, 0, -shape.height / 2);
  }
  if (shape.axis === 'x') geometry.rotateY(Math.PI / 2);
  if (shape.axis === 'y') geometry.rotateX(-Math.PI / 2);
  return geometry;
}

export function createScene(
  host: HTMLElement,
  parts: PartSpec[],
  specs: AssemblySpec[],
  options: SceneOptions,
): ModelScene {
  const scene = new THREE.Scene();
  const root = new THREE.Group();
  scene.add(root);
  const camera = new THREE.OrthographicCamera(-150, 150, 150, -150, 0.1, 2500);
  camera.up.set(0, 0, 1);
  camera.position.set(300, -420, 270);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x111315, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const appearance = createAppearance(renderer);
  scene.environment = appearance.environment;
  scene.environmentIntensity = 0.85;
  host.append(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.09;
  controls.enablePan = false;
  controls.rotateSpeed = 0.65;
  controls.minZoom = 0.65;
  controls.maxZoom = 3.6;
  controls.minPolarAngle = 0.12;
  controls.maxPolarAngle = Math.PI - 0.12;
  controls.target.set(0, 0, 0);
  controls.update();
  controls.saveState();

  scene.add(new THREE.HemisphereLight(0xe6e7e8, 0x333437, 0.65));
  const key = new THREE.DirectionalLight(0xfff9ef, 2.6);
  key.position.set(160, -180, 330);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = key.shadow.camera.bottom = -260;
  key.shadow.camera.right = key.shadow.camera.top = 260;
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 1000;
  key.shadow.normalBias = 0.15;
  key.shadow.bias = -0.00015;
  key.shadow.radius = 2;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xe0e5eb, 0.8);
  fill.position.set(-180, 20, 120);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xf5f6f8, 1.3);
  rim.position.set(50, 180, 80);
  scene.add(rim);

  const groups = new Map<string, THREE.Group>();
  for (const spec of specs) {
    const group = new THREE.Group();
    group.name = spec.id;
    groups.set(spec.id, group);
    root.add(group);
  }
  const meshes: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>[] =
    [];
  for (const part of parts) {
    const material = appearance.material(part);
    const geometry = partGeometry(part);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = part.id;
    mesh.position.set(...part.position);
    if (part.rotation) mesh.rotation.set(...part.rotation);
    mesh.userData = {
      subsystem: part.subsystem,
      description: part.name,
      baseColour: material.color.getHex(),
      baseRoughness: material.roughness,
      baseMetalness: material.metalness,
    };
    groups.get(part.assembly)?.add(mesh);
    meshes.push(mesh);
    const size =
      part.shape.kind === 'box'
        ? Math.max(...part.shape.size)
        : part.shape.height;
    mesh.castShadow = size > 3 && part.material !== 'glass';
    mesh.receiveShadow = true;
    mesh.userData.castsShadow = mesh.castShadow;
  }

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  controls.enableDamping = !reduceMotion.matches;
  let selected: Selection = 'all';
  let targetExplode = 0;
  let explode = 0;
  let active = true;
  let visible = true;
  let animation = 0;
  let previous = 0;
  let disposed = false;
  let failed = false;
  let aspect = 1;
  let hover: THREE.Mesh | null = null;
  createSpacecraftBranding()
    .then((marks) => {
      for (const { mesh, assembly } of marks) {
        if (disposed) {
          mesh.geometry.dispose();
          mesh.material.map?.dispose();
          mesh.material.dispose();
          continue;
        }
        mesh.userData = {
          ...mesh.userData,
          subsystem: 'eps',
          description: 'Melbourne Space Program identification',
          decoration: 'msp-branding',
          baseColour: mesh.material.color.getHex(),
          baseRoughness: mesh.material.roughness,
          baseMetalness: mesh.material.metalness,
          castsShadow: false,
        };
        groups.get(assembly)?.add(mesh);
        meshes.push(mesh);
      }
      if (!disposed) applySelection();
    })
    // The model still works without the optional branding decals.
    .catch(() => {});

  function resize() {
    if (disposed || failed) return;
    const { width, height } = host.getBoundingClientRect();
    aspect = Math.max(width, 1) / Math.max(height, 1);
    renderer.setSize(width, height, false);
    fitCamera();
    invalidate();
  }
  function fitCamera() {
    const half = (113 + explode * 120) * Math.max(1, 1.1 / aspect);
    camera.left = -half * aspect;
    camera.right = half * aspect;
    camera.top = half;
    camera.bottom = -half;
    camera.updateProjectionMatrix();
  }
  function applySelection() {
    for (const mesh of meshes) {
      const picked = selected === 'all' || mesh.userData.subsystem === selected;
      mesh.material.color.set(picked ? mesh.userData.baseColour : 0x42484e);
      mesh.material.roughness = picked ? mesh.userData.baseRoughness : 0.95;
      mesh.material.metalness = picked ? mesh.userData.baseMetalness : 0.05;
      if (mesh.material.transparent === picked)
        mesh.material.needsUpdate = true;
      mesh.material.transparent = !picked;
      mesh.material.opacity = picked ? 1 : 0.16;
      mesh.material.depthWrite = picked;
      mesh.castShadow = picked && mesh.userData.castsShadow;
      mesh.material.emissive.set(0);
      mesh.material.emissiveIntensity = 0;
      if (mesh === hover) {
        mesh.material.emissive.set(0x5b6065);
        mesh.material.emissiveIntensity = 0.08;
      }
    }
    invalidate();
  }
  function invalidate() {
    if (
      !animation &&
      !disposed &&
      !failed &&
      active &&
      visible &&
      !document.hidden
    ) {
      animation = requestAnimationFrame(tick);
    }
  }
  function failRendering() {
    if (failed || disposed) return;
    failed = true;
    active = false;
    cancelAnimationFrame(animation);
    animation = 0;
    options.onFailure();
  }
  function tick(now: number) {
    animation = 0;
    if (disposed || failed || !active || !visible || document.hidden) return;
    const dt = Math.min((now - previous) / 1000 || 1 / 60, 0.25);
    previous = now;
    const moving = Math.abs(targetExplode - explode) > 0.0001;
    if (moving) {
      explode = reduceMotion.matches
        ? targetExplode
        : THREE.MathUtils.lerp(explode, targetExplode, 1 - Math.exp(-8 * dt));
      if (Math.abs(targetExplode - explode) < 0.0001) explode = targetExplode;
      for (const spec of specs)
        groups
          .get(spec.id)
          ?.position.set(
            ...(spec.explode.map((v) => v * explode) as [
              number,
              number,
              number,
            ]),
          );
      fitCamera();
    }
    let changed = false;
    try {
      changed = controls.update(dt);
      renderer.render(scene, camera);
    } catch {
      failRendering();
      return;
    }
    if (moving || changed) invalidate();
  }
  controls.addEventListener('change', invalidate);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let pointerDown = [0, 0];
  function hit(event: PointerEvent) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      1 - ((event.clientY - rect.top) / rect.height) * 2,
    );
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(meshes, false)[0]?.object as
      | THREE.Mesh
      | undefined;
  }
  function onDown(event: PointerEvent) {
    pointerDown = [event.clientX, event.clientY];
  }
  function onUp(event: PointerEvent) {
    if (
      Math.hypot(
        event.clientX - pointerDown[0],
        event.clientY - pointerDown[1],
      ) > 5
    )
      return;
    const mesh = hit(event);
    if (mesh) options.onSelect(mesh.userData.subsystem as SubsystemId);
  }
  function onMove(event: PointerEvent) {
    if (event.buttons) return;
    const mesh = hit(event) ?? null;
    if (mesh === hover) return;
    hover = mesh;
    renderer.domElement.style.cursor = hover ? 'pointer' : 'grab';
    options.onHover(hover?.userData.description ?? null);
    applySelection();
  }
  function onLeave() {
    hover = null;
    renderer.domElement.style.cursor = 'grab';
    options.onHover(null);
    applySelection();
  }
  function onContextLost(event: Event) {
    event.preventDefault();
    failRendering();
  }
  renderer.domElement.addEventListener('pointerdown', onDown);
  renderer.domElement.addEventListener('pointerup', onUp);
  renderer.domElement.addEventListener('pointermove', onMove);
  renderer.domElement.addEventListener('pointerleave', onLeave);
  renderer.domElement.addEventListener('webglcontextlost', onContextLost);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    invalidate();
  });
  observer.observe(host);
  const wake = () => {
    previous = 0;
    controls.enableDamping = !reduceMotion.matches;
    invalidate();
  };
  document.addEventListener('visibilitychange', wake);
  reduceMotion.addEventListener('change', wake);
  resize();

  return {
    setExplode(value) {
      if (!animation) previous = performance.now();
      targetExplode = THREE.MathUtils.clamp(value, 0, 1);
      invalidate();
    },
    setSelection(value) {
      selected = value;
      applySelection();
    },
    setActive(value) {
      active = value && !failed;
      if (!active) {
        cancelAnimationFrame(animation);
        animation = 0;
      }
      if (active) resize();
    },
    reset() {
      controls.reset();
      invalidate();
    },
    orbit(horizontal, vertical) {
      const spherical = new THREE.Spherical().setFromVector3(
        camera.position
          .clone()
          .sub(controls.target)
          .applyAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2),
      );
      spherical.theta += horizontal;
      spherical.phi = THREE.MathUtils.clamp(
        spherical.phi + vertical,
        0.12,
        Math.PI - 0.12,
      );
      camera.position.copy(
        new THREE.Vector3()
          .setFromSpherical(spherical)
          .applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2)
          .add(controls.target),
      );
      controls.update();
      invalidate();
    },
    zoom(factor) {
      camera.zoom = THREE.MathUtils.clamp(
        camera.zoom * factor,
        controls.minZoom,
        controls.maxZoom,
      );
      camera.updateProjectionMatrix();
      invalidate();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(animation);
      resizeObserver.disconnect();
      observer.disconnect();
      document.removeEventListener('visibilitychange', wake);
      reduceMotion.removeEventListener('change', wake);
      controls.dispose();
      for (const mesh of meshes) {
        mesh.geometry.dispose();
        if (mesh.userData.decoration) mesh.material.map?.dispose();
        mesh.material.dispose();
      }
      appearance.dispose();
      key.shadow.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
