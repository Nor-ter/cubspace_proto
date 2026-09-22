# CubSpace 온보딩

CubeSat의 임무, 구성요소, 시스템 모델과 검증 근거를 한국어로 학습하는 웹 앱입니다. 교육용 3D 모델, ADCS 설명, 퀴즈와 Prolog 학습 자료를 포함합니다. 실제 비행 시뮬레이터나 기술 인증 도구는 아닙니다.

## 1. 하나의 Conda 환경 사용

macOS 또는 Linux 터미널에서 실행합니다. Windows는 먼저 [WSL 환경 설정](docs/environment.md#플랫폼별-설치-방식)을 확인하고 WSL 터미널에서 같은 명령을 사용하세요. 저장소를 내려받아 `package.json`과 `environment.yml`이 있는 폴더에서 실행합니다.

```bash
git clone --branch onboarding_training_auto https://github.com/Nor-ter/cubspace_proto.git
cd cubspace_proto
conda env create -f environment.yml
conda activate cubspace
node scripts/setup-environment.mjs
conda deactivate
conda activate cubspace
npm run environment:check
```

`conda env create`는 `conda create -n cubspace`와 패키지 설치를 하나의 환경 파일로 묶은 명령입니다. Node.js, npm, SWI-Prolog와 에이전트 CLI는 `cubspace` 환경 안에 설치합니다. 앱 의존성인 `node_modules`는 저장소에 두고 이 환경의 Node.js로 실행합니다. VS Code와 확장은 편집기에 설치되므로 Conda 환경과 별개입니다.

환경이 이미 있으면 `conda env update -n cubspace -f environment.yml`을 사용합니다. 플랫폼별 설치 방식과 실제 확인한 버전은 [환경 설정](docs/environment.md)을 참고하세요.

설치 스크립트는 macOS와 Linux용입니다. Windows는 [환경 설정의 WSL 절차](docs/environment.md#플랫폼별-설치-방식)를 사용합니다. 아래 PowerShell 참고는 기존 Windows Node 환경을 사용하는 경우에 해당합니다.

Windows에서 `conda activate`가 안 되면 Anaconda Prompt를 사용하거나 `conda init powershell` 후 터미널을 다시 여세요. `npm.ps1` 정책 오류가 나면 `npm.cmd`를 사용합니다. 관리자 권한은 필요하지 않습니다.

## 2. VS Code에서 열고 실행

활성화한 터미널에서 편집기를 엽니다.

```powershell
code .
```

이미 저장소가 있다면 **VS Code → 파일 → 폴더 열기**에서 `package.json`이 있는 폴더를 선택합니다. `code` 명령이 없어도 이 방법으로 열 수 있습니다.

VS Code에서 **터미널 → 새 터미널**을 연 뒤 실행합니다. 새 터미널에서는 환경을 다시 활성화하세요.

```powershell
conda activate cubspace
npm run dev
```

터미널에 표시된 주소를 브라우저로 엽니다. 기본 주소는 `http://localhost:3000`이며 포트가 사용 중이면 실제 출력 주소를 따릅니다. 서버는 터미널을 닫거나 `Ctrl+C`를 누르면 종료됩니다.

- 학습자 화면: <http://localhost:3000/>
- 전체 페이지 미리보기: <http://localhost:3000/?admin=1>
- 관리자 메뉴: <http://localhost:3000/admin>

`?admin=1`은 **로컬 검토용 학습 잠금 해제**입니다. 사용자 인증이나 보안 권한 기능이 아닙니다. 학습 기록은 브라우저 localStorage에 저장되며, 브라우저나 접속 주소를 바꾸면 공유되지 않습니다.

## 3. 수정 후 검사

```powershell
npm test
npm run test:prolog
npm run lint
npm run typecheck
npm run build
```

설치 스크립트가 Chromium도 설치합니다. 브라우저만 다시 설치해야 할 때는 같은 환경에서 실행합니다.

```powershell
npm run browser:install
npm run dev
```

다른 터미널에서 같은 Conda 환경을 활성화한 뒤 `npm run test:browser`를 실행합니다. 기본 주소는 `http://localhost:3000`입니다. 다른 주소는 `BASE_URL` 환경변수로 지정합니다. 검사 결과와 스크린샷은 `.workflow/browser/`에 저장됩니다.

## 4. 티켓으로 변경하기

`ticket.json`에 작업 목적, 변경 범위, 완료 기준과 QA 항목을 적습니다. 기존 `mds/` 문서는 과거 작업 기록으로 보존합니다. 새 작업 문서는 입력에서 자동 생성합니다.

```powershell
npm run ticket -- generate
```

출력된 실행 ID를 아래 `RUN_ID` 자리에 넣습니다.

```powershell
npm run ticket -- agent RUN_ID implementer
npm run ticket -- check RUN_ID
npm run ticket -- agent RUN_ID reviewer
npm run ticket -- report RUN_ID
```

선택한 에이전트 CLI에 로그인돼 있으면 `npm run ticket -- run`으로 생성부터 구현·검사·독립 리뷰·보고서까지 연결할 수 있습니다. CLI 자동화를 사용하지 않으면 생성된 Markdown을 VS Code의 코딩 에이전트에 전달하고, 리뷰 결과를 `review` 명령으로 등록합니다.

리뷰를 통과한 **같은 코드 버전**만 커밋·푸시할 수 있습니다.

```powershell
npm run ticket -- commit RUN_ID
npm run ticket -- push RUN_ID
```

검사 실패, 코드 변경 후 오래된 리뷰, 대상 브랜치 불일치, 범위 밖 변경은 릴리스를 중단합니다. `main`에 직접 푸시하지 않습니다. LLM 리뷰는 기술 책임자의 공학적 승인을 대체하지 않습니다.

설정, ClickUp 입력과 VS Code 에이전트 사용법은 [자동화 흐름](docs/workflow.md)을 참고하세요.

## 5. ClickUp 토큰 연결

이미 **ClickUp (`edsol.clickup`)** 확장이 설치돼 있습니다. VS Code 명령 팔레트에서 **ClickUp: Set token**을 실행하고 토큰을 입력하면 확장에서 작업을 볼 수 있습니다. CLI는 확장에 저장한 토큰을 읽지 않으므로 다음 설정을 한 번 더 합니다.

1. `.clickup.env.example`을 같은 폴더의 `.clickup.env`로 복사합니다.
2. 새 파일을 VS Code에서 열어 `CLICKUP_API_TOKEN=` 뒤에 본인의 토큰을 입력합니다.
3. ClickUp 작업 URL 끝의 ID로 실행합니다.

```powershell
npm run ticket -- clickup TASK_ID
```

`.clickup.env`는 Git에서 제외되며 웹 앱의 환경 파일로 로드되지 않습니다. 토큰을 `ticket.json`, `.vscode/settings.json`, `NEXT_PUBLIC_*` 또는 `VITE_*`에 넣지 마세요. 토큰 자체를 채팅이나 보고서에 붙여 넣을 필요도 없습니다.

생성된 `ticket.clickup.json`의 작업 ID, 범위, 완료 기준을 검토해 `ticket.json`에 반영한 뒤 문서를 생성합니다. 이 명령은 ClickUp 작업을 읽기만 합니다. 토큰과 실제 task ID를 설정하기 전에는 계정 연결이 검증된 상태가 아닙니다.

## 6. 확장과 에이전트

2026-09-23에 확인한 이 컴퓨터의 설치 상태입니다. 확장 설치와 CLI 설치·로그인은 별개입니다.

| 확장                                              | 상태              | 용도                                                  |
| :------------------------------------------------ | :---------------- | :---------------------------------------------------- |
| Codex, `openai.chatgpt`                           | 설치됨            | VS Code에서 구현과 코드 검토                          |
| Claude Code, `anthropic.claude-code`              | 설치됨            | Claude 구현 및 독립 리뷰                              |
| ClickUp, `edsol.clickup`                          | 설치됨            | 작업 탐색, 토큰 입력                                  |
| Markdown All in One, `yzhang.markdown-all-in-one` | 설치됨            | README와 작업 문서 편집                               |
| Playwright Test, `ms-playwright.playwright`       | 미설치, 선택 사항 | Playwright Test 기반 검사를 편집기에서 실행할 때 사용 |
| GitHub Copilot Chat, `GitHub.copilot-chat`        | 미설치, 선택 사항 | `.github/agents/` 역할을 사용할 때만 필요             |

지금은 Codex 또는 Claude 중 하나를 사용하면 됩니다. **추가 필수 확장은 없습니다.** 현재 브라우저 검사는 Playwright API를 사용하는 Node 스크립트이므로 Playwright Test 확장 설치 없이 `npm run test:browser`로 실행합니다. [전체 설치 확장 목록](docs/extensions.md)에 나머지 확장과 버전도 기록했습니다. `.vscode/extensions.json`은 추천 목록이며 자동 설치 목록이 아닙니다.

에이전트 파일은 도구별 형식이 다릅니다.

| 도구           | 지침 위치                          | 실행                                         |
| :------------- | :--------------------------------- | :------------------------------------------- |
| Codex          | `AGENTS.md`                        | CLI가 구현·리뷰를 각각 독립 세션으로 호출    |
| Claude Code    | `CLAUDE.md`, `.claude/agents/*.md` | `ticket-implementer`, `ticket-reviewer` 역할 |
| GitHub Copilot | `.github/agents/*.agent.md`        | Chat에서 역할 선택                           |

공통 `.agent` 파일 하나를 모든 도구가 읽는 구조는 아닙니다. 자동화에서는 `workflow/config.json`의 역할별 `provider`를 `codex` 또는 `claude`로 지정합니다. 기본값은 둘 다 Codex이며, 구현은 Codex, 리뷰는 Claude로 나눌 수도 있습니다. Claude 리뷰는 읽기 도구만 사용하고 필수 검사 로그를 확인합니다. 검사 자체는 `check` 단계가 실행합니다.

```json
"agents": {
  "implementer": { "provider": "codex" },
  "reviewer": { "provider": "claude" }
}
```

로그인과 전체 실행 절차는 [자동화 흐름](docs/workflow.md)에 있습니다.

## 구조

```text
app/                 페이지와 공통 스타일
components/          실제 화면에서 사용하는 컴포넌트
src/                 학습 데이터와 상태 로직
lib/                 공통 유틸리티
public/              사용하는 이미지, 3D 모델과 텍스처
docs/                설치, 자동화, 작성·검토 지침
scripts/             환경 설정, 티켓 처리와 브라우저 검사
tests/               로직·자동화 회귀 검사
prolog/              교육 예제, 실행 사실과 질의 규칙
mds/                 생성된 티켓과 과거 작업 문서
workflow/            에이전트·검사 설정과 실행 보고서
.claude/             Claude 역할 지침
.github/             Copilot 역할과 프롬프트
.vscode/             작업 단축 명령과 확장 추천
.openai/             현재 빌드가 사용하는 호스팅 설정
environment.yml      공통 Conda 패키지 정의
ticket.json          현재 작업 입력
```

`node_modules`, `dist`, `.vinext`, `.wrangler`, `.workflow` 등은 로컬 설치·빌드·검사 과정에서 생기는 경로이며 Git에 올리지 않습니다. `.workflow/receipts`에는 검증한 커밋의 영수증이 있으므로 푸시 전까지 보존합니다. 과거 `mds/`와 `workflow/runs/`는 작업 근거이며 미사용 임시 파일이 아닙니다.

## 근거와 한계

ACRUX-2 ConOps 및 MADE 모델링 자료를 바탕으로 구성했습니다. 원본 PDF/DOCX는 저장소에 포함하지 않습니다. 화면에 표시된 출처, 가정, 미확정 항목은 유지하며, 교육용 그림과 예시 수치를 확정 설계로 해석하지 않습니다. 실제 사용자 평가와 분야 전문가 검토는 별도입니다.

- [공학 검토 기록](docs/engineering-review.md)
- [퀴즈 작성 지침](docs/quiz-authoring.md)
- [Conda 환경 관리](https://docs.conda.io/projects/conda/en/stable/user-guide/tasks/manage-environments.html)
- [ClickUp 인증](https://developer.clickup.com/docs/authentication)
- [Codex 프로젝트 지침](https://developers.openai.com/codex/guides/agents-md/)
- [Claude 하위 에이전트](https://code.claude.com/docs/en/sub-agents)
