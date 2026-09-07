# CubSpace Prolog Knowledge Backbone — 실행 가능한 첫 버전

개요 문서 8장(Layer 3 — Prolog Knowledge & Reasoning Backbone)을 실제로 돌아가는 코드로
만든 것입니다. SWI-Prolog로 작성·테스트했고, 이 폴더의 세 파일만 있으면 바로 실행됩니다.

## 왜 이렇게 3개 파일로 나눴는가

CubSpace가 매우 강조하는 원칙 하나가 "MADE는 무엇인지, Prolog는 무엇이 따라나오는지를
답한다"(8.1절)입니다. 그래서 **사실(fact)과 규칙(rule)을 분리**했습니다.

| 파일             | 내용                                                | 갱신 빈도               | 원천(source of truth)        |
| ---------------- | --------------------------------------------------- | ----------------------- | ---------------------------- |
| `facts_model.pl` | 서브시스템·요구사항·모델요소 — "무엇이 존재하는가"  | MADE 모델이 바뀔 때마다 | MADE 모델 (Layer 1)          |
| `facts_tasks.pl` | Cell·Task Card·Sign-off 상태 — "무엇이 진행 중인가" | ClickUp이 바뀔 때마다   | ClickUp (Layer 4~6)          |
| `rules.pl`       | 추론 규칙 — "그래서 무엇이 따라나오는가"            | 거의 안 바뀜            | 이 파일 자체가 CubSpace 로직 |

즉 이 Prolog 파일 자체가 "지식 타워"의 원천이 아니라, **MADE와 ClickUp이라는 두 원천을
매일 반영하는 그림자(shadow)** 입니다. Prolog가 진실을 만드는 게 아니라, 이미 승인된
사실로부터 논리적으로 따라나오는 것만 답합니다 — CubSpace 19.4절 "AI/도구가 미션 지식을
확정하지 않는다"는 원칙이 여기도 그대로 적용됩니다.

## 실행 방법

```bash
# 설치 (한 번만)
sudo apt-get install swi-prolog-nox   # 또는 https://www.swi-prolog.org/download

# 대화형으로 질의하기
cd cubspace_prolog
swipl -s rules.pl
```

```prolog
?- ready(X).                    % 지금 바로 착수 가능한 태스크는?
?- blocked(X).                  % 막혀있는 태스크는?
?- blocking_tasks(T, D).        % 뭐가 뭘 막고 있는지 (T가 D 때문에 막힘)
?- requirement_open(R).         % 아직 검증 안 된 요구사항은?
?- subsystem_ready(adcs).       % ADCS 서브시스템은 준비됐는가? (지금은 no)
?- mission_ready(demonstrate_deneb_adcs).  % 미션 목표 단위로도 질의 가능
```

## 지금 데이터로 실제 확인되는 것 (2026-08-29 스냅샷)

이 폴더 그대로 실행하면:

- `ready(X)` → `TASK-EPS-001` 만 나옵니다. `TASK-ADCS-001`은 `TASK-EPS-001`에 의존하고
  있어서 아직 착수 불가(`blocked`)로 정확히 잡힙니다 — 지난 대화에서 얘기한
  "ADCS Cell과 EPS Cell의 약한 의존관계"가 여기서 실제로 작동하는 걸 볼 수 있어요.
- `requirement_open(R)` → 세 요구사항(`REQ-ADCS-01`, `REQ-ADCS-02`, `REQ-EPS-01`) 전부
  아직 열려있습니다. 아직 아무 태스크도 signed-off되지 않았으니까요.
- `subsystem_ready(adcs)` → **false**. `REQ-ADCS-01`(안테나 전개 임계값)을 다루는
  태스크가 아직 하나도 없기 때문입니다 — 이게 바로 "Track B에 아직 등록 안 된
  숨은 작업"을 Prolog가 찾아준 사례입니다. `REQ-ADCS-01`용 Task Card를 하나
  더 만들어야 한다는 뜻이죠.

만약 `TASK-EPS-001`과 `TASK-ADCS-001`을 둘 다 `signed_off`로 바꾸고 다시 질의하면
(`facts_tasks.pl`에서 `sign_off_status` 값을 고치고 재실행), `REQ-ADCS-02`는
`requirement_verified`로 바뀌지만, 여전히 `subsystem_ready(adcs)`는 false로 남습니다
— `REQ-ADCS-01`을 다루는 태스크가 없다는 사실은 그대로이기 때문입니다. 이렇게 값을
직접 바꿔가며 실험해보시면 규칙이 어떻게 반응하는지 감이 잡히실 거예요.

**주의(중요한 함정 하나):** `subsystem_ready(comms)`, `subsystem_ready(payload)` 등은
지금 `true`로 나옵니다. 이건 "COMMS가 실제로 준비됐다"는 뜻이 아니라, **아직 COMMS에
요구사항이 하나도 등록되지 않아서 논리적으로 공집합 조건이 참이 되는 것**입니다
(전칭 논리의 특성 — "만족 못 하는 요구사항이 하나도 없다"는 "요구사항이 아예 없다"도
포함). 요구사항·태스크가 늘어날수록 이 착시는 사라집니다. 지금 단계에서 Prolog 결과를
볼 때는 이 점을 꼭 감안하세요.

## 워크플로우 — 앞으로 이 세 파일을 어떻게 유지할지

1. **ClickUp에서 Task Card 상태가 바뀔 때마다** `facts_tasks.pl`을 손으로 갱신합니다
   (Cell, task, task_depends_on, sign_off_status). 지금은 ClickUp 커넥터를 안 쓰기로
   하셨으니 수작업이 기본이고, 나중에 필요하면 ClickUp REST API를 별도 스크립트로 호출해
   이 파일을 자동 생성하는 것도 가능합니다 (커넥터 연결과는 무관하게 할 수 있어요).
2. **MADE 모델링(Phase 1)이 진행될 때마다** `facts_model.pl`에 실제 서브시스템·요구사항·
   모델요소·고장모드를 채워 넣습니다. 지금은 placeholder 수준입니다.
3. **rules.pl은 거의 건드릴 필요 없습니다.** 새로운 질문이 생기면(예: "이 고장모드는
   검출 로직이 있는가?") 여기에 규칙을 추가하면 됩니다 — 개요 문서 8.3절에 예시 질문
   목록이 있습니다.
4. 정기적으로(예: 매주) `swipl -s rules.pl -g "..."` 로 몇 가지 질의를 돌려보고, 결과를
   ClickUp의 "현황" 노트나 CubSpace의 Mission Knowledge & Control Tower 문서에 옮겨
   적으면 그게 곧 "지식 타워"가 살아있다는 뜻입니다.

## 다음으로 자연스럽게 추가할 규칙

- `failure_detected(FailureMode)` / `failure_rectified(FailureMode)` — FMECA가 채워지면
- `evidence_sufficient(TaskId)` — required_evidence 개수·서명 여부 기반
- `next_task(Cell, TaskId)` — 특정 Cell에서 지금 뭘 집어야 하는지 우선순위까지 골라주는 규칙
  (blocked가 아니고, requirement 중요도가 높은 것부터)

이 세 가지는 지금 데이터로는 아직 채울 근거가 부족해서(FMECA 없음, evidence 없음) 일부러
비워뒀습니다 — 사실을 지어내지 않는다는 원칙 그대로입니다.
