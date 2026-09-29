/* oxlint-disable jsx-a11y/prefer-tag-over-role -- Inline SVG retains its accessible title and description. */
const variables = [
  {
    symbol: 'B',
    name: 'magnetic field',
    unit: 'T (usually in µT)',
    role: 'Environmental magnetic fields measured by a magnetometer',
    tone: 'field',
  },
  {
    symbol: 'm',
    name: 'magnetic dipole moment',
    unit: 'A·m²',
    role: 'Magnetic dipole commanded to magnetic talker',
    tone: 'moment',
  },
  {
    symbol: 'τ',
    name: 'magnetic torque',
    unit: 'N·m',
    role: 'Magnetic torque produced by m × B',
    tone: 'torque',
  },
  {
    symbol: 'ω',
    name: 'angular velocity',
    unit: 'rad/s · °/s',
    role: 'Current satellite rotation state affected by torque',
    tone: 'rate',
  },
] as const;

export function AdcsVectorVisual() {
  return (
    <section className="adcs-vector-visual" aria-labelledby="adcs-vector-title">
      <header>
        <p className="eyebrow">Vector in satellite body coordinate system</p>
        <h4 id="adcs-vector-title">
          Relationship between magnetic field, driving command, torque, and
          angular velocity
        </h4>
        <p>
          Compare the directions and key relationships of the four vectors in
          the same satellite body coordinate system.
        </p>
      </header>

      <div className="adcs-vector-layout">
        <figure>
          <svg
            viewBox="0 0 520 340"
            role="img"
            aria-labelledby="adcs-vector-svg-title adcs-vector-svg-desc"
          >
            <title id="adcs-vector-svg-title">
              Vector illustration of B, m, τ, ω in one satellite body coordinate
              system
            </title>
            <desc id="adcs-vector-svg-desc">
              From the origin, magnetic field B points right, magnetic moment m
              points upward, their cross-product torque τ points upper-left, and
              angular velocity ω points lower-left. Torque τ is perpendicular to
              both m and B, but it is not necessarily opposite to ω at every
              instant. If m and B are parallel, torque is zero; torque cannot be
              generated along the magnetic-field direction. This is a
              two-dimensional conceptual projection, not a to-scale
              representation of an actual orbital attitude.
            </desc>
            <defs>
              {[
                ['axis', '#668599'],
                ['field', '#65c6ec'],
                ['moment', '#a6d86f'],
                ['torque', '#f2bd65'],
                ['rate', '#bd9cff'],
              ].map(([id, color]) => (
                <marker
                  key={id}
                  id={`arrow-${id}`}
                  markerWidth="10"
                  markerHeight="10"
                  refX="8"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill={color} />
                </marker>
              ))}
            </defs>

            <g className="vector-axes">
              <line x1="250" y1="188" x2="452" y2="188" />
              <line x1="250" y1="188" x2="250" y2="32" />
              <line x1="250" y1="188" x2="410" y2="300" />
              <text x="466" y="193">
                +x
              </text>
              <text x="239" y="22">
                +y
              </text>
              <text x="420" y="313">
                +z
              </text>
            </g>

            <circle className="vector-origin" cx="250" cy="188" r="7" />
            <text className="vector-origin-label" x="224" y="214">
              O
            </text>

            <g className="vector-arrow vector-field">
              <line x1="250" y1="188" x2="424" y2="188" />
              <text x="438" y="195">
                B
              </text>
            </g>
            <g className="vector-arrow vector-moment">
              <line x1="250" y1="188" x2="250" y2="54" />
              <text x="264" y="58">
                m
              </text>
            </g>
            <g
              className="vector-right-angle"
              aria-label="90 degrees between m and B"
            >
              <path d="M250 166 H272 V188" />
              <text x="278" y="169">
                90°
              </text>
            </g>
            <g className="vector-arrow vector-torque">
              <line x1="250" y1="188" x2="112" y2="88" />
              <text x="86" y="82">
                τ
              </text>
              <text className="vector-relation-note" x="52" y="110">
                τ ⟂ B, m
              </text>
            </g>
            <g className="vector-arrow vector-rate">
              <line x1="250" y1="188" x2="142" y2="284" />
              <text x="112" y="303">
                ω
              </text>
            </g>

            <text className="vector-core-equation" x="324" y="92">
              τ = m × B
            </text>
          </svg>
          <figcaption>
            2D projection for educational use Vectors are displayed in the same
            satellite body coordinate system and are to scale and realistic. It
            does not indicate posture.
          </figcaption>
        </figure>

        <div
          className="adcs-variable-list"
          aria-label="ADCS variable meaning and units"
        >
          {variables.map((variable) => (
            <article
              key={variable.symbol}
              className={`variable-${variable.tone}`}
            >
              <span>{variable.symbol}</span>
              <div>
                <h5>{variable.name}</h5>
                <small>{variable.unit}</small>
                <p>{variable.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="adcs-control-summary">
        <p>
          <span>control target</span>
          <strong>Angular velocity magnitude |ω| decrease</strong>
        </p>
        <p>
          Because magnetic torque is constrained by τ = m × B, it cannot point
          exactly opposite to ω at every instant.
        </p>
      </div>
      <p className="adcs-vector-limit">
        <strong>Constraints on driving direction</strong>, m ∥ B, then τ = 0,
        and the magnetic field in the B direction is Torque cannot be created
        instantaneously.
      </p>
    </section>
  );
}
