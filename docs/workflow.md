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
| `npm run ticket -- agent RUN_ID implementer`  | Codex CLI로 구현 실행                             |
| `npm run ticket -- check RUN_ID`              | 테스트·lint·타입·빌드 결과 및 실제 소요 시간 기록 |
| `npm run ticket -- agent RUN_ID reviewer`     | 읽기 전용 독립 Codex 세션에서 QA                  |
| `npm run ticket -- review RUN_ID review.json` | 다른 독립 LLM 리뷰 결과 등록                      |
| `npm run ticket -- report RUN_ID`             | 결과·검사 성능 보고서 생성                        |
| `npm run ticket -- commit RUN_ID`             | 통과한 코드와 티켓 범위만 커밋                    |
| `npm run ticket -- push RUN_ID`               | 커밋 영수증과 현재 HEAD 확인 후 지정 브랜치 푸시  |

`run`은 생성부터 보고서까지 수행하며 커밋·푸시는 별도 명령입니다. Codex CLI는 별도 설치·로그인이 필요합니다. `npm install -g @openai/codex` 후 로그인하세요. Windows에서 `codex.cmd`를 실행할 수 없다면 `npm root -g`로 확인한 경로를 사용해 `workflow/config.json`의 `agent_command`를 `["node", "C:/실제경로/node_modules/@openai/codex/bin/codex.js"]`로 지정합니다. 명령은 셸 문자열이 아닌 인수 배열로 실행됩니다. 현재 실행에서 사용한 도구와 향후 자동화 도구를 구분해 보고합니다. 실행되지 않은 API 호출이나 토큰 비용을 만들지 않습니다.

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

GitHub Copilot을 사용한다면 `.github/agents/`의 구현·리뷰·릴리스 역할을 Chat에서 선택할 수 있습니다. `.github/prompts/ticket.prompt.md`는 `/ticket` 진입점입니다. Codex 사용자는 같은 생성 Markdown과 AGENTS.md를 Codex 확장에 전달하거나 CLI 연결 명령을 실행합니다. 특정 확장의 내부 세션을 억지로 제어하지 않고, 파일과 명령을 공통 인터페이스로 사용합니다.

설치 후보: GitHub Copilot (`GitHub.copilot-chat`) 또는 Codex (`openai.chatgpt`), Playwright Test (`ms-playwright.playwright`). `.vscode/extensions.json`은 추천만 제공하며 계정 설치·로그인을 자동 수행하지 않습니다.

## ClickUp 연결

현재 지원하는 경로는 **명시적 가져오기**입니다. API 토큰은 저장소에 쓰지 않고 환경변수로 전달합니다.

```powershell
$env:CLICKUP_API_TOKEN = "본인의 토큰"
npm run ticket -- clickup TASK_ID
```

macOS/Linux에서는 `export CLICKUP_API_TOKEN='본인의 토큰'`을 사용합니다. 공유 터미널이나 기록에 토큰을 남기지 않도록 환경 설정을 관리하세요.

명령은 공식 Get Task API를 호출해 `ticket.clickup.json` 초안을 만듭니다. 제목과 설명, 원본 task ID를 가져오며, 범위·완료 기준·로컬 티켓 ID는 사람이 확인하도록 기존 템플릿을 유지합니다. 이를 검토해 `ticket.json`에 반영한 다음 생성합니다. ClickUp 상태 변경, 댓글 작성, 자동 실행은 하지 않습니다.

완전 자동화의 다음 단계는 ClickUp `taskCreated`/`taskUpdated` webhook → 서명 검증 → task ID로 공식 API 재조회 → 중복 이벤트 제거 → 작업 큐 → 승인된 브랜치의 동일 파이프라인입니다. VS Code 확장은 화면 인터페이스이고 상시 webhook 서버가 아닙니다. 현재 코드에는 외부 webhook 수신 서버나 ClickUp 계정 연결이 없습니다.

## Prolog 기록

`prolog/run_memory.pl`은 실행 상태에서 다시 생성되는 사실 파일입니다. 기존 교육용 mission/task 규칙과 별도이며 자동 실행 기록을 공학적 sign-off로 올리지 않습니다.

SWI-Prolog 설치 후:

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

현재 환경 검증: 브라우저 검사는 로컬 Chrome을 사용할 수 있으며 `BROWSER_EXECUTABLE`로 경로를 지정합니다. SWI-Prolog 네이티브 실행은 별도 설치가 필요합니다. Node.js가 생성하는 사실 파일과 문자열 이스케이프는 회귀 검사하지만, 인터프리터가 없으면 Prolog 질의를 실행했다고 표시하지 않습니다.
