# 개발 환경

프로젝트 루트에서 실행한다. Node.js, SWI-Prolog, 브라우저 검사 도구는 하나의 `cubspace` Conda 환경을 사용한다.

```bash
conda env create -f environment.yml
conda activate cubspace
node scripts/setup-environment.mjs
conda deactivate
conda activate cubspace
npm run environment:check
npm run dev
```

이미 환경이 있으면 첫 줄을 `conda env update -n cubspace -f environment.yml`로 바꾼다.

## 에이전트 선택

웹사이트 실행에는 LLM 계정이 필요 없다. 자동 구현과 리뷰를 실행할 때 사용할 에이전트를 선택한다. **Codex와 Claude를 모두 설치할 필요는 없다.**

| 사용 방식               | 설치 명령                                   | 로그인                       |
| ----------------------- | ------------------------------------------- | ---------------------------- |
| VS Code의 에이전트 사용 | `node scripts/setup-environment.mjs vscode` | 해당 VS Code 확장에서 로그인 |
| Codex CLI 사용          | `node scripts/setup-environment.mjs codex`  | `codex login`                |
| Claude Code CLI 사용    | `node scripts/setup-environment.mjs claude` | `claude auth login`          |

인자를 생략하면 `vscode`로 설치한다. 선택한 CLI만 환경 안에 추가하며, 기존 CLI는 제거하지 않는다. `vscode`는 별도 CLI를 설치하지 않는다는 뜻이며, 확장을 자동 설치하거나 로그인하지 않는다. VS Code에서 사용할 수 있는 모델은 로그인한 확장과 계정에 따라 다르다. 웹사이트 설치만으로 Copilot이나 다른 모델의 사용 권한이 생기지는 않는다.

설치 스크립트는 공통 도구와 프로젝트 의존성도 준비한다. 에이전트의 작업 순서와 실행 명령은 [작업 흐름](workflow.md)을 따른다.

## 설치 위치

| 항목                     | 위치                                     |
| ------------------------ | ---------------------------------------- |
| Node.js, npm, 선택한 CLI | `cubspace` 환경                          |
| SWI-Prolog               | 환경 내부, macOS는 `opt/SWI-Prolog.app`  |
| npm 캐시, Chromium       | 환경의 `var/npm-cache`, `var/playwright` |
| 웹사이트 라이브러리      | 프로젝트의 `node_modules`                |

스크립트가 `NPM_CONFIG_PREFIX`, `NPM_CONFIG_CACHE`, `PLAYWRIGHT_BROWSERS_PATH`를 환경에 저장하므로 설치 후 한 번 다시 활성화한다. 환경을 옮기면 설치 스크립트를 다시 실행한다. VS Code와 확장, Git, Conda 자체는 외부 도구다. 로그인 정보는 각 제품의 사용자 설정에 보관하며 Conda 환경으로 복사하지 않는다.

`npm run environment:check`는 필수 도구의 위치와 실행, Prolog 질의, Chromium 경로를 확인한다. Codex와 Claude는 설치된 경우에만 버전을 확인하고, 없어도 검사를 실패시키지 않는다. 로그인이나 모델 사용 가능 여부는 이 검사로 확인하지 않는다.

## 운영체제

- **macOS:** 공식 SWI-Prolog `10.0.2-1` 범용 번들의 SHA256을 확인하고 환경에 설치한다. 관리자 권한이나 Homebrew를 사용하지 않는다. Apple Silicon에서 실행을 검증했으며 Intel 실행은 미검증이다.
- **Linux:** 같은 환경에 `conda-forge::swi-prolog=10`을 설치한다. 이 컴퓨터에서는 미검증이며 Chromium용 운영체제 라이브러리가 필요할 수 있다.
- **Windows:** VS Code의 WSL 확장으로 Linux 폴더를 열고 WSL 안의 Conda에서 설치한다. 자동 설치는 Windows 네이티브를 지원하지 않으며 WSL 경로는 미검증이다.

macOS ARM용 Conda 패키지를 대신해 [SWI-Prolog 공식 번들](https://www.swi-prolog.org/download/stable)을 사용한다. 다른 설치 방식은 [공식 문서](https://www.swi-prolog.org/build/unix.md)를 참고한다.

## Prolog와 브라우저 검사

```bash
npm run test:prolog
swipl -q -s prolog/run_rules.pl
```

```prolog
reviewed_run(Run).
needs_attention(Run).
halt.
```

Prolog는 저장된 검사·리뷰 이력을 조회한다. 현재 변경의 커밋 가능 여부는 `scripts/ticket.mjs`가 별도로 검사한다.

웹사이트를 `npm run dev`로 실행한 뒤 같은 환경의 다른 터미널에서 `npm run test:browser`를 실행한다. Chromium만 다시 설치하려면 `npm run browser:install`을 사용한다.
