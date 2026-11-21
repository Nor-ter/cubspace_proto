import { STRUCTURE } from '../data';

// Mission Tree's levels drawn as a simple tree: the mission is the root at
// the bottom, a trunk forks into branches that thin out upward, and tasks are
// the leaves under a soft round crown.
// Each level sits on an arc that curves down at its ends, the upper levels
// wider, so the leaves trace a round crown. Every node is a cream circle;
// each level is labelled on the right, level with the middle of its arc.

const ROOT_X = 160;

type Level = {
  /** Height of the arc's middle. */
  y: number;
  /** Node offsets from the trunk, left to right. */
  dx: readonly number[];
  /** How far the arc curves down at its outermost node. */
  drop: number;
  r: number;
};

// Bottom (Mission) to top (Tasks); matches STRUCTURE.
const LEVELS: readonly Level[] = [
  { y: 262, dx: [0], drop: 0, r: 8 },
  { y: 196, dx: [-50, 50], drop: 8, r: 6 },
  { y: 150, dx: [-100, -35, 35, 100], drop: 26, r: 5 },
  { y: 100, dx: [-115, -40, 40, 115], drop: 40, r: 4 },
  { y: 44, dx: [-135, -95, -55, -18, 18, 55, 95, 135], drop: 70, r: 5 },
];

const nodes = LEVELS.map((level) => {
  const widest = Math.max(...level.dx.map(Math.abs)) || 1;
  return level.dx.map((dx) => ({
    x: ROOT_X + dx,
    y: level.y + level.drop * (dx / widest) ** 2,
  }));
});

type Point = { x: number; y: number };

// A branch from a node up to one of its children: an S-curve that leaves
// and arrives vertically.
function branch(from: Point, to: Point) {
  const mid = (from.y + to.y) / 2;
  return `M${from.x} ${from.y}C${from.x} ${mid} ${to.x} ${mid} ${to.x} ${to.y}`;
}

// Children of node `i` on the level above: one when the level has the same
// count, otherwise two.
function children(level: number, i: number) {
  const here = LEVELS[level].dx.length;
  const above = LEVELS[level + 1].dx.length;
  return above === here ? [i] : [i * 2, i * 2 + 1];
}

// Where the trunk forks into the first branches.
const FORK: Point = { x: ROOT_X, y: 214 };
// Branch thickness by the level it grows from: thick near the trunk, thin at
// the leaves.
const BRANCH_WIDTH = [5, 3.5, 2.5, 1.75];
const ROOT_Y = LEVELS[0].y;
// Roots: [end x offset, end depth], curving out under the mission.
const ROOTS = [
  [-52, 34],
  [-22, 44],
  [22, 44],
  [52, 34],
] as const;

export function StructureTree() {
  const branches: { d: string; width: number }[] = [];
  for (let level = 0; level < LEVELS.length - 1; level++)
    nodes[level].forEach((node, i) =>
      children(level, i).forEach((child) =>
        branches.push({
          // The first branches grow from the top of the trunk.
          d: branch(level === 0 ? FORK : node, nodes[level + 1][child]),
          width: BRANCH_WIDTH[level],
        }),
      ),
    );

  return (
    <svg
      className="structure-tree"
      viewBox="0 0 460 310"
      // An inline drawing, not a picture file: role="img" plus a label is how
      // assistive tech reads an SVG as one image.
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
      role="img"
      aria-label={`How Mission Tree is organised, from the root up: ${STRUCTURE.join(', ')}.`}
    >
      {/* The crown: a soft round shape behind the branches and leaves. */}
      <ellipse
        className="structure-tree-crown"
        cx={ROOT_X}
        cy="118"
        rx="152"
        ry="104"
      />

      {/* Roots curving out under the mission, each ending in a small dot. */}
      <g className="structure-tree-roots">
        {ROOTS.map(([dx, depth]) => (
          <g key={dx}>
            <path
              d={`M${ROOT_X} ${ROOT_Y}C${ROOT_X} ${ROOT_Y + depth * 0.6} ${ROOT_X + dx * 0.6} ${ROOT_Y + depth} ${ROOT_X + dx} ${ROOT_Y + depth}`}
            />
            <circle cx={ROOT_X + dx} cy={ROOT_Y + depth} r="2.5" />
          </g>
        ))}
      </g>

      {/* The trunk, from the mission up to the first fork. */}
      <path
        className="structure-tree-trunk"
        d={`M${ROOT_X} ${ROOT_Y}V${FORK.y}`}
      />

      <g className="structure-tree-branches">
        {branches.map(({ d, width }) => (
          <path key={d} d={d} style={{ strokeWidth: width }} />
        ))}
      </g>

      {nodes.map((row, level) =>
        row.map((node) => (
          <circle
            key={`${level}-${node.x}`}
            className={level === 0 ? 'is-root' : undefined}
            cx={node.x}
            cy={node.y}
            r={LEVELS[level].r}
          />
        )),
      )}

      {STRUCTURE.map((label, level) => (
        <text key={label} x="318" y={LEVELS[level].y} dominantBaseline="middle">
          {label}
        </text>
      ))}
    </svg>
  );
}
