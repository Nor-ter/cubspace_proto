export const equations: Record<string, string[]> = {
  '02': [
    '\\frac{GM}{r^2}=\\frac{v^2}{r}\\quad\\Longrightarrow\\quad v=\\sqrt{\\frac{GM}{r}}',
    '\\Delta E_{\\mathrm{battery}}=\\int_{t_0}^{t_1}\\left(P_{\\mathrm{charge}}-P_{\\mathrm{load}}-P_{\\mathrm{loss}}\\right)\\,\\mathrm{d}t',
    'E\\,[\\mathrm{Wh}]=\\frac{P\\,[\\mathrm{W}]\\,t\\,[\\mathrm{s}]}{3600}',
  ],
  '03': [
    '\\boldsymbol H=\\mathbf I\\boldsymbol\\omega',
    '\\mathbf I\\frac{\\mathrm{d}\\boldsymbol\\omega}{\\mathrm{d}t}+\\boldsymbol\\omega\\times(\\mathbf I\\boldsymbol\\omega)=\\boldsymbol\\tau_{\\mathrm{ext}}',
    '\\boldsymbol\\tau_{\\mathrm{mag}}=\\boldsymbol m\\times\\boldsymbol B,\\qquad |\\boldsymbol\\tau|=|\\boldsymbol m|\\,|\\boldsymbol B|\\sin\\theta',
  ],
  '04': [
    '\\lVert\\boldsymbol\\omega\\rVert<\\omega_{\\mathrm{lim}},\\qquad t\\leq T_{\\mathrm{lim}}',
  ],
  '05': [
    '\\frac{\\mathrm{d}\\boldsymbol B_{\\mathrm{body}}}{\\mathrm{d}t}\\approx-\\boldsymbol\\omega\\times\\boldsymbol B',
    '\\boldsymbol m_{\\mathrm{cmd}}=-k\\frac{\\mathrm{d}\\boldsymbol B_{\\mathrm{body}}}{\\mathrm{d}t},\\quad k>0',
    '\\boldsymbol\\tau=\\boldsymbol m\\times\\boldsymbol B',
    '\\frac{\\mathrm{d}E_{\\mathrm{rot}}}{\\mathrm{d}t}=\\boldsymbol\\tau\\cdot\\boldsymbol\\omega\\approx-k\\lVert\\boldsymbol\\omega\\times\\boldsymbol B\\rVert^2\\leq0',
  ],
};

export type EquationBlock = {
  name: string;
  purpose: string;
  formula?: string;
  statement?: string;
  notation?: string;
};

export const equationBlocks: Record<string, EquationBlock[]> = {
  '01': [
    {
      name: 'Traceable engineering claim',
      statement:
        '주장 → 요구사항 ID → 모델 요소 → 검증 방법 → 결과·조건 → 검토 기록',
      purpose:
        '판단의 근거와 검증 결과를 다음 검토자가 재현할 수 있게 연결합니다.',
    },
  ],
  '02': [
    {
      name: 'Circular-orbit speed',
      formula: equations['02'][0],
      purpose: '중력과 구심가속도의 관계에서 원궤도 속도를 구합니다.',
      notation:
        'G: 중력상수 · M: 중심 천체 질량 (kg) · r: 중심 거리 (m) · v: 속도 (m/s)',
    },
    {
      name: 'Battery energy balance',
      formula: equations['02'][1],
      purpose: '일정 시간 동안 충전·부하·손실 전력의 순효과를 계산합니다.',
      notation:
        'Pcharge, Pload, Ploss: 전력 (W) · t: 시간 (s) · ΔE: 에너지 변화 (J)',
    },
    {
      name: 'Power-to-energy conversion',
      formula: equations['02'][2],
      purpose: '전력과 작동 시간을 배터리 에너지 단위인 Wh로 변환합니다.',
      notation: 'P: 전력 (W) · t: 시간 (s) · E: 에너지 (Wh)',
    },
  ],
  '03': [
    {
      name: 'Angular momentum',
      formula: equations['03'][0],
      purpose: '위성의 관성 특성과 현재 회전 상태를 각운동량으로 연결합니다.',
      notation:
        'H: 각운동량 (kg·m²/s) · I: 관성행렬 (kg·m²) · ω: 각속도 (rad/s)',
    },
    {
      name: 'Rigid-body rotational dynamics',
      formula: equations['03'][1],
      purpose:
        '외부 토크가 위성의 각속도를 시간에 따라 어떻게 바꾸는지 나타냅니다.',
      notation:
        'I: 관성행렬 (kg·m²) · ω: 각속도 (rad/s) · τext: 외부 토크 (N·m) · t: 시간 (s)',
    },
    {
      name: 'Magnetic torque',
      formula: equations['03'][2],
      purpose:
        '명령된 자기 쌍극자와 환경 자기장에서 생성되는 토크를 계산합니다.',
      notation:
        'm: 자기 쌍극자 (A·m²) · B: 자기장 (T) · θ: 두 벡터 사이 각도 · τmag: 자기 토크 (N·m)',
    },
  ],
  '04': [
    {
      name: 'Detumbling acceptance condition',
      formula: equations['04'][0],
      purpose:
        '정해진 시간 안에 회전 상태가 허용 한계에 도달했는지 표현합니다.',
      notation:
        'ω: 각속도 (rad/s 또는 °/s) · ωlim: 허용 한계 · Tlim: 완료 시간 한계',
    },
    {
      name: 'Function-to-implementation allocation',
      statement: '기능: 회전 감소 / 구현: 센서 + OBC 제어 SW + 자기구동기',
      purpose:
        '필요한 기능과 그 기능을 수행하는 하드웨어·소프트웨어를 구분합니다.',
    },
  ],
  '05': [
    {
      name: 'Body-frame magnetic-field rate',
      formula: equations['05'][0],
      purpose: '몸체 좌표계의 자기장 변화율을 위성 회전과 연결하는 근사입니다.',
      notation:
        'Bbody: 몸체 좌표계 자기장 (T) · ω: 각속도 (rad/s) · dB/dt: 자기장 변화율 (T/s)',
    },
    {
      name: 'B-dot dipole command',
      formula: equations['05'][1],
      purpose: '측정한 자기장 변화율의 반대 방향으로 자기 쌍극자를 명령합니다.',
      notation:
        'mcmd: 명령 자기 쌍극자 (A·m²) · k: 양의 제어 이득 · dB/dt: 자기장 변화율 (T/s)',
    },
    {
      name: 'Magnetic torque',
      formula: equations['05'][2],
      purpose: '자기 쌍극자와 환경 자기장의 외적으로 구동 토크를 만듭니다.',
      notation: 'm: 자기 쌍극자 (A·m²) · B: 자기장 (T) · τ: 토크 (N·m)',
    },
    {
      name: 'Rotational-energy rate',
      formula: equations['05'][3],
      purpose:
        '이상적인 B-dot 근사에서 회전 에너지가 증가하지 않음을 보여줍니다.',
      notation:
        'Erot: 회전 에너지 (J) · τ·ω: 회전 전력 (W) · k: 양의 제어 이득',
    },
  ],
  '06': [
    {
      name: 'Fact, rule, and query',
      statement:
        'Fact: component(adcs, magnetometer).\nRule: contains(X,Y) :- component(X,Y).\nQuery: ?- contains(adcs, X).',
      purpose:
        '저장된 사실과 규칙에서 관계를 질의하는 Prolog의 기본 구조를 보여줍니다.',
    },
  ],
  '07': [
    {
      name: 'Reproducible change record',
      statement:
        '변경 기록 = 대상·버전 + 이유 + 영향 + 재현 절차·결과 + 불확실성 + 검토자',
      purpose:
        '변경의 범위, 근거, 결과와 책임을 다음 팀이 추적할 수 있게 남깁니다.',
    },
  ],
};
