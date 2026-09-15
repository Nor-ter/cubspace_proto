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

// Metadata follows the unchanged formula order above.
export const equationLabels: Record<
  string,
  { name: string; purpose: string; symbols: string }[]
> = {
  '02': [
    {
      name: '원궤도 속도',
      purpose: '원궤도에서 중력과 구심가속도의 관계로 속도를 구합니다.',
      symbols:
        'G: 중력상수 [m³/(kg·s²)] · M: 중심 천체 질량 [kg] · r: 중심부터 거리 [m] · v: 궤도 속도 [m/s]. 원궤도 근사.',
    },
    {
      name: '배터리 에너지 수지',
      purpose:
        '충전·부하·손실 전력을 시간에 따라 합산해 에너지 변화를 구합니다.',
      symbols:
        'ΔE: 배터리 에너지 변화 [J] · P: 전력 [W] · charge: 충전 · load: 부하 · loss: 손실 · t₀, t₁: 적분 시작·종료 시간 [s]. 이미 반영한 손실은 중복 차감하지 않습니다.',
    },
    {
      name: '전력에서 에너지로 변환',
      purpose: '일정한 전력을 사용한 시간으로 소비 에너지(Wh)를 계산합니다.',
      symbols:
        'E: 에너지 [Wh] · P: 일정한 전력 [W] · t: 시간 [s] · 3600: 1시간의 초 수.',
    },
  ],
  '03': [
    {
      name: '각운동량',
      purpose: '관성행렬과 각속도로 강체의 각운동량을 표현합니다.',
      symbols:
        'H: 각운동량 [kg·m²/s] · I: 관성행렬 [kg·m²] · ω: 각속도 벡터 [rad/s]. 동일한 좌표계의 성분을 사용합니다.',
    },
    {
      name: '강체 회전 운동 방정식',
      purpose: '외부 토크와 강체의 각속도 변화 사이의 관계를 설명합니다.',
      symbols:
        'I: 몸체 좌표계에서 일정한 관성행렬 [kg·m²] · ω: 각속도 [rad/s] · t: 시간 [s] · τext: 외부 토크 [N·m] · ×: 벡터 외적. 몸체 좌표계의 강체 방정식.',
    },
    {
      name: '자기 토크',
      purpose: '자기모멘트와 자기장의 방향·크기로 발생 토크를 계산합니다.',
      symbols:
        'τmag, τ: 자기 토크 [N·m] · m: 자기모멘트 [A·m²] · B: 자기장 [T] · θ: 두 벡터 사이 각도 [rad] · | |: 벡터 크기 · ×: 외적. 평행하면 토크는 0입니다.',
    },
  ],
  '04': [
    {
      name: '회전 감소 요구조건 예시',
      purpose: '정해진 시간 안에 각속도 한계에 도달하는지 판단합니다.',
      symbols:
        '‖ω‖: 각속도 벡터 크기 [rad/s 또는 °/s] · ωlim: 같은 단위의 한계값 · t: 경과 시간 [s] · Tlim: 제한 시간 [s]. 한계값·초기조건·유지 시간은 별도 확인 대상입니다.',
    },
  ],
  '05': [
    {
      name: '몸체 자기장 변화율',
      purpose: '회전이 우세할 때 몸체에서 관측하는 자기장 변화율을 근사합니다.',
      symbols:
        'Bbody: 몸체 좌표계 자기장 [T] · B: 같은 좌표계의 자기장 [T] · ω: 각속도 [rad/s] · t: 시간 [s] · 변화율: [T/s]. 궤도에 따른 자기장 변화가 작다는 근사입니다.',
    },
    {
      name: 'B-dot 제어 명령',
      purpose: '자기장 변화율의 반대 방향으로 자기모멘트를 명령합니다.',
      symbols:
        'mcmd: 명령 자기모멘트 [A·m²] · k: 양의 제어 이득 [A·m²·s/T] · dBbody/dt: 자기장 변화율 [T/s].',
    },
    {
      name: '자기구동기 토크',
      purpose:
        '명령에 따른 자기모멘트가 자기장과 상호작용하는 토크를 표현합니다.',
      symbols:
        'τ: 토크 [N·m] · m: 자기모멘트 [A·m²] · B: 자기장 [T] · ×: 벡터 외적. 자기장 방향의 토크는 순간적으로 만들 수 없습니다.',
    },
    {
      name: '회전 에너지 감소',
      purpose:
        '이상적인 B-dot 제어에서 회전 에너지가 증가하지 않음을 설명합니다.',
      symbols:
        'Erot: 회전 에너지 [J] · t: 시간 [s] · τ·ω: 회전 전력 [W] · k: 이득 [A·m²·s/T] · ω: 각속도 [rad/s] · B: 자기장 [T] · ‖ ‖: 벡터 크기. 고정 관성 강체·외란 무시·비포화 제어 근사.',
    },
  ],
};

export const statementLabels: Record<
  string,
  { name: string; purpose: string }[]
> = {
  '01': [
    {
      name: '검증 근거의 연결',
      purpose: '주장에서 검토 기록까지 추적할 항목을 연결합니다.',
    },
  ],
  '06': [
    { name: 'Fact · 사실', purpose: '예제 모델에 부품 관계를 선언합니다.' },
    { name: 'Rule · 규칙', purpose: '부품 관계에서 포함 관계를 도출합니다.' },
    { name: 'Query · 질의', purpose: 'ADCS에 포함된 요소를 조회합니다.' },
  ],
  '07': [
    {
      name: '변경 기록 구성',
      purpose: '재현과 검토에 필요한 인계 정보를 기록합니다.',
    },
  ],
};
