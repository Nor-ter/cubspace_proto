import * as THREE from 'three';

// Illustrative geometry and time scales, not a trajectory or flight controller.
export function createMissionAnimation(orbit: THREE.Group) {
  const root = new THREE.Group();
  orbit.add(root);
  const silver = new THREE.MeshStandardMaterial({
    color: 0xdce8ef,
    metalness: 0.55,
    roughness: 0.35,
  });
  const blue = new THREE.MeshStandardMaterial({ color: 0x3284b4 });
  const rocket = new THREE.Group();
  root.add(rocket);
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.009, 0.009, 0.058, 20),
    silver,
  );
  rocket.add(body);
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.009, 0.021, 20), blue);
  nose.position.y = 0.0395;
  rocket.add(nose);
  for (let i = 0; i < 4; i++) {
    const fin = new THREE.Mesh(
      new THREE.BoxGeometry(0.017, 0.016, 0.002),
      blue,
    );
    fin.position.y = -0.021;
    fin.rotation.y = (i * Math.PI) / 2;
    rocket.add(fin);
  }
  const flame = new THREE.Mesh(
    new THREE.ConeGeometry(0.008, 0.027, 12),
    new THREE.MeshBasicMaterial({ color: 0xffb54d }),
  );
  flame.rotation.z = Math.PI;
  flame.position.y = -0.041;
  rocket.add(flame);
  const station = new THREE.Group();
  station.position.set(0.149, 0, 0);
  root.add(station);
  const mast = new THREE.Mesh(
    new THREE.CylinderGeometry(0.002, 0.003, 0.018, 8),
    silver,
  );
  mast.rotation.z = -Math.PI / 2;
  station.add(mast);
  const dish = new THREE.Mesh(
    new THREE.SphereGeometry(0.011, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0x9debea, side: THREE.DoubleSide }),
  );
  dish.rotation.z = -Math.PI / 2;
  dish.position.x = 0.014;
  station.add(dish);
  const antenna = new THREE.Group();
  root.add(antenna);
  const rods = Array.from({ length: 4 }, () => {
    const rod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0008, 0.0008, 1, 6),
      silver,
    );
    antenna.add(rod);
    return rod;
  });
  const signal = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]),
    new THREE.LineBasicMaterial({
      color: 0x67efff,
      transparent: true,
      opacity: 0.5,
    }),
  );
  root.add(signal);
  const packets = Array.from({ length: 4 }, (_, i) => {
    const p = new THREE.Mesh(
      new THREE.SphereGeometry(0.003, 8, 6),
      new THREE.MeshBasicMaterial({ color: i % 2 ? 0xb2e86d : 0x69edff }),
    );
    root.add(p);
    return p;
  });
  const yAxis = new THREE.Vector3(0, 1, 0);
  const point = (a: number, r = 0.29) =>
    new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0);
  function update(phase: number, t: number, model: THREE.Object3D) {
    rocket.visible = phase === 0 && t < 12;
    station.visible = phase === 2;
    antenna.visible = phase === 2;
    signal.visible = false;
    packets.forEach((p) => (p.visible = false));
    model.visible = phase !== 0 || t >= 7;
    let angle = -0.65 + 0.085 * t;
    let label = '';
    if (phase === 0) {
      const ascent = Math.min(t / 7, 1);
      const a = -1.1 + ascent * 1.1;
      rocket.position.copy(point(a, 0.17 + 0.12 * ascent));
      rocket.quaternion.setFromUnitVectors(yAxis, point(a + 0.32).normalize());
      flame.visible = t < 7;
      flame.scale.y = 0.8 + 0.2 * Math.sin(t * 35);
      if (t >= 7) {
        angle = (t - 7) * 0.085;
        model.position.copy(point(angle));
        rocket.position.copy(point(angle - 0.1 * Math.min((t - 7) / 3, 1)));
      }
      model.rotation.set(0.12, (t - 7) * 0.7, -0.08);
      label =
        t < 3
          ? '발사 · 지표에서 상승'
          : t < 7
            ? '상승 · 궤도 투입'
            : t < 10
              ? '위성 사출 · 발사체와 분리'
              : '분리 완료 · 궤도 비행';
    } else {
      model.position.copy(point(angle));
      if (phase === 1) {
        const spin = (5 / 0.45) * (1 - Math.exp(-0.45 * t)) + 0.08 * t;
        model.rotation.set(0.12 + spin * 0.65, spin, -0.08 + spin * 0.3);
        label =
          t < 3
            ? '사출 직후 · 빠른 몸체 회전'
            : t < 10
              ? 'B-dot 제어 · 몸체 회전 감쇠'
              : '회전 감소 · 다음 운용 조건 확인';
      } else {
        model.rotation.set(0.12, -0.45 + 0.08 * t, -0.08);
        antenna.position.copy(model.position);
        antenna.quaternion.copy(model.quaternion);
        const deployment = THREE.MathUtils.smoothstep(t, 0, 3);
        rods.forEach((rod, i) => {
          const a = (i * Math.PI) / 2;
          const start = new THREE.Vector3(
            Math.cos(a) * 0.01,
            Math.sin(a) * 0.01,
            0,
          );
          const direction = new THREE.Vector3(
            Math.cos(a) * deployment,
            Math.sin(a) * deployment,
            1 - deployment,
          ).normalize();
          rod.position.copy(start).addScaledVector(direction, 0.021);
          rod.quaternion.setFromUnitVectors(yAxis, direction);
          rod.scale.y = 0.042;
        });
        // Above the local horizon: the Earth must not block this illustrative link.
        const ground = new THREE.Vector3(0.169, 0, 0);
        const visible = model.position.x > 0.169;
        const connected = t >= 3 && visible;
        signal.visible = connected;
        if (connected) {
          signal.geometry.setFromPoints([ground, model.position]);
          packets.forEach((p, i) => {
            p.visible = true;
            let f = (t * 0.5 + i / 4) % 1;
            if (i % 2) f = 1 - f;
            p.position.lerpVectors(ground, model.position, f);
          });
        }
        label =
          t < 3
            ? '안테나 전개'
            : connected
              ? '지상국 가시권 · 명령 ↑ / 텔레메트리 ↓'
              : '지상국 비가시권 · 다음 통신 기회 대기';
      }
    }
    return label;
  }
  function dispose() {
    orbit.remove(root);
    root.traverse((o) => {
      if (o instanceof THREE.Mesh || o instanceof THREE.Line) {
        o.geometry.dispose();
        const ms = Array.isArray(o.material) ? o.material : [o.material];
        ms.forEach((m) => m.dispose());
      }
    });
  }
  return { update, dispose };
}
