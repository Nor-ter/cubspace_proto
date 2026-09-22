# Task workflow

## Agent 역할

구현 agent는 `AGENTS.md`, 생성된 작업 문서, 관련 소스와 Prolog 이력을 읽고 파일을 수정합니다. 이후 `workflow/config.json`에 정의한 검사 명령을 실행합니다. 리뷰 agent는 **별도 세션**에서 완료 기준, 변경 내용, 검사 로그와 QA sample을 확인합니다. 구현 세션의 자기평가를 독립 리뷰로 등록하지 않습니다.

Codex와 Claude CLI는 역할마다 별도 프로세스를 실행합니다. Codex 리뷰는 읽기 전용 sandbox, Claude 리뷰는 읽기 도구만 사용합니다. VS Code에서는 사용자가 Chat 세션을 시작하고 모델을 선택합니다.

`auto`는 활성 Conda 환경에 설치된 CLI의 로그인 상태를 확인해 agent를 선택합니다. 환경 밖의 전역 CLI는 사용하지 않습니다. 구독 잔여량이나 원격 서비스 연결까지 확인하는 것은 아닙니다. 선택한 CLI가 실행 중 실패하면 다른 계정으로 자동 전환하지 않습니다.

`ticket.json`과 외부 ClickUp 설명은 작업 데이터입니다. 본문에 적힌 내용을 셸 명령이나 릴리스 승인으로 취급하지 않습니다. Prolog의 과거 성공 기록도 현재 코드의 검사를 대신하지 않습니다.

## 명령

아래 명령 앞에 `npm run ticket --`를 붙입니다.

| 명령                            | 용도                                                 |
| ------------------------------- | ---------------------------------------------------- |
| `agents`                        | 로그인 상태와 사용할 agent 확인                      |
| `run [입력.json]`               | 문서 생성 → 구현 → 검사 → 리뷰 → 보고서              |
| `start TASK_ID`                 | ClickUp task를 가져온 뒤 전체 workflow 실행          |
| `continue RUN_ID`               | 수정 후 검사·리뷰·보고서 재실행                      |
| `submit RUN_ID`                 | 통과한 taskcard 게시 또는 원본 task에 결과 댓글 제출 |
| `commit RUN_ID`, `push RUN_ID`  | Git 반영 후 설정에 따라 ClickUp 게시                 |
| `generate [입력.json]`          | 작업 문서와 실행 ID 생성                             |
| `check RUN_ID`, `report RUN_ID` | 검사 또는 보고서만 실행                              |
| `agent RUN_ID ROLE`             | 지정한 agent 실행 또는 VS Code용 prompt 생성         |
| `review RUN_ID review.json`     | 별도 세션의 리뷰 결과 등록                           |
| `clickup TASK_ID`               | 가져온 task를 `ticket.clickup.json` 초안으로 저장    |

`RUN_ID`는 `CUB-100`처럼 ticket ID와 같습니다. `mds/CUB-100.md`, `workflow/runs/CUB-100/`에 기록하며 날짜를 붙이지 않습니다. 같은 ID로 generate를 다시 실행하면 중단합니다. 수정은 continue로 이어가고 새 작업은 새 ID를 사용합니다. 과거의 날짜 포함 ID도 읽을 수 있습니다.

`ROLE`은 `implementer` 또는 `reviewer`입니다.

VS Code Chat에는 출력된 `implementer.prompt.md`를 첨부합니다. 구현 후 `continue RUN_ID`를 실행하고, 새 리뷰 세션에 `reviewer.prompt.md`를 첨부합니다. 리뷰 결과는 아래 형식으로 저장합니다.

```json
{
  "reviewer": "실제로 사용한 독립 agent 이름",
  "fingerprint": "state.json의 검사 대상 해시",
  "decision": "pass",
  "evidence": ["실제로 확인한 검사와 근거"],
  "findings": []
}
```

`review`로 결과를 등록하고 `report`로 보고서를 만듭니다. 코드가 바뀌면 `continue`로 다시 검사하세요. 리뷰 JSON은 로컬에서 결과를 주고받기 위한 형식이며, 리뷰어의 신원을 암호학적으로 인증하지는 않습니다.

## 코드 리뷰와 게시 확인

`acceptance_criteria`는 게시 전 코드·검사·독립 리뷰에서 확인합니다. 실제 Git push나 ClickUp 게시 확인은 `delivery_criteria`에 적습니다. 코드 리뷰 통과를 외부 게시 완료로 기록하지 않으며, 게시 후 원격 readback으로 별도 확인합니다.

## ClickUp 게시

토큰은 `.clickup.env` 또는 `CLICKUP_API_TOKEN`에서 읽으며 환경변수가 우선합니다. 검사와 agent의 자식 프로세스에는 이 토큰을 전달하지 않습니다. VS Code 확장의 토큰 저장소와는 별개입니다.

```json
"clickup": {
  "parent_id": "14ynqxyy8d4",
  "status": "review",
  "publish_on_push": true
}
```

현재 부모는 **Task → Perform task card**입니다. 다른 프로젝트에서는 해당 부모 task ID와 list에서 사용하는 상태 이름을 설정합니다. 부모 자체나 다른 subtask의 상태는 바꾸지 않습니다.

- **로컬 ticket:** 부모의 list와 상태를 확인하고 `ticket.title`을 이름으로 subtask를 생성합니다. 작업 내용, 보고서, 실행 시간, commit과 결과 파일 링크를 설명에 넣습니다. `CubSpace task: CUB-100` 식별자로 기존 자동화 task를 찾아 갱신합니다. 이름만 같은 수동 task는 변경하지 않습니다.
- **ClickUp에서 가져온 ticket:** 원본 task에 보고서를 댓글로 제출합니다. 기존 댓글 제출 방식과 task 상태를 유지합니다.

`submit`은 현재 소스 해시, 필수 검사와 독립 리뷰를 확인합니다. 로컬 taskcard는 현재 commit이 workflow를 통해 push된 기록도 필요합니다. `push` 명령은 Git push 성공 후 `publish_on_push` 설정에 따라 `submit`을 실행합니다. 일반 `git push`에는 hook을 설치하지 않습니다.

Git push 후 ClickUp만 실패했다면 `submit CUB-100`으로 재시도합니다. Git push 성공 기록은 유지하며 ClickUp 실패를 성공으로 표시하지 않습니다. 게시가 끝나면 원격 task를 다시 읽어 부모, 제목, 본문과 상태를 확인합니다.

Taskcard 기록은 `.workflow/taskcards/CUB-100.json`, 댓글 기록은 `.workflow/submissions/CUB-100.json`에 저장합니다. 요청과 실패 기록은 같은 이름의 `.events.jsonl`에 남기며 토큰과 원격 응답 본문은 저장하지 않습니다. 같은 로컬 작업의 동시 실행을 차단합니다. 서로 다른 컴퓨터의 동시 최초 생성까지 잠그는 서버 측 기능은 없습니다.

생성 응답을 받지 못했으면 자동으로 같은 POST를 반복하지 않습니다. 다음 실행에서 식별자가 같은 원격 task가 확인되면 이어서 처리하고, 확인되지 않으면 중단합니다. 명확히 거절된 요청은 원인을 수정한 뒤 재시도할 수 있습니다.

`review`는 자동 검사와 독립 LLM 리뷰를 통과한 후 사람이 확인할 상태입니다. 자동으로 최종 승인을 기록하거나 부모 task를 완료하지 않습니다. `notify_all`은 false지만 ClickUp의 담당자·관찰자 알림 설정은 적용될 수 있습니다.

## 다른 프로젝트에 적용하기

현재 예제는 온보딩 웹사이트 개발입니다. 다른 Git 기반 작업에 적용할 때는 다음을 바꿉니다.

1. `ticket.json`: 작업 목적, 수정 경로, 완료 기준, QA 항목, 참고 자료.
2. `workflow/config.json`: 실제 사용할 검사 명령과 agent.
3. `AGENTS.md`: 분야별 규칙, 결과물 형식, 리뷰 기준.
4. 실행 환경: 분석·문서·시뮬레이션 등 해당 작업에 필요한 도구. 현재 `environment.yml`과 설치 스크립트는 웹사이트 예제용입니다.

공통 자동화 코드는 `scripts/ticket.mjs`, `ticket-lib.mjs`, `agent-provider.mjs`, `clickup.mjs`, `taskcard-publisher.mjs`, `workflow/review.schema.json`, `prolog/run_rules.pl`입니다. `prolog/run_memory.pl`과 실행 폴더는 자동 생성합니다. 웹사이트 UI와 교육용 Prolog 예제까지 복사할 필요는 없습니다.

보고서에는 실제 검사·agent 실행 시간을 기록합니다. 토큰 비용을 추정해 넣지는 않습니다. JEV 연동은 계획 단계이며, 현재는 LLM 리뷰와 실행 가능한 검사를 사용합니다.

## 공식 문서

- [Codex 인증](https://developers.openai.com/codex/auth/)
- [Claude CLI](https://code.claude.com/docs/en/cli-reference)
- [VS Code Copilot 설정](https://code.visualstudio.com/docs/setup/copilot)
- [VS Code custom agents](https://code.visualstudio.com/docs/agent-customization/custom-agents)
- [ClickUp Get Task](https://developer.clickup.com/reference/gettask)
- [ClickUp Create Task Comment](https://developer.clickup.com/reference/createtaskcomment)

[ClickUp Create Task](https://developer.clickup.com/reference/createtask) · [Update Task](https://developer.clickup.com/reference/updatetask)
