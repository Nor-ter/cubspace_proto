export type SubsystemKey =
  | 'all'
  | 'structure'
  | 'solar'
  | 'eps'
  | 'obc'
  | 'comms'
  | 'adcs'
  | 'payload'
  | 'antennas';

export const subsystems = [
  {
    id: 'all' as const,
    label: '전체 위성',
    title: 'ACRUX-II 1U CubeSat',
    purpose: '모든 서브시스템을 하나의 임무 시스템으로 통합합니다.',
    components: ['1U chassis', 'PCB stack', 'solar array', 'antennas'],
    input: '태양 에너지 · 지상 명령 · 우주 환경',
    output: '임무 데이터 · Telemetry · 제어된 위성 거동',
    status: '교육용 3D 모델',
  },
  {
    id: 'adcs' as const,
    label: 'ADCS',
    title: 'Attitude Determination & Control',
    purpose:
      '자기장 정보를 이용해 회전을 줄입니다. 정밀 자세 지향은 별도의 센서·제어 성능 검증이 필요합니다.',
    components: ['Magnetometer A/B', 'B-dot software', 'Deneb magnetorquer'],
    input: 'Regulated power · Magnetic field · Mode command',
    output: 'Magnetic-field data · Control torque',
    status: '핵심 학습 모델',
  },
  {
    id: 'obc' as const,
    label: 'OBC',
    title: 'Onboard Computer',
    purpose: '센서 데이터를 처리하고 B-dot 알고리즘과 임무 순서를 실행합니다.',
    components: ['Microprocessor', 'Flash', 'FRAM', 'Flight software'],
    input: 'Sensor data · Ground command · Power',
    output: 'Actuator command · Telemetry',
    status: '문서 기반 개념 · 형상 확인 필요',
  },
  {
    id: 'eps' as const,
    label: 'EPS',
    title: 'Electrical Power System',
    purpose: '전력을 생성·저장·조절·분배해 ADCS와 다른 부하를 지원합니다.',
    components: ['Solar panels', 'MPPT', 'Battery', 'Regulator'],
    input: 'Solar radiation · Load command',
    output: 'Regulated power · Health data',
    status: '지원 서브시스템',
  },
  {
    id: 'comms' as const,
    label: 'COMMS',
    title: 'Communications',
    purpose: '지상국과 명령·Telemetry를 양방향으로 연결합니다.',
    components: ['Radio electronics', 'Antenna interface'],
    input: 'Telemetry · Received RF · Power',
    output: 'RF telemetry · Decoded command',
    status: '문서 기반 개념 · 형상 확인 필요',
  },
  {
    id: 'structure' as const,
    label: 'Structure',
    title: 'BOX / Structure',
    purpose: '하드웨어를 정렬·고정하고 발사 하중과 열을 전달합니다.',
    components: ['CNC chassis', 'Rails', 'PCB mounts', 'Fastener pairs'],
    input: 'Launch load · Hardware mass · Heat',
    output: 'Maintained geometry · Load path',
    status: '교육용 형상',
  },
  {
    id: 'solar' as const,
    label: 'Solar array',
    title: 'Solar surfaces',
    purpose: '태양 복사 에너지를 DC 전력으로 변환합니다.',
    components: ['Body panels', 'Deployable wings', 'Busbars'],
    input: 'Solar radiation',
    output: 'DC electrical power',
    status: '시각 자산 구성 · 실제 설계와 구분',
  },
  {
    id: 'antennas' as const,
    label: 'Antenna',
    title: 'Antenna & deployment',
    purpose: 'RF 신호를 방사·수신하고 첫 지상 통신 경로를 엽니다.',
    components: ['Deploy tray', 'Antenna rods', 'RF coax'],
    input: 'RF signal · Release command',
    output: 'Radiated/received RF',
    status: '교육용 형상',
  },
] as const;

export const learningPath = [
  [
    '01',
    'ORIENT',
    '왜 CubSpace인가',
    '사람이 바뀌어도 임무 지식은 남아야 합니다.',
  ],
  [
    '02',
    'SPACECRAFT',
    'CubeSat과 ACRUX-II',
    '1U 플랫폼과 임무의 성공 경로를 파악합니다.',
  ],
  [
    '03',
    'ANATOMY',
    '위성 구조 탐색',
    '3D 모델에서 하드웨어와 인터페이스를 찾습니다.',
  ],
  [
    '04',
    'SYSTEM MODEL',
    '시스템 모델링 기초',
    '요구·기능·물리·검증을 하나의 관계망으로 읽습니다.',
  ],
  [
    '05',
    'MADE',
    'ADCS 기능 모델',
    'MADE식 Function–Flow–Property 문법을 연습합니다.',
  ],
  [
    '06',
    'PROLOG',
    '지식 관계 추론',
    '사실과 규칙을 질의 가능한 지식으로 바꿉니다.',
  ],
  [
    '07',
    'HANDOFF',
    '첫 엔지니어링 과제',
    '근거·검토·승인을 남기는 업무 흐름을 익힙니다.',
  ],
] as const;

export const adcsNodes = [
  {
    id: 'field',
    name: 'Earth Magnetic Field',
    type: 'environment',
    fn: '궤도 위치에서의 지구 자기장 B를 제공합니다.',
    flow: 'ENERGY',
    props: ['flux density B (µT)', 'body-frame vector Bx, By, Bz'],
  },
  {
    id: 'sensor',
    name: '3-axis Magnetometer',
    type: 'component',
    fn: '위성 몸체 좌표계의 자기장 벡터를 시간표시와 함께 측정합니다.',
    flow: 'DATA',
    props: ['B-body (µT)', 'sample rate (Hz)', 'noise & bias'],
  },
  {
    id: 'filter',
    name: 'Calibration & Filter',
    type: 'software',
    fn: '센서 bias와 hard/soft-iron 오차를 보정하고 측정 노이즈를 줄입니다.',
    flow: 'DATA',
    props: ['calibrated B (µT)', 'timestamp (s)', 'filter bandwidth (Hz)'],
  },
  {
    id: 'logic',
    name: 'B-dot Controller',
    type: 'software',
    fn: 'dB/dt를 계산해 반대 방향의 자기 쌍극자 명령을 만듭니다.',
    flow: 'DATA',
    props: ['dB/dt (T/s)', 'm-command (A·m²)', 'gain K & saturation'],
  },
  {
    id: 'driver',
    name: '전류 구동 기능 (개념)',
    type: 'electronics',
    fn: '자기 쌍극자 명령을 각 축 코일의 극성과 제한된 전류로 변환합니다.',
    flow: 'ENERGY',
    props: ['coil current Ix, Iy, Iz (A)', 'voltage (V)', 'PWM & duty cycle'],
  },
  {
    id: 'actuator',
    name: 'Deneb 자기구동기',
    type: 'component',
    fn: '구동 전류로 자기 쌍극자 m을 만듭니다. 실제 축 구성·최대 모멘트는 보드 사양을 확인해야 합니다.',
    flow: 'ENERGY',
    props: [
      'dipole moment m (A·m²)',
      'coil temperature (°C)',
      'axis alignment',
    ],
  },
  {
    id: 'motion',
    name: 'Rigid-body Dynamics',
    type: 'spacecraft state',
    fn: 'm × B 토크가 회전 상태를 바꾸며, 감쇠 제어 조건에서 회전 에너지가 감소합니다. 바뀐 자세가 센서 입력에 반영됩니다.',
    flow: 'ENERGY',
    props: ['torque τ=m×B (N·m)', 'angular rate ω (°/s)', 'detumble threshold'],
  },
] as const;

export const prologFacts = `subsystem(acrux2, adcs).
component(adcs, magnetometer).
component(adcs, deneb_magnetorquer).
measures(magnetometer, magnetic_field).
commands(b_dot, deneb_magnetorquer).
requires(detumble_complete, adcs_operational).

contains(X, Y) :- subsystem(X, Y).
contains(X, Y) :- component(X, Y).
contains(X, Y) :- subsystem(X, Z), contains(Z, Y).
% 교육용 검토 조건; 비행 준비 판정이 아닙니다.
:- dynamic evidence/1, human_signed/1.
ready(detumble) :- evidence(adcs_test), human_signed(adcs_test).`;

export const sourceCards = [
  ['ACRUX_2_ConOps.pdf', '임무 단계, 초기 운용, detumbling, 통신과 운용 가정'],
  [
    'ACRUX-2 CubeSat MADE Modeling.docx',
    '계층, 기능, Material/Energy/Data flow와 측정 속성',
  ],
  [
    'Product & Engineering Specification',
    '초보 엔지니어용 학습 순서, UX와 기술 경계',
  ],
  [
    'Project CubSpace Overview',
    'MADE–Documentation–Prolog–Task–Sign-off 지식 연속성',
  ],
  ['Prolog Tutorials', 'Fact, Rule, Query, recursion과 CubeSat 관계 모델'],
] as const;

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
};

export const quizOrder = [
  'mission',
  'anatomy',
  'model',
  'made',
  'prolog',
  'handoff',
] as const;
export type QuizSection = (typeof quizOrder)[number];

export const quizzes: Record<
  QuizSection,
  { title: string; questions: QuizQuestion[] }
> = {
  mission: {
    title: '임무 이해 확인',
    questions: [
      {
        id: 'm1',
        prompt: 'CubSpace가 해결하려는 핵심 문제는 무엇인가요?',
        options: [
          '발사체 성능 부족',
          '학생 교체에 따른 지식 단절',
          '위성 크기 증가',
          '지상국 주파수 선택',
        ],
        correct: 1,
        explanation:
          'CubSpace는 엔지니어가 바뀌어도 임무 지식과 판단 근거가 이어지도록 합니다.',
      },
      {
        id: 'm2',
        prompt: 'ConOps의 일차 성공 기준은 무엇인가요?',
        options: [
          '카메라 촬영',
          '전개 순서 완료와 지상 통신 확보',
          '새 CAD 모델',
          '모든 문서 번역',
        ],
        correct: 1,
        explanation:
          'ConOps §1.1의 일차 성공은 전개 순서 완료와 통신 확보입니다. 실증 데이터 수집은 이차 성공 기준이며, 저전력 예외 절차는 별도로 정의되어 있습니다.',
      },
      {
        id: 'm3',
        prompt: '이번 온보딩의 핵심 기술 예시는?',
        options: [
          'EPS heater',
          'Payload camera',
          'ADCS detumbling',
          'Launch vehicle',
        ],
        correct: 2,
        explanation:
          '자기장 측정, B-dot, Deneb magnetorquer로 이어지는 ADCS detumbling이 중심 예시입니다.',
      },
      {
        id: 'm4',
        prompt: '같은 판단을 다음 팀이 재현하려면 무엇을 남겨야 하나요?',
        options: [
          '결론만 기록',
          '출처·가정·조건·검증 결과',
          '발표용 그림만 저장',
          '담당자 이름만 기록',
        ],
        correct: 1,
        explanation:
          '판단의 적용 조건과 근거를 남겨야 설계가 변경되어도 유효한 결론인지 검토할 수 있습니다.',
      },
      {
        id: 'm5',
        prompt: '임무 지식을 기준선에 반영하기 전 필요한 것은?',
        options: [
          'AI 단독 승인',
          'Human review와 sign-off',
          '디자인 변경',
          '새 계정 생성',
        ],
        correct: 1,
        explanation:
          'AI는 지원할 수 있지만 권위 있는 mission-state 변경은 사람의 검토와 승인이 필요합니다.',
      },
    ],
  },
  anatomy: {
    title: '위성 구조 이해 확인',
    questions: [
      {
        id: 'a1',
        prompt: 'ADCS의 주된 임무는?',
        options: [
          '전력 저장',
          '자세 판단과 회전 제어',
          'RF 변조',
          '구조 하중 전달',
        ],
        correct: 1,
        explanation: 'ADCS는 환경을 측정하고 위성의 회전과 자세를 제어합니다.',
      },
      {
        id: 'a2',
        prompt: '자기장 벡터를 측정하는 부품은?',
        options: ['Magnetometer', 'Antenna', 'MPPT', 'Flash memory'],
        correct: 0,
        explanation:
          'Magnetometer가 로컬 자기장 벡터를 디지털 데이터로 출력합니다.',
      },
      {
        id: 'a3',
        prompt: 'Deneb magnetorquer의 출력은?',
        options: ['Image file', 'Control torque', 'RF packet', 'Stored charge'],
        correct: 1,
        explanation:
          '전류로 자기 쌍극자를 만들고 지구 자기장과 상호작용해 토크를 생성합니다.',
      },
      {
        id: 'a4',
        prompt: '3D 모델에 대한 올바른 설명은?',
        options: [
          '확정된 Flight CAD',
          '정확한 축척의 제조 모델',
          '교육용 개념 모델',
          '발사 승인 도면',
        ],
        correct: 2,
        explanation:
          '제공된 모델은 탐색용이며 실제 ACRUX-II 확정 CAD로 취급하면 안 됩니다.',
      },
      {
        id: 'a5',
        prompt: 'BOX / Structure가 모든 하드웨어에 제공하는 것은?',
        options: [
          'RF decoding',
          'Mounting과 load path',
          'B-dot calculation',
          'Battery charge',
        ],
        correct: 1,
        explanation:
          'Structure는 장착, 정렬, 보호, 하중 전달과 열전도 경로를 제공합니다.',
      },
    ],
  },
  model: {
    title: '시스템 모델 이해 확인',
    questions: [
      {
        id: 's1',
        prompt: 'System Model이 단순 그림과 다른 핵심 이유는?',
        options: [
          '색상이 많아서',
          '요구·기능·물리·근거가 연결돼서',
          '파일이 커서',
          '3D이기 때문에',
        ],
        correct: 1,
        explanation:
          '모델의 가치는 항목과 관계를 추적하고 질문할 수 있다는 데 있습니다.',
      },
      {
        id: 's2',
        prompt: '입력을 출력으로 바꾸는 행동·변환을 표현하는 관점은?',
        options: ['Requirement', 'Function', 'Physical', 'Evidence'],
        correct: 1,
        explanation:
          'Function 관점은 시스템이 수행해야 할 변환과 거동을 설명합니다.',
      },
      {
        id: 's3',
        prompt: '제공된 MADE 문서에서 Magnetometer를 모델링한 계층은?',
        options: ['Part', 'Part-pair', 'Component', 'System'],
        correct: 2,
        explanation:
          '제공된 모델은 자력계를 입출력이 있는 Component로 정의합니다. 분해 수준은 모델 목적과 확보된 근거에 따라 정합니다.',
      },
      {
        id: 's4',
        prompt: 'Bolt와 Nut의 결합을 표현하기 알맞은 계층은?',
        options: ['Part-pair', 'Component', 'Subsystem', 'System'],
        correct: 0,
        explanation:
          '두 물리 Part가 상호작용해 체결 기능을 만들므로 Part-pair입니다.',
      },
      {
        id: 's5',
        prompt: 'Traceability가 설계 변경 때 주는 이점은?',
        options: [
          '모든 시험을 삭제',
          '영향받는 기능·시험·문서 식별',
          '수치를 자동 승인',
          '사람 검토 제거',
        ],
        correct: 1,
        explanation:
          '연결 관계를 따라 변경 영향을 찾는 것이 traceability의 중요한 목적입니다.',
      },
    ],
  },
  made: {
    title: 'MADE 기능 모델 이해 확인',
    questions: [
      {
        id: 'd1',
        prompt: 'MADE 기능 모델의 기본 문법은?',
        options: [
          'Part → Cost → Owner',
          'Function → Functional Flow → Flow Property',
          'Risk → Schedule → Budget',
          'Input → Document → Meeting',
        ],
        correct: 1,
        explanation:
          '기능, 이동하는 것, 측정 가능한 속성을 분리해 모델링합니다.',
      },
      {
        id: 'd2',
        prompt: 'Magnetometer 측정값의 Flow Type은?',
        options: ['Material', 'Energy', 'Data', 'Structure'],
        correct: 2,
        explanation: '디지털화된 자기장 측정값은 Data flow입니다.',
      },
      {
        id: 'd3',
        prompt: '제어 토크의 Flow Type은?',
        options: ['Energy', 'Data', 'Material', 'Document'],
        correct: 0,
        explanation:
          '제공된 모델은 기계적 상호작용을 Energy로 분류합니다. 토크 자체는 에너지가 아니며 회전 전력은 토크와 각속도의 내적입니다.',
      },
      {
        id: 'd4',
        prompt: 'Flow Property로 가장 적절한 것은?',
        options: ['좋은 성능', '충분한 힘', 'Torque (N·m)', '안전함'],
        correct: 2,
        explanation:
          '물리량에는 단위·범위·측정 조건이 필요합니다. 상태 플래그 등 단위 없는 속성은 의미와 허용값을 정의합니다.',
      },
      {
        id: 'd5',
        prompt: 'B-dot software가 출력하는 것은?',
        options: ['태양광', 'Magnetorquer command', '기계 부품', 'RF 안테나'],
        correct: 1,
        explanation:
          '시간이 표시된 자기장 측정값을 처리해 magnetorquer 명령을 만듭니다.',
      },
    ],
  },
  prolog: {
    title: 'Prolog 추론 이해 확인',
    questions: [
      {
        id: 'p1',
        prompt: 'Prolog에서 관계를 사실로 표현하는 구문은?',
        options: ['Fact', 'Pixel', 'Frame', 'Shader'],
        correct: 0,
        explanation:
          'Fact는 관계에 대한 진술입니다. 사실 구문에 입력된 내용이 현실에서 참인지, 승인되었는지는 별도 검토해야 합니다.',
      },
      {
        id: 'p2',
        prompt: '여러 사실로부터 새 상태를 도출하는 것은?',
        options: ['Asset', 'Rule', 'Canvas', 'Packet'],
        correct: 1,
        explanation:
          'Rule은 조건을 만족하는 사실을 조합해 새로운 관계나 상태를 추론합니다.',
      },
      {
        id: 'p3',
        prompt: 'Prolog에서 대문자로 시작하는 X는?',
        options: ['고정 상수', '변수', '주석', '오류'],
        correct: 1,
        explanation:
          '대문자로 시작하는 이름은 질의에서 가능한 값을 찾는 변수입니다.',
      },
      {
        id: 'p4',
        prompt: 'Negation as failure의 올바른 해석은?',
        options: [
          '항상 거짓',
          '증명할 근거를 찾지 못함',
          '시험 실패 확정',
          '승인 완료',
        ],
        correct: 1,
        explanation: '미검증과 검증 실패를 혼동하지 않는 것이 중요합니다.',
      },
      {
        id: 'p5',
        prompt: 'MADE와 Prolog의 역할 관계는?',
        options: [
          '서로 완전히 동일',
          'MADE는 시스템 모델, Prolog는 지식·진행 추론',
          'Prolog는 3D 렌더러',
          'MADE는 텍스트 편집기',
        ],
        correct: 1,
        explanation:
          '두 도구는 모델 사실을 매개로 서로 다른 역할을 수행합니다.',
      },
    ],
  },
  handoff: {
    title: '업무 인계 이해 확인',
    questions: [
      {
        id: 'h1',
        prompt: 'Task Card가 추적되어야 하는 곳은?',
        options: [
          '임의 메모',
          'Engineering model과 requirement',
          '개인 채팅만',
          '색상 팔레트',
        ],
        correct: 1,
        explanation:
          '업무는 임무 목표, 요구, 모델 항목, 고장 또는 검증 공백과 연결되어야 합니다.',
      },
      {
        id: 'h2',
        prompt: 'Knowledge Commit에 포함되어야 할 것은?',
        options: [
          '변경 이유와 근거·검토자',
          '파일명만',
          'AI 답변만',
          '완료 이모지',
        ],
        correct: 0,
        explanation:
          '무엇이 왜 바뀌었고 어떤 근거와 승인이 있는지 남겨야 합니다.',
      },
      {
        id: 'h3',
        prompt: 'AI의 적절한 역할은?',
        options: [
          '최종 설계 권한',
          '분석·추적·초안 지원',
          'Human sign-off 대체',
          '근거 없는 수치 생성',
        ],
        correct: 1,
        explanation:
          'AI는 업무를 지원하지만 판단과 기준선 승인은 사람이 담당합니다.',
      },
      {
        id: 'h4',
        prompt: '원문 문서끼리 배터리 개수가 다르면 어떻게 처리해야 하나요?',
        options: [
          '더 많은 숫자를 자동 선택',
          '두 출처와 충돌을 기록하고 담당 검토자에게 확인',
          '임의로 평균값 적용',
          '관련 항목 모두 삭제',
        ],
        correct: 1,
        explanation:
          'ConOps는 3개, Modeling 문서는 3–4개 TBD입니다. 출처·버전을 보존하고 실제 설계 선택과 시험 근거를 확인해 기준선을 갱신합니다.',
      },
      {
        id: 'h5',
        prompt: '첫 ADCS Task의 완료 조건은?',
        options: [
          '화면 캡처만 제출',
          '근거·Flow Property·Human sign-off 포함',
          '퀴즈 생략',
          '모든 TBD 삭제',
        ],
        correct: 1,
        explanation:
          '모델 내용, 불확실성, 근거와 사람의 승인이 함께 남아야 합니다.',
      },
    ],
  },
};
