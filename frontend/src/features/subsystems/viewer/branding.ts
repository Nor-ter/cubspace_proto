// From CubeSat_Anatomy v1.0.1 (src/branding.ts), the standalone 1U explorer.
import * as THREE from 'three';
import logoSource from '@/assets/msp-original.png';

export interface SpacecraftBranding {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;
  assembly: 'solar-y-negative' | 'solar-x-positive';
}

interface ImageCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

function loadLogo(): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error('The supplied MSP logo could not be loaded.'));
    image.src = logoSource;
  });
}

function whiteInkTexture(
  image: HTMLImageElement,
  crop: ImageCrop,
  width: number,
  height: number,
): THREE.CanvasTexture {
  const source = document.createElement('canvas');
  source.width = crop.width;
  source.height = crop.height;
  const sourceContext = source.getContext('2d');
  if (!sourceContext)
    throw new Error('A canvas is required for the MSP surface marking.');
  sourceContext.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height,
  );

  // Extract the existing white artwork, excluding the faint capture interface
  // at the bottom right. The icon and lettering retain their supplied shapes.
  const pixels = sourceContext.getImageData(0, 0, crop.width, crop.height);
  for (let index = 0; index < pixels.data.length; index += 4) {
    const white = Math.min(
      pixels.data[index],
      pixels.data[index + 1],
      pixels.data[index + 2],
    );
    if (white < 220 || pixels.data[index + 3] < 180) pixels.data[index + 3] = 0;
  }
  sourceContext.putImageData(pixels, 0, 0);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context)
    throw new Error('A canvas is required for the MSP surface marking.');
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  const scale = Math.min(width / crop.width, height / crop.height);
  const drawnWidth = crop.width * scale;
  const drawnHeight = crop.height * scale;
  context.drawImage(
    source,
    (width - drawnWidth) / 2,
    (height - drawnHeight) / 2,
    drawnWidth,
    drawnHeight,
  );

  const texture = new THREE.CanvasTexture(canvas);
  texture.name = 'Supplied Melbourne Space Program white artwork';
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

function decal(
  width: number,
  height: number,
  texture: THREE.CanvasTexture,
): THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial> {
  const material = new THREE.MeshStandardMaterial({
    name: 'MSP printed white marking',
    color: 0xffffff,
    map: texture,
    metalness: 0,
    roughness: 0.65,
    transparent: true,
    alphaTest: 0.08,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  mesh.name = 'MSP logo';
  mesh.userData = {
    subsystem: 'eps',
    description:
      'Melbourne Space Program logo printed on the solar-panel substrate',
    isBranding: true,
    baseColour: 0xffffff,
    baseRoughness: 0.65,
    baseMetalness: 0,
  };
  return mesh;
}

/** Surface markings in assembly-local millimetres. Attach each mesh directly
 * to its returned assembly group so it follows that panel during separation.
 * Dispose the geometries, materials and their map textures with the scene. */
export async function createSpacecraftBranding(): Promise<
  SpacecraftBranding[]
> {
  const image = await loadLogo();
  if (image.naturalWidth < 727 || image.naturalHeight < 1996)
    throw new Error(
      'The MSP source image no longer matches the supplied artwork.',
    );

  const front = decal(
    45,
    8,
    whiteInkTexture(
      image,
      { x: 40, y: 1848, width: 687, height: 148 },
      1125,
      200,
    ),
  );
  front.position.set(0, -49.34, 44);
  front.rotation.x = Math.PI / 2;

  const side = decal(
    8,
    8,
    whiteInkTexture(
      image,
      { x: 40, y: 1848, width: 157, height: 148 },
      256,
      256,
    ),
  );
  side.position.set(49.34, -18, 44);
  side.quaternion.setFromRotationMatrix(
    new THREE.Matrix4().makeBasis(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(1, 0, 0),
    ),
  );

  return [
    { mesh: front, assembly: 'solar-y-negative' },
    { mesh: side, assembly: 'solar-x-positive' },
  ];
}
