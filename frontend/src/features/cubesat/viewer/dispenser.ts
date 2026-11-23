import * as THREE from 'three';

/** Reference-inspired rail dispenser; illustrative geometry, not a manufacturing definition. */
export function createDispenser() {
  const group = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({
    color: 0xc9cdd0,
    metalness: 0.85,
    roughness: 0.32,
  });
  const dark = new THREE.MeshStandardMaterial({
    color: 0x42484e,
    metalness: 0.7,
    roughness: 0.4,
  });
  const panel = new THREE.MeshStandardMaterial({
    color: 0xd8dadd,
    metalness: 0.55,
    roughness: 0.46,
  });
  const board = new THREE.MeshStandardMaterial({
    color: 0x254c37,
    roughness: 0.75,
  });
  const chip = new THREE.MeshStandardMaterial({
    color: 0x171b1c,
    roughness: 0.7,
  });
  const gold = new THREE.MeshStandardMaterial({
    color: 0xba9c55,
    metalness: 0.8,
    roughness: 0.4,
  });
  function box(
    parent: THREE.Object3D,
    dimensions: [number, number, number],
    position: [number, number, number],
    material: THREE.Material,
  ) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...dimensions), material);
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
  }
  box(group, [1.36, 0.1, 1.4], [0, -1.65, 0], metal);
  box(group, [1.25, 3.25, 0.05], [0, 0, 0.65], panel);
  box(group, [1.25, 3.25, 0.05], [0, 0, -0.65], dark);
  box(group, [0.05, 3.25, 1.3], [-0.625, 0, 0], dark);
  box(group, [0.05, 3.25, 1.3], [0.625, 0, 0], dark);
  for (const x of [-0.63, 0.63])
    for (const z of [-0.66, 0.66]) {
      box(group, [0.12, 3.3, 0.12], [x, 0, z], metal);
      box(group, [0.04, 3.18, 0.025], [x, 0, z + Math.sign(z) * 0.065], dark);
    }
  // Side extrusions and internal CubeSat guide rails.
  for (const side of [-1, 1]) {
    for (const z of [-0.36, 0, 0.36])
      box(group, [0.055, 3.1, 0.06], [side * 0.67, 0, z], metal);
    for (const z of [-0.48, 0.48])
      box(group, [0.06, 3.12, 0.06], [side * 0.5, 0, z], metal);
  }
  // Recessed fastener strips, with individual screw heads and slots.
  const screwGeometry = new THREE.CylinderGeometry(0.026, 0.026, 0.018, 12);
  for (const side of [-1, 1])
    for (const x of [-0.46, 0.46]) {
      for (let row = 0; row < 17; row++) {
        const y = -1.43 + row * 0.178;
        box(group, [0.082, 0.082, 0.015], [x, y, side * 0.685], dark);
        const screw = new THREE.Mesh(screwGeometry, metal);
        screw.rotation.x = Math.PI / 2;
        screw.position.set(x, y, side * 0.7);
        group.add(screw);
        box(group, [0.027, 0.007, 0.006], [x, y, side * 0.713], chip);
      }
    }
  // Access cover, mounting tabs and a visible electronics board beneath the opening.
  box(group, [0.21, 0.45, 0.025], [-0.12, 1.18, 0.69], metal);
  box(group, [0.9, 0.035, 0.95], [0, 0.5, 0], board);
  for (const x of [-0.3, 0.28])
    for (const z of [-0.25, 0.25])
      box(group, [0.17, 0.035, 0.13], [x, 0.54, z], chip);
  box(group, [0.85, 0.08, 0.85], [0, -1.45, 0], dark);
  for (const x of [-0.72, 0.72])
    box(group, [0.3, 0.08, 0.35], [x, -1.68, 0], metal);
  const hinge = new THREE.Group();
  hinge.position.set(0, 1.66, -0.66);
  group.add(hinge);
  box(hinge, [1.36, 0.055, 1.36], [0, 0, 0.66], dark);
  for (const x of [-0.5, 0.5]) {
    const pin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.22, 16),
      metal,
    );
    pin.rotation.z = Math.PI / 2;
    pin.position.x = x;
    hinge.add(pin);
    box(group, [0.16, 0.13, 0.16], [x, 1.62, -0.66], metal);
  }
  box(group, [0.12, 0.12, 0.1], [0.5, 1.6, 0.68], gold);
  return { group, hinge };
}
