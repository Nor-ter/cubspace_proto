# CubSpace

Task를 읽은 LLM agent가 작업하고, 별도 세션에서 리뷰한 뒤 HTML 보고서를 만드는 workflow입니다. **CubeSat 온보딩 웹사이트 개발**을 reference로 사용하며, 작업 범위와 검사 명령을 바꾸면 문서 작성이나 데이터 분석에도 적용할 수 있습니다.

```text
inputs/ticket.json → 구현 → 검사 → 독립 리뷰
                  → outputs/<ID>/ → Git commit/push → ClickUp submit
```

Codex, Claude 또는 VS Code의 agent가 자료를 읽고 파일을 수정합니다. Engineering 지식과 추론, 계산, 문헌 조사를 활용하며 결론은 출처와 검사 결과로 뒷받침합니다. Prolog는 작업 이력과 검사 결과를 저장하고 조회합니다.

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

VS Code 확장은 **Codex** (`openai.chatgpt`), **Claude Code** (`anthropic.claude-code`), **Copilot Chat** (`GitHub.copilot-chat`) 중 사용하는 것을 설치하면 됩니다. VS Code에서 ClickUp task UI를 사용하려면 **ClickUp** (`edsol.clickup`) 확장도 설치하세요. `code .`가 실행되지 않으면 VS Code의 **파일 → 폴더 열기**로 저장소를 여세요.

## 웹사이트 실행

```bash
conda activate cubspace
npm run dev
```

터미널에 표시된 주소를 엽니다. 기본 주소는 <http://localhost:3000>입니다. <http://localhost:3000/?admin=1>에서는 모든 학습 페이지를 미리 볼 수 있습니다. 이 옵션은 교육용 잠금 해제 기능이며 로그인 기능은 아닙니다. 서버를 종료하려면 `Ctrl+C`를 누릅니다.

웹사이트만 실행할 때는 LLM 계정이 필요 없습니다.

## 입력과 결과

일상적인 작업에서는 두 폴더를 사용합니다.

| 위치                    | 용도                                                                          |
| ----------------------- | ----------------------------------------------------------------------------- |
| `inputs/reference.json` | **CUB REF**: 실제 reference task의 기준 입력. 다음 작업을 만들 때 사용합니다. |
| `inputs/ticket.json`    | 현재 작업의 내용, 수정 경로, 완료 기준. 작업마다 편집합니다.                  |
| `outputs/<ID>/`         | 해당 작업의 입력 snapshot, 작업 문서, 검사·리뷰, HTML와 screenshot            |
| `outputs/archive/`      | 이전 실행 결과. 원래 작업 ID와 이력을 유지합니다.                             |

**[CUB REF](https://app.clickup.com/t/14ynqxyyzx6)는 이 workflow로 수행한 온보딩 웹사이트 reference task입니다.** 기존 CUB-100 카드를 이어 사용하며, 기준 입력은 `inputs/reference.json`에 보관합니다. 과거 CUB-100 실행 기록은 당시 이름 그대로 archive에 남깁니다. 새 작업은 reference와 별도의 ID 및 결과 폴더를 사용합니다.

## Agent로 작업하기

모든 작업은 **`CUB XXX`** 형식으로 이름을 정합니다. 아래 명령의 `XXX`를 실제 작업 번호로 바꿔 실행하세요. `XXX`는 `001`, `002`부터 이어지는 세 자리 작업 번호입니다. ID에는 공백을 사용합니다. CLI에서는 ID를 따옴표로 감싸세요.

새 작업을 시작할 때는 먼저 reference에서 입력을 만듭니다. 저장소에 포함된 완료 작업을 다시 `run`하지 마세요.

```bash
npm run ticket -- new "CUB XXX" "작업 제목"
```

이 명령은 `inputs/ticket.json`만 준비하고 reference와 이전 결과는 보존합니다. 현재 입력에 저장하지 않은 변경이 있으면 덮어쓰지 않고 멈춥니다.

1. `inputs/ticket.json`에 작업 내용, 수정 경로, 완료 기준을 적습니다.
2. `workflow/config.json`의 검사 명령을 확인합니다. 현재 설정은 웹사이트와 Prolog를 검사합니다.
3. `cubspace` 환경에서 시작합니다.

```bash
npm run ticket -- agents
npm run ticket -- run
```

`run`은 입력을 `outputs/<ID>/ticket.json`에 저장하고 작업을 시작합니다. 기본 agent는 로그인된 Codex를 먼저 확인하고, 없으면 Claude를 사용합니다. 둘 다 없으면 VS Code Chat용 prompt 파일을 만들고 대기합니다. `workflow/config.json`에서 `codex`, `claude`, `vscode`를 직접 선택할 수도 있습니다. 모델은 CLI 설정이나 VS Code에서 선택한 값을 따릅니다.

VS Code에서는 prompt를 첨부해 `ticket-implementer`로 작업합니다. 리뷰는 **새 Chat 세션**의 `ticket-reviewer`로 실행하고 결과 JSON을 등록합니다. 모델 사용 권한은 로그인한 서비스와 계정에 따라 달라집니다.

웹사이트 작업은 screenshot이 없으면 리뷰 전에 멈출 수 있습니다. `npm run dev`로 서버를 켠 뒤 별도 터미널에서 이어갑니다.

```bash
npm run ticket -- evidence "CUB XXX"
npm run ticket -- continue "CUB XXX"
npm run ticket -- report "CUB XXX"
```

`continue`는 해당 작업의 저장된 입력을 사용합니다. 현재 `inputs/ticket.json`을 바꿔도 과거 실행에 자동 적용되지 않습니다. 진행 중인 작업의 요구사항을 바꾸려면 입력을 수정한 뒤 명시적으로 반영하세요. 입력 ID가 일치해야 하며 기존 리뷰는 다시 받아야 합니다.

```bash
npm run ticket -- revise "CUB XXX"
npm run ticket -- continue "CUB XXX"
```

화면이 바뀌면 `continue` 전에 `evidence`도 다시 생성합니다. 다음 작업은 새 번호로 `new`를 실행해 시작하세요.

## 결과 확인과 게시

| 확인할 결과                 | 위치 (`<ID>`는 작업 ID)                              |
| --------------------------- | ---------------------------------------------------- |
| 저장된 입력과 작업 문서     | `outputs/<ID>/ticket.json`, `task.md`                |
| 진행 상태와 구현 설명       | `outputs/<ID>/state.json`, `implementation.md`       |
| 보고서                      | `outputs/<ID>/report.html`, `report.md`              |
| 독립 리뷰                   | `outputs/<ID>/review.json`                           |
| 화면 검사와 screenshot 목록 | `outputs/<ID>/browser-results.json`, `evidence.json` |
| Screenshot                  | `outputs/<ID>/screenshots/`                          |

HTML을 열고 검사 결과, screenshot, 리뷰를 확인합니다. 아직 완료되지 않은 작업도 Markdown 보고서에서 상태를 확인할 수 있습니다. 공유용 HTML은 이미지를 포함한 독립 파일이며 외부 폰트를 불러오지 않습니다. 재검사 전의 통과 HTML은 `outputs/<ID>/history/`에 보관합니다. HTML과 screenshot은 로컬 생성 파일로 Git에 포함하지 않으며 ClickUp에 첨부합니다. 다른 checkout에서는 `evidence`와 `report`로 다시 생성하세요.

수정이 필요하면 같은 작업에서 고치고 다시 검사·리뷰합니다. 준비가 되면 Git에 반영하고 ClickUp에 결과를 제출합니다.

```bash
npm run ticket -- commit "CUB XXX"
npm run ticket -- push "CUB XXX" --git-only
npm run ticket -- submit "CUB XXX"
```

현재 기본값은 `clickup.publish_on_push: false`입니다. **Git push와 ClickUp submit은 별도 단계입니다.** `--git-only`는 이전 설정에서 자동 게시가 켜져 있어도 Git만 반영합니다. ClickUp까지 제출하는 작업은 두 단계를 모두 수행하고 원격 Git commit과 카드·HTML·screenshot을 확인합니다. 코드 리뷰 통과와 실제 게시 완료는 별도로 확인합니다.

## ClickUp 연결

VS Code의 **Extensions**에서 `edsol.clickup`을 검색하거나 터미널에서 설치합니다.

```bash
code --install-extension edsol.clickup
```

**Command Palette → `ClickUp: Set token`**에서 토큰을 입력합니다. 단축키는 macOS에서 `Cmd+Shift+P`, Windows/Linux에서 `Ctrl+Shift+P`입니다. **`ClickUp: Set token`은 터미널 명령이 아닙니다.**

확장은 VS Code task UI용입니다. CLI의 API 가져오기·게시 기능은 확장 없이도 실행되며, 프로젝트 루트의 `.clickup.env`에 `CLICKUP_API_TOKEN=본인의토큰`을 저장합니다. 파일은 Git에서 제외합니다. 확장과 CLI의 토큰은 자동 공유되지 않습니다.

```bash
npm run ticket -- start TASK_ID
```

ClickUp의 제목과 설명을 가져와 시작합니다. 범위와 완료 기준은 `inputs/ticket.json`에서 준비하세요. 가져오기만 하려면 `npm run ticket -- clickup TASK_ID`를 사용합니다.

검사와 리뷰를 통과한 작업을 ClickUp에 게시할 때 사용합니다. `XXX`를 실제 작업 번호로 바꾸세요.

```bash
npm run ticket -- submit "CUB XXX"
```

로컬 작업은 설정된 parent task 아래에 taskcard를 생성·갱신하고, ClickUp에서 시작한 작업은 원본 task에 결과 댓글을 남깁니다. 게시 내용은 작업 설명, 검사·리뷰 결과, 실행 시간, Git 링크와 HTML·선택한 screenshot입니다. 로컬 카드 이름은 ticket ID이며 status는 설정된 `review`를 사용합니다. 이는 사람의 최종 승인을 의미하지 않습니다.

게시 후 실제 task와 첨부 파일을 확인합니다. 토큰, 인증 파일, 전체 저장소는 첨부하지 않습니다. 전송 결과가 불확실하면 먼저 원격 task를 확인하고 재시도하세요.

## 프로젝트 구조

`inputs/`와 `outputs/`는 작업용 폴더입니다. 아래 파일은 도구와 웹사이트 실행에 필요한 표준 프로젝트 구조로 유지합니다.

| 위치                                              | 용도                               |
| ------------------------------------------------- | ---------------------------------- |
| `workflow/`                                       | agent 선택, 검사 명령, 리뷰 schema |
| `scripts/`, `tests/`                              | 자동화 코드와 테스트               |
| `prolog/`                                         | 작업 이력과 조회 규칙, 교육 예제   |
| `app/`, `components/`, `src/`, `lib/`, `public/`  | 온보딩 웹사이트                    |
| `AGENTS.md`, `CLAUDE.md`, `.claude/`, `.github/`  | agent 지침                         |
| `.vscode/`, `docs/`                               | VS Code 작업 명령과 문서           |
| `package.json`, `environment.yml`, 기타 root 설정 | Node.js, Conda, 빌드 설정          |

`.workflow/`는 로컬 commit·게시 기록을 보관합니다. 이 폴더와 `node_modules`, 빌드 캐시, 토큰 파일은 Git에서 제외합니다.

개별 검사는 `npm test`, `npm run test:prolog`, `npm run lint`, `npm run typecheck`, `npm run build`로 실행합니다. 개발 서버가 켜져 있으면 `npm run test:browser`로 화면을 검사할 수 있습니다.

[환경 설정](docs/environment.md) · [workflow 상세](docs/workflow.md) · [공학 검토](docs/engineering-review.md) · [퀴즈 작성](docs/quiz-authoring.md)

Agent는 engineering 분석과 설계 검토를 지원합니다. 실제 위성 설계의 formal sign-off는 프로젝트 승인 절차를 따릅니다.
