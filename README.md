# CubSpace 온보딩

CubeSat의 임무, 구성요소, 시스템 모델과 검증 근거를 한국어로 학습하는 웹 앱입니다. 교육용 3D 모델, ADCS 설명, 퀴즈와 Prolog 학습 자료를 포함합니다. 실제 비행 시뮬레이터나 기술 인증 도구는 아닙니다.

## 1. Conda 환경과 Node.js 설치

Anaconda 또는 Miniconda가 설치된 터미널에서 실행합니다. `cubspace`는 환경 이름이며 원하는 이름으로 바꿀 수 있습니다.

```powershell
conda create -n cubspace -y
conda activate cubspace
conda install -c conda-forge nodejs=22 -y
node --version
npm --version
```

Node.js는 **22.13 이상**이 필요합니다. Conda 환경 활성화 후 `node`와 `npm`이 인식되는지 확인하세요. Python 패키지를 따로 설치할 필요는 없습니다.

Windows에서 `conda activate`가 안 되면 **Anaconda Prompt**를 사용하거나 `conda init powershell`을 한 번 실행한 뒤 터미널을 다시 여세요. `npm.ps1` 실행 정책 오류가 나면 아래 명령에서 `npm` 대신 `npm.cmd`를 사용하세요. 관리자 권한으로 실행할 필요는 없습니다.

## 2. VS Code에서 열고 실행

처음 내려받는 경우:

```powershell
git clone --branch onboarding_training_auto https://github.com/Nor-ter/cubspace_proto.git
cd cubspace_proto
code .
```

이미 저장소가 있다면 **VS Code → 파일 → 폴더 열기**에서 `package.json`이 있는 폴더를 선택합니다. `code` 명령이 없어도 이 방법으로 열 수 있습니다.

VS Code에서 **터미널 → 새 터미널**을 연 뒤 실행합니다. 새 터미널에서는 환경을 다시 활성화하세요.

```powershell
conda activate cubspace
npm ci
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
npm run lint
npm run typecheck
npm run build
```

브라우저 검사도 실행하려면 한 번 설치합니다.

```powershell
npx playwright install chromium
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

Codex CLI가 설치·로그인돼 있으면 `npm run ticket -- run`으로 생성부터 구현·검사·독립 리뷰·보고서까지 연결할 수 있습니다. 별도 에이전트가 없으면 생성된 Markdown을 VS Code의 코딩 에이전트에 전달하고, 리뷰 결과를 `review` 명령으로 등록합니다.

리뷰를 통과한 **같은 코드 버전**만 커밋·푸시할 수 있습니다.

```powershell
npm run ticket -- commit RUN_ID
npm run ticket -- push RUN_ID
```

검사 실패, 코드 변경 후 오래된 리뷰, 대상 브랜치 불일치, 범위 밖 변경은 릴리스를 중단합니다. `main`에 직접 푸시하지 않습니다. LLM 리뷰는 기술 책임자의 공학적 승인을 대체하지 않습니다.

설정, ClickUp 입력과 VS Code 에이전트 사용법은 [자동화 흐름](docs/workflow.md)을 참고하세요.

## 구조

| 위치                                    | 역할                                       |
| :-------------------------------------- | :----------------------------------------- |
| `app/`, `components/`                   | 화면, 도식, 수식과 인터랙션                |
| `src/data/`                             | 학습 내용, 출처, 퀴즈와 공학 설명          |
| `ticket.json`                           | 현재 작업 입력                             |
| `mds/`                                  | 생성된 작업 Markdown과 과거 티켓           |
| `scripts/`, `workflow/`                 | 작업 생성, 검사, 에이전트 호출과 실행 기록 |
| `prolog/run_memory.pl`                  | 실행 기록에서 생성한 Prolog 사실           |
| `prolog/run_rules.pl`                   | 실행 결과 질의 규칙                        |
| `prolog/facts_*.pl`, `prolog/tutorial/` | 기존 교육용 모델과 예제                    |
| `tests/`                                | 학습 로직과 자동화 회귀 검사               |

## 근거와 한계

ACRUX-2 ConOps 및 MADE 모델링 자료를 바탕으로 구성했습니다. 원본 PDF/DOCX는 저장소에 포함하지 않습니다. 화면에 표시된 출처, 가정, 미확정 항목은 유지하며, 교육용 그림과 예시 수치를 확정 설계로 해석하지 않습니다. 실제 사용자 평가와 분야 전문가 검토는 별도입니다.

설치 참고: [Conda 환경 관리](https://docs.conda.io/projects/conda/en/stable/user-guide/tasks/manage-environments.html), [VS Code 폴더와 터미널](https://code.visualstudio.com/docs/terminal/getting-started).
