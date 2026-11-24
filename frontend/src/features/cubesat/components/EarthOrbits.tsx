// The LEO box's pictures, drawn for the site: the Earth with low, medium
// and geostationary orbits around it, then a table comparing the three.
// Altitudes are the usual definitions; the drawing is not to scale.

const CX = 170; // the Earth's centre, low left, partly off the picture
const CY = 600;
const EARTH_R = 250;

const ORBITS = [
  { name: 'LEO', altitude: '160–2,000 km', r: 350, at: 52 },
  { name: 'MEO', altitude: '2,000–35,786 km', r: 580, at: 44 },
  { name: 'GEO', altitude: '35,786 km', r: 820, at: 42 },
] as const;

/** Where an orbit of radius `r` crosses the angle `deg` (up from +x). */
const on = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: CX + r * Math.cos(a), y: CY - r * Math.sin(a) };
};

/** A satellite: a body with a dish and two solar wings, about 90 wide. */
function Satellite({ x, y, turn }: { x: number; y: number; turn: number }) {
  return (
    <g className="orbit-sat" transform={`translate(${x} ${y}) rotate(${turn})`}>
      {[-1, 1].map((side) => (
        <g key={side}>
          <line x1={side * 9} y1={0} x2={side * 14} y2={0} />
          <rect
            className="orbit-sat-wing"
            x={side < 0 ? -46 : 14}
            y={-9}
            width={32}
            height={18}
          />
          {[1, 2, 3].map((i) => (
            <line
              key={i}
              className="orbit-sat-cell"
              x1={(side < 0 ? -46 : 14) + i * 8}
              y1={-9}
              x2={(side < 0 ? -46 : 14) + i * 8}
              y2={9}
            />
          ))}
        </g>
      ))}
      <rect
        className="orbit-sat-body"
        x={-9}
        y={-11}
        width={18}
        height={22}
        rx={2}
      />
      <path className="orbit-sat-dish" d="M -7 15 Q 0 26 7 15 Z" />
    </g>
  );
}

export function EarthOrbits() {
  return (
    <svg
      className="earth-orbits"
      viewBox="0 0 1000 600"
      // An inline drawing read as one image.
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
      role="img"
      aria-label="The Earth with three orbits around it, not to scale: low Earth orbit (LEO) at 160 to 2,000 km, medium Earth orbit (MEO) at 2,000 to 35,786 km, and geostationary orbit (GEO) at 35,786 km."
    >
      <defs>
        <radialGradient id="orbit-glow" cx="50%" cy="50%" r="50%">
          <stop offset="88%" stopColor="rgb(120 170 255)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="rgb(120 170 255)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Each orbit's band, lighter towards the Earth. */}
      {[...ORBITS].reverse().map((orbit) => (
        <circle
          key={`band-${orbit.name}`}
          className="orbit-band"
          cx={CX}
          cy={CY}
          r={orbit.r + 60}
        />
      ))}
      {ORBITS.map((orbit) => (
        <circle
          key={`path-${orbit.name}`}
          className="orbit-path"
          cx={CX}
          cy={CY}
          r={orbit.r}
        />
      ))}
      <circle cx={CX} cy={CY} r={EARTH_R * 1.1} fill="url(#orbit-glow)" />
      <image
        href="/images/cubesat/earth-disc.png"
        x={CX - EARTH_R}
        y={CY - EARTH_R}
        width={EARTH_R * 2}
        height={EARTH_R * 2}
      />
      {ORBITS.map((orbit) => {
        const p = on(orbit.r, orbit.at);
        return (
          <g key={orbit.name}>
            {/* Wings along the orbit's tangent, dish towards the Earth. */}
            <Satellite x={p.x} y={p.y} turn={90 - orbit.at} />
            <text className="orbit-name" x={p.x + 40} y={p.y + 62}>
              {orbit.name}
            </text>
            <text className="orbit-altitude" x={p.x + 40} y={p.y + 88}>
              {orbit.altitude}
            </text>
          </g>
        );
      })}
      <text className="orbit-note" x={985} y={588} textAnchor="end">
        Not to scale
      </text>
    </svg>
  );
}

/** [what, LEO, MEO, GEO] */
const ROWS = [
  [
    'Altitude',
    '160–2,000 km',
    '2,000–35,786 km',
    '35,786 km, above the equator',
  ],
  [
    'One orbit takes',
    'About 90–130 minutes',
    'About 2–24 hours (GPS: 12 hours)',
    'One day, matching the Earth’s turn',
  ],
  [
    'Seen from the ground',
    'Passes overhead in about 10 minutes, several times a day',
    'Visible for hours at a time',
    'Stays over the same spot',
  ],
  [
    'Typical uses',
    'Earth observation, science, CubeSats, crewed stations',
    'Navigation',
    'Weather, television and communications',
  ],
  [
    'Examples',
    'ISS (about 400 km)',
    'GPS, Galileo',
    'Weather and broadcast satellites',
  ],
] as const;

export function OrbitTable() {
  return (
    <div className="orbit-table-wrap">
      <table className="orbit-table">
        <thead>
          <tr>
            <th scope="col">Orbit</th>
            <th scope="col">LEO</th>
            <th scope="col">MEO</th>
            <th scope="col">GEO</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map(([what, ...cells]) => (
            <tr key={what}>
              <th scope="row">{what}</th>
              {cells.map((cell, index) => (
                <td key={index}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
