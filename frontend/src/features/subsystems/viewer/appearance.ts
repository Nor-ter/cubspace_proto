// From CubeSat_Anatomy v1.0.1 (src/appearance.ts), the standalone 1U explorer.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { PartSpec } from './types';

const FINISHES: Record<
  PartSpec['material'],
  { colour: number; metal: number; rough: number }
> = {
  aluminium: { colour: 0xc4c7ca, metal: 0.97, rough: 0.32 },
  darkMetal: { colour: 0x343639, metal: 0.87, rough: 0.38 },
  board: { colour: 0x303735, metal: 0, rough: 0.64 },
  panel: { colour: 0x25282b, metal: 0.12, rough: 0.53 },
  chip: { colour: 0x181a1b, metal: 0, rough: 0.82 },
  gold: { colour: 0xc6a667, metal: 0.92, rough: 0.3 },
  copper: { colour: 0xa36d4f, metal: 0.9, rough: 0.38 },
  solar: { colour: 0x09111c, metal: 0, rough: 0.19 },
  glass: { colour: 0x17242d, metal: 0, rough: 0.065 },
  battery: { colour: 0xa4a7aa, metal: 0.87, rough: 0.41 },
  white: { colour: 0xc9c8c3, metal: 0, rough: 0.77 },
};

/** Neutral reflected light and restrained surface finishes, generated locally. */
export function createAppearance(renderer: THREE.WebGLRenderer) {
  const room = new RoomEnvironment();
  const generator = new THREE.PMREMGenerator(renderer);
  const environment = generator.fromScene(room, 0.06);
  room.dispose();
  generator.dispose();

  // Fine directional roughness, rather than a painted colour texture, gives
  // the aluminium its machining finish without imposing a visible pattern.
  const width = 128;
  const data = new Uint8ClampedArray(width * width * 4);
  let seed = 271828;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let y = 0; y < width; y++) {
    const row = 210 + random() * 28;
    for (let x = 0; x < width; x++) {
      const value = Math.round(row + random() * 9);
      const offset = (y * width + x) * 4;
      data.set([value, value, value, 255], offset);
    }
  }
  // Canvas-backed textures also remain compatible with glTF's combined
  // metallic/roughness image export.
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = width;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('The surface texture could not be created.');
  context.putImageData(new ImageData(data, width, width), 0, 0);
  const machining = new THREE.CanvasTexture(canvas);
  machining.wrapS = machining.wrapT = THREE.RepeatWrapping;
  machining.repeat.set(1, 6);
  machining.magFilter = THREE.LinearFilter;
  machining.minFilter = THREE.LinearMipmapLinearFilter;
  machining.generateMipmaps = true;
  machining.needsUpdate = true;

  return {
    environment: environment.texture,
    material(part: PartSpec): THREE.MeshStandardMaterial {
      const finish = FINISHES[part.material];
      const options: THREE.MeshStandardMaterialParameters = {
        color: finish.colour,
        metalness: finish.metal,
        roughness: finish.rough,
      };
      if (part.material === 'aluminium' || part.material === 'battery') {
        options.roughnessMap = machining;
      }
      if (part.material === 'solar' || part.material === 'glass') {
        return new THREE.MeshPhysicalMaterial({
          ...options,
          clearcoat: 1,
          clearcoatRoughness: part.material === 'glass' ? 0.045 : 0.13,
          ior: 1.5,
          specularIntensity: part.material === 'glass' ? 1 : 0.75,
        });
      }
      return new THREE.MeshStandardMaterial(options);
    },
    dispose() {
      machining.dispose();
      environment.dispose();
    },
  };
}
