# Task workflow

## Agent 역할

구현 agent는 `AGENTS.md`, 생성된 작업 문서, 관련 소스와 Prolog 이력을 읽고 파일을 수정합니다. 이후 `workflow/config.json`에 정의한 검사 명령을 실행합니다. 리뷰 agent는 **별도 세션**에서 완료 기준, 변경 내용, 검사 로그와 QA sample을 확인합니다. 구현 세션의 자기평가를 독립 리뷰로 등록하지 않습니다.

Codex와 Claude CLI는 역할마다 별도 프로세스를 실행합니다. Codex 리뷰는 읽기 전용 sandbox, Claude 리뷰는 읽기 도구만 사용합니다. VS Code에서는 사용자가 Chat 세션을 시작하고 모델을 선택합니다.

`auto`는 활성 Conda 환경에 설치된 CLI의 로그인 상태를 확인해 agent를 선택합니다. 환경 밖의 전역 CLI는 사용하지 않습니다. 구독 잔여량이나 원격 서비스 연결까지 확인하는 것은 아닙니다. 선택한 CLI가 실행 중 실패하면 다른 계정으로 자동 전환하지 않습니다.

`ticket.json`과 외부 ClickUp 설명은 작업 데이터입니다. 본문에 적힌 내용을 셸 명령이나 릴리스 승인으로 취급하지 않습니다. Prolog의 과거 성공 기록도 현재 코드의 검사를 대신하지 않습니다.

## 명령

아래 명령 앞에 `npm run ticket --`를 붙입니다.

| 명령                            | 용도                                              |
| ------------------------------- | ------------------------------------------------- |
| `agents`                        | 로그인 상태와 사용할 agent 확인                   |
| `run [입력.json]`               | 문서 생성 → 구현 → 검사 → 리뷰 → 보고서           |
| `start TASK_ID`                 | ClickUp task를 가져온 뒤 전체 workflow 실행       |
| `continue RUN_ID`               | 수정 후 검사·리뷰·보고서 재실행                   |
| `submit RUN_ID`                 | 통과한 보고서를 원본 ClickUp task에 댓글로 게시   |
| `commit RUN_ID`, `push RUN_ID`  | 검증한 코드와 작업 범위를 Git에 반영              |
| `generate [입력.json]`          | 작업 문서와 실행 ID 생성                          |
| `check RUN_ID`, `report RUN_ID` | 검사 또는 보고서만 실행                           |
| `agent RUN_ID ROLE`             | 지정한 agent 실행 또는 VS Code용 prompt 생성      |
| `review RUN_ID review.json`     | 별도 세션의 리뷰 결과 등록                        |
| `clickup TASK_ID`               | 가져온 task를 `ticket.clickup.json` 초안으로 저장 |

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

## ClickUp 제출 기록

가져오기는 공식 Get Task API, 제출은 Create Task Comment API를 사용합니다. 토큰은 `.clickup.env` 또는 `CLICKUP_API_TOKEN` 환경변수에서 읽으며 환경변수가 우선합니다. 검사와 agent의 자식 프로세스에는 이 토큰을 전달하지 않습니다. VS Code ClickUp 확장의 토큰 저장소와는 별개입니다.

`submit`은 현재 코드 해시, 필수 검사, 독립 리뷰를 확인한 뒤 보고서를 갱신해 게시합니다. 원본 ClickUp task ID가 없는 로컬 작업은 제출할 수 없습니다.

댓글 ID는 `.workflow/submissions/RUN_ID.json`에 저장하고, 같은 실행의 중복 제출을 확인할 때 사용합니다. 전송 시각과 HTTP 상태는 `RUN_ID.events.jsonl`에 남깁니다. 토큰과 응답 본문은 기록하지 않습니다.

명확한 4xx 오류는 기록을 남기고 재시도를 허용합니다. 응답을 받지 못해 게시 여부가 불확실하면 pending 기록을 유지하고 재전송을 막습니다. ClickUp에서 실제 게시 여부를 확인한 후 해당 로컬 기록을 정리하세요. 이 방식은 로컬 기록을 사용하므로 여러 컴퓨터에서 동시에 제출하는 경우까지 조정하지는 않습니다.

요청의 `notify_all`은 false지만, ClickUp의 담당자·관찰자 알림 설정은 적용될 수 있습니다. Task 상태 변경이나 webhook 자동 실행은 포함하지 않습니다. 결과는 `submit`을 실행할 때 게시됩니다.

## 다른 프로젝트에 적용하기

현재 예제는 온보딩 웹사이트 개발입니다. 다른 Git 기반 작업에 적용할 때는 다음을 바꿉니다.

1. `ticket.json`: 작업 목적, 수정 경로, 완료 기준, QA 항목, 참고 자료.
2. `workflow/config.json`: 실제 사용할 검사 명령과 agent.
3. `AGENTS.md`: 분야별 규칙, 결과물 형식, 리뷰 기준.
4. 실행 환경: 분석·문서·시뮬레이션 등 해당 작업에 필요한 도구. 현재 `environment.yml`과 설치 스크립트는 웹사이트 예제용입니다.

공통 자동화 코드는 `scripts/ticket.mjs`, `ticket-lib.mjs`, `agent-provider.mjs`, `clickup.mjs`, `workflow/review.schema.json`, `prolog/run_rules.pl`입니다. `prolog/run_memory.pl`과 실행 폴더는 자동 생성합니다. 웹사이트 UI와 교육용 Prolog 예제까지 복사할 필요는 없습니다.

보고서에는 실제 검사·agent 실행 시간을 기록합니다. 토큰 비용을 추정해 넣지는 않습니다. JEV 연동은 계획 단계이며, 현재는 LLM 리뷰와 실행 가능한 검사를 사용합니다.

## 공식 문서

- [Codex 인증](https://developers.openai.com/codex/auth/)
- [Claude CLI](https://code.claude.com/docs/en/cli-reference)
- [VS Code Copilot 설정](https://code.visualstudio.com/docs/setup/copilot)
- [VS Code custom agents](https://code.visualstudio.com/docs/agent-customization/custom-agents)
- [ClickUp Get Task](https://developer.clickup.com/reference/gettask)
- [ClickUp Create Task Comment](https://developer.clickup.com/reference/createtaskcomment)
