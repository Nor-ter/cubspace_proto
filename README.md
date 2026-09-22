# CubSpace

ClickUp task나 `ticket.json`을 받아 LLM agent가 작업하고, 별도 세션에서 리뷰한 뒤 결과를 보고하는 workflow입니다. 이 저장소에서는 **CubeSat 온보딩 웹사이트 개발**을 예제로 사용합니다. 작업 범위와 검사 명령을 바꾸면 문서 작성이나 데이터 분석 등 다른 Git 기반 프로젝트에도 적용할 수 있습니다.

```text
ClickUp / ticket.json
  → 작업 문서 → 구현 → 자동 검사 → 독립 리뷰
  → 보고서 + Prolog 이력 → Git commit/push → ClickUp taskcard 게시
```

Codex, Claude 또는 VS Code의 agent가 자료를 읽고 파일을 수정합니다. Engineering 지식과 추론, 계산, 문헌 조사를 활용할 수 있으며 결론은 출처와 검사 결과로 뒷받침합니다. Prolog는 작업 이력과 검사 결과를 저장하고 조회합니다.

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

## Agent로 작업하기

1. `ticket.json`에 작업 ID, 내용, 수정할 경로, 완료 기준을 적습니다. ID는 `CUB-100`처럼 사용하며 날짜를 붙이지 않습니다.
2. `workflow/config.json`의 검사 명령을 확인합니다. 현재 설정은 온보딩 웹사이트와 Prolog를 검사합니다.
3. `cubspace` 환경에서 실행합니다.

```bash
npm run ticket -- agents
npm run ticket -- run
```

`agents`는 사용할 agent를 보여줍니다. 기본값 `agent: "auto"`는 활성 Conda 환경에 설치되고 로그인된 Codex를 먼저 확인하고, 없으면 Claude를 사용합니다. 둘 다 없으면 VS Code Chat에 첨부할 `*.prompt.md`를 생성한 뒤 대기합니다. 직접 선택하려면 `workflow/config.json`의 `agent`를 `codex`, `claude`, `vscode`로 설정하세요. 모델은 해당 CLI 설정이나 VS Code에서 선택한 값을 따릅니다.

현재 웹사이트 설정은 `evidence.browser: true`이므로 `run`이나 `start`가 screenshot을 기다리며 리뷰 전에 멈출 수 있습니다. `npm run dev`로 개발 서버를 켜고, 별도 터미널에서 아래 순서로 이어가세요. `CUB-100`은 출력된 작업 ID로 바꿉니다.

```bash
npm run ticket -- evidence CUB-100
npm run ticket -- continue CUB-100
```

Screenshot을 만들기 전에도 `report.md`에서 현재 진행 상태를 확인할 수 있습니다.

VS Code Chat을 사용할 때는 생성된 파일을 첨부하고 `ticket-implementer`로 작업합니다. 구현 후 같은 순서로 evidence를 만들고 검사와 리뷰를 준비합니다. 리뷰는 **새 Chat 세션**에서 `ticket-reviewer`로 진행하고, 안내에 따라 결과 JSON을 등록합니다. Copilot을 포함한 모델 사용 권한은 로그인한 서비스와 계정에 따라 달라집니다.

검사나 리뷰에서 문제가 발견되면 수정한 뒤 같은 ID로 이어갑니다. 새 작업은 `CUB-101`처럼 ID를 바꿉니다. 같은 ID의 작업을 다시 생성하지 말고 `continue`로 수정합니다.

## ClickUp 연결

VS Code의 **Extensions**에서 `edsol.clickup`을 검색하거나 터미널에서 설치합니다.

```bash
code --install-extension edsol.clickup
```

**Command Palette**를 열고 **`ClickUp: Set token`**을 선택해 토큰을 입력합니다. 단축키는 macOS에서 `Cmd+Shift+P`, Windows/Linux에서 `Ctrl+Shift+P`입니다. **`ClickUp: Set token`은 터미널 명령이 아닙니다.**

확장은 VS Code의 task UI용입니다. CLI의 API 가져오기·게시 기능은 확장 없이도 실행되며, 별도의 `.clickup.env` 파일을 사용합니다. 프로젝트 루트에 `CLICKUP_API_TOKEN=본인의토큰` 한 줄을 작성하세요. 이 파일은 Git에서 제외합니다. 이미 입력했다면 그대로 사용하면 됩니다. 확장에 저장한 토큰과 CLI 토큰은 자동 공유되지 않습니다.

```bash
npm run ticket -- start TASK_ID
```

ClickUp task의 제목과 설명을 가져와 작업을 시작합니다. Screenshot이 없으면 위의 `evidence → continue` 순서로 리뷰를 이어갑니다. 범위와 완료 기준은 시작 전에 `ticket.json`에서 맞춰주세요. 가져오기만 하려면 `npm run ticket -- clickup TASK_ID`를 사용합니다.

로컬 `ticket.json`으로 시작한 작업은 설정된 parent task 아래에 게시합니다. 현재 예제는 **Task → Perform task card** 아래의 **[CUB-100](https://app.clickup.com/t/14ynqxyyzx6)**을 갱신하며 status를 **review**로 설정합니다. 카드 이름은 ticket ID를 그대로 사용합니다.

## 결과 확인과 게시

웹사이트 변경은 `npm run dev`로 확인합니다. 개발 서버를 실행한 상태에서 별도 터미널로 screenshot과 HTML report를 만듭니다.

```bash
npm run ticket -- evidence CUB-100
```

HTML은 브라우저에서 직접 열 수 있는 독립 파일입니다. 실제 browser check 결과와 screenshot을 확인한 뒤 `continue CUB-100`으로 코드 검사와 독립 리뷰를 진행하세요. 리뷰 후 `npm run ticket -- report CUB-100`을 실행하면 최신 결과를 반영한 HTML preview를 볼 수 있습니다. 게시할 때도 통과한 검사·리뷰 결과로 HTML을 갱신합니다.

| 확인할 결과                     | 로컬 위치                                                                           |
| ------------------------------- | ----------------------------------------------------------------------------------- |
| 작업 내용과 완료 기준           | `ticket.json`, `mds/CUB-100.md`                                                     |
| 변경 설명과 남은 문제           | `workflow/runs/CUB-100/implementation.md`, `git diff`                               |
| 검사 결과와 실행 시간           | `workflow/runs/CUB-100/report.md`                                                   |
| 독립 리뷰                       | `workflow/runs/CUB-100/review.json`                                                 |
| Browser check와 screenshot 목록 | `workflow/runs/CUB-100/browser-results.json`, `workflow/runs/CUB-100/evidence.json` |
| Screenshot 파일                 | `workflow/runs/CUB-100/screenshots/`                                                |
| 브라우저에서 열 HTML report     | `.workflow/results/CUB-100/CUB-100.html`                                            |
| 게시할 parent task와 status     | `workflow/config.json`의 `clickup`                                                  |

**수정이 필요하면** 같은 CUB-100 작업에서 내용을 수정하고 검사·리뷰를 다시 실행합니다. 화면이 바뀌었으면 `evidence`도 다시 생성하세요.

```bash
npm run ticket -- continue CUB-100
```

**결과가 준비되면** 보고서, screenshot, 독립 리뷰를 확인한 뒤 commit과 push를 실행합니다.

```bash
npm run ticket -- commit CUB-100
npm run ticket -- push CUB-100
```

VS Code Chat 리뷰는 새 세션에서 실행하고 안내된 JSON을 등록합니다. 실패한 리뷰를 수동으로 통과 처리하지 마세요. 이미 commit한 뒤 수정했더라도 다시 검사·리뷰하고 새 commit을 만들면 됩니다.

`push`는 Git push 성공 후 ClickUp에 다음 내용을 게시합니다.

- **Taskcard:** 이름 `CUB-100`, 작업 설명, 검사·리뷰 결과, 실행 시간, commit과 결과 파일 링크.
- **첨부 파일:** 독립 실행 HTML report와 선택한 실제 screenshot.
- **Status:** `review`. 사람이 최종 승인했다는 의미는 아닙니다.

기존 CUB-100 카드를 갱신하며 중복 생성하지 않습니다. ClickUp에서 가져온 작업은 원본 task에 결과 댓글을 제출합니다. 게시 후에는 원격 Git commit과 ClickUp 카드의 이름, status, 첨부 파일을 다시 확인합니다. **코드 리뷰 통과와 실제 게시 완료는 별도로 확인합니다.**

일반 `git push`나 VS Code Git Sync는 ClickUp 게시를 실행하지 않습니다. VS Code의 **Git push와 ClickUp 게시** 작업을 사용하거나 위 명령을 실행하세요. 자동 게시를 끄려면 `clickup.publish_on_push`를 `false`로 설정합니다.

Git push는 성공했지만 ClickUp 게시가 실패했다면 새 작업을 만들지 말고 게시만 재시도합니다.

```bash
npm run ticket -- submit CUB-100
```

전송 성공 여부가 불확실하면 먼저 원격 task를 확인합니다. 카드 게시 기록은 `.workflow/taskcards/CUB-100.json`, 첨부 기록은 `.workflow/attachments/CUB-100.json`에 저장합니다. 토큰이나 인증 파일, 전체 저장소를 첨부하지 않습니다.

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

`.workflow/`에는 제출·커밋 기록과 로컬 화면 검사 결과를 저장합니다. 이 폴더와 `node_modules`, 빌드 캐시, 토큰 파일은 Git에 포함하지 않습니다. `mds/`에는 현재 작업인 `CUB-100.md`만 둡니다. 이전 작업 문서는 Git history에서, 실행 이력은 `workflow/runs/`에서 확인합니다.

개별 검사는 `npm test`, `npm run test:prolog`, `npm run lint`, `npm run typecheck`, `npm run build`로 실행합니다. 개발 서버가 켜진 상태에서는 `npm run test:browser`로 화면도 검사할 수 있습니다.

[환경 설정](docs/environment.md) · [workflow 상세와 다른 프로젝트에 적용하기](docs/workflow.md) · [공학 검토](docs/engineering-review.md) · [퀴즈 작성](docs/quiz-authoring.md)

Agent는 engineering 분석과 설계 검토를 지원합니다. 실제 위성 설계의 formal sign-off는 해당 프로젝트의 승인 절차를 따릅니다.
