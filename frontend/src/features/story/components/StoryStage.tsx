import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { createMissionAnimation } from '@/lib/missionAnimation';
import { SATELLITE_POSITION } from '../data';
import { SUBSYSTEM_MESH_KEYS } from '../subsystems';
import type { StoryScene } from '../data';
import type { StoryFrameRef } from '../hooks/useStoryScroll';

const CREAM = 0xfbf4e6;
const GRIP = 0x4d9bff;
const ATMOSPHERE = 0x9db8d6;
const EARTH_RADIUS = 1;
const ORBIT_RADIUS = SATELLITE_POSITION[1];
const STAR_COUNT = 900;
const EXPLODE_DISTANCE = 0.035;
const DAMPING = 6;
const PORTRAIT_ASPECT = 0.85;
const PORTRAIT_DISTANCE = 1.5;
const PORTRAIT_RAISE = 0.18;
// The mission animation is authored for an Earth of this radius and orbit.
const MISSION_EARTH_RADIUS = 0.145;
const MISSION_ORBIT_RADIUS = 0.29;
const MISSION_MODEL_SIZE = 0.055;

type ExplodablePart = {
  mesh: THREE.Mesh;
  base: THREE.Vector3;
  direction: THREE.Vector3;
};

function materialsOf(mesh: THREE.Mesh) {
  const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  return list as THREE.MeshStandardMaterial[];
}

function createStars() {
  const positions = Array.from({ length: STAR_COUNT }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / STAR_COUNT;
    const ring = Math.sqrt(1 - y * y);
    const angle = i * 2.399963;
    const radius = 14 + ((i * 73) % 211) / 12;
    return [Math.cos(angle) * ring * radius, y * radius, Math.sin(angle) * ring * radius];
  }).flat();
  return new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)),
    new THREE.PointsMaterial({ color: CREAM, size: 0.045, transparent: true, opacity: 0.7 }),
  );
}

function createAtmosphere() {
  return new THREE.Mesh(
    new THREE.SphereGeometry(EARTH_RADIUS * 1.06, 64, 48),
    new THREE.ShaderMaterial({
      uniforms: { glow: { value: new THREE.Color(ATMOSPHERE) } },
      vertexShader:
        'varying vec3 vNormal; void main() { vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader:
        'uniform vec3 glow; varying vec3 vNormal; void main() { float strength = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 5.0) * 0.3; gl_FragColor = vec4(glow, 1.0) * strength; }',
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    }),
  );
}

function createOrbit(radius: number) {
  const points = Array.from({ length: 256 }, (_, i) => {
    const angle = (i / 256) * Math.PI * 2;
    return new THREE.Vector3(Math.sin(angle) * radius, Math.cos(angle) * radius, 0);
  });
  return new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color: CREAM, transparent: true, opacity: 0.3 }),
  );
}

export function StoryStage({
  scenes,
  frameRef,
  activeIndex,
  missionPhase,
  missionReplay,
  captionRef,
}: {
  scenes: readonly Pick<StoryScene, 'stage'>[];
  frameRef: StoryFrameRef;
  activeIndex: number;
  missionPhase: number;
  missionReplay: number;
  captionRef: RefObject<HTMLParagraphElement | null>;
}) {
  const host = useRef<HTMLDivElement>(null);
  const activeRef = useRef(activeIndex);
  const applyLookRef = useRef<(index: number) => void>(() => undefined);
  const phaseRef = useRef(missionPhase);
  const elapsedRef = useRef(0);

  useEffect(() => {
    activeRef.current = activeIndex;
    applyLookRef.current(activeIndex);
    if (scenes[activeIndex].stage.mission) elapsedRef.current = 0;
  }, [activeIndex, scenes]);

  useEffect(() => {
    phaseRef.current = missionPhase;
    elapsedRef.current = 0;
  }, [missionPhase, missionReplay]);

  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    const prefersStill = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.01, 100);
    scene.add(new THREE.HemisphereLight(0xcfe3ff, 0x101014, 1.6));
    const sun = new THREE.DirectionalLight(0xffffff, 3.4);
    sun.position.set(4, 2, 5);
    scene.add(sun);

    const earthMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.92 });
    const earth = new THREE.Mesh(new THREE.SphereGeometry(EARTH_RADIUS, 96, 64), earthMaterial);
    earth.rotation.set(0.1, -0.5, -0.08);
    const storyOrbit = createOrbit(ORBIT_RADIUS);
    scene.add(earth, createAtmosphere(), storyOrbit, createStars());

    const missionRig = new THREE.Group();
    missionRig.scale.setScalar(EARTH_RADIUS / MISSION_EARTH_RADIUS);
    missionRig.visible = false;
    const missionOrbit = new THREE.Group();
    missionOrbit.rotation.set(-1.5, 0, -0.22);
    missionOrbit.add(createOrbit(MISSION_ORBIT_RADIUS));
    missionRig.add(missionOrbit);
    scene.add(missionRig);
    const mission = createMissionAnimation(missionOrbit);
    let missionModel: THREE.Group | null = null;

    const earthTexture = new THREE.TextureLoader().load('/textures/earth-blue-marble.jpg', (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      earthMaterial.map = texture;
      earthMaterial.needsUpdate = true;
    });

    const parts: ExplodablePart[] = [];
    let model: THREE.Group | null = null;
    let appliedExplode = -1;
    let disposed = false;

    function applyLook(index: number) {
      const { highlight, wireframe } = scenes[index].stage;
      const keys = SUBSYSTEM_MESH_KEYS[highlight];
      parts.forEach(({ mesh }) => {
        const isAll = highlight === 'all';
        const isPicked = isAll || keys.some((key) => mesh.name.toLowerCase().includes(key));
        materialsOf(mesh).forEach((material) => {
          const baseOpacity = material.userData.baseOpacity as number;
          material.transparent = true;
          material.wireframe = wireframe;
          material.color.copy(wireframe ? new THREE.Color(CREAM) : (material.userData.baseColor as THREE.Color));
          material.opacity = wireframe ? 0.55 : isPicked ? baseOpacity : 0.12;
          if (wireframe) {
            material.emissive.set(CREAM);
            material.emissiveIntensity = 0.35;
          } else {
            material.emissive.set(isPicked && !isAll ? GRIP : 0x000000);
            material.emissiveIntensity = isPicked && !isAll ? 0.5 : 0;
          }
        });
      });
    }
    applyLookRef.current = applyLook;

    new GLTFLoader().load('/models/cubesat-1u-subsystems.glb', (gltf) => {
      if (disposed) return;
      const asset = gltf.scene;
      const group = new THREE.Group();
      group.add(asset);
      const box = new THREE.Box3().setFromObject(group);
      const size = box.getSize(new THREE.Vector3());
      asset.position.sub(box.getCenter(new THREE.Vector3()));

      const missionAsset = asset.clone(true);
      const missionGroup = new THREE.Group();
      missionGroup.add(missionAsset);
      missionGroup.scale.setScalar(MISSION_MODEL_SIZE / Math.max(size.x, size.y, size.z));
      missionGroup.rotation.set(0.12, -0.45, -0.08);
      missionGroup.position.set(MISSION_ORBIT_RADIUS, 0, 0);
      missionGroup.traverse((object) => {
        if (object.name.toLowerCase().includes('antenna')) object.visible = false;
        if (object instanceof THREE.Mesh) {
          object.material = Array.isArray(object.material)
            ? object.material.map((material) => material.clone())
            : object.material.clone();
        }
      });
      missionOrbit.add(missionGroup);
      missionModel = missionGroup;

      group.scale.setScalar(0.2 / Math.max(size.x, size.y, size.z));
      group.rotation.set(0.12, -0.45, -0.08);
      group.position.set(...SATELLITE_POSITION);
      group.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.material = Array.isArray(object.material)
          ? object.material.map((material) => material.clone())
          : object.material.clone();
        materialsOf(object).forEach((material) => {
          material.userData.baseColor = material.color.clone();
          material.userData.baseOpacity = material.opacity;
        });
        parts.push({
          mesh: object,
          base: object.position.clone(),
          direction: object.position.clone().normalize(),
        });
      });
      model = group;
      scene.add(group);
      applyLook(activeRef.current);
    });

    let width = 1;
    let height = 1;
    const resize = () => {
      width = Math.max(container.clientWidth, 1);
      height = Math.max(container.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    const pointer = new THREE.Vector2();
    const pointerGoal = new THREE.Vector2();
    const onPointerMove = (event: PointerEvent) => {
      if (prefersStill) return;
      pointerGoal.set((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const first = scenes[0].stage;
    const cameraNow = new THREE.Vector3(...first.camera);
    const targetNow = new THREE.Vector3(...first.target);
    const cameraGoal = new THREE.Vector3();
    const targetGoal = new THREE.Vector3();
    const startPoint = new THREE.Vector3();
    const endPoint = new THREE.Vector3();
    let shiftNow = first.shift;
    let explodeNow = first.explode;
    let previous = performance.now();
    let animationFrame = 0;

    const render = () => {
      animationFrame = requestAnimationFrame(render);
      const now = performance.now();
      const dt = Math.min((now - previous) / 1000, 0.1);
      previous = now;

      const { index, blend } = frameRef.current;
      const from = scenes[index].stage;
      const to = scenes[Math.min(index + 1, scenes.length - 1)].stage;
      cameraGoal.lerpVectors(startPoint.set(...from.camera), endPoint.set(...to.camera), blend);
      targetGoal.lerpVectors(startPoint.set(...from.target), endPoint.set(...to.target), blend);
      const shiftGoal = THREE.MathUtils.lerp(from.shift, to.shift, blend);
      const explodeGoal = THREE.MathUtils.lerp(from.explode, to.explode, blend);

      const ease = prefersStill ? 1 : 1 - Math.exp(-dt * DAMPING);
      cameraNow.lerp(cameraGoal, ease);
      targetNow.lerp(targetGoal, ease);
      shiftNow = THREE.MathUtils.lerp(shiftNow, shiftGoal, ease);
      explodeNow = THREE.MathUtils.lerp(explodeNow, explodeGoal, ease);
      pointer.lerp(pointerGoal, ease);

      const isPortrait = camera.aspect < PORTRAIT_ASPECT;
      const distanceScale = isPortrait ? PORTRAIT_DISTANCE : 1;
      camera.position.copy(cameraNow).sub(targetNow).multiplyScalar(distanceScale).add(targetNow);
      const distance = camera.position.distanceTo(targetNow);
      camera.position.x += pointer.x * distance * 0.035;
      camera.position.y -= pointer.y * distance * 0.025;
      camera.lookAt(targetNow);
      camera.setViewOffset(
        width,
        height,
        (isPortrait ? 0 : shiftNow) * width,
        (isPortrait ? PORTRAIT_RAISE : 0) * height,
        width,
        height,
      );

      const isMission = scenes[activeRef.current].stage.mission;
      missionRig.visible = isMission;
      storyOrbit.visible = !isMission;
      if (model) model.visible = !isMission;
      if (isMission && missionModel) {
        elapsedRef.current += dt;
        const label = mission.update(phaseRef.current, elapsedRef.current, missionModel);
        const caption = captionRef.current;
        if (caption && caption.textContent !== label) caption.textContent = label;
      }

      if (Math.abs(explodeNow - appliedExplode) > 0.001) {
        appliedExplode = explodeNow;
        parts.forEach(({ mesh, base, direction }) => {
          mesh.position.copy(base).addScaledVector(direction, EXPLODE_DISTANCE * explodeNow);
        });
      }
      if (!prefersStill) {
        earth.rotation.y += dt * 0.02;
        if (model) model.rotation.y += dt * 0.06;
      }
      renderer.render(scene, camera);
    };
    render();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      applyLookRef.current = () => undefined;
      mission.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
          object.geometry.dispose();
          (Array.isArray(object.material) ? object.material : [object.material]).forEach((material) =>
            material.dispose(),
          );
        }
      });
      earthTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [scenes, frameRef, captionRef]);

  return <div ref={host} className="story-stage" aria-hidden="true" />;
}
