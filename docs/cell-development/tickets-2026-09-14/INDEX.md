# CubSpace Task Card Inventory — 2026-09-14

11개 Draft 카드. 사용자 피드백 6개 + 추가 확인/기존 미해결 검토 5개. 모든 카드는 Red(todo)이며 구현·사람 승인·게시를 수행하지 않았다. 각 Markdown에 실제 localhost 캡처가 포함되어 있고, Task_Cards_A4.pdf는 11페이지로 카드당 A4 한 장임을 확인했다. PDF의 작은 이미지는 위치 확인용이며 세부 내용은 Markdown의 원본 PNG를 연다.

## 티켓 목록

| No. | 주제 | 분류 | 우선순위 제안 |
|---|---|---|---|
| [CUB-001](CUB-001.md) | 수식별 블록·라벨 | 사용자 피드백 | P2 |
| [CUB-002](CUB-002.md) | Worked Example 토글 | 사용자 피드백 | P2 |
| [CUB-003](CUB-003.md) | 설계 검토 라벨 | 사용자 피드백 | P2 |
| [CUB-004](CUB-004.md) | SENSE→DECIDE→ACT→OBSERVE | 사용자 피드백 | P2 |
| [CUB-005](CUB-005.md) | 부품 카드·I/O 경계 | 사용자 피드백 | P2 |
| [CUB-006](CUB-006.md) | Traceability 한 줄 정의 | 사용자 피드백 | P2 |
| [CUB-007](CUB-007.md) | command 내부 mm 수식 오인식 | 새로 재현한 표시/의미 결함 | P2 |
| [CUB-008](CUB-008.md) | 에너지 기준 충돌 | 기존 SME 검토 과제 | P2 |
| [CUB-009](CUB-009.md) | 배터리 형상 충돌 | 기존 SME 검토 과제 | P2 |
| [CUB-010](CUB-010.md) | Detumbling 수용 기준 | 기존 SME 검토 과제 | P2 |
| [CUB-011](CUB-011.md) | Deneb·카메라·GLB 근거 | 기존/연관 SME 검토 과제 | P2 |

## 입력과 검색 범위

- 프로젝트 전체 Markdown 파일명 검색(의존성·빌드 산출물 제외)과 검토 기록 검색을 수행했다. 이 프로젝트에서 독립적으로 발행된 기존 버그 티켓 Markdown 묶음은 발견되지 않았다. 아래 템플릿·예시·검토 기록을 식별했다. 다른 프로젝트나 외부 티켓 시스템 전체를 검색한 결과는 아니다.
- 사용자 메시지로 제공된 수식/ADCS/Traceability/I/O 피드백을 CUB-001~006에 반영했다. 지정 Downloads의 Feedback-20260914082210.md 파일은 존재하지 않았으므로 그 파일 자체를 읽었다고 주장하지 않는다. 이후 붙여 넣은 피드백 외의 내용이 있다면 추가 입력이 필요하다.
- `outputs/cell-development/Task_Card_Ticket_Template.md`: 사용한 카드 템플릿.
- `outputs/cell-development/Engineering_Prompt_Manual_Template.md`: 공통 실행 규칙.
- `outputs/cell-development/Inspection_Signoff_Record_Template.md`: 향후 사람 승인 기록 양식.
- `outputs/cell-development/Pupfish_Filter_Ticket_Example.md`: 다른 앱의 예시. CubSpace 문제로 재발행하지 않았다.
- `outputs/cell-development/skill/cell-development-engineering/`: 위 문서의 스킬 내 사본. 중복 티켓으로 세지 않았다.
- `cubspace-branch/ENGINEERING_REVIEW.md`: 2026-09-08 검토. Corrections는 과거 수정 기록이며 이번에 전부 미해결 버그로 재발행하지 않았다.
- `cubspace-branch/prolog/README.md`, `facts_tasks.pl`: 기존 TASK-ADCS-001 및 TASK-EPS-001은 Prolog 학습 스냅샷의 모델 작업이다. 실제 현행 티켓 상태로 간주하지 않았다.
- `outputs/CubSpace_Onboarding_Trainer_Script_KO.md`: 교육 진행 자료이며 버그 티켓이 아니다.

## 화면 점검 근거와 한계

- 대상: http://localhost:3000/ · checkout: onboarding_training · HEAD: 2a2c6a44aade2fc27b5ada7f867429b132d4add6. 별도 운영 서비스는 검사하지 않았다. HEAD는 로컬 checkout 식별값이며 배포 증명은 아니다.
- main의 임무 이해·위성 구조·시스템 모델, 읽기 자료 02~07 중 관련 화면을 직접 확인했다. 모든 퀴즈·모든 기기·모든 경계 조건을 전수 검사한 것은 아니다.
- 검증을 위해 첫 두 퀴즈를 통과한 뒤 캡처했다. 점검 후 초기 상태인 0/6과 빈 답안으로 복원했다. 캡처의 1/6·2/6은 검사 중 테스트 상태다.
- 기본 뷰포트 캡처이며 실제 폰 Inspection은 수행하지 않았다. 390px에서 /learn/04의 가로 넘침을 추가 확인했고 해당 화면의 문서 폭은 뷰포트 이내였다. 임시 뷰포트는 복원했다.
- 라디오가 스냅샷에 중복 표시되어 조사했으나 보조 input에 aria-hidden=true가 있어 이를 확정 접근성 버그로 등록하지 않았다.
- CUB-007: /learn/03의 command/telemetry에서 `mm`가 math 노드로 노출됨을 확인했다. components/math-text.tsx의 다문자 단위 매칭에 단어 경계가 없는 것이 원인 후보다. 화면만으로 소리내어 읽기 동작까지 검증했다고 주장하지 않는다.
- CUB-008~011은 교육 앱이 미확정이라고 올바르게 표시한 원문/형상 검토 과제다. 교육 소프트웨어 자체의 실패로 분류하지 않는다. 외부 기술 원문의 재검증·수치 확정은 이번 범위에 포함하지 않았다.

## 관계·발행 조건

승인된 Mission Tree 원본이 제공되지 않아 모든 Prolog 경로는 제안값이다. 실제 Tree ID·버전·leaf, Cell Owner, Assignee, Inspector, 승인자, 배포 대상·권한을 확정한 뒤 Ready로 발행한다. Prolog 실행 검증은 미수행이다. 현재 카드의 Red는 티켓 구현·Sign-off가 아직 없다는 뜻이며, 작성된 문서가 미완성이라는 뜻은 아니다.

CUB-004와 005는 같은 ADCS 데이터 모델을 공유하도록 연계한다. CUB-001~003은 동일 설명 패널을 다루므로 공동 변경 범위를 조율하되 각각의 AC와 확인 증거를 유지한다. 실제 사람의 후보별 승인 없이 Green 또는 Done으로 바꾸지 않는다.

## 사용자 피드백 보존 메모

- 흐름도: EPS 공급은 Magnetometer/OBC/Deneb 전력 경로로, Bx/By/Bz는 측정 데이터로, 명령은 B-dot→Deneb로 구분한다. Deneb의 자기모멘트와 지구 자기장의 상호작용이 토크를 만들며, 회전 변화는 다음 측정으로 피드백된다. OBSERVE는 항상 회전 감소를 보장하는 센서나 장치가 아니다.
- B-dot 카드: 역할=회전 감소 명령 계산; 입력=연속 자기장·timestamp·운용 모드; 처리=시간 변화율; 출력=자기쌍극자 또는 구동 명령; 다음 연결=Deneb; 문제 영향=노이즈·지연·포화로 감쇠 성능 저하 가능.
- 긴 세부 절차·이미지 원본·검증 기록은 카드 밖에 보존하고, 카드 본문은 A–E 및 한 장 제한을 유지한다.

후속 연구·추가 피드백: [CUB-012~019 및 리서치 요약](../research-2026-09-14/INDEX.md). 기존 카드의 확장 관계는 후속 목록에 표시했다.
