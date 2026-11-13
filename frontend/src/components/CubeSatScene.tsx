import { useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createMissionAnimation } from '@/lib/missionAnimation';
import type { SubsystemKey } from '@/types/subsystem';

const WIDE_STAGE_ASPECT = 1.4;
const WIDE_ORBIT_DISTANCE = 0.58;

type Props = {
  mode: 'orbit' | 'explore';
  selected?: SubsystemKey;
  exploded?: boolean;
  paused?: boolean;
  missionPhase?: number;
  replayKey?: number;
  /** 0 = assembled, 1 = fully exploded. Overrides `exploded` when given. */
  separation?: number;
  autoRotate?: boolean;
  /** Mesh name to highlight as the picked part. */
  pickedPart?: string | null;
  onPick?: (part: PickedPart | null) => void;
  controlsRef?: Ref<SceneControls>;
};

export type PickedPart = {
  name: string;
  label: string;
  subsystem: SubsystemKey | null;
};

export type SceneControls = {
  reset: () => void;
  zoom: (factor: number) => void;
};

const MAX_SEPARATION = 0.075;

/** `wing_pos_x_hinge_pin` → `Wing pos x hinge pin` */
export function partLabel(name: string) {
  const text = name.replace(/_\d+$/, (m) => ` ${m.slice(1)}`).replace(/_/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function subsystemOf(obj: THREE.Object3D): SubsystemKey | null {
  for (let o: THREE.Object3D | null = obj; o; o = o.parent) {
    const name = o.name.toLowerCase();
    for (const [key, parts] of Object.entries(SUBSYSTEM_MESH_KEYS)) {
      if (key !== 'all' && parts.some((part) => name.includes(part)))
        return key as SubsystemKey;
    }
  }
  return null;
}

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

export function CubeSatScene({
  mode,
  selected = 'all',
  exploded = false,
  paused = false,
  missionPhase = 1,
  replayKey = 0,
  separation,
  autoRotate = false,
  pickedPart = null,
  onPick,
  controlsRef,
}: Props) {
  const targetSeparation = separation ?? (exploded ? 0.5 : 0);
  const separationRef = useRef({ target: targetSeparation, current: targetSeparation });
  const pickedRef = useRef(pickedPart);
  const onPickRef = useRef(onPick);
  const autoRotateRef = useRef(autoRotate);
  const controlsApi = useRef<OrbitControls | null>(null);
  useImperativeHandle(controlsRef, () => ({
    reset: () => controlsApi.current?.reset(),
    zoom: (factor) => {
      const controls = controlsApi.current;
      if (!controls) return;
      const camera = controls.object;
      const offset = camera.position.clone().sub(controls.target);
      const distance = THREE.MathUtils.clamp(
        offset.length() * factor,
        controls.minDistance,
        controls.maxDistance,
      );
      camera.position.copy(controls.target).add(offset.setLength(distance));
    },
  }));
  useEffect(() => {
    separationRef.current.target = targetSeparation;
  }, [targetSeparation]);
  useEffect(() => {
    onPickRef.current = onPick;
  }, [onPick]);
  useEffect(() => {
    autoRotateRef.current = autoRotate;
    if (controlsApi.current) controlsApi.current.autoRotate = autoRotate;
  }, [autoRotate]);
  useEffect(() => {
    pickedRef.current = pickedPart;
    applyLook();
  }, [pickedPart]);
  const phaseRef = useRef(missionPhase);
  const elapsedRef = useRef(0);
  const captionRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    phaseRef.current = missionPhase;
    elapsedRef.current = 0;
  }, [missionPhase, replayKey]);
  const host = useRef<HTMLDivElement>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const earthRef = useRef<THREE.Object3D | null>(null);
  const orbitRef = useRef<THREE.Group | null>(null);
  const selectedRef = useRef(selected);
  const pausedRef = useRef(paused);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    selectedRef.current = selected;
    applyLook();
  }, [selected]);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // oxlint-disable-next-line react/react-compiler -- Three.js mutable scene traversal triggers an internal compiler diagnostic.
  function applyLook() {
    const root = modelRef.current;
    if (!root) return;
    const keys = SUBSYSTEM_MESH_KEYS[selectedRef.current];
    root.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const picked =
        selectedRef.current === 'all' ||
        keys.some((key) => obj.name.toLowerCase().includes(key));
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((mat) => {
        const m = mat as THREE.MeshStandardMaterial;
        if (!m.userData.baseColor) m.userData.baseColor = m.color.clone();
        if (!m.userData.baseOpacity) m.userData.baseOpacity = m.opacity;
        m.transparent = true;
        m.opacity =
          selectedRef.current === 'all' || picked
            ? (m.userData.baseOpacity ?? 1)
            : 0.12;
        m.color.copy(m.userData.baseColor);
        const isPickedPart = pickedRef.current === obj.name;
        m.emissive?.set(
          isPickedPart
            ? 0xffc46b
            : picked && selectedRef.current !== 'all'
              ? 0x5ee7ff
              : 0x000000,
        );
        m.emissiveIntensity = isPickedPart
          ? 0.6
          : picked && selectedRef.current !== 'all'
            ? 0.34
            : 0;
      });
    });
    applySeparation();
  }

  function applySeparation() {
    const root = modelRef.current;
    if (!root) return;
    const amount = separationRef.current.current * MAX_SEPARATION;
    root.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const base = obj.userData.basePosition as THREE.Vector3 | undefined;
      if (!base) obj.userData.basePosition = obj.position.clone();
      obj.position.copy(obj.userData.basePosition);
      if (amount > 0 && obj.parent)
        obj.position.add(obj.userData.basePosition.clone().normalize().multiplyScalar(amount));
    });
  }

  useEffect(() => {
    const container = host.current;
    if (!container) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      mode === 'orbit' ? 34 : 28,
      1,
      0.01,
      100,
    );
    // A wide orbit stage frames the Earth closer; a narrow one keeps the whole orbit in view.
    const isWideStage =
      container.clientWidth / Math.max(container.clientHeight, 1) >
      WIDE_STAGE_ASPECT;
    const orbitDistance = isWideStage ? WIDE_ORBIT_DISTANCE : 1;
    camera.position.set(
      mode === 'orbit' ? 0 : 0.26,
      mode === 'orbit' ? 0.18 * orbitDistance : 0.12,
      mode === 'orbit' ? 0.92 * orbitDistance : 0.32,
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = mode === 'orbit' ? 0.45 : 0.18;
    controls.maxDistance = mode === 'orbit' ? 1.8 : 0.9;
    controls.enabled = true;
    controls.rotateSpeed = 0.65;
    controls.dampingFactor = 0.075;
    controls.autoRotate = autoRotateRef.current;
    controls.autoRotateSpeed = 1.2;
    controls.saveState();
    controlsApi.current = controls;
    const resetView = () => controls.reset();
    container.addEventListener('reset-view', resetView);
    scene.add(new THREE.HemisphereLight(0x8bdcff, 0x08101d, 2.2));
    const key = new THREE.DirectionalLight(0xffffff, 4.2);
    key.position.set(3, 3, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x7cf7c7, 2.2);
    rim.position.set(-4, 1, -2);
    scene.add(rim);
    if (mode === 'orbit') {
      const earthPosition = new THREE.Vector3(0, 0, 0);
      const earthMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.9,
      });
      const earth = new THREE.Mesh(
        new THREE.SphereGeometry(0.145, 64, 48),
        earthMaterial,
      );
      earth.position.copy(earthPosition);
      earth.rotation.set(0.08, -0.45, -0.08);
      earthRef.current = earth;
      scene.add(earth);
      new THREE.TextureLoader().load(
        '/textures/earth-blue-marble.jpg',
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
          earthMaterial.map = texture;
          earthMaterial.needsUpdate = true;
        },
      );
      const orbit = new THREE.Group();
      orbit.position.copy(earthPosition);
      orbit.rotation.set(-1.5, 0, -0.22);
      orbitRef.current = orbit;
      scene.add(orbit);
      const orbitLine = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(
          Array.from({ length: 128 }, (_, i) => {
            const angle = (i / 128) * Math.PI * 2;
            return new THREE.Vector3(
              Math.cos(angle) * 0.29,
              Math.sin(angle) * 0.29,
              0,
            );
          }),
        ),
        new THREE.LineBasicMaterial({
          color: 0x75bad3,
          transparent: true,
          opacity: 0.65,
          depthTest: true,
          depthWrite: false,
        }),
      );
      orbit.add(orbitLine);
      const stars = new THREE.Points(
        new THREE.BufferGeometry().setAttribute(
          'position',
          new THREE.Float32BufferAttribute(
            Array.from(
              { length: 720 },
              (_, i) => ((i * 73) % 211) / 105.5 - 1,
            ).map((value, i) => value * (i % 3 === 2 ? 1.4 : 1.9)),
            3,
          ),
        ),
        new THREE.PointsMaterial({
          color: 0xd9efff,
          size: 0.003,
          transparent: true,
          opacity: 0.72,
        }),
      );
      scene.add(stars);
    }
    const mission =
      mode === 'orbit' && orbitRef.current
        ? createMissionAnimation(orbitRef.current)
        : null;
    let disposed = false;
    const loader = new GLTFLoader();
    loader.load(
      '/models/cubesat-1u-subsystems.glb',
      (gltf) => {
        if (disposed) return;
        const asset = gltf.scene;
        const model = new THREE.Group();
        model.add(asset);
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        asset.position.sub(box.getCenter(new THREE.Vector3()));
        model.scale.setScalar(
          (mode === 'orbit' ? 0.055 : 0.2) / Math.max(size.x, size.y, size.z),
        );
        model.rotation.set(0.12, -0.45, -0.08);
        model.traverse((obj) => {
          if (obj instanceof THREE.Mesh)
            obj.material = Array.isArray(obj.material)
              ? obj.material.map((m) => m.clone())
              : obj.material.clone();
        });
        modelRef.current = model;
        if (mode === 'orbit' && orbitRef.current) {
          model.position.set(0.29, 0, 0);
          orbitRef.current.add(model);
        } else scene.add(model);
        applyLook();
        if (mode === 'orbit')
          model.traverse((obj) => {
            if (obj.name.toLowerCase().includes('antenna')) obj.visible = false;
          });
        setState('ready');
      },
      undefined,
      () => setState('error'),
    );
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
    };
    // Defer canvas writes until the next frame to avoid observer feedback loops.
    let resizeFrame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(resize);
    });
    observer.observe(container);
    resize();
    let frame = 0;
    let previousTime = performance.now();
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - previousTime) / 1000, 0.05);
      previousTime = now;
      controls.update();
      const sep = separationRef.current;
      if (Math.abs(sep.target - sep.current) > 0.0005) {
        sep.current += (sep.target - sep.current) * Math.min(dt * 8, 1);
        applySeparation();
      } else if (sep.current !== sep.target) {
        sep.current = sep.target;
        applySeparation();
      }
      if (mode === 'orbit' && modelRef.current && mission) {
        if (!pausedRef.current) elapsedRef.current += dt;
        const label = mission.update(
          phaseRef.current,
          elapsedRef.current,
          modelRef.current,
        );
        if (captionRef.current && captionRef.current.textContent !== label)
          captionRef.current.textContent = label;
      }
      renderer.render(scene, camera);
    };
    animate();
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downAt: { x: number; y: number } | null = null;
    const hitAt = (event: PointerEvent) => {
      const model = modelRef.current;
      if (!model) return null;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
      return (
        raycaster.intersectObject(model, true).find((hit) => {
          const mesh = hit.object as THREE.Mesh;
          const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.Material;
          return mesh.visible && mat.opacity > 0.2;
        })?.object ?? null
      );
    };
    const onPointerDown = (event: PointerEvent) => {
      downAt = { x: event.clientX, y: event.clientY };
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!downAt || !onPickRef.current) return;
      const moved = Math.hypot(event.clientX - downAt.x, event.clientY - downAt.y);
      downAt = null;
      if (moved > 5) return;
      const hit = hitAt(event);
      onPickRef.current(
        hit
          ? { name: hit.name, label: partLabel(hit.name), subsystem: subsystemOf(hit) }
          : null,
      );
    };
    let hoverFrame = 0;
    const onPointerMove = (event: PointerEvent) => {
      if (!onPickRef.current || event.buttons || hoverFrame) return;
      hoverFrame = requestAnimationFrame(() => {
        hoverFrame = 0;
        renderer.domElement.style.cursor = hitAt(event) ? 'pointer' : '';
      });
    };
    if (mode === 'explore') {
      renderer.domElement.addEventListener('pointerdown', onPointerDown);
      renderer.domElement.addEventListener('pointerup', onPointerUp);
      renderer.domElement.addEventListener('pointermove', onPointerMove);
    }
    return () => {
      disposed = true;
      cancelAnimationFrame(hoverFrame);
      controlsApi.current = null;
      mission?.dispose();
      cancelAnimationFrame(frame);
      observer.disconnect();
      cancelAnimationFrame(resizeFrame);
      container.removeEventListener('reset-view', resetView);
      controls.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      modelRef.current = null;
      earthRef.current = null;
      orbitRef.current = null;
    };
  }, [mode]);

  return (
    <section
      ref={host}
      className={`three-stage three-${mode}`}
      aria-label="ACRUX-II Educational 1U CubeSat 3D model with rotation and zoom"
    >
      {mode === 'orbit' && (
        <p
          className="mission-scene-caption"
          ref={captionRef}
          aria-live="polite"
        />
      )}
      {mode === 'orbit' && (
        <div className="orbit-interaction">
          <span>Earth drag · Wheel zoom</span>
          <button
            onClick={() => host.current?.dispatchEvent(new Event('reset-view'))}
          >
            Reset viewpoint
          </button>
        </div>
      )}
      {state !== 'ready' && (
        <div className="model-status">
          {state === 'loading'
            ? 'Loading 3D model'
            : '3D model cannot be displayed'}
        </div>
      )}
    </section>
  );
}
