# CubSpace

ClickUp task나 `ticket.json`을 받아 LLM agent가 작업하고, 별도 세션에서 리뷰한 뒤 결과를 보고하는 workflow입니다. 이 저장소에서는 **CubeSat 온보딩 웹사이트 개발**을 예제로 사용합니다. 작업 범위와 검사 명령을 바꾸면 문서 작성이나 데이터 분석 등 다른 Git 기반 프로젝트에도 적용할 수 있습니다.

```text
ClickUp / ticket.json
  → 작업 문서 → 구현 → 자동 검사 → 독립 리뷰
  → 보고서 + Prolog 이력 → ClickUp에 결과 제출
```

파일을 읽고 수정하는 역할은 Codex, Claude 또는 VS Code의 agent가 맡습니다. Prolog는 작업 이력과 검사 결과를 저장하고 조회합니다.

## 설치

[Conda](https://docs.conda.io/projects/conda/en/stable/user-guide/install/index.html), [Git](https://git-scm.com/downloads), [VS Code](https://code.visualstudio.com/)를 먼저 설치합니다. Windows, macOS, Linux에서 아래 순서로 실행하세요. 이미 저장소를 받았다면 해당 폴더에서 Conda 명령부터 시작합니다.

```bash
git clone --branch onboarding_training_auto https://github.com/Nor-ter/cubspace_proto.git
cd cubspace_proto
conda env create -f environment.yml
conda activate cubspace
node scripts/setup-environment.mjs codex
conda deactivate
conda activate cubspace
npm run environment:check
code .
```

설치 명령의 `codex`는 사용할 도구에 맞게 바꿉니다. **하나만 선택하면 됩니다.**

| 도구                      | 설치 인수 | 로그인                               |
| ------------------------- | --------- | ------------------------------------ |
| Codex CLI                 | `codex`   | `codex login`                        |
| Claude Code CLI           | `claude`  | `claude auth login`                  |
| VS Code Chat (Copilot 등) | `vscode`  | VS Code에서 사용하는 서비스에 로그인 |

Node.js, SWI-Prolog, 선택한 CLI와 Chromium은 `cubspace` 환경에 설치합니다. 프로젝트 라이브러리는 `node_modules`, VS Code 확장은 편집기에서 관리합니다. 기존 환경을 갱신하거나 설치 문제가 생기면 [환경 설정](docs/environment.md)을 참고하세요.

VS Code 확장은 **Codex** (`openai.chatgpt`), **Claude Code** (`anthropic.claude-code`), **Copilot Chat** (`GitHub.copilot-chat`) 중 사용하는 것을 설치하면 됩니다. **ClickUp** (`edsol.clickup`)은 편집기에서 task를 찾아볼 때 선택적으로 사용합니다. `code .`가 실행되지 않으면 VS Code의 **파일 → 폴더 열기**로 저장소를 여세요.

## 웹사이트 실행

```bash
conda activate cubspace
npm run dev
```

터미널에 표시된 주소를 엽니다. 기본 주소는 <http://localhost:3000>입니다. <http://localhost:3000/?admin=1>에서는 모든 학습 페이지를 미리 볼 수 있습니다. 이 옵션은 교육용 잠금 해제 기능이며 로그인 기능은 아닙니다. 서버를 종료하려면 `Ctrl+C`를 누릅니다.

웹사이트만 실행할 때는 LLM 계정이 필요 없습니다.

## Agent로 작업하기

1. `ticket.json`에 작업 내용, 수정할 경로, 완료 기준을 적습니다.
2. `workflow/config.json`의 검사 명령을 확인합니다. 현재 설정은 온보딩 웹사이트와 Prolog를 검사합니다.
3. `cubspace` 환경에서 실행합니다.

```bash
npm run ticket -- agents
npm run ticket -- run
```

`agents`는 사용할 agent를 보여줍니다. 기본값 `agent: "auto"`는 활성 Conda 환경에 설치되고 로그인된 Codex를 먼저 확인하고, 없으면 Claude를 사용합니다. 둘 다 없으면 VS Code Chat에 첨부할 `*.prompt.md`를 생성한 뒤 대기합니다. 직접 선택하려면 `workflow/config.json`의 `agent`를 `codex`, `claude`, `vscode`로 설정하세요. 모델은 해당 CLI 설정이나 VS Code에서 선택한 값을 따릅니다.

VS Code Chat을 사용할 때는 생성된 파일을 첨부하고 `ticket-implementer`로 작업합니다. 구현 후 아래 명령을 실행하면 검사와 리뷰를 준비합니다. 리뷰는 **새 Chat 세션**에서 `ticket-reviewer`로 진행하고, 안내에 따라 결과 JSON을 등록합니다. Copilot을 포함한 모델 사용 권한은 로그인한 서비스와 계정에 따라 달라집니다.

```bash
npm run ticket -- continue RUN_ID
```

검사나 리뷰에서 문제가 발견되면 수정한 뒤 같은 `RUN_ID`로 이어갑니다.

## ClickUp 연결

VS Code 확장의 토큰은 **명령 팔레트 → `ClickUp: Set token`**에서 설정합니다. 터미널에 입력하는 명령이 아닙니다.

CLI는 별도로 프로젝트 루트의 `.clickup.env`를 사용합니다. 이 파일에 `CLICKUP_API_TOKEN=본인의토큰` 한 줄을 작성하세요. 이미 입력했다면 추가 설정은 필요 없습니다. 파일은 Git에서 제외하며, 확장에 저장한 토큰을 CLI가 자동으로 가져오지는 않습니다.

```bash
npm run ticket -- start TASK_ID
```

ClickUp task의 제목과 설명을 가져와 구현부터 리뷰까지 실행합니다. 작업 범위와 완료 기준은 `ticket.json`을 사용하므로 시작 전에 해당 task에 맞게 수정하세요. 가져오기만 하려면 `npm run ticket -- clickup TASK_ID`를 실행합니다.

완료 후 `workflow/runs/RUN_ID/report.md`를 확인하고 원본 task에 댓글로 제출합니다.

```bash
npm run ticket -- submit RUN_ID
```

현재 코드의 검사와 리뷰가 통과한 경우에만 제출합니다. 같은 실행의 중복 제출은 로컬 기록으로 방지합니다. 전송 결과가 불확실하면 재전송하지 않고 멈추므로 ClickUp에서 먼저 확인하세요. Task 상태는 자동으로 변경하지 않으며, `submit`을 실행하기 전에는 결과를 게시하지 않습니다.

Git에 반영할 때도 검사를 통과한 실행 ID를 사용합니다.

```bash
npm run ticket -- commit RUN_ID
npm run ticket -- push RUN_ID
```

## 파일 구조

| 위치                                             | 용도                                        |
| ------------------------------------------------ | ------------------------------------------- |
| `ticket.json`, `workflow/config.json`            | 작업 입력, agent 선택, 검사 명령            |
| `mds/`, `workflow/runs/`                         | 작업 문서, 검사·리뷰 결과, 실행 시간 보고서 |
| `prolog/`                                        | workflow 이력과 조회 규칙, 온보딩 교육 예제 |
| `scripts/`, `tests/`                             | 자동화 코드와 테스트                        |
| `app/`, `components/`, `src/`, `lib/`, `public/` | 온보딩 웹사이트                             |
| `AGENTS.md`, `CLAUDE.md`, `.claude/`, `.github/` | agent별 작업 지침                           |
| `.vscode/`, `docs/`                              | VS Code 작업 명령과 상세 문서               |

`.workflow/`에는 제출·커밋 기록과 로컬 화면 검사 결과를 저장합니다. 이 폴더와 `node_modules`, 빌드 캐시, 토큰 파일은 Git에 포함하지 않습니다. 과거 작업 문서와 보고서는 이력으로 보관합니다.

개별 검사는 `npm test`, `npm run test:prolog`, `npm run lint`, `npm run typecheck`, `npm run build`로 실행합니다. 개발 서버가 켜진 상태에서는 `npm run test:browser`로 화면도 검사할 수 있습니다.

[환경 설정](docs/environment.md) · [workflow 상세와 다른 프로젝트에 적용하기](docs/workflow.md) · [공학 검토](docs/engineering-review.md) · [퀴즈 작성](docs/quiz-authoring.md)

온보딩 교육 예제와 자동 리뷰는 실제 위성 설계의 공학적 승인을 대신하지 않습니다.
