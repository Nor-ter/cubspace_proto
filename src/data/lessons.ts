export type Lesson = {
  id: string;
  label: string;
  title: string;
  lead: string;
  visual:
    | 'continuity'
    | 'orbit'
    | 'anatomy'
    | 'trace'
    | 'made'
    | 'prolog'
    | 'handoff';
  chapters: { title: string; body: string; points: string[] }[];
  source: { label: string; href: string };
};

export const lessons: Lesson[] = [
  {
    id: '01',
    label: 'ORIENT',
    title: '왜 CubSpace인가',
    visual: 'continuity',
    lead: '미션 지식이 사람의 기억에만 머물지 않도록, 판단의 근거와 시스템 관계를 연결합니다.',
    chapters: [
      {
        title: '문서보다 연결이 먼저입니다',
        body: '시스템 엔지니어링 정보는 요구사항, 기능, 물리 구성, 검증 결과가 서로 연결될 때 재사용할 수 있습니다.',
        points: [
          '결정과 가정을 함께 기록',
          '모델 요소에서 시험 근거까지 추적',
          '다음 팀이 질문을 재구성할 수 있게 유지',
        ],
      },
      {
        title: '온보딩의 목표',
        body: '모든 것을 암기하는 대신 어디에서 신뢰할 수 있는 정보를 찾고, 어떻게 근거를 남기는지 배우는 것이 목표입니다.',
        points: [
          '미션 맥락 이해',
          '공통 모델 언어 습득',
          '검토 가능한 첫 Task 완성',
        ],
      },
    ],
    source: {
      label: 'NASA Systems Engineering Handbook',
      href: 'https://www.nasa.gov/reference/systems-engineering-handbook/',
    },
  },
  {
    id: '02',
    label: 'SPACECRAFT',
    title: 'CubeSat과 ACRUX-II',
    visual: 'orbit',
    lead: '표준화된 작은 플랫폼 안에서 전력, 통신, 자세 제어, 컴퓨팅이 하나의 임무 시스템으로 작동합니다.',
    chapters: [
      {
        title: '1U는 크기만을 뜻하지 않습니다',
        body: 'CubeSat 규격은 발사체와 위성 사이의 기계적 인터페이스를 표준화해 개발 진입 장벽을 낮춥니다.',
        points: [
          '약 10 cm급 폼팩터',
          '제한된 질량·전력·열 예산',
          '서브시스템 간 인터페이스가 설계의 핵심',
        ],
      },
      {
        title: 'ACRUX-II의 초기 성공 조건',
        body: '분리 뒤 생존하고 회전을 낮추며 지상과 연결되어야 기술 실증 데이터를 수집할 수 있습니다.',
        points: [
          'Deployment 감지',
          'ADCS detumbling',
          '안테나 전개와 최초 교신',
        ],
      },
    ],
    source: {
      label: 'NASA CubeSat 101',
      href: 'https://www.nasa.gov/wp-content/uploads/2017/03/nasa_csli_cubesat_101_508.pdf',
    },
  },
  {
    id: '03',
    label: 'ANATOMY',
    title: '위성 구조 탐색',
    visual: 'anatomy',
    lead: '구조물 안의 보드와 장치를 개별 부품이 아니라 임무 기능을 수행하는 협력 시스템으로 읽습니다.',
    chapters: [
      {
        title: '구조에서 기능으로',
        body: 'Chassis는 부품을 지지하고, OBC는 상태와 명령을 처리하며, EPS는 에너지를 공급하고, ADCS는 자세를 추정·제어합니다.',
        points: [
          'Structure: 하중과 배치',
          'OBC·COMMS: 명령과 데이터',
          'ADCS: 센싱과 토크 생성',
        ],
      },
      {
        title: '인터페이스를 먼저 찾으세요',
        body: '부품 이름보다 무엇이 들어오고 무엇이 나가는지 확인하면 시스템 경계를 빠르게 이해할 수 있습니다.',
        points: [
          '전력: voltage/current',
          '데이터: command/telemetry',
          '물리: torque/temperature',
        ],
      },
    ],
    source: {
      label: 'NASA Small Spacecraft Systems',
      href: 'https://www.nasa.gov/smallsat-institute/sst-soa/',
    },
  },
  {
    id: '04',
    label: 'SYSTEM MODEL',
    title: 'System Modeling 기초',
    visual: 'trace',
    lead: '요구, 기능, 물리 구현과 검증 근거를 하나의 추적 가능한 관계망으로 표현합니다.',
    chapters: [
      {
        title: '모델은 질문에 답해야 합니다',
        body: '좋은 모델은 무엇이 존재하는지를 넘어 왜 필요하고, 무엇과 연결되며, 어떻게 검증되는지 보여줍니다.',
        points: [
          'Requirement: 무엇을 만족해야 하는가',
          'Function: 어떤 변환이 필요한가',
          'Physical: 누가 수행하는가',
          'Evidence: 어떻게 확인하는가',
        ],
      },
      {
        title: '경계와 추적성',
        body: '시스템 경계를 명시하면 입력·출력이 선명해지고 변경 영향과 누락된 검증을 찾기 쉬워집니다.',
        points: [
          '상위 목적에서 하위 구성까지 연결',
          '인터페이스 타입 명시',
          '주장마다 검증 근거 연결',
        ],
      },
    ],
    source: {
      label: 'NASA Systems Engineering Handbook',
      href: 'https://www.nasa.gov/reference/systems-engineering-handbook/',
    },
  },
  {
    id: '05',
    label: 'MADE',
    title: 'ADCS 기능 모델',
    visual: 'made',
    lead: 'MADE의 Function–Flow–Property 구조로 detumbling 과정의 정보와 에너지 변환을 읽습니다.',
    chapters: [
      {
        title: '블록은 기능, 선은 흐름입니다',
        body: '기능 블록은 입력을 출력으로 바꾸며 연결선은 전력, 데이터, 물질 또는 기계적 효과가 이동하는 경로를 나타냅니다.',
        points: [
          'Magnetometer가 자기장 측정',
          'B-dot 로직이 제어 명령 계산',
          'Driver와 magnetorquer가 토크 생성',
        ],
      },
      {
        title: 'Flow Property가 검증 기준이 됩니다',
        body: 'Data rate, voltage, current, torque처럼 단위가 있는 속성이 있어야 인터페이스가 호환되는지 검토할 수 있습니다.',
        points: [
          '흐름 타입 일치',
          '단위와 허용 범위 기록',
          '출처와 확정 상태 표시',
        ],
      },
    ],
    source: {
      label: 'PHM Technology — MADe',
      href: 'https://phmtechnology.com/products/maintenance-aware-design-environment-made/',
    },
  },
  {
    id: '06',
    label: 'PROLOG',
    title: 'Knowledge Reasoning',
    visual: 'prolog',
    lead: '시스템 사실과 규칙을 질의 가능한 형태로 표현해 문서 검색을 넘어 관계를 추론합니다.',
    chapters: [
      {
        title: 'Fact, Rule, Query',
        body: 'Prolog는 사실을 저장하고 규칙으로 관계를 정의한 뒤 질의에 맞는 해를 탐색합니다.',
        points: [
          'Fact: component(adcs, magnetometer)',
          'Rule: ready(X) :- powered(X), verified(X)',
          'Query: ?- ready(detumble)',
        ],
      },
      {
        title: '왜 이 프로젝트에 적합한가',
        body: '시스템 모델의 관계, 근거와 제약을 사람이 읽을 수 있는 문장에 가깝게 보존하면서 역방향 질문도 할 수 있습니다.',
        points: [
          '추적 관계를 직접 표현',
          '누락과 충돌을 질의',
          '설명 가능한 결과 생성',
        ],
      },
    ],
    source: {
      label: 'SWI-Prolog Quick Start',
      href: 'https://www.swi-prolog.org/pldoc/man?section=quickstart',
    },
  },
  {
    id: '07',
    label: 'HANDOFF',
    title: '첫 Engineering Task',
    visual: 'handoff',
    lead: '근거와 검토 상태가 남는 작은 모델 변경으로 지식 연속성의 첫 고리를 완성합니다.',
    chapters: [
      {
        title: '작은 변경도 완결된 기록으로',
        body: 'Task에는 목적, 영향받는 모델 요소, 사용한 출처, 확인 방법과 승인자가 함께 남아야 합니다.',
        points: [
          '범위와 완료 조건 합의',
          '모델·문서·규칙 업데이트',
          'Evidence 첨부',
          'Peer review와 sign-off',
        ],
      },
      {
        title: '완료의 정의',
        body: '파일을 저장하는 것이 아니라 다음 엔지니어가 결정 이유를 재현하고 변경 영향을 추적할 수 있을 때 완료입니다.',
        points: [
          '링크가 끊기지 않음',
          '가정과 TBD가 명확함',
          '소유자와 다음 행동이 있음',
        ],
      },
    ],
    source: {
      label: 'NASA Systems Engineering Handbook',
      href: 'https://www.nasa.gov/reference/systems-engineering-handbook/',
    },
  },
];

export const lessonById = Object.fromEntries(
  lessons.map((lesson) => [lesson.id, lesson]),
);
