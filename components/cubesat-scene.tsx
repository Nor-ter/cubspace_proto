'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { SubsystemKey } from '@/src/data/onboarding';

type Props = {
  mode: 'orbit' | 'explore';
  selected?: SubsystemKey;
  exploded?: boolean;
  paused?: boolean;
};

const groups: Record<SubsystemKey, string[]> = {
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
}: Props) {
  const host = useRef<HTMLDivElement>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const earthRef = useRef<THREE.Object3D | null>(null);
  const orbitRef = useRef<THREE.Group | null>(null);
  const selectedRef = useRef(selected);
  const explodedRef = useRef(exploded);
  const pausedRef = useRef(paused);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    selectedRef.current = selected;
    applyLook();
  }, [selected]);
  useEffect(() => {
    explodedRef.current = exploded;
    applyLook();
  }, [exploded]);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  function applyLook() {
    const root = modelRef.current;
    if (!root) return;
    const keys = groups[selectedRef.current];
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
        m.emissive?.set(
          picked && selectedRef.current !== 'all' ? 0x5ee7ff : 0x000000,
        );
        m.emissiveIntensity =
          picked && selectedRef.current !== 'all' ? 0.34 : 0;
      });
      const p = obj.userData.basePosition as THREE.Vector3 | undefined;
      if (!p) obj.userData.basePosition = obj.position.clone();
      else obj.position.copy(p);
      if (explodedRef.current && obj.parent && obj.userData.basePosition) {
        const direction = obj.userData.basePosition.clone().normalize();
        obj.position.add(direction.multiplyScalar(0.035));
      }
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
    camera.position.set(
      mode === 'orbit' ? 0 : 0.26,
      mode === 'orbit' ? 0.18 : 0.12,
      mode === 'orbit' ? 0.92 : 0.32,
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
    controls.minDistance = mode === 'orbit' ? 0.65 : 0.18;
    controls.maxDistance = mode === 'orbit' ? 1.8 : 0.9;
    controls.enabled = true;
    controls.rotateSpeed = 0.65;
    controls.dampingFactor = 0.075;
    controls.saveState();
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
    const loader = new GLTFLoader();
    loader.load(
      '/models/cubesat-1u-subsystems.glb',
      (gltf) => {
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
    let orbitAngle = 0;
    let previousTime = performance.now();
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - previousTime) / 1000, 0.05);
      previousTime = now;
      controls.update();
      if (!pausedRef.current && mode === 'orbit') {
        orbitAngle += 0.3 * dt;
        if (earthRef.current) earthRef.current.rotation.y += 0.027 * dt;
        if (modelRef.current) {
          modelRef.current.position.set(
            Math.cos(orbitAngle) * 0.29,
            Math.sin(orbitAngle) * 0.29,
            0,
          );
          modelRef.current.rotation.y += 0.12 * dt;
        }
      }
      renderer.render(scene, camera);
    };
    animate();
    return () => {
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
    <div
      ref={host}
      className={`three-stage three-${mode}`}
      role="region"
      aria-label="회전과 확대가 가능한 ACRUX-II 교육용 1U CubeSat 3D 모델"
    >
      {mode === 'orbit' && (
        <div className="orbit-interaction">
          <span>지구 드래그 · 휠 확대/축소</span>
          <button
            onClick={() => host.current?.dispatchEvent(new Event('reset-view'))}
          >
            시점 초기화
          </button>
        </div>
      )}
      {state !== 'ready' && (
        <div className="model-status">
          {state === 'loading' ? '3D MODEL LOADING' : 'WEBGL MODEL UNAVAILABLE'}
        </div>
      )}
    </div>
  );
}
