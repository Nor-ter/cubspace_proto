export const taskKnowledge = {
  id: 'TASK-ADCS-001',
  atom: 'task_adcs_001',
  version: '1.0',
  title: 'ADCS 기능 모델 검토',
  purpose:
    '자력계 → OBC B-dot 소프트웨어 → Deneb 자기구동기의 기능·입출력·속성을 검토한다.',
  scope: '비행 제어기 설계·임계값 확정·실제 하드웨어 구동은 포함하지 않는다.',
  inputs: [
    'ACRUX-2 MADE Modeling §1–2',
    'ConOps §3.1.2·3.2·5.1',
    '확보된 Deneb 데이터시트',
  ],
  constraints: [
    '자료의 버전·절·담당자를 기록한다. 미확보 사양은 TBD로 표시한다.',
    '출처 진술·계산·가정·문서 충돌을 구분하고 누락된 수치는 만들지 않는다.',
    '최종 승인과 물리 장치 실행 권한은 담당 검토자가 별도로 판단한다.',
  ],
  steps: [
    {
      id: 'S01',
      title: '기능과 흐름 정의',
      instruction:
        '각 항목의 기능을 동사와 목적어로 정의하고 입력·출력을 Energy / Data / Material로 분류한다.',
      output: '기능·입출력 표',
      check: '각 기능의 입력과 출력, 흐름 분류 근거가 연결되어 있다.',
    },
    {
      id: 'S02',
      title: '물리 속성 확인',
      instruction:
        '단위·좌표계·범위·시간 기준을 기록한다. B(T), m(A·m²), τ(N·m)를 구분하고 자기 토크의 방향 제한을 설명한다.',
      output: '속성·단위·출처 표',
      check:
        '모든 수치에 출처 또는 명시적 가정이 있고 토크와 에너지를 구분한다.',
    },
    {
      id: 'S03',
      title: 'B-dot 가정 검토',
      instruction:
        '감쇠 가정, 샘플링·노이즈·포화·자기 간섭을 확인한다. 단일축 추정치를 근거 없이 3축 성능으로 일반화하지 않는다.',
      output: '제어 가정·불확실성 목록',
      check: '적용 조건과 미확인 조건이 구분되어 있다.',
    },
    {
      id: 'S04',
      title: '근거와 충돌 추적',
      instruction:
        '출처 진술, 계산 결과, 가정, 문서 충돌을 구분한다. 누락된 수치와 근거는 확인 질문으로 남긴다.',
      output: '근거 연결·검토자 질문 목록',
      check: '출처 위치와 문서 버전을 추적할 수 있다.',
    },
    {
      id: 'S05',
      title: '변경 제안과 인계',
      instruction:
        '변경 제안과 영향받는 요구·시험·모델 요소를 제출한다. 최종 승인 여부를 대신 판단하지 않는다.',
      output: '검토 패키지와 인계 기록',
      check: '영향받는 항목과 담당 검토자, 남은 질문이 명시되어 있다.',
    },
  ],
};
const q = (value: string) => `'${value.replaceAll("'", "''")}'`;
export function taskProlog() {
  const t = taskKnowledge;
  return [
    '% 교육용 지식 표현. 실행 엔진이나 하드웨어 명령이 아닙니다.',
    `task(${t.atom}).`,
    `task_id(${t.atom}, ${q(t.id)}).`,
    `revision(${t.atom}, ${q(t.version)}).`,
    `title(${t.atom}, ${q(t.title)}).`,
    `purpose(${t.atom}, ${q(t.purpose)}).`,
    `scope(${t.atom}, ${q(t.scope)}).`,
    ...t.inputs.map((s) => `source(${t.atom}, ${q(s)}).`),
    ...t.constraints.map((s) => `constraint(${t.atom}, ${q(s)}).`),
    ...t.steps.flatMap((s, i) => [
      `step(${t.atom}, ${i + 1}, ${s.id.toLowerCase()}).`,
      `step_title(${s.id.toLowerCase()}, ${q(s.title)}).`,
      `instruction(${s.id.toLowerCase()}, ${q(s.instruction)}).`,
      `output(${s.id.toLowerCase()}, ${q(s.output)}).`,
      `acceptance(${s.id.toLowerCase()}, ${q(s.check)}).`,
    ]),
    '% 사람의 승인 기록은 자동 생성하지 않습니다.',
    ':- dynamic evidence/2, human_approved/1.',
    'reviewable(Task) :- task(Task), forall(step(Task, _, S), evidence(Task, S)).',
    'handoff_ready(Task) :- reviewable(Task), human_approved(Task).',
  ].join('\n');
}
export function taskMarkdown(view: 'human' | 'ai' | 'robot') {
  const t = taskKnowledge;
  return [
    `---`,
    `id: ${t.id}`,
    `version: "${t.version}"`,
    `view: ${view}`,
    `status: draft`,
    `---`,
    `# ${t.title}`,
    `## 목적\n${t.purpose}`,
    `## 범위\n${t.scope}`,
    `## 입력\n${t.inputs.map((x) => '- ' + x).join('\n')}`,
    `## 제약\n${t.constraints.map((x) => '- ' + x).join('\n')}`,
    ...t.steps.map(
      (s) =>
        `## ${s.id} ${s.title}\n${s.instruction}\n\n산출물: ${s.output}\n\n수용 기준: ${s.check}`,
    ),
    `## 승인과 인계\n담당자: TBD\n검토자: TBD\n승인: 미승인`,
    ...(view === 'ai'
      ? [
          `## Core Knowledge Tree / Skill 저장 구조 (제안)\nMission / ACRUX-II / ADCS / Skills / ${t.id}\n\n아래 내용은 지식 저장용 초안이며 실제 Tower에 저장된 상태가 아닙니다.`,
          `## Prolog\n\`\`\`prolog\n${taskProlog()}\n\`\`\``,
        ]
      : []),
  ].join('\n\n');
}
