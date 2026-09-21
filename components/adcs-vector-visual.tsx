const variables = [
  {
    symbol: 'B',
    name: 'Magnetic field',
    unit: 'T · usually µT',
    role: 'Magnetometer가 측정하는 환경 자기장',
    tone: 'field',
  },
  {
    symbol: 'm',
    name: 'Magnetic dipole moment',
    unit: 'A·m²',
    role: 'Magnetorquer에 명령되는 자기 쌍극자',
    tone: 'moment',
  },
  {
    symbol: 'τ',
    name: 'Magnetic torque',
    unit: 'N·m',
    role: 'm × B로 생성되는 자기 토크',
    tone: 'torque',
  },
  {
    symbol: 'ω',
    name: 'Angular velocity',
    unit: 'rad/s · °/s',
    role: '토크의 영향을 받는 현재 위성 회전 상태',
    tone: 'rate',
  },
] as const;

export function AdcsVectorVisual() {
  return (
    <section className="adcs-vector-visual" aria-labelledby="adcs-vector-title">
      <header>
        <p className="eyebrow">VARIABLES IN ONE BODY FRAME</p>
        <h4 id="adcs-vector-title">
          자기장과 구동 명령이 회전 상태에 연결되는 방향
        </h4>
        <p>
          같은 spacecraft body frame에서 네 벡터의 방향과 핵심 관계를
          비교하세요.
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
              B, m, τ, ω를 하나의 위성 몸체 좌표계에 표시한 벡터 그림
            </title>
            <desc id="adcs-vector-svg-desc">
              원점에서 오른쪽은 자기장 B, 위쪽은 자기모멘트 m, 왼쪽 위는 두
              벡터의 외적으로 생기는 토크 τ, 왼쪽 아래는 현재 각속도 ω를
              나타냅니다. τ는 m과 B에 모두 수직이지만 ω와 항상 정반대 방향인
              것은 아닙니다. m과 B가 평행하면 토크는 0이며 자기장 방향의 토크는
              만들 수 없습니다. 그림은 2차원 투영이며 축척과 실제 궤도 자세를
              나타내지 않습니다.
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
            <g className="vector-right-angle" aria-label="m과 B 사이 90도">
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
            교육용 2D 투영 · 벡터는 같은 spacecraft body frame에 표시되며 축척과
            실제 자세를 나타내지 않습니다.
          </figcaption>
        </figure>

        <div className="adcs-variable-list" aria-label="ADCS 변수 의미와 단위">
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
          <span>Control objective</span>
          <strong>Reduce |ω|</strong>
        </p>
        <p>
          자기 토크는 τ = m × B 관계로 제한되므로, 매 순간 ω의 정확한 반대
          방향으로 작용하는 것은 아닙니다.
        </p>
      </div>
      <p className="adcs-vector-limit">
        <strong>Direction limit</strong> — m ∥ B이면 τ=0이며, 자기장 B 방향의
        토크는 순간적으로 만들 수 없습니다.
      </p>
    </section>
  );
}
