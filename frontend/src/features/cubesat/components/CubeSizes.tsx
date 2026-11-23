// The CubeSat formats side by side, drawn in the site's green: each one a
// box of 10 cm units, front face, top and side, with the unit seams shown.
// Shown beside the CubeSat page title.

/** [label, units wide, units high, units deep] */
const FORMATS = [
  ['1U', 1, 1, 1],
  ['1.5U', 1, 1.5, 1],
  ['2U', 1, 2, 1],
  ['3U', 1, 3, 1],
  ['6U', 2, 3, 1],
  ['12U', 2, 3, 2],
] as const;

const S = 30; // one unit, front face
const DX = 0.45 * S; // one unit of depth, drawn up and to the right
const DY = -0.38 * S;
const GAP = 22;
const BASE = 150; // y of the front faces' bottom edge
const PAD = 4;

const pts = (...p: [number, number][]) =>
  p.map(([x, y]) => `${x},${y}`).join(' ');
/** Whole-unit steps inside a length, e.g. 1.5 -> [1]. */
const seams = (n: number) =>
  Array.from({ length: Math.ceil(n) - 1 }, (_, i) => i + 1);

function Box({ x, w, h, d }: { x: number; w: number; h: number; d: number }) {
  const W = w * S;
  const top = BASE - h * S;
  const ox = d * DX;
  const oy = d * DY;
  const lines: [number, number, number, number][] = [
    // Front: columns and rows.
    ...seams(w).map((i): [number, number, number, number] => [
      x + i * S,
      top,
      x + i * S,
      BASE,
    ]),
    ...seams(h).map((j): [number, number, number, number] => [
      x,
      BASE - j * S,
      x + W,
      BASE - j * S,
    ]),
    // Top: columns run back; depth seams run across.
    ...seams(w).map((i): [number, number, number, number] => [
      x + i * S,
      top,
      x + i * S + ox,
      top + oy,
    ]),
    ...seams(d).map((k): [number, number, number, number] => [
      x + k * DX,
      top + k * DY,
      x + W + k * DX,
      top + k * DY,
    ]),
    // Side: rows run back; depth seams run down.
    ...seams(h).map((j): [number, number, number, number] => [
      x + W,
      BASE - j * S,
      x + W + ox,
      BASE - j * S + oy,
    ]),
    ...seams(d).map((k): [number, number, number, number] => [
      x + W + k * DX,
      top + k * DY,
      x + W + k * DX,
      BASE + k * DY,
    ]),
  ];
  return (
    <g>
      <rect className="cube-front" x={x} y={top} width={W} height={h * S} />
      <polygon
        className="cube-top"
        points={pts(
          [x, top],
          [x + W, top],
          [x + W + ox, top + oy],
          [x + ox, top + oy],
        )}
      />
      <polygon
        className="cube-side"
        points={pts(
          [x + W, top],
          [x + W + ox, top + oy],
          [x + W + ox, BASE + oy],
          [x + W, BASE],
        )}
      />
      {lines.map(([x1, y1, x2, y2]) => (
        <line
          key={`${x1},${y1},${x2},${y2}`}
          className="cube-seam"
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
        />
      ))}
    </g>
  );
}

// Laid out once: each format after the last, a gap apart.
const BOXES = FORMATS.reduce<
  { label: string; w: number; h: number; d: number; at: number }[]
>((list, [label, w, h, d]) => {
  const last = list.at(-1);
  const at = last ? last.at + last.w * S + last.d * DX + GAP : PAD;
  return [...list, { label, w, h, d, at }];
}, []);
const LAST = BOXES[BOXES.length - 1];
const WIDTH = LAST.at + LAST.w * S + LAST.d * DX + PAD;

export function CubeSizes() {
  return (
    <svg
      className="cube-sizes"
      viewBox={`0 0 ${WIDTH} ${BASE + 34}`}
      // An inline drawing read as one image.
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
      role="img"
      aria-label="CubeSat formats compared: 1U, 1.5U, 2U, 3U, 6U and 12U, each built from 10 cm units."
    >
      {BOXES.map(({ label, w, h, d, at }) => (
        <g key={label}>
          <Box x={at} w={w} h={h} d={d} />
          <text x={at + (w * S) / 2} y={BASE + 26} textAnchor="middle">
            {label}
          </text>
        </g>
      ))}
    </svg>
  );
}
