# 개발 환경

Windows, macOS, Linux에서 같은 명령으로 설치합니다. 자동 설치 대상은 Windows x64, macOS (Apple Silicon/Intel), Linux x64입니다. Conda와 Git을 먼저 설치하고, 프로젝트 루트에서 실행하세요. Node.js, SWI-Prolog, 선택한 agent CLI와 브라우저 검사 도구는 `cubspace` Conda 환경에서 관리합니다.

```bash
conda env create -f environment.yml
conda activate cubspace
node scripts/setup-environment.mjs codex
conda deactivate
conda activate cubspace
npm run environment:check
npm run dev
```

환경이 이미 있으면 첫 줄 대신 아래 명령을 사용합니다.

```bash
conda env update -n cubspace -f environment.yml
```

## Agent 선택

웹사이트만 실행할 때는 LLM 계정이 필요 없습니다. 자동 구현과 리뷰에 사용할 도구는 하나만 선택하면 됩니다.

| 도구            | 설치 명령                                   | 로그인                           |
| --------------- | ------------------------------------------- | -------------------------------- |
| Codex CLI       | `node scripts/setup-environment.mjs codex`  | `codex login`                    |
| Claude Code CLI | `node scripts/setup-environment.mjs claude` | `claude auth login`              |
| VS Code Chat    | `node scripts/setup-environment.mjs vscode` | 사용하는 VS Code 확장에서 로그인 |

인수를 생략하면 `vscode`를 사용합니다. 선택한 CLI만 추가로 설치하며 이미 설치한 CLI는 제거하지 않습니다. `vscode`는 CLI 설치를 생략하는 옵션입니다. VS Code 확장 설치와 로그인은 편집기에서 직접 진행하세요.

VS Code에서 사용할 수 있는 모델은 확장과 계정에 따라 다릅니다. 프로젝트 설치만으로 Copilot이나 다른 서비스의 모델 사용 권한이 생기지는 않습니다.

## 설치 위치

| 항목                                 | 위치                         |
| ------------------------------------ | ---------------------------- |
| Node.js, npm, 선택한 CLI, SWI-Prolog | `cubspace` 환경 내부         |
| npm 캐시                             | 환경 내부의 `var/npm-cache`  |
| Chromium                             | 환경 내부의 `var/playwright` |
| 프로젝트 라이브러리                  | 저장소의 `node_modules`      |

설치 스크립트가 운영체제에 맞는 SWI-Prolog를 준비합니다. Windows에서는 공식 배포 파일을 환경 내부에 풀어 사용하므로 별도 설치 마법사를 실행하지 않습니다. Linux에서는 conda-forge 패키지를 사용합니다. 공식 배포 파일을 사용할 때는 SHA256을 확인합니다. VS Code와 확장, Git, Conda 자체는 별도로 설치하는 도구입니다. 로그인 정보는 각 서비스의 사용자 설정에 두며 Conda 환경으로 복사하지 않습니다.

`NPM_CONFIG_PREFIX`, `NPM_CONFIG_CACHE`, `PLAYWRIGHT_BROWSERS_PATH`를 Conda 환경 설정에 저장하므로 설치 후 환경을 한 번 다시 활성화합니다. 환경 위치를 옮겼다면 설치 스크립트를 다시 실행하세요.

`npm run environment:check`는 필수 도구가 해당 환경에 있는지 확인하고, Prolog 질의와 Chromium 경로를 검사합니다. Codex와 Claude는 설치돼 있을 때만 버전을 확인합니다. CLI 로그인 상태와 선택될 agent는 `npm run ticket -- agents`로 확인합니다. 원격 서비스 연결이나 남은 사용량까지 검사하지는 않습니다.

## 터미널 설정

- **`conda`가 인식되지 않을 때:** Conda가 제공하는 터미널을 열거나, 사용하는 셸에 `conda init`을 적용한 뒤 터미널을 다시 엽니다.
- **PowerShell에서 `npm.ps1` 실행이 차단될 때:** `npm` 대신 `npm.cmd`를 사용합니다. 예를 들어 `npm.cmd run dev`로 실행할 수 있습니다.
- **VS Code 작업에서 도구를 찾지 못할 때:** `conda activate cubspace`를 실행한 터미널에서 `code .`로 폴더를 엽니다.
- **Linux에서 Chromium 라이브러리가 없을 때:** Playwright 오류에 표시된 운영체제 패키지를 설치합니다. 시스템 라이브러리는 Conda에 설치한 Chromium과 별도로 필요할 수 있습니다.

## Prolog와 화면 검사

```bash
npm run test:prolog
npm run prolog -- -q -s prolog/run_rules.pl
```

Prolog 콘솔에서 아래와 같이 이력을 조회합니다.

```prolog
reviewed_run(Run).
needs_attention(Run).
halt.
```

Prolog는 저장된 검사·리뷰 이력을 조회합니다. 현재 변경을 커밋할 수 있는지는 `scripts/ticket.mjs`가 별도로 검사합니다.

화면 검사는 개발 서버를 실행한 상태에서 같은 환경의 다른 터미널을 열어 진행합니다.

```bash
npm run test:browser
```

현재 task의 screenshot과 HTML report를 만들려면 개발 서버를 켠 상태에서 `npm run ticket -- evidence CUB-100`을 실행합니다. 결과 위치와 게시 절차는 README에 정리돼 있습니다.

Chromium만 다시 설치하려면 `npm run browser:install`을 실행하세요. 작업 실행과 리뷰 절차는 [workflow 문서](workflow.md)를 참고하세요.

[SWI-Prolog 공식 배포](https://www.swi-prolog.org/download/stable) · [SWI-Prolog 설치 문서](https://www.swi-prolog.org/build/unix.md)
