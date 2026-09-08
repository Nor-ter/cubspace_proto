export const engineeringNotes = [
  {
    id: '01',
    section: 'mission',
    title: '판단을 재현할 수 있어야 지식이 이어집니다',
    principle:
      '먼저 시스템의 경계와 성공 조건을 정하고, 관측값으로 주장을 확인합니다. 모델은 현실을 목적에 맞게 단순화한 표현이므로 출처·버전·가정 없이 정확성을 보장할 수 없습니다.',
    equation:
      '주장 → 요구사항 ID → 모델 요소 → 검증 방법 → 결과·조건 → 검토 기록',
    example:
      '예: “회전이 충분히 줄었다” 대신 각속도 벡터, 측정 좌표계, 임계값, 유지 시간과 센서 유효성을 기록합니다. 요구 충족 확인(verification)과 임무 목적에 적합한지 확인(validation)을 구분합니다.',
    checks: [
      '원문 진술, 계산한 결과, 교육용 가정, 미확정(TBD)을 분리합니다.',
      '검토·승인은 시험 데이터의 대체물이 아닙니다. 실제 형상·시험 조건과 근거의 연결을 확인합니다.',
    ],
    source: 'NASA Systems Engineering Handbook; MADE Modeling §1–2',
    url: 'https://www.nasa.gov/reference/systems-engineering-handbook/',
  },
  {
    id: '02',
    section: 'mission',
    title: '궤도 운동과 에너지 예산을 분리해서 생각하세요',
    principle:
      '원궤도에서는 중력이 속도의 방향을 계속 바꾸는 구심가속도를 만듭니다. 위성은 지속적으로 자유낙하합니다. 자세 제어는 위성의 방향·회전을 바꾸며, 이 교육 예제의 자기 제어는 궤도 고도를 제어하지 않습니다.',
    equation:
      'GM/r² = v²/r → v = √(GM/r)\nΔE배터리 = ∫(P충전 − P부하 − P손실)dt\nE(Wh) = P(W) × t(s) / 3600',
    example:
      'ConOps §2: 평균 사용 가능 전력 0.31 W에서 명시된 0.20 W 부하를 빼면 0.11 W입니다(원문은 약 0.1 W로 표기). 손실이 이미 반영된 값이면 이중 차감하지 않습니다. 5 V × 0.25 A × 10 s = 12.5 J ≈ 0.00347 Wh이며 원문의 0.005 Wh는 보수적 추정입니다.',
    checks: [
      '이 그림의 크기·궤도 고도·시간은 축척이 맞는 비행 해석값이 아닙니다. r은 지구 중심부터의 거리입니다.',
      'ConOps의 초기 26.46 Wh는 명목 용량×SOC 추정이지 모두 사용할 수 있는 여유 에너지는 아닙니다. 방전 한계·온도·열화·전압 제한을 반영해야 합니다. ConOps §3.1.2: 2 Wh 미만이고 90분 동안 충전이 늘지 않는 경우 안테나를 먼저 전개하는 예외가 있습니다. 정상 순서가 모든 상황에 적용되지는 않습니다.',
      'ConOps의 40% 최대 방전심도 목표는 대략 SOC ≥60%에 해당하지만, §4.2의 40% 잔량 운용 기준과 일치하지 않습니다. 승인자가 해소할 문서 충돌입니다.',
    ],
    source: 'ConOps §2–4; NASA Gravity & Mechanics',
    url: 'https://science.nasa.gov/learn/basics-of-space-flight/chapter3-4/',
  },
  {
    id: '03',
    section: 'anatomy',
    title: '회전 감소에는 외부 토크가 필요합니다',
    principle:
      '강체가 외부 토크를 받지 않으면 관성계에서 각운동량이 보존됩니다. 질량중심이 기하학적 중심과 다르다는 사실만으로 스핀이 저절로 증가하지 않습니다. 중력구배·공력·태양복사압·잔류 자기모멘트 등 실제 외란 토크를 검토해야 합니다.',
    equation:
      'H = Iω;  I·dω/dt + ω×(Iω) = τ외부\nτ자기 = m×B;  |τ| = |m||B|sinθ',
    example:
      '교육용 예: m=0.1 A·m², B=30 µT이고 서로 수직이면 토크는 3 µN·m입니다. 평행하면 0입니다. 이는 Deneb 보드 성능값이 아닙니다. 자기장 방향 토크를 순간적으로 만들 수 없으므로 detumbling 완료가 정밀 3축 지향을 뜻하지 않습니다.',
    checks: [
      'ConOps의 3축 detumbling 에너지 1.083 Wh는 단일축 추정의 3배입니다. 결합된 회전 동역학과 전류 제한을 고려한 검증 없이 보장값으로 사용할 수 없습니다. 회전 상태는 각속도(rad/s 또는 °/s), 관성행렬은 kg·m², 토크는 N·m로 기록합니다.',
      '자력계 한 시점의 벡터 하나만으로 모든 자세 자유도를 유일하게 결정할 수 없습니다. 참조 벡터·센서·추정기와 관측 가능성을 확인합니다.',
      'GLB의 전개형 날개는 시각 자산의 구성입니다. 원문 Modeling §1의 5개 패널+안테나 결합 면을 확정 CAD로 재현한 모델이 아닙니다.',
    ],
    source: 'ConOps §5.1의 스핀 설명 검토; NASA Small Spacecraft GNC',
    url: 'https://www.nasa.gov/smallsat-institute/sst-soa/guidance-navigation-and-control/',
  },
  {
    id: '04',
    section: 'model',
    title: '기능, 요구사항, 구현을 같은 것으로 취급하지 마세요',
    principle:
      '기능은 수행할 변환·행동이고, 요구사항은 그 기능이 만족해야 할 측정 가능한 조건입니다. 하드웨어·소프트웨어는 기능을 할당받은 구현입니다. 여러 기능이 하나의 부품에, 하나의 기능이 여러 부품에 연결될 수 있습니다.',
    equation:
      '요구 예시: 지정 초기조건에서 ‖ω‖ < ωlim을 Tlim 이내 달성\n기능: 회전 감소 / 구현: 센서 + OBC 제어 SW + 자기구동기',
    example:
      'ωlim과 Tlim을 임의의 확정값으로 채우지 않습니다. ConOps §3.2는 <5°/s를 제시하지만 벡터 크기인지 축별 값인지, 유지 시간과 검증 조건은 별도 확인해야 합니다. 성공 기준이 없는 링크만으로 검증이 완료되지는 않습니다.',
    checks: [
      'Part-pair < Component < Subsystem < System은 제공된 MADE 문서의 모델링 규약이며 보편적인 물리 법칙이 아닙니다.',
      'B-dot 소프트웨어는 OBC에 할당하고 ADCS 기능과의 연결을 표시합니다. 기능 소속과 물리 탑재 위치를 구분합니다.',
      '배터리 수: ConOps §2는 3개, Modeling §1은 병렬 3–4개 TBD입니다. 카메라도 TBD이며 검증 전 확정 구성으로 표시하지 않습니다.',
    ],
    source:
      'MADE Modeling §1, §2.2; ConOps §3.2; NASA Systems Engineering Handbook',
    url: 'https://www.nasa.gov/reference/systems-engineering-handbook/',
  },
  {
    id: '05',
    section: 'made',
    title: 'B-dot은 자기장 변화율을 이용해 회전 에너지를 줄입니다',
    principle:
      '몸체 좌표계에서 측정한 자기장의 시간 변화에는 위성 회전과 궤도를 따라 변하는 지구 자기장이 함께 포함됩니다. 회전 효과가 우세하다는 근사에서 변화율의 반대 방향으로 자기 쌍극자를 명령합니다.',
    equation:
      'dBbody/dt ≈ −ω×B;  mcmd = −k·dBbody/dt (k > 0)\nτ = m×B;  dErot/dt = τ·ω ≈ −k|ω×B|² ≤ 0',
    example:
      '이상적인 고정 관성 강체, 외란 무시, 비포화 제어 근사에서 회전 에너지가 감소합니다. 실제로는 노이즈·샘플 간격·필터 지연·전류 제한·코일 발열과 센서에 대한 구동기 자기 간섭을 검증해야 합니다. 저속에서는 궤도에 따른 자기장 변화가 무시되지 않을 수 있습니다.',
    checks: [
      '자기모멘트 m는 A·m², 자기장 B는 T, 변화율은 T/s입니다. µT를 T로 변환하지 않으면 이득과 토크 계산이 틀립니다.',
      '문서의 Energy 분류는 물리적 상호작용 분류입니다. 토크는 에너지(J)가 아닙니다. 회전 전력은 τ·ω(W), 전기 입력 전력은 VI(W)입니다.',
      '블록에는 환경·기능·장치·상태가 섞여 있습니다. 이는 인과관계 학습도이며 모든 블록이 부품이거나 모든 화살표가 전력 공급선은 아닙니다. Deneb의 축 구성과 상세 구동기는 확정 사양으로 추정하지 않습니다.',
    ],
    source: 'MADE Modeling §2; NASA magnetic control reference; PHM Technology',
    url: 'https://ntrs.nasa.gov/api/citations/20110007876/downloads/20110007876.pdf',
  },
  {
    id: '06',
    section: 'prolog',
    title: '질의 성공은 현실의 안전을 증명하지 않습니다',
    principle:
      'Prolog는 주어진 사실과 규칙에서 목표를 증명합니다. 사실을 입력했다고 자동으로 승인된 정보가 되지 않으며, 근거의 진위·최신성·모델 완전성은 별도 검토 대상입니다.',
    equation:
      'Fact: component(adcs, magnetometer).\nRule: contains(X,Y) :- component(X,Y).\nQuery: ?- contains(adcs, X).',
    example:
      '화면은 지정된 세 가지 질의 결과를 보여주는 교육용 예제이며 Prolog 실행기가 아닙니다. ready(detumble)는 예제의 검토 근거 조건만 나타내며 실제 전력·온도·센서·제어기·운용 허가를 판정하지 않습니다.',
    checks: [
      '\\+ Goal은 Goal의 증명 시도가 유한 시간에 실패하면 성공합니다. 미등록·미검증과 물리적 실패를 분리하세요.',
      '정의하지 않은 술어는 SWI-Prolog 기본 설정에서 오류가 날 수 있습니다. 예제는 evidence/1와 human_signed/1를 선언하고 사실을 비워 둡니다.',
      '부품 관계의 추이 규칙에는 순환과 중복 가능성도 검토해야 합니다. 이 예제는 작은 비순환 관계만 다룹니다.',
    ],
    source: 'SWI-Prolog 공식 문서: negation as failure',
    url: 'https://www.swi-prolog.org/pldoc/doc_for?object=(%5C%2B)/1',
  },
  {
    id: '07',
    section: 'handoff',
    title: '인계 가능한 결과물에는 재현 조건이 남아야 합니다',
    principle:
      '변경은 기존 요구와 인터페이스에 영향을 줍니다. 시험 통과와 변경 승인, 학습 완료를 별도 상태로 관리해야 이후 팀이 잘못된 기준선을 사용하지 않습니다.',
    equation:
      '변경 기록 = 대상·버전 + 이유 + 영향 + 재현 절차·결과 + 불확실성 + 검토자',
    example:
      'TASK-ADCS-001에서 자력계 → OBC B-dot → 자기구동기 체인의 각 입력·출력, 단위, 좌표계, 출처 절을 작성합니다. 전류 제한값을 찾지 못했다면 TBD와 담당자·확인 계획을 남깁니다. 퀴즈 합격은 실제 설계 승인이나 비행 운용 권한을 부여하지 않습니다.',
    checks: [
      '요구 ID와 사용 형상, 시험 입력·기대 결과·실제 결과를 연결합니다.',
      '허용 오차·불확실성·실패 시 동작·재검토 조건을 기록합니다.',
      '이 화면의 완료 체크는 자기점검용입니다. 승인 원장이나 실제 임무 상태를 갱신하지 않습니다.',
    ],
    source: 'NASA Systems Engineering Handbook; MADE Modeling §2.2',
    url: 'https://www.nasa.gov/reference/systems-engineering-handbook/',
  },
] as const;
