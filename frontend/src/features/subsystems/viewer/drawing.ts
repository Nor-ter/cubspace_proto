// From CubeSat_Anatomy v1.0.1 (src/drawing.ts), the standalone 1U explorer.
import * as kit from './isoKit';
import type { AssemblySpec, Axis, PartSpec, Selection, Vec3 } from './types';

/** SVG companion of the shared physical model, using the Anatomy projection.
 * Small box-edge bevels are omitted from this explanatory drawing; the shared
 * dimensions, placement, round surfaces and open bores are retained.
 */
const WIDTH = 920;
const HEIGHT = 760;
const EPSILON = 1e-8;

interface Surface {
  part: PartSpec;
  vertices: Vec3[];
  edges: [Vec3, Vec3][];
  normal: Vec3;
  primitive?: 'slab-top' | 'cylinder-cap';
}

interface Face extends Surface {
  screen: kit.Flat[];
  depth: number;
  plane: Vec3;
  bounds: [number, number, number, number];
  d: string;
  outline: string;
  shade: number;
}

interface PreparedDrawing {
  parts: PartSpec[];
  assemblies: AssemblySpec[];
  explode: number;
  faces: Face[];
}

let previous: PreparedDrawing | undefined;

const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const subtract = (a: Vec3, b: Vec3): Vec3 => [
  a[0] - b[0],
  a[1] - b[1],
  a[2] - b[2],
];
const dot = (a: Vec3, b: Vec3): number =>
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const unit = (v: Vec3): Vec3 => {
  const length = Math.hypot(...v) || 1;
  return [v[0] / length, v[1] / length, v[2] / length];
};
const centre = (points: Vec3[]): Vec3 =>
  points
    .reduce<Vec3>((sum, p) => add(sum, p), [0, 0, 0])
    .map((v) => v / points.length) as Vec3;

// Three's default Euler order is XYZ: R = Rx Ry Rz.
function rotate([x, y, z]: Vec3, angles: Vec3 | undefined): Vec3 {
  if (!angles) return [x, y, z];
  const [a, b, c] = angles;
  const xc = x * Math.cos(c) - y * Math.sin(c);
  const yc = x * Math.sin(c) + y * Math.cos(c);
  const xb = xc * Math.cos(b) + z * Math.sin(b);
  const zb = -xc * Math.sin(b) + z * Math.cos(b);
  return [
    xb,
    yc * Math.cos(a) - zb * Math.sin(a),
    yc * Math.sin(a) + zb * Math.cos(a),
  ];
}

function alongAxis([u, v, s]: Vec3, axis: Axis): Vec3 {
  return axis === 'x' ? [s, u, v] : axis === 'y' ? [v, s, u] : [u, v, s];
}

function polygonEdges(points: Vec3[]): [Vec3, Vec3][] {
  return points.map(
    (p, i) => [p, points[(i + 1) % points.length]!] as [Vec3, Vec3],
  );
}

function surfacesOf(part: PartSpec, offset: Vec3): Surface[] {
  const origin = add(part.position, offset);
  const toWorld = (p: Vec3): Vec3 => add(origin, rotate(p, part.rotation));
  const surfaces: Surface[] = [];
  const push = (
    local: Vec3[],
    edges?: [Vec3, Vec3][],
    primitive?: Surface['primitive'],
  ): void => {
    const vertices = local.map(toWorld);
    const normal = unit(
      cross(
        subtract(vertices[1]!, vertices[0]!),
        subtract(vertices[2]!, vertices[0]!),
      ),
    );
    surfaces.push({
      part,
      vertices,
      normal,
      edges: (edges ?? polygonEdges(local)).map(([a, b]) => [
        toWorld(a),
        toWorld(b),
      ]),
      primitive,
    });
  };

  if (part.shape.kind === 'box') {
    const [x, y, z] = part.shape.size.map((v) => v / 2) as Vec3;
    const p: Vec3[] = [
      [-x, -y, -z],
      [x, -y, -z],
      [x, y, -z],
      [-x, y, -z],
      [-x, -y, z],
      [x, -y, z],
      [x, y, z],
      [-x, y, z],
    ];
    const faces = [
      [0, 3, 2, 1],
      [4, 5, 6, 7],
      [0, 1, 5, 4],
      [1, 2, 6, 5],
      [2, 3, 7, 6],
      [3, 0, 4, 7],
    ];
    faces.forEach((indices, index) =>
      push(
        indices.map((i) => p[i]!),
        undefined,
        index === 1 && !part.rotation?.some((a) => Math.abs(a) > EPSILON)
          ? 'slab-top'
          : undefined,
      ),
    );
    return surfaces;
  }

  const shape = part.shape;
  const outer = shape.kind === 'ring' ? shape.outerRadius : shape.radius;
  const inner = shape.kind === 'ring' ? shape.innerRadius : 0;
  const half = shape.height / 2;
  const steps = Math.max(16, Math.min(48, Math.ceil(outer * 2.2)));
  const circle = (radius: number, z: number): Vec3[] =>
    kit
      .circleRing(0, 0, radius, steps)
      .map(([x, y]) => alongAxis([x, y, z], shape.axis));
  const bottom = circle(outer, -half);
  const top = circle(outer, half);
  const innerBottom = inner > 0 ? circle(inner, -half) : [];
  const innerTop = inner > 0 ? circle(inner, half) : [];

  // The round sides are independently sortable, with no spurious facet-edge strokes.
  for (let i = 0; i < steps; i++) {
    const j = (i + 1) % steps;
    push(
      [bottom[i]!, bottom[j]!, top[j]!, top[i]!],
      [
        [bottom[i]!, bottom[j]!],
        [top[i]!, top[j]!],
      ],
    );
    if (inner > 0) {
      push(
        [innerBottom[j]!, innerBottom[i]!, innerTop[i]!, innerTop[j]!],
        [
          [innerBottom[i]!, innerBottom[j]!],
          [innerTop[i]!, innerTop[j]!],
        ],
      );
      // Annular sectors preserve the real hole. There is deliberately no hull fill.
      push(
        [top[i]!, top[j]!, innerTop[j]!, innerTop[i]!],
        [
          [top[i]!, top[j]!],
          [innerTop[i]!, innerTop[j]!],
        ],
      );
      push(
        [bottom[j]!, bottom[i]!, innerBottom[i]!, innerBottom[j]!],
        [
          [bottom[i]!, bottom[j]!],
          [innerBottom[i]!, innerBottom[j]!],
        ],
      );
    }
  }
  if (inner <= 0) {
    const nativeCap =
      shape.axis === 'z' && !part.rotation?.some((a) => Math.abs(a) > EPSILON)
        ? 'cylinder-cap'
        : undefined;
    push(top, undefined, nativeCap);
    push([...bottom].reverse());
  }
  return surfaces;
}

function signedArea(polygon: kit.Flat[]): number {
  return (
    polygon.reduce((sum, [x, y], i) => {
      const next = polygon[(i + 1) % polygon.length]!;
      return sum + x * next[1] - next[0] * y;
    }, 0) / 2
  );
}

/** Convex face overlap in screen space, used to compare actual surface depths. */
function overlapPolygon(subject: kit.Flat[], clip: kit.Flat[]): kit.Flat[] {
  let result = subject;
  const sign = signedArea(clip) >= 0 ? 1 : -1;
  for (let i = 0; i < clip.length && result.length; i++) {
    const a = clip[i]!;
    const b = clip[(i + 1) % clip.length]!;
    const side = (p: kit.Flat): number =>
      sign * ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]));
    const input = result;
    result = [];
    let last = input[input.length - 1]!;
    let lastSide = side(last);
    for (const point of input) {
      const pointSide = side(point);
      if (pointSide >= 0 !== lastSide >= 0) {
        const t = lastSide / (lastSide - pointSide);
        result.push([
          last[0] + t * (point[0] - last[0]),
          last[1] + t * (point[1] - last[1]),
        ]);
      }
      if (pointSide >= -EPSILON) result.push(point);
      last = point;
      lastSide = pointSide;
    }
  }
  return result;
}

function depthPlane(
  screen: kit.Flat[],
  world: Vec3[],
  projection: kit.Projection,
): Vec3 {
  const p = screen[0]!;
  const d0 = kit.depthOf(world[0]!, projection);
  for (let i = 1; i < screen.length - 1; i++) {
    const a = screen[i]!;
    const b = screen[i + 1]!;
    const ax = a[0] - p[0];
    const ay = a[1] - p[1];
    const bx = b[0] - p[0];
    const by = b[1] - p[1];
    const determinant = ax * by - ay * bx;
    if (Math.abs(determinant) < EPSILON) continue;
    const da = kit.depthOf(world[i]!, projection) - d0;
    const db = kit.depthOf(world[i + 1]!, projection) - d0;
    const x = (da * by - db * ay) / determinant;
    const y = (ax * db - bx * da) / determinant;
    return [x, y, d0 - x * p[0] - y * p[1]];
  }
  return [0, 0, d0];
}

function orderFaces(faces: Face[]): Face[] {
  const successors = faces.map(() => new Set<number>());
  const incoming = faces.map(() => 0);
  const sweep = faces
    .map((_, index) => index)
    .sort((a, b) => faces[a]!.bounds[0] - faces[b]!.bounds[0]);
  for (let ii = 0; ii < sweep.length; ii++) {
    const ai = sweep[ii]!;
    const a = faces[ai]!;
    for (let jj = ii + 1; jj < sweep.length; jj++) {
      const bi = sweep[jj]!;
      const b = faces[bi]!;
      if (b.bounds[0] >= a.bounds[2] - 0.02) break;
      if (
        a.bounds[1] >= b.bounds[3] - 0.02 ||
        b.bounds[1] >= a.bounds[3] - 0.02
      )
        continue;
      const overlap = overlapPolygon(a.screen, b.screen);
      if (overlap.length < 3 || Math.abs(signedArea(overlap)) < 0.035) continue;
      const middle = overlap.reduce<kit.Flat>(
        (sum, p) => [
          sum[0] + p[0] / overlap.length,
          sum[1] + p[1] / overlap.length,
        ],
        [0, 0],
      );
      const depthAt = (f: Face): number =>
        f.plane[0] * middle[0] + f.plane[1] * middle[1] + f.plane[2];
      const delta = depthAt(a) - depthAt(b);
      if (Math.abs(delta) < 1e-5) continue;
      const behind = delta < 0 ? ai : bi;
      const front = delta < 0 ? bi : ai;
      if (!successors[behind]!.has(front)) {
        successors[behind]!.add(front);
        incoming[front] = incoming[front]! + 1;
      }
    }
  }
  const result: Face[] = [];
  const pending = new Set(faces.map((_, i) => i));
  const ready = faces.map((_, i) => i).filter((i) => incoming[i] === 0);
  // A physical intersection can produce a cyclic relation. Depth is a deterministic
  // fallback for that case; non-intersecting visible faces follow the overlap graph.
  while (pending.size) {
    if (!ready.length) {
      let nearest = -1;
      for (const index of pending)
        if (nearest < 0 || faces[index]!.depth < faces[nearest]!.depth)
          nearest = index;
      ready.push(nearest);
    }
    ready.sort((a, b) => faces[b]!.depth - faces[a]!.depth);
    const index = ready.pop()!;
    if (!pending.delete(index)) continue;
    result.push(faces[index]!);
    for (const next of successors[index]!) {
      incoming[next] = incoming[next]! - 1;
      if (incoming[next] === 0 && pending.has(next)) ready.push(next);
    }
  }
  return result;
}

function prepare(
  parts: PartSpec[],
  assemblies: AssemblySpec[],
  explode: number,
): Face[] {
  if (
    previous?.parts === parts &&
    previous.assemblies === assemblies &&
    previous.explode === explode
  )
    return previous.faces;
  const assemblyMap = new Map(assemblies.map((a) => [a.id, a]));
  const surfaces = parts.flatMap((part) => {
    const vector = assemblyMap.get(part.assembly)?.explode ?? [0, 0, 0];
    return surfacesOf(part, vector.map((v) => v * explode) as Vec3);
  });
  if (!surfaces.length) return [];
  // Match the Three view's initial camera direction, [300, -420, 270].
  const projection = kit.fitProjection(
    surfaces.flatMap((s) => s.vertices),
    WIDTH,
    HEIGHT,
    {
      pad: 46,
      azimuth: (Math.atan2(-420, 300) * 180) / Math.PI,
      elevation: (Math.atan2(270, Math.hypot(300, 420)) * 180) / Math.PI,
    },
  );
  const camera = kit.cameraOf(projection);
  const viewer: Vec3 = [
    camera.cosA * camera.cosE,
    camera.sinA * camera.cosE,
    camera.sinE,
  ];
  const light = unit([-0.5, 0.35, 0.9]);
  const edgeKey = (a: Vec3, b: Vec3): string => {
    const key = (p: Vec3): string => p.map((v) => v.toFixed(6)).join(',');
    return [key(a), key(b)].sort().join('|');
  };
  const visibleEdges = new Map<string, number>();
  for (const surface of surfaces) {
    if (dot(surface.normal, viewer) <= 1e-7) continue;
    for (const [a, b] of polygonEdges(surface.vertices)) {
      const key = `${surface.part.id}|${edgeKey(a, b)}`;
      visibleEdges.set(key, (visibleEdges.get(key) ?? 0) + 1);
    }
  }
  const faces: Face[] = [];
  for (const surface of surfaces) {
    if (dot(surface.normal, viewer) <= 1e-7) continue;
    const screen = surface.vertices.map((p) => kit.iso(p, projection));
    if (Math.abs(signedArea(screen)) < 0.025) continue;
    let d = kit.pathOf(screen, true);
    // Use the kit's exact native primitives for horizontal box faces and round caps.
    // Other faces stay independent, so a frame member can pass behind a board.
    if (surface.primitive === 'slab-top' && surface.part.shape.kind === 'box') {
      const low = surface.vertices[0]!;
      const [w, depth] = surface.part.shape.size;
      d = kit.slabOf(
        { x: low[0], y: low[1], w, d: depth, r: 0 },
        low[2],
        0,
        projection,
      ).top;
    } else if (
      surface.primitive === 'cylinder-cap' &&
      surface.part.shape.kind === 'cylinder'
    ) {
      const midpoint = centre(surface.vertices);
      d = kit.cylinder(
        midpoint[0],
        midpoint[1],
        surface.part.shape.radius,
        midpoint[2],
        0,
        projection,
        surface.vertices.length,
      ).top;
    }
    const xs = screen.map((p) => p[0]);
    const ys = screen.map((p) => p[1]);
    const edges = new Map(
      surface.edges.map(([a, b]) => [edgeKey(a, b), [a, b] as [Vec3, Vec3]]),
    );
    for (const [a, b] of polygonEdges(surface.vertices)) {
      if (visibleEdges.get(`${surface.part.id}|${edgeKey(a, b)}`) === 1)
        edges.set(edgeKey(a, b), [a, b]);
    }
    faces.push({
      ...surface,
      screen,
      d,
      depth: kit.depthOf(centre(surface.vertices), projection),
      plane: depthPlane(screen, surface.vertices, projection),
      bounds: [
        Math.min(...xs),
        Math.min(...ys),
        Math.max(...xs),
        Math.max(...ys),
      ],
      outline: [...edges.values()]
        .map(([a, b]) => kit.segment(a, b, projection))
        .join(''),
      shade:
        surface.normal[2] > 0.85
          ? 4
          : Math.max(
              0,
              Math.min(3, Math.floor((dot(surface.normal, light) + 1) * 2)),
            ),
    });
  }
  const ordered = orderFaces(faces);
  previous = { parts, assemblies, explode, faces: ordered };
  return ordered;
}

const MATERIAL_LIGHTNESS: Record<PartSpec['material'], number> = {
  aluminium: 0.48,
  darkMetal: 0.28,
  board: 0.33,
  panel: 0.29,
  chip: 0.22,
  gold: 0.56,
  copper: 0.43,
  solar: 0.2,
  glass: 0.26,
  battery: 0.4,
  white: 0.59,
};

function colour(lightness: number): string {
  const v = Math.max(0, Math.min(1, lightness));
  return `rgb(${Math.round(22 + v * 218)} ${Math.round(22 + v * 210)} ${Math.round(19 + v * 191)})`;
}

function paint(face: Face, selected: Selection): string {
  const active = selected !== 'all' && selected === face.part.subsystem;
  const muted = selected !== 'all' && !active;
  const material = MATERIAL_LIGHTNESS[face.part.material];
  const level = active
    ? Math.min(0.82, material + 0.25)
    : muted
      ? 0.19 + material * 0.2
      : material;
  const fill = colour(level * (0.64 + face.shade * 0.1));
  const line = active ? '#f1e8d2' : muted ? '#55544e' : '#aaa495';
  const shades = ['', '', '', ''];
  if (face.shade < 4) shades[face.shade] = face.d;
  const paths: kit.SolidPaths = {
    fill: face.d,
    outline: face.outline,
    crease: '',
    top: face.shade === 4 ? face.d : '',
    shades,
  };
  return kit.groupSvg(kit.solidSvg(paths, { tone: 'hi', crease: 'none' }), {
    class: `anatomy-part${active ? ' is-selected' : ''}${muted ? ' is-muted' : ''}`,
    'data-subsystem': face.part.subsystem,
    'data-part': face.part.id,
    'aria-label': `${face.part.name}, ${face.part.subsystem.toUpperCase()}`,
    style: `--anatomy-paper:${fill};--anatomy-top:${fill};--anatomy-shade-0:${fill};--anatomy-shade-1:${fill};--anatomy-shade-2:${fill};--anatomy-shade-3:${fill};--anatomy-hi:${line}`,
  });
}

/** Returns a self-contained, selectable, isometric SVG from the shared PartSpec geometry. */
export function renderDrawing(
  parts: PartSpec[],
  assemblies: AssemblySpec[],
  explode: number,
  selected: Selection,
): string {
  const amount = Number.isFinite(explode)
    ? Math.max(0, Math.min(1, explode))
    : 0;
  const faces = prepare(parts, assemblies, amount);
  const style = `<style>.cube-anatomy{background:#161612;--anatomy-weight:.55px}.cube-anatomy .anatomy-part{cursor:pointer}.cube-anatomy .anatomy-part:hover{--anatomy-hi:#fff4d8!important}.cube-anatomy .is-selected{--anatomy-weight:.85px}.cube-anatomy .iso-shade,.cube-anatomy .iso-top{stroke:var(--anatomy-paper);stroke-width:.22;stroke-linejoin:round}.cube-anatomy .iso-edge{stroke-linecap:round;stroke-linejoin:round}</style>`;
  const mode = amount > 0.01 ? 'Exploded' : 'Assembled';
  return kit.figureSvg({
    width: WIDTH,
    height: HEIGHT,
    standalone: 'dark',
    className: 'cube-anatomy',
    label: `${mode} CubeSat isometric drawing. Structure, EPS, ADCS, OBC, communications and payload use the same geometry as the 3D view. Select a visible part to inspect its subsystem.`,
    body: [
      style,
      `<rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="#161612"/>`,
      ...faces.map((face) => paint(face, selected)),
    ],
  });
}
