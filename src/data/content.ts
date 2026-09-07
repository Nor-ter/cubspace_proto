export type Status =
  | 'Confirmed'
  | 'Assumption'
  | 'TBD'
  | 'Conflicting'
  | 'Historical';
export type SourceReference = {
  document: string;
  section: string;
  page?: number;
  note?: string;
};
export const conops = (section: string, page: number): SourceReference => ({
  document: 'ACRUX_2_ConOps.pdf',
  section,
  page,
});
export const model = (section: string): SourceReference => ({
  document: 'ACRUX-2 CubeSat MADE Modeling.docx',
  section,
});
export const spec = (section: string): SourceReference => ({
  document: 'Product & Engineering Specification v0.1',
  section,
});
export type FlowType = 'Material' | 'Energy' | 'Data';
export type Interface = { name: string; type: FlowType; properties: string[] };
export type Entity = {
  id: string;
  name: string;
  level: 'system' | 'subsystem' | 'component' | 'part-pair';
  parentId?: string;
  purpose: string;
  function: string;
  components: string[];
  inputs: Interface[];
  outputs: Interface[];
  connections: string[];
  failure: string;
  status: Status;
  sourceRefs: SourceReference[];
};
const flow = (
  name: string,
  type: FlowType,
  properties: string[],
): Interface => ({ name, type, properties });
export const subsystems: Entity[] = [
  {
    id: 'obc',
    name: 'OBC · Onboard Computer',
    level: 'subsystem',
    parentId: 'acrux',
    purpose: '위성의 상태를 판단하고 임무 순서를 조율합니다.',
    function: '명령 처리, 데이터 저장, 상태 감시와 임무 시퀀스를 수행한다.',
    components: [
      'Microprocessor',
      'B-dot software',
      'Flash memory',
      'FRAM backup memory',
      'Camera interface (camera inclusion: TBD)',
    ],
    inputs: [
      flow('조정된 DC 전력', 'Energy', ['Voltage (V)', 'Current (A)']),
      flow('센서 측정값·지상 명령', 'Data', [
        'Data rate (bit/s)',
        'Timestamp (s)',
      ]),
    ],
    outputs: [
      flow('제어 명령·Telemetry·저장 데이터', 'Data', [
        'Latency (ms)',
        'Packet rate (packet/s)',
      ]),
    ],
    connections: ['adcs', 'eps', 'comms', 'box'],
    failure:
      'OBC 정지 → 명령·상태 처리 중단. EPS watchdog 복구 개념을 검토합니다.',
    status: 'Confirmed',
    sourceRefs: [model('§1.2, §2 OBC'), conops('§4.1.1', 4)],
  },
  {
    id: 'adcs',
    name: 'ADCS · Attitude Determination and Control System',
    level: 'subsystem',
    parentId: 'acrux',
    purpose: '회전을 줄여 안테나 전개와 실험을 지원합니다.',
    function: '자기장을 측정하고 Magnetorquer로 제어 토크를 생성한다.',
    components: [
      'Deneb magnetorquer',
      'Magnetometer A',
      'Magnetometer B',
      'OBC의 B-dot software와 연결',
    ],
    inputs: [
      flow('DC 전력·주변 자기장', 'Energy', [
        'Voltage (V)',
        'Field strength (µT)',
      ]),
      flow('운용 모드·제어 명령', 'Data', ['Command rate (Hz)']),
    ],
    outputs: [
      flow('자기장 측정값', 'Data', ['Sample rate (Hz)']),
      flow('Control torque', 'Energy', [
        'Torque (N·m)',
        'Angular acceleration (rad/s²)',
      ]),
    ],
    connections: ['obc', 'eps', 'box'],
    failure: '자기장 측정 불량 → 제어 명령 오류 → 회전 감소 및 전개 지연.',
    status: 'Confirmed',
    sourceRefs: [model('§1.2, §2 ADCS'), conops('§3.1.2', 3)],
  },
  {
    id: 'eps',
    name: 'EPS · Electrical Power System',
    level: 'subsystem',
    parentId: 'acrux',
    purpose: '일식과 순간 부하에서도 위성이 동작할 전력을 공급합니다.',
    function: '전력 생성·저장·조정·분배와 배터리 열관리를 수행한다.',
    components: [
      'Solar panels / antenna-face assembly',
      'MPPT',
      'Li-ion cells (3 vs 3–4: Conflicting)',
      'Temperature sensor',
      'Heater',
      'Voltage regulator',
      'Power distribution',
    ],
    inputs: [
      flow('태양 복사·저장 에너지', 'Energy', [
        'Irradiance (W/m²)',
        'Energy (Wh)',
      ]),
      flow('부하 명령·온도 측정값', 'Data', [
        'Temperature (°C)',
        'Sample rate (Hz)',
      ]),
    ],
    outputs: [
      flow('Regulated DC power', 'Energy', [
        'Voltage (V)',
        'Current (A)',
        'Power (W)',
      ]),
      flow('EPS health telemetry', 'Data', [
        'Temperature (°C)',
        'State of charge (%)',
      ]),
    ],
    connections: ['obc', 'adcs', 'comms', 'box'],
    failure: '발전 또는 열관리 실패 → 에너지 부족·충전 제한 → 임무 중단 위험.',
    status: 'Confirmed',
    sourceRefs: [model('§1.2, §2 EPS, §2.2'), conops('§2', 1)],
  },
  {
    id: 'comms',
    name: 'COMMS · Communications',
    level: 'subsystem',
    parentId: 'acrux',
    purpose: '지상으로 성능 데이터를 보내고 명령을 받습니다.',
    function: '지상국과 양방향 RF 통신 링크를 제공한다.',
    components: [
      'Antenna',
      'Radio / communications electronics',
      'Ground station (external system)',
    ],
    inputs: [
      flow('DC 전력·수신 RF', 'Energy', [
        'Voltage (V)',
        'Frequency (Hz)',
        'Received signal level (dBm)',
      ]),
      flow('Telemetry', 'Data', ['Data rate (bit/s)']),
    ],
    outputs: [
      flow('송신 RF', 'Energy', ['RF power (W)', 'Frequency (Hz)']),
      flow('복호된 지상 명령', 'Data', [
        'Packet rate (packet/s)',
        'Bit-error rate',
      ]),
    ],
    connections: ['obc', 'eps', 'box'],
    failure:
      '통신 실패 → 지상 접촉 및 명령 기능 상실. 자율 운용만으로 성공적인 통신을 대체할 수 없습니다.',
    status: 'Confirmed',
    sourceRefs: [model('§2 COMMS'), conops('§4.1.2', 4)],
  },
  {
    id: 'box',
    name: 'BOX · Structure',
    level: 'subsystem',
    parentId: 'acrux',
    purpose: '발사 하중을 전달하고 내부 하드웨어를 지지·보호합니다.',
    function: '하드웨어 장착, 정렬, 보호, 하중 전달 및 열전도를 제공한다.',
    components: [
      'CNC chassis',
      'PCB assemblies',
      'Deployment switches',
      'Bolt–nut / screw–insert pairs',
      'Rivet–hole pairs',
      'Plug–socket pairs',
    ],
    inputs: [
      flow('장착 하드웨어', 'Material', ['Mass (kg)']),
      flow('발사 하중·열환경', 'Energy', [
        'Force (N)',
        'Acceleration (m/s²)',
        'Temperature (°C)',
      ]),
    ],
    outputs: [
      flow('지지된 하드웨어', 'Material', ['Displacement (mm)']),
      flow('전달 하중·전도열', 'Energy', [
        'Stress (Pa)',
        'Temperature gradient (K/m)',
      ]),
    ],
    connections: ['obc', 'adcs', 'eps', 'comms'],
    failure:
      '체결부 이완 → PCB 변위·접속 손상 → 여러 Subsystem 기능 상실 가능.',
    status: 'Confirmed',
    sourceRefs: [model('§1.3, §2 BOX / Structure')],
  },
];
export const components: Entity[] = [
  {
    id: 'solar',
    name: 'Solar panel',
    level: 'component',
    parentId: 'eps',
    purpose: '전력 자립을 위한 발전원',
    function: '태양 복사를 DC 전력으로 변환한다.',
    components: [],
    inputs: [
      flow('Solar radiation', 'Energy', [
        'Irradiance (W/m²)',
        'Incidence angle (°)',
      ]),
    ],
    outputs: [
      flow('DC electrical power', 'Energy', [
        'Voltage (V)',
        'Current (A)',
        'Power (W)',
        'Efficiency (%)',
      ]),
    ],
    connections: ['eps'],
    failure: '발전 저하 → 충전량 감소',
    status: 'Confirmed',
    sourceRefs: [model('§2 Solar panel')],
  },
  {
    id: 'magnetometer',
    name: 'Magnetometer',
    level: 'component',
    parentId: 'adcs',
    purpose: 'Detumbling 제어에 필요한 자기장 측정',
    function: '주변 자기장 벡터를 측정한다.',
    components: [],
    inputs: [
      flow('Magnetic field / regulated power', 'Energy', [
        'Field strength (µT)',
        'Voltage (V)',
      ]),
    ],
    outputs: [
      flow('Digitized magnetic-field data', 'Data', [
        'Sample rate (Hz)',
        'Resolution (µT)',
        'Noise (µT)',
        'Bias (µT)',
      ]),
    ],
    connections: ['adcs', 'obc', 'eps'],
    failure: 'Bias 오류 → B-dot 입력 오염',
    status: 'Confirmed',
    sourceRefs: [model('§2 Magnetometer A / B')],
  },
  {
    id: 'sensor',
    name: 'Battery temperature sensor',
    level: 'component',
    parentId: 'eps',
    purpose: '배터리 열관리 판단에 필요한 온도 측정',
    function: '배터리 주변 온도를 측정값으로 변환한다.',
    components: [],
    inputs: [
      flow('전력·배터리 열적 상태', 'Energy', [
        'Voltage (V)',
        'Temperature (°C)',
      ]),
    ],
    outputs: [
      flow('Temperature measurement', 'Data', [
        'Temperature (°C)',
        'Accuracy (°C)',
        'Sample rate (Hz)',
      ]),
    ],
    connections: ['eps', 'obc'],
    failure: '값 고정 → 히터 제어 판단 오류',
    status: 'Confirmed',
    sourceRefs: [model('§2 Temperature sensor'), conops('§3.1.1', 2)],
  },
  {
    id: 'heater',
    name: 'Heater',
    level: 'component',
    parentId: 'eps',
    purpose: '배터리 온도를 적절한 운용 범위로 유지',
    function: '전기 에너지를 배터리 영역에 전달되는 열로 변환한다.',
    components: [],
    inputs: [
      flow('Electrical power', 'Energy', ['Voltage (V)', 'Current (A)']),
      flow('Heater command', 'Data', [
        'Duty cycle (%)',
        'Command threshold (°C)',
      ]),
    ],
    outputs: [
      flow('Thermal energy', 'Energy', [
        'Heater power (W)',
        'Heat flux (W/m²)',
        'Temperature rise (°C)',
      ]),
    ],
    connections: ['eps', 'obc', 'sensor'],
    failure: '고착 ON → 과열 / 고착 OFF → 가열 불가',
    status: 'Confirmed',
    sourceRefs: [model('§2 Heater')],
  },
  {
    id: 'antenna',
    name: 'Antenna',
    level: 'component',
    parentId: 'comms',
    purpose: 'RF 에너지를 우주 공간과 교환',
    function: '전기 RF 신호와 복사 전자기 에너지를 상호 변환한다.',
    components: [],
    inputs: [
      flow('Transmitter RF / incident RF field', 'Energy', [
        'Frequency (Hz)',
        'RF power (W)',
      ]),
      flow('RF에 실린 정보', 'Data', ['Data rate (bit/s)']),
    ],
    outputs: [
      flow('Radiated RF / received electrical RF', 'Energy', [
        'Gain (dBi)',
        'Received signal level (dBm)',
      ]),
      flow('RF에 실린 정보', 'Data', ['Data rate (bit/s)']),
    ],
    connections: ['comms', 'eps', 'box'],
    failure: '전개 실패 → 링크 형성 실패 가능',
    status: 'Confirmed',
    sourceRefs: [model('§2 Antenna')],
  },
];
export const phases = [
  {
    title: 'Initial Operations',
    ko: '먼저 살아남고, 지상과 연결합니다.',
    description:
      '초기 배터리 에너지로 열관리, Detumbling, 안테나 전개와 통신 수립을 진행합니다.',
    active: ['box', 'eps', 'obc', 'adcs', 'comms'],
    success: 'Primary: 전개 시퀀스 완료와 통신 확립',
    sourceRefs: [conops('§1.1–1.2', 1)],
  },
  {
    title: 'Operational Phase',
    ko: '에너지 수지를 유지하며 실험합니다.',
    description:
      '태양광 수확 에너지로 지속 가능한 운용을 유지하며 ETP 태양전지판과 Deneb magnetorquer 성능 데이터를 수집합니다.',
    active: ['eps', 'obc', 'adcs', 'comms'],
    success: 'Secondary: 두 실증 하드웨어의 성능 데이터 수집',
    sourceRefs: [conops('§1.1–1.2', 1)],
  },
  {
    title: 'Extended Operations',
    ko: '장기 데이터로 변화를 이해합니다.',
    description:
      '장기간 하드웨어 성능과 시스템 상태를 기록합니다. 실제 수명 보증이나 30일 성공 판정 모델은 아닙니다.',
    active: ['eps', 'obc', 'adcs', 'comms'],
    success: 'Tertiary: 장기 하드웨어 성능 데이터 수집',
    sourceRefs: [conops('§1.1–1.2', 1)],
  },
];
export const modes = [
  {
    name: 'Critical',
    range: '<10%',
    text: '필수 시스템만 유지하고 Payload 실험을 중지합니다.',
  },
  {
    name: 'Safe',
    range: '10–40%',
    text: '기본 기능을 유지합니다. 제한적 Payload 활동은 지상 지시가 있을 때만 고려합니다.',
  },
  {
    name: 'Normal',
    range: '40–80%',
    text: '전력·자세·건강 조건을 확인하며 정상 임무와 실험을 수행합니다.',
  },
  {
    name: 'High Power',
    range: '>80%',
    text: '전력이 충분하면 더 길고 빈번한 실험과 데이터 수집을 수행합니다.',
  },
];
export const stages = [
  {
    title: '발사체 내부 대기',
    en: 'Contained in deployer',
    text: '외부 시스템인 Deployer가 위성을 구속합니다. Deployment switches와 기계적 접촉이 있습니다.',
    active: ['box'],
    input: '기계적 구속 · Material / Energy',
    output: '스위치 구속 상태 · Data',
    risk: '접점 상태가 부정확하면 전개 판단을 신뢰하기 어렵습니다.',
    gate: '개념 단계: 발사 제공자의 Deployer 내부',
    sourceRefs: [model('§2 Deployment switch, §2.2')],
  },
  {
    title: '분리와 스위치 해제',
    en: 'Separation & release',
    text: '두 Deployment switches가 해제된 상태를 확인한 뒤 초기 시퀀스를 시작합니다.',
    active: ['box', 'eps', 'obc'],
    input: '기계적 접촉 해제 · Energy',
    output: 'Released-state signal · Data',
    risk: '하나의 스위치만 해제되거나 접점이 튀면 시작 조건을 충족하지 못할 수 있습니다.',
    gate: 'Current ConOps assumption: 2개 스위치가 30초 동안 해제',
    sourceRefs: [conops('§3.1', 2)],
  },
  {
    title: '초기화와 배터리 열관리',
    en: 'Initialize & warm battery',
    text: '온도 센서로 배터리를 감시하며 가열합니다. 가열 중 측정값이 변하지 않으면 센서 건강 상태를 FALSE로 두고 열관리 저하 모드를 고려합니다.',
    active: ['eps', 'obc'],
    input: '저장 전력 · Energy / 온도 측정 · Data',
    output: '배터리에 전달되는 열 · Energy / 센서 건강 상태 · Data',
    risk: '가열 시간 제한과 전력 제한이 필요합니다. 정확한 가열 소비량과 복구 절차는 TBD입니다.',
    gate: 'Current ConOps assumption: 목표 6°C, 충전 >0°C, 센서가 정상이고 <3°C이면 재가열',
    sourceRefs: [conops('§3.1.1', 2), conops('§3.1.1 continued', 3)],
  },
  {
    title: '초기 자세 결정과 회전 감소',
    en: 'Determine attitude & detumble',
    text: 'Magnetometer → OBC / B-dot → Magnetorquer로 회전 감소를 시도합니다. 전력이 충분한지 먼저 확인합니다.',
    active: ['adcs', 'obc', 'eps'],
    input: '자기장 · Energy / 자기장 측정 · Data',
    output: 'Magnetorquer command · Data / Control torque · Energy',
    risk: '에너지가 부족하면 기다립니다. ConOps에는 <2 Wh이고 90분 동안 충전 증가가 없으면 통신을 위한 비상 안테나 전개를 제안합니다.',
    gate: 'Current ConOps assumption: 초기 Detumbling 시작 시 최소 2 Wh',
    sourceRefs: [conops('§3.1.2', 3)],
  },
  {
    title: '안테나 전개와 확인',
    en: 'Deploy & verify antenna',
    text: '회전이 충분히 줄어든 뒤 안테나를 전개합니다. 전개 확인 장치와 초기 송신 시험으로 확인합니다.',
    active: ['comms', 'obc', 'eps', 'box'],
    input: '전개 명령 · Data / 구동 전력 · Energy',
    output: 'Antenna Deployed 상태 · Data',
    risk: '전개 실패는 임무 종료로 이어질 수 있습니다. 보장된 재전개 절차는 정의되어 있지 않습니다.',
    gate: 'Current ConOps assumption: 초기 성공 기준 각속도 <5°/s. 전개 상세 임계값과 비상 예외는 SME 확인 필요',
    sourceRefs: [conops('§3.1.3, §3.2', 3)],
  },
  {
    title: '지상 통신 확립',
    en: 'Establish ground contact',
    text: 'OBC가 Telemetry를 수집·저장하고 Radio와 Antenna를 통해 보냅니다. 지상 접촉으로 첫 번째 임무 성공을 확인합니다.',
    active: ['comms', 'obc', 'eps'],
    input: 'Telemetry packet · Data / 전력 · Energy',
    output: 'RF beacon · Energy / 지상 수신 데이터 · Data',
    risk: '안테나 전개만으로 링크 성공이 보장되지는 않습니다. 지상 수신과 상태 확인이 필요합니다.',
    gate: 'Current ConOps assumption: 10초마다 1초 Beacon 송신',
    sourceRefs: [conops('§4.1.2', 4)],
  },
  {
    title: '정상 운용과 Payload 실험',
    en: 'Nominal & payload operations',
    text: '전력·자세·태양 조명·시스템 건강·저장 용량을 확인하고 실험합니다. 요약은 Beacon, 상세 기록은 요청된 Downlink로 전달합니다.',
    active: ['eps', 'obc', 'adcs', 'comms'],
    input: '운용 조건·지상 명령 · Data / 발전 전력 · Energy',
    output: 'ETP / Deneb 성능 데이터 · Data',
    risk: 'ETP 실험의 안정 각속도 임계값과 파일 저장 세부 사항은 TBD입니다.',
    gate: 'Current ConOps assumption: Deneb 실험 30초, ETP 측정 보드 30초 후 종료',
    sourceRefs: [conops('§5.1–5.2', 5), conops('§5.2–5.3', 6)],
  },
];
export const chains = [
  {
    name: 'EPS',
    nodes: [
      'Sunlight',
      'Solar Panel',
      'MPPT',
      'Battery / Bus',
      'Voltage Regulator',
      'Spacecraft Loads',
    ],
    edges: [
      'Energy · irradiance (W/m²)',
      'Energy · voltage (V), current (A)',
      'Energy · power (W)',
      'Energy · voltage (V)',
      'Energy · branch current (A)',
    ],
    sourceRefs: [model('§2.1 High-Level Functional Flow Chain')],
  },
  {
    name: 'ADCS',
    nodes: [
      'Magnetic Field',
      'Magnetometer',
      'OBC / B-dot',
      'Magnetorquer',
      'Control Torque',
      'Rotational Motion',
    ],
    edges: [
      'Energy · field strength (µT)',
      'Data · sample rate (Hz)',
      'Data · duty cycle (%)',
      'Energy · torque (N·m)',
      'Energy · angular acceleration (rad/s²)',
    ],
    sourceRefs: [model('§2.1 High-Level Functional Flow Chain')],
  },
  {
    name: 'COMMS',
    nodes: [
      'Ground Command',
      'RF',
      'Antenna',
      'Radio',
      'OBC',
      'Command Processing',
    ],
    edges: [
      'Data · packet rate (packet/s)',
      'Energy · frequency (Hz)',
      'Energy · received signal level (dBm)',
      'Data · data rate (bit/s)',
      'Data · latency (ms)',
    ],
    sourceRefs: [model('§2.1 High-Level Functional Flow Chain')],
  },
  {
    name: 'Thermal Control',
    nodes: [
      'Battery Temperature',
      'Temperature Sensor',
      'Controller',
      'Heater',
      'Battery',
    ],
    edges: [
      'Energy · temperature (°C)',
      'Data · sample rate (Hz)',
      'Data · command threshold (°C)',
      'Energy · heat flux (W/m²)',
    ],
    sourceRefs: [model('§2.1 High-Level Functional Flow Chain')],
  },
];
export const failures = [
  {
    id: 'antenna-failure',
    entityId: 'antenna',
    title: '안테나 전개 실패',
    chain: [
      '전개 메커니즘 작동 실패',
      'COMMS RF 인터페이스 제한',
      '통신 수립 실패 → Primary 성공 기준 미달',
    ],
    detection: ['전개 확인 상태 점검', '초기 송신 및 지상 수신 시험'],
    mitigation: [
      '전개·전력·각속도 조건을 검토',
      '비상 절차는 상세 정의와 SME 검토 필요; 성공적 복구를 보장하지 않음',
    ],
    sourceRefs: [conops('§3.1.3', 3), conops('§7.1, §9.1', 8)],
  },
  {
    id: 'thermal-failure',
    entityId: 'sensor',
    title: '배터리 열관리 실패',
    chain: [
      '센서 값 고정 또는 히터 동작 실패',
      'EPS 열관리 판단·가열 기능 저하',
      '충전 제한·영구 배터리 손상 위험',
    ],
    detection: [
      '가열 중 온도 변화 여부 감시',
      '가열 타임아웃 및 센서 건강 상태 점검',
    ],
    mitigation: [
      '센서 건강 FALSE 및 열관리 저하 모드 개념',
      '가열 시간·전력 제한; 상세 제한값은 TBD',
    ],
    sourceRefs: [conops('§3.1.1', 2), conops('§7.1', 8)],
  },
  {
    id: 'comms-failure',
    entityId: 'comms',
    title: '통신 실패',
    chain: [
      'Radio / 통신 경로 기능 상실',
      '명령 수신·Telemetry Downlink 불가',
      '지상 접촉 및 임무 데이터 회수 상실',
    ],
    detection: ['통신 Timeout 감시', 'Beacon와 지상 수신 상태 점검'],
    mitigation: [
      'Beacon 재시작·통신 재초기화 개념',
      '통신 공백 중 자율 운용; 상세 복구 절차는 SME 확인 필요',
    ],
    sourceRefs: [conops('§6.3', 7), conops('§7', 8)],
  },
  {
    id: 'power-failure',
    entityId: 'eps',
    title: '전력 생성 실패',
    chain: [
      '태양전지판 발전 저하 또는 전원 경로 실패',
      '충전과 부하 공급 에너지 부족',
      'Payload 중단 → 필수 기능 유지 곤란',
    ],
    detection: [
      '전력·배터리 상태 Telemetry 추세 점검 (교육 예시)',
      '충전 증가 여부 감시',
    ],
    mitigation: [
      '저전력 모드와 부하 차단',
      '점진적 기능 저하; 정확한 진단과 복구 정책은 TBD',
    ],
    sourceRefs: [conops('§3.1.2', 3), conops('§6.3', 7), conops('§7', 8)],
  },
];
export const rams = [
  {
    name: 'Reliability',
    ko: '신뢰성',
    text: '지정된 기간과 조건에서 요구 기능을 수행할 확률입니다. 예: 임무 기간 동안 전력 공급 기능을 유지하는가?',
  },
  {
    name: 'Availability',
    ko: '가용성',
    text: '필요한 때 서비스가 준비되어 사용 가능한 정도입니다. 예: 필요한 지상 접촉 때 통신 기능을 사용할 수 있는가?',
  },
  {
    name: 'Maintainability',
    ko: '정비성',
    text: '고장 후 기능을 복구·보존할 수 있는 능력입니다. 궤도에서는 물리적 수리보다 고장 격리, Reset, 소프트웨어 복구와 재구성을 고려합니다.',
  },
  {
    name: 'Safety',
    ko: '안전성',
    text: '사람, 발사 시스템, 다른 위성과 임무에 대한 허용 불가능한 위험을 방지합니다. 예: 배터리 과열을 제한하는가?',
  },
];
export const analyses = [
  {
    name: 'FMECA',
    text: '각 Failure mode에서 시작해 국소·상위·임무 영향을 추적하고 중요도를 검토합니다. 안테나 전개 실패의 영향이 임무 전체로 어떻게 이어지는지 살펴봅니다.',
  },
  {
    name: 'RBD',
    text: '요구 기능이 유지되는 데 어떤 구성 요소가 필요한지 표현합니다. 안테나와 Radio가 모두 필요하면 직렬 기능 관계입니다. 이 도식은 확률 계산 결과가 아닙니다.',
  },
  {
    name: 'Fault Tree',
    text: '최상위 사건에서 출발해 OR / AND 조건으로 원인을 분해합니다. 교육 예: 통신 상실 ← 안테나 기능 상실 OR Radio 기능 상실. 실제 완전한 Fault Tree는 별도 분석이 필요합니다.',
  },
  {
    name: 'PHM',
    text: '상태 감시, 고장 진단과 열화·예지 추론을 연결합니다. 예: 충전 추세·온도·전류를 관찰해 열화 의심을 제기합니다. 추세만으로 원인을 확정하거나 수명을 예측하지 않습니다.',
  },
];
export const hierarchy = [
  {
    level: 'Part',
    name: 'Bolt',
    text: '이 모델에서 독립적인 임무 기능이 배정되지 않은 물리적 항목입니다.',
  },
  {
    level: 'Part-pair',
    name: 'Bolt–nut',
    text: '상호작용하는 두 부품이 체결과 같은 기능을 함께 수행합니다.',
  },
  {
    level: 'Component',
    name: 'Microprocessor',
    text: '정의된 입력과 출력을 갖는 기능 단위입니다. Microprocessor와 소프트웨어도 Component입니다.',
  },
  {
    level: 'Subsystem',
    name: 'OBC',
    text: '주요 위성 능력을 제공하는 Component 그룹입니다.',
  },
  {
    level: 'System',
    name: 'ACRUX-2 CubeSat',
    text: '각 Subsystem을 통합해 임무를 수행하는 전체 위성입니다.',
  },
];
export const uncertainties = [
  {
    status: 'Confirmed' as Status,
    title: '1U 기술 실증 임무',
    text: 'ConOps §1에서 ETP 및 Deneb 하드웨어 성능 데이터 수집 목적을 명시합니다. Confirmed는 제공 문서에 명시되었다는 뜻이며 비행 검증을 뜻하지 않습니다.',
    sourceRefs: [conops('§1', 1)],
  },
  {
    status: 'Conflicting' as Status,
    title: '배터리 셀 수',
    text: 'ConOps §2.1은 3셀, Modeling §1.2 및 §2.2는 3–4셀 TBD입니다. 진동 시험과 최종 설계 선택을 확인해야 합니다.',
    sourceRefs: [conops('§2.1', 1), model('§1.2, §2.2')],
  },
  {
    status: 'TBD' as Status,
    title: 'Camera 포함 여부',
    text: 'Raspberry Pi camera는 Modeling 문서에서 TBD입니다. 확정된 ACRUX-2 Payload로 설명하지 않습니다.',
    sourceRefs: [model('§1.2, §2.2')],
  },
  {
    status: 'Assumption' as Status,
    title: '전력 모드 경계',
    text: 'Current ConOps assumption. Safe 10–40%와 Normal 40–80%는 40%에서 겹치며 자율 Payload 조건은 >40%입니다. 최대 방전 깊이 40% 목표와 SOC 운용 기준의 관계도 SME 검토가 필요합니다.',
    sourceRefs: [
      conops('§2.1', 2),
      conops('§4.2', 4),
      conops('§4.2 continued', 5),
    ],
  },
  {
    status: 'TBD' as Status,
    title: '히터 전력·센서 상세·실험 각속도',
    text: '가열 소비 전력, 센서 사양, ETP 실험의 안정 각속도 임계값, 저장·복구 절차가 완성되지 않았습니다.',
    sourceRefs: [conops('§8–9', 8), conops('§5.2', 6)],
  },
  {
    status: 'Assumption' as Status,
    title: '임무 기간의 적용 범위',
    text: 'Modeling 문서는 30-day LEO mission을 기술하지만 ConOps의 단계별 성공 기준은 고정 기간을 정하지 않습니다. 30일을 공통 검증 기준으로 승격하지 않습니다.',
    sourceRefs: [model('§1.1, §2 System'), conops('§1', 1)],
  },
];
export const questions = [
  {
    id: 'flow',
    type: 'Flow classification',
    question: '태양전지판으로 들어오는 Solar radiation의 흐름 유형은?',
    options: ['Material', 'Energy', 'Data'],
    answer: 1,
    feedback:
      '빛은 전자기 에너지를 전달합니다. 태양전지판은 이를 DC 전력으로 변환합니다.',
    sourceRefs: [model('§2 Solar panel')],
  },
  {
    id: 'hierarchy',
    type: 'Hierarchy classification',
    question: 'MADE convention에서 Microprocessor의 계층은?',
    options: ['Part', 'Part-pair', 'Component', 'Subsystem'],
    answer: 2,
    feedback:
      '명확한 기능과 입출력을 가진 Microprocessor는 Component입니다. 내부 정보를 모른다고 임의의 Part로 분해하지 않습니다.',
    sourceRefs: [model('§1.1')],
  },
  {
    id: 'pair',
    type: 'Hierarchy classification',
    question: '체결 기능을 함께 수행하는 Bolt–nut의 계층은?',
    options: ['Part-pair', 'System', 'Subsystem'],
    answer: 0,
    feedback:
      '두 물리적 Part의 상호작용으로 기능을 수행하므로 Part-pair입니다.',
    sourceRefs: [model('§1.1')],
  },
  {
    id: 'match',
    type: 'Match input to output',
    question: 'Temperature sensor의 입력과 출력 연결로 올바른 것은?',
    options: [
      '온도 조건 (Energy) → 온도 측정값 (Data)',
      '온도 측정값 (Data) → RF 에너지 (Energy)',
      '전기 에너지 (Energy) → 기계적 체결 (Material)',
    ],
    answer: 0,
    feedback:
      '물리적인 열적 상태와 그 상태를 나타내는 측정 데이터는 구분합니다.',
    sourceRefs: [model('§2 Temperature sensor')],
  },
  {
    id: 'property',
    type: 'Measurable property',
    question: 'DC 전력 Flow의 측정 가능한 Property는?',
    options: ['임무 성공', 'Voltage (V)', '전원 시스템'],
    answer: 1,
    feedback:
      'Voltage는 단위로 측정할 수 있습니다. 임무 성공은 결과, 전원 시스템은 엔티티입니다.',
    sourceRefs: [model('§2')],
  },
  {
    id: 'confirmed',
    type: 'Source status',
    question:
      'ConOps §1에 명시된 Primary 성공 기준인 전개·통신 수립의 출처 상태는?',
    options: ['Confirmed (문서 명시)', 'TBD', 'Historical'],
    answer: 0,
    feedback:
      '제공 문서에 명시된 내용입니다. Confirmed가 실제 비행 검증 완료를 뜻하지는 않습니다.',
    sourceRefs: [conops('§1.1', 1)],
  },
  {
    id: 'assumption',
    type: 'Source status',
    question:
      'ConOps의 두 스위치 30초 해제를 학습 시뮬레이터에서 어떻게 표시해야 할까요?',
    options: [
      '검증 완료 비행 요구사항',
      'Current ConOps assumption',
      'Historical',
    ],
    answer: 1,
    feedback:
      '이 값은 출처가 있는 운용 가정입니다. 검증된 Flight software 요구사항으로 표현하지 않습니다.',
    sourceRefs: [conops('§3.1', 2), spec('§7 Module 3')],
  },
  {
    id: 'tbd',
    type: 'Source status',
    question: 'Raspberry Pi camera의 현재 포함 여부는?',
    options: ['Confirmed', 'TBD', 'Historical'],
    answer: 1,
    feedback: 'Modeling 문서에서 포함과 적격성 확인이 필요한 TBD로 표시합니다.',
    sourceRefs: [model('§2.2')],
  },
  {
    id: 'conflict',
    type: 'Source status',
    question:
      'ConOps는 배터리 3셀, Modeling은 3–4셀 TBD라고 합니다. 어떻게 기록할까요?',
    options: ['3셀로 자동 통일', 'Conflicting · SME 확인 필요', '평균 3.5셀'],
    answer: 1,
    feedback:
      '충돌을 보존하고 최종 설계 담당자에게 확인합니다. 임의로 통합하지 않습니다.',
    sourceRefs: [conops('§2.1', 1), model('§2.2')],
  },
];
export const assignmentFields = [
  ['entity', 'Entity name'],
  ['level', 'Hierarchy level'],
  ['parent', 'Parent subsystem'],
  ['function', 'Function'],
  ['inputs', 'Inputs'],
  ['outputs', 'Outputs'],
  ['flowTypes', 'Flow types'],
  ['properties', 'Flow properties + units'],
  ['connections', 'Connected components'],
  ['assumptions', 'Known assumptions / TBDs'],
  ['failure', 'One possible failure mode'],
] as const;
export const moduleTitles = [
  '임무 개요',
  '위성 구조 탐색',
  '전개 시퀀스',
  'MADE 모델 탐색',
  'RAMS와 고장 추론',
  '모델링 준비도',
];
export const moduleEnglish = [
  'MISSION OVERVIEW',
  'SYSTEM ANATOMY',
  'MISSION SEQUENCE',
  'MADE MODEL EXPLORER',
  'FAILURE REASONING',
  'MODELING READINESS',
];
