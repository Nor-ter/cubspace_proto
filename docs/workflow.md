# 티켓 기반 개발 흐름

## 단계와 실행 파일

```text
ticket.json → mds/작업문서.md → 구현 에이전트 → 필수 검사
           → 독립 리뷰 에이전트 → Prolog 기록 + 보고서 → 커밋 → 푸시
```

`npm run ticket -- generate`는 입력을 검증하고 UTC 시각·입력 해시가 포함된 실행 ID를 생성합니다. 입력은 `workflow/runs/RUN_ID/state.json`에 복사하므로 이후 ticket.json을 수정해도 과거 작업 내용은 보존됩니다. 같은 입력은 같은 작업 본문을 생성하며 실행 시각은 별도입니다.

`workflow/config.json`은 신뢰하는 저장소 설정입니다. 검사 명령은 여기에만 정의합니다. 외부 티켓 본문에서 셸 명령을 추출해 실행하지 않습니다. 다른 프로젝트에서는 검사 목록과 에이전트 지침을 바꾸면 같은 흐름을 사용할 수 있습니다.

| 명령                                          | 결과                                              |
| :-------------------------------------------- | :------------------------------------------------ |
| `npm run ticket -- generate`                  | 작업 문서와 실행 상태 생성                        |
| `npm run ticket -- agent RUN_ID implementer`  | 선택한 CLI로 구현 실행                            |
| `npm run ticket -- check RUN_ID`              | 테스트·lint·타입·빌드 결과 및 실제 소요 시간 기록 |
| `npm run ticket -- agent RUN_ID reviewer`     | 독립 Codex/Claude 세션에서 QA                     |
| `npm run ticket -- review RUN_ID review.json` | 다른 독립 LLM 리뷰 결과 등록                      |
| `npm run ticket -- report RUN_ID`             | 결과·검사 성능 보고서 생성                        |
| `npm run ticket -- commit RUN_ID`             | 통과한 코드와 티켓 범위만 커밋                    |
| `npm run ticket -- push RUN_ID`               | 커밋 영수증과 현재 HEAD 확인 후 지정 브랜치 푸시  |

`run`은 생성부터 보고서까지 수행하며 커밋·푸시는 별도 명령입니다. 환경 설치 스크립트가 CLI를 같은 Conda 환경에 설치합니다. 사용하려는 도구에 로그인하세요.

```powershell
conda activate cubspace
codex login
claude auth login
```

두 도구를 모두 사용할 때만 둘 다 로그인합니다. `workflow/config.json`의 `agents.implementer.provider`와 `agents.reviewer.provider`는 `codex` 또는 `claude`입니다. 기본은 Codex입니다. 사용자 지정 실행 파일이 필요하면 역할 설정의 `command`에 명령 또는 인수 배열을 지정합니다. Windows의 Conda 환경에서는 설치된 npm 패키지의 `bin` 항목으로 실행 파일을 찾으므로 `.cmd`를 셸로 실행할 필요가 없습니다.

각 역할은 별도 프로세스로 실행합니다. Codex 리뷰는 읽기 전용 sandbox를 사용합니다. Claude 리뷰는 `plan` 모드에서 `Read`, `Glob`, `Grep`만 제공하고 외부 MCP를 연결하지 않습니다. 리뷰 전 저장한 diff와 미추적 파일 목록, 필수 검사 로그를 읽습니다. Claude가 명령 실행 권한을 받지 못하면 구현 단계에서 추가 검사 실행이 제한될 수 있지만, 후속 `check` 단계는 동일하게 실행됩니다. 권한을 건너뛰는 옵션은 사용하지 않습니다.

Claude의 구조화된 응답은 공통 리뷰 JSON으로 변환합니다. CLI 실패, 불완전한 응답, 오래된 코드 해시를 통과로 등록하지 않습니다. 확장 내부 세션을 CLI가 이어받는 구조는 아니며 각 도구의 로그인·사용량 조건이 적용됩니다.

## 리뷰와 QA/QC

필수 검사는 전부 실행합니다. 무작위 검사는 필수 검사를 대체하지 않습니다. `qa_seed`와 `qa_cases`에서 재현 가능한 세 항목을 선택해 추가 리뷰 대상으로 제공합니다. 리뷰어는 변경 내용과 수용 기준을 독립적으로 확인하고 실제 검증 근거를 기록합니다.

```json
{
  "reviewer": "independent-llm-reviewer",
  "fingerprint": "검사 state.json의 실제 코드 해시",
  "decision": "pass",
  "evidence": ["실제로 실행한 검사와 확인한 결과"],
  "findings": []
}
```

이 형식은 결과 교환 규약이지 리뷰어 신원을 암호학적으로 증명하는 방식은 아닙니다. 신뢰하는 로컬 작업자가 사용합니다. 리뷰 등록 시 검사와 현재 코드 해시가 같아야 합니다. 소스가 바뀌면 재검사·재리뷰가 필요합니다.

JEV는 사용자가 지칭한 도구의 명칭·API가 확인되면 연결할 계획입니다. 현재는 실행하지 않습니다. 먼저 일반 LLM 리뷰와 Playwright 화면 검사로 확인하며, 나중에 JEV를 같은 리뷰 결과 규약의 어댑터로 추가할 수 있습니다.

## VS Code에서 사용

`.vscode/tasks.json`에서 개발 서버, 검사, 티켓 문서 생성과 보고서를 실행할 수 있습니다. **터미널 → 작업 실행**을 사용하세요. 작업 터미널이 Node.js를 찾지 못하면 활성화된 Conda 터미널에서 `code .`로 다시 열거나 통합 터미널에서 명령을 직접 실행합니다.

Codex는 `AGENTS.md`, Claude는 `CLAUDE.md`와 `.claude/agents/`를 사용합니다. Claude에게 `ticket-reviewer`로 생성된 작업 문서를 검토하라고 요청할 수도 있습니다. 결과를 파이프라인에 등록하려면 공통 JSON 형식으로 저장한 뒤 `review` 명령을 사용합니다.

GitHub Copilot을 사용한다면 `.github/agents/`의 역할과 `/ticket` 프롬프트를 선택할 수 있습니다. 현재 Codex, Claude Code와 ClickUp 확장이 설치돼 있으며, Copilot은 선택 사항입니다. 전체 버전 목록은 [확장 기록](extensions.md)에 있습니다.

## ClickUp 연결

[README의 토큰 설정](../README.md#5-clickup-토큰-연결)에 따라 `.clickup.env`를 만들고 `npm run ticket -- clickup TASK_ID`를 실행합니다. VS Code **작업 실행 → ClickUp 티켓 가져오기**에서도 task ID를 입력할 수 있습니다. `CLICKUP_API_TOKEN` 환경변수가 있으면 로컬 파일보다 우선합니다. 토큰은 ClickUp HTTP 요청에만 사용하며 자식 검사·에이전트 프로세스의 환경변수에서는 제거합니다. 에이전트에 비밀 파일을 읽도록 요청하지 마세요.

공식 Get Task API에서 제목, 설명과 task ID를 가져와 `ticket.clickup.json` 초안을 만듭니다. 범위, 완료 기준과 로컬 티켓 ID는 기존 `ticket.json`에서 유지하므로 새 작업에 맞게 반드시 검토합니다. 외부 설명은 작업 데이터이며 실행 권한으로 해석하지 않습니다. 실제 토큰을 제공하지 않은 개발 검사는 대체 응답으로 가져오기·실패 경로를 검사합니다.

ClickUp 확장(`edsol.clickup`)은 별도 게시자의 편집기 도구입니다. 자동화 CLI는 그 확장에 의존하지 않고 공식 API를 직접 호출합니다. 확장의 `ClickUp: Set token` 저장소와 CLI의 `.clickup.env`는 공유되지 않습니다.

현재는 명시적 가져오기만 구현했습니다. ClickUp 생성 이벤트를 자동 실행으로 연결하려면 webhook 수신, 서명 검증, API 재조회, 중복 제거와 작업 큐가 필요합니다. VS Code 확장은 상시 webhook 서버가 아니며 이 저장소에 해당 서버를 구현했다고 표시하지 않습니다.

## Prolog 기록

`prolog/run_memory.pl`은 실행 상태에서 다시 생성되는 사실 파일입니다. 기존 교육용 mission/task 규칙과 별도이며 자동 실행 기록을 공학적 sign-off로 올리지 않습니다.

`npm run environment:check`가 통과한 같은 Conda 터미널에서:

```bash
swipl -q -s prolog/run_rules.pl -g "reviewed_run(R), writeln(R), halt"
```

`reviewed_run/1`은 저장된 스냅샷의 검사·리뷰 정합성을 질의합니다. 현재 파일의 해시 검증은 Node.js 릴리스 단계에서 수행합니다. Prolog 결과만으로 현재 소스를 릴리스하지 않습니다.

## 자료

- [Codex 비대화형 실행](https://developers.openai.com/codex/noninteractive/)
- [VS Code 사용자 정의 에이전트](https://code.visualstudio.com/docs/agent-customization/custom-agents)
- [VS Code 프롬프트 파일](https://code.visualstudio.com/docs/agent-customization/prompt-files)
- [ClickUp Get Task](https://developer.clickup.com/reference/gettask)
- [ClickUp Webhooks](https://developer.clickup.com/docs/webhooks)

환경 설치와 확인 범위는 [환경 설정](environment.md)에 기록합니다. Prolog 실행 파일은 Conda 환경 내부에 설치합니다. 웹 화면의 Prolog 학습 예제와 실제 SWI-Prolog 질의 실행은 구분합니다.
