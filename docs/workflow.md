# 작업 실행 규약

## LLM 역할과 기록

구현 에이전트는 `AGENTS.md`, 생성된 작업 문서, 관련 소스와 Prolog 이력을 읽어 실제 파일을 수정합니다. 검사 단계는 `workflow/config.json`의 명령을 실행합니다. 리뷰 에이전트는 새 세션에서 완료 기준, 변경 내용, 검사 로그와 재현 가능한 QA 표본을 확인합니다. 같은 구현 세션의 자기평가를 독립 리뷰로 등록하지 않습니다.

Codex와 Claude CLI는 각각 독립 프로세스로 실행합니다. Codex 리뷰는 읽기 전용 sandbox, Claude 리뷰는 읽기 도구만 사용합니다. VS Code 경로는 실제 선택된 모델로 사용자가 시작하는 세션입니다. CLI가 IDE 내부 모델 선택이나 계정 권한을 임의로 가져오지 않습니다. `auto`는 CLI의 로그인 상태를 확인하며, 구독·잔여 사용량·원격 서비스 가용성까지 보장하지 않습니다. 선택한 CLI가 실행 중 실패하면 다른 계정으로 몰래 재시도하지 않습니다.

`ticket.json`은 작업 데이터입니다. 외부 카드의 문구를 셸 명령이나 릴리스 승인으로 실행하지 않습니다. Prolog의 과거 성공 기록도 현재 코드의 검사를 대체하지 않습니다.

## 명령

| 명령 (`npm run ticket --` 뒤)   | 역할                                            |
| :------------------------------ | :---------------------------------------------- |
| `agents`                        | 로그인 상태를 바탕으로 선택될 실행 경로 표시    |
| `run [입력.json]`               | 문서 생성, 구현, 검사, 독립 리뷰와 보고서       |
| `start TASK_ID`                 | ClickUp 카드 가져오기 후 같은 실행 흐름         |
| `continue RUN_ID`               | 수정 후 검사·리뷰·보고서 재실행                 |
| `submit RUN_ID`                 | 통과한 보고서를 원본 ClickUp 작업에 댓글로 게시 |
| `commit RUN_ID`, `push RUN_ID`  | 검증한 소스와 범위만 Git에 반영                 |
| `generate [입력.json]`          | 문서와 실행 ID만 생성                           |
| `check RUN_ID`, `report RUN_ID` | 검사 또는 보고서만 생성                         |
| `agent RUN_ID ROLE`             | 특정 LLM 역할 실행 또는 VS Code 전달 파일 생성  |
| `review RUN_ID review.json`     | 별도 세션의 리뷰 결과 등록                      |
| `clickup TASK_ID`               | `ticket.clickup.json` 초안만 생성               |

`ROLE`에는 `implementer` 또는 `reviewer`를 지정합니다.

VS Code Chat에서는 출력된 `implementer.prompt.md`를 첨부합니다. 구현이 끝나면 `continue RUN_ID`를 실행하고, 새 리뷰 세션에서 출력된 `reviewer.prompt.md`를 첨부합니다. 리뷰 파일은 다음 형식입니다.

```json
{
  "reviewer": "실제로 사용한 독립 에이전트 이름",
  "fingerprint": "state.json의 검사 대상 해시",
  "decision": "pass",
  "evidence": ["실제로 확인한 검사와 근거"],
  "findings": []
}
```

`review`와 `report` 명령으로 등록합니다. 코드를 바꾸면 `continue`로 다시 검사합니다. 리뷰 JSON은 로컬 결과 교환 규약이며 리뷰어 신원의 암호학적 증명이 아닙니다.

## ClickUp 제출

가져오기는 공식 Get Task API, 제출은 Create Task Comment API를 사용합니다. 토큰은 `.clickup.env` 또는 `CLICKUP_API_TOKEN` 환경변수에서 읽습니다. 환경변수가 우선하며, 자식 검사·에이전트 프로세스에는 이 토큰을 전달하지 않습니다. VS Code ClickUp 확장의 토큰 저장소는 별개입니다.

`submit`은 현재 소스 해시, 필수 검사와 독립 리뷰를 확인한 뒤 보고서를 갱신해 게시합니다. 로컬 입력만 있는 작업에는 원본 task ID가 없으므로 제출할 수 없습니다. 서버가 반환한 댓글 ID를 `.workflow/submissions/RUN_ID.json`에 저장합니다. 같은 실행의 재제출은 이 영수증을 사용합니다. 제출 시도, 성공·실패 시각과 HTTP 상태는 같은 폴더의 `RUN_ID.events.jsonl`에 남기며 토큰과 응답 본문은 기록하지 않습니다. 명확한 4xx 거절은 이력을 보존한 채 재시도를 허용합니다. 응답이 불확실하면 pending 기록을 보존하고 자동 재전송을 차단합니다. 원본 작업에서 성공 여부를 확인한 후에만 해당 로컬 기록을 정리하세요. 서로 다른 컴퓨터의 중복 제출까지 조정하는 중앙 작업 큐는 아닙니다.

`notify_all`은 false로 보내지만 ClickUp 자체의 담당자·관찰자 알림 정책은 적용될 수 있습니다. 상태 변경과 자동 webhook 실행은 포함하지 않습니다. `submit` 명령이 외부 게시 시점입니다.

## 다른 업무에 적용

이 저장소는 온보딩 웹사이트를 만드는 예제입니다. 다른 Git 저장소에서는 다음을 바꿉니다.

1. `ticket.json`: 작업 목적, 수정 경로, 완료 기준, QA 항목과 자료 경로.
2. `workflow/config.json`: 해당 업무의 실제 검사 명령과 에이전트 선택.
3. `AGENTS.md`: 분야 규칙, 산출물 형식과 검토 책임.
4. 실행 환경: 해당 분석·문서·시뮬레이션 도구 설치. 현재 `environment.yml`과 설치 스크립트는 웹사이트 예제에 맞춘 것입니다.

공통 자동화 파일은 `scripts/ticket.mjs`, `ticket-lib.mjs`, `agent-provider.mjs`, `clickup.mjs`, `workflow/review.schema.json`과 `prolog/run_rules.pl`입니다. `prolog/run_memory.pl`과 실행 폴더는 자동 생성됩니다. 웹사이트 UI나 교육용 Prolog 예제를 다른 업무로 복사할 필요는 없습니다.

검사·에이전트 실행 시간은 실제 측정값입니다. 토큰 비용을 임의로 계산하지 않습니다. JEV 연동은 구현되지 않았으며 현재 검토는 LLM과 실행 가능한 검사로 구성합니다.

## 공식 문서

- [Codex 인증, OpenAI Docs](https://developers.openai.com/codex/auth/)
- [Claude CLI](https://code.claude.com/docs/en/cli-reference)
- [VS Code Copilot 설정](https://code.visualstudio.com/docs/setup/copilot)
- [VS Code 사용자 정의 에이전트](https://code.visualstudio.com/docs/agent-customization/custom-agents)
- [ClickUp Get Task](https://developer.clickup.com/reference/gettask)
- [ClickUp Create Task Comment](https://developer.clickup.com/reference/createtaskcomment)
