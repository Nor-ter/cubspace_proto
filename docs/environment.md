# 개발 환경

## 설치

프로젝트 루트에서 실행한다. Conda 환경은 하나만 사용한다.

```bash
conda env create -f environment.yml
conda activate cubspace
node scripts/setup-environment.mjs
conda deactivate
conda activate cubspace
npm run environment:check
npm run dev
```

이미 `cubspace` 환경이 있으면 첫 줄 대신 다음 명령을 사용한다.

```bash
conda env update -n cubspace -f environment.yml
```

설치 스크립트는 활성 환경의 Node.js인지 확인한 뒤 SWI-Prolog, Codex CLI, Claude Code, 프로젝트 의존성과 Chromium을 설치한다. 관리자 권한이나 Homebrew는 필요하지 않다. CLI 로그인은 설치와 별개다.

```bash
codex login
claude auth login
```

| 항목                    | 위치                                                                   |
| ----------------------- | ---------------------------------------------------------------------- |
| Node.js와 npm           | `cubspace` 환경                                                        |
| Codex CLI와 Claude Code | 환경 내부 npm 전역 패키지 경로                                         |
| SWI-Prolog              | macOS에서는 환경의 `opt/SWI-Prolog.app`, Linux에서는 Conda 패키지 경로 |
| npm 다운로드 캐시       | 환경의 `var/npm-cache`                                                 |
| Playwright Chromium     | 환경의 `var/playwright`                                                |
| 웹사이트 라이브러리     | 프로젝트의 `node_modules`, `package-lock.json`으로 관리                |

`npm install -g`의 전역 범위도 활성 환경으로 제한한다. 설치 스크립트는 `NPM_CONFIG_PREFIX`, `NPM_CONFIG_CACHE`, `PLAYWRIGHT_BROWSERS_PATH`를 Conda 환경 변수에 저장한다. 따라서 설치 후 한 번 환경을 다시 활성화해야 한다. 환경을 옮기거나 이름을 바꾸면 스크립트를 다시 실행한다.

VS Code 자체와 편집기 확장은 Conda 패키지가 아니다. Git과 Conda도 환경을 준비하는 외부 도구다. CLI 로그인 정보는 각 제품이 관리하는 사용자 설정 위치에 저장되며 Conda 환경으로 복사하지 않는다.

## 플랫폼별 설치 방식

- **macOS Apple Silicon:** 실제 설치와 실행을 검증했다. 공식 SWI-Prolog `10.0.2-1` 범용 앱 번들의 SHA256을 확인하고 환경 안으로 복사한다. `Applications` 폴더는 변경하지 않는다.
- **macOS Intel:** 같은 공식 범용 번들을 사용한다. 이 컴퓨터에서는 실행하지 않았다.
- **Linux:** 스크립트가 같은 환경에 `conda-forge::swi-prolog=10`을 설치한다. Linux에서의 설치와 브라우저 실행은 아직 검증하지 않았다. 배포판에 따라 Chromium의 운영체제 라이브러리가 추가로 필요할 수 있다.
- **Windows:** 자동 설치 스크립트는 Windows 네이티브 설치를 수행하지 않는다. VS Code의 WSL 확장으로 Linux 폴더를 열고 WSL 안의 Conda에서 위 명령을 실행한다. Windows용 Conda와 WSL용 Conda를 섞지 않는다. WSL 설치 경로는 이 컴퓨터에서 검증하지 않았다.

macOS ARM용 `conda-forge::swi-prolog` 패키지는 확인 당시 제공되지 않았으므로, 실패하는 Conda 명령을 반복하지 않고 [SWI-Prolog 공식 다운로드](https://www.swi-prolog.org/download/stable)의 재배치 가능한 번들을 사용한다. 고정된 파일의 SHA256은 설치 스크립트에 기록했다. Linux 설치 방식과 직접 빌드가 필요한 경우는 [공식 설치 문서](https://www.swi-prolog.org/build/unix.md)를 참고한다.

## Prolog 실행

```bash
swipl -q -s prolog/run_rules.pl -g "findall(R,reviewed_run(R),Rs),writeln(Rs),halt"
swipl -q -s prolog/run_rules.pl
```

대화형 질의 예시:

```prolog
reviewed_run(Run).
needs_attention(Run).
halt.
```

이 질의는 저장된 검사·리뷰 이력을 읽는다. 현재 소스의 커밋 가능 여부는 `scripts/ticket.mjs`가 별도로 검사한다. 과거 실행이 `reviewed_run/1`을 만족해도 현재 변경의 검토를 대신하지 않는다.

## 브라우저 검사

한 터미널에서 `npm run dev`를 실행한 상태로, 같은 환경을 활성화한 다른 터미널에서 실행한다.

```bash
npm run test:browser
```

Chromium만 다시 설치하려면 다음 명령을 사용한다. `PLAYWRIGHT_BROWSERS_PATH`는 활성 Conda 환경에 저장된 값을 사용한다.

```bash
npm run browser:install
```

`npm run environment:check`는 Node.js, npm, 두 CLI, SWI-Prolog, Chromium의 경로와 환경 변수를 확인하고 실제 Prolog 질의를 실행한다. 환경 밖의 실행 파일이나 누락된 도구가 있으면 종료 코드가 0이 되지 않는다.

이 Mac에서 확인한 버전: Node.js 22.23.2, npm 10.9.8, Codex 0.155.1, Claude Code 2.1.278, SWI-Prolog 10.0.2. 네이티브 Prolog 질의와 환경 내부 Chromium의 headless 실행을 확인했다.
