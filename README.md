# CubSpace 작업 자동화와 온보딩 예제

작업 카드를 읽는 LLM 에이전트가 구현하고, 별도 LLM 세션이 검토한 뒤 결과를 남기는 개발 흐름입니다. 이 저장소의 적용 사례는 한국어 CubeSat 온보딩 웹사이트입니다. 작업 내용과 검사 명령을 바꾸면 문서 작성, 데이터 분석 등 다른 Git 기반 작업에도 사용할 수 있습니다.

```text
ClickUp 작업 또는 ticket.json
  → 작업 문서 → LLM 구현 → 검사 → 독립 LLM 리뷰
  → Prolog 이력·결과 보고서 → ClickUp 결과 제출
```

Prolog는 이전 작업의 사실과 검사 이력을 저장합니다. 작업을 이해하고 파일을 수정하는 주체는 Codex, Claude 또는 VS Code에서 선택한 에이전트입니다.

## 설치

macOS 또는 Linux 터미널에서 실행합니다. Windows는 [WSL 안내](docs/environment.md)를 따릅니다. 이미 저장소가 있으면 해당 폴더에서 Conda 명령부터 실행하세요.

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

`code .` 명령이 없다면 VS Code의 **파일 → 폴더 열기**에서 저장소 폴더를 선택하세요.

설치 명령의 마지막 값은 **하나만 선택**합니다.

| 사용할 에이전트          | 설치 인수 | 로그인                           |
| :----------------------- | :-------- | :------------------------------- |
| Codex                    | `codex`   | 터미널에서 `codex login`         |
| Claude Code              | `claude`  | 터미널에서 `claude auth login`   |
| VS Code Chat, Copilot 등 | `vscode`  | VS Code에서 해당 서비스에 로그인 |

Node.js, SWI-Prolog, 선택한 CLI와 Chromium은 `cubspace` 환경에 설치됩니다. 앱 의존성은 프로젝트의 `node_modules`에 둡니다. VS Code 확장은 편집기에 설치합니다. 기존 환경은 `conda env update -n cubspace -f environment.yml`로 갱신합니다.

권장 확장은 Codex (`openai.chatgpt`), Claude Code (`anthropic.claude-code`), Copilot Chat (`GitHub.copilot-chat`) 중 사용하는 것 하나입니다. ClickUp (`edsol.clickup`)은 작업 탐색용 선택 사항입니다. 현재 이 컴퓨터에는 Codex·Claude·ClickUp 확장이 설치돼 있습니다. 웹사이트만 실행한다면 LLM 계정이 필요 없습니다.

## 웹사이트 실행

```bash
conda activate cubspace
npm run dev
```

터미널에 표시된 주소를 엽니다. 기본은 <http://localhost:3000>, 전체 학습 페이지 미리보기는 <http://localhost:3000/?admin=1>입니다. `admin=1`은 교육용 잠금 해제이며 사용자 인증 기능은 아닙니다. 종료는 `Ctrl+C`입니다.

## 작업 실행

1. `ticket.json`에 작업 내용, 수정할 경로와 완료 기준을 적습니다.
2. `workflow/config.json`에서 검사 명령을 확인합니다. 현재는 웹사이트·Prolog 검사입니다.
3. 같은 Conda 터미널에서 실행합니다.

```bash
npm run ticket -- agents
npm run ticket -- run
```

기본 `agent: "auto"`는 로그인된 Codex, 다음으로 Claude를 확인합니다. 둘 다 사용할 수 없으면 VS Code Chat에 첨부할 `*.prompt.md` 경로를 출력하고 대기합니다. 명시적으로 선택하려면 `workflow/config.json`의 `agent`를 `codex`, `claude`, `vscode` 중 하나로 바꿉니다. 모델을 강제 지정하지 않으므로 CLI 설정 또는 VS Code에서 선택한 모델을 사용합니다.

**VS Code 경로:** 출력된 파일을 Chat에 첨부하고 `ticket-implementer`로 실행합니다. 구현 후 `continue` 명령이 검사와 리뷰 지침을 준비합니다. 리뷰는 새 세션의 `ticket-reviewer`로 실행하고 안내된 JSON 등록 명령을 따릅니다. Copilot은 GitHub 로그인이 필요하며, VS Code가 계정 없이 모델을 자동 제공하는 것은 아닙니다.

검사나 리뷰에 실패하면 문제를 수정한 뒤 같은 실행 ID로 이어갑니다.

```bash
npm run ticket -- continue RUN_ID
```

## ClickUp 연결과 결과 제출

VS Code 명령 팔레트 **⌘⇧P**(Windows **Ctrl+Shift+P**)의 `ClickUp: Set token`은 확장용 설정입니다. 터미널 명령이 아닙니다.

CLI 가져오기·제출은 로컬 `.clickup.env`의 `CLICKUP_API_TOKEN`을 사용합니다. 이미 입력했다면 그대로 사용하세요. 새 컴퓨터에서는 이 파일에 `CLICKUP_API_TOKEN=본인의토큰` 한 줄을 작성합니다. Git에서 제외되며 토큰 예제 파일은 필요 없습니다. 기존 ClickUp 확장에 저장한 토큰을 CLI가 자동으로 읽는 기능은 없습니다.

```bash
npm run ticket -- start TASK_ID
```

작업 카드의 제목·설명을 읽고 구현부터 리뷰까지 진행합니다. 범위와 완료 기준은 `ticket.json`을 사용하므로 시작 전에 해당 작업에 맞게 정리하세요. 가져오기만 하려면 `npm run ticket -- clickup TASK_ID`를 사용합니다.

출력된 실행 ID의 `workflow/runs/RUN_ID/report.md`를 확인한 뒤 결과를 원본 작업의 댓글로 제출합니다.

```bash
npm run ticket -- submit RUN_ID
```

현재 코드의 검사·리뷰가 통과해야 제출됩니다. 제출 기록이 있으면 같은 댓글을 다시 보내지 않습니다. 응답이 끊겨 성공 여부가 불명확하면 원본 작업을 확인하도록 멈춥니다. 작업 상태를 임의로 완료 처리하지 않습니다. 계정이 연결됐더라도 `submit`을 실행하기 전에는 외부에 결과를 게시하지 않습니다.

Git 반영도 검증된 실행 ID로 수행합니다.

```bash
npm run ticket -- commit RUN_ID
npm run ticket -- push RUN_ID
```

## 파일과 결과

| 위치                                             | 내용                                         |
| :----------------------------------------------- | :------------------------------------------- |
| `ticket.json`, `workflow/config.json`            | 작업 입력, 에이전트 선택과 검사 명령         |
| `mds/`, `workflow/runs/`                         | 작업 문서, 검사·리뷰 결과와 소요 시간 보고서 |
| `prolog/`                                        | 실행 이력·질의 규칙과 온보딩 교육 예제       |
| `scripts/`, `tests/`                             | 자동화 실행 코드와 회귀 검사                 |
| `app/`, `components/`, `src/`, `lib/`, `public/` | 온보딩 웹사이트와 사용하는 자산              |
| `AGENTS.md`, `CLAUDE.md`, `.claude/`, `.github/` | 도구별 LLM 역할 지침                         |
| `.vscode/`, `docs/`                              | 작업 단축 명령과 상세 문서                   |

`.workflow/`는 제출·커밋 영수증과 로컬 화면 검사 결과입니다. `node_modules`, 빌드 캐시와 비밀 파일도 Git에 포함하지 않습니다. 과거 작업 문서는 추적 근거로 보존합니다.

직접 검사는 `npm test`, `npm run test:prolog`, `npm run lint`, `npm run typecheck`, `npm run build`입니다. 개발 서버가 켜진 상태에서 `npm run test:browser`로 화면을 검사합니다.

[환경 설정](docs/environment.md) · [실행 규약과 다른 작업에 적용하기](docs/workflow.md) · [공학 검토](docs/engineering-review.md) · [퀴즈 작성](docs/quiz-authoring.md)

온보딩 화면의 교육 예시와 자동 리뷰는 실제 위성 설계의 공학적 승인을 대신하지 않습니다.
