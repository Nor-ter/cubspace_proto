# CUB-023 변경 내용

README, 환경 설정, workflow와 agent 안내를 자연스러운 한국어로 정리했다. ADCS, Task Card, CLI 등 통용되는 용어를 유지하고 번역투와 과장된 문구를 줄였다. 홈·학습·관리 화면과 관련 설명의 문구를 수정했으며 수식, 출처, 학습 상태와 component 동작은 보존했다.

설치 명령은 공통 진입점을 사용하고 OS에 따라 npm/SWI-Prolog 경로를 선택한다. Windows에서는 공식 SWI-Prolog 파일을 SHA256 확인 후 Conda 환경 안에 추출한다. Prolog 실행도 동일한 Node launcher를 사용하며 환경 밖 실행 파일을 거부한다. README에서 개인 기기의 설치·검사 이력은 제거하고 필요한 설치 순서만 남겼다.

## 확인 근거

- Mandatory checks: unit 41개, lint, types, build, Prolog 모두 통과.
- environment:check: Node, npm, SWI-Prolog, CLI, 환경 변수와 Chromium 경로 확인 통과.
- Windows 공식 SWI-Prolog 10.0.2-1 x64 배포 파일의 SHA256 `2ec1f25be0eafb92e559004782b130774c12573fb4b7e8a917e534754a641ad6` 확인. 압축 해제 후 bin/swipl.exe, boot.prc, library/INDEX.pl 존재 확인.
- conda-forge Windows 7zip 26.03 archive에서 bin/7z.exe, bin/7z.dll 위치 확인. Windows Node recipe의 prefix/node.exe, prefix/node_modules 위치 확인.
- Windows 경로(공백 포함), Unix 경로, 환경 외부 sibling/symlink 차단을 자동 검사.

## 검증 범위

이 실행의 실제 runtime 검사는 현재 macOS 환경에서 수행했다. Windows는 실제 배포 archive와 경로 fixture를 검증했으며 native Windows/Linux 설치 실행은 수행하지 않았다. 자동 설치 지원 아키텍처는 Windows x64, macOS Apple Silicon/Intel, Linux x64로 환경 안내에 명시했다. 모든 OS/하드웨어를 검증했다고 주장하지 않는다.

## 참고

- [SWI-Prolog Windows 배포](https://www.swi-prolog.org/download/stable/bin/swipl-10.0.2-1.x64.exe.envelope)
- [SWI-Prolog 개발자의 설치 파일 추출 안내](https://swi-prolog.discourse.group/t/swi-prolog-distribution-as-zip/7156)
- [conda-forge 7zip](https://anaconda.org/conda-forge/7zip)
- [conda-forge Node Windows 설치 recipe](https://github.com/conda-forge/nodejs-feedstock/blob/main/recipe/build.bat)

## 첫 리뷰 후 수정

첫 Codex 리뷰에서 Unix agent 선택이 전역 PATH의 CLI를 실행할 수 있다는 문제를 발견했다. 모든 OS에서 Conda 환경의 package manifest로 실행 파일을 찾도록 수정했다. Custom command도 환경 내부 실행 파일인지 확인한다. 환경 밖에만 Codex/Claude가 있는 경우 인증 확인이나 실행을 하지 않고 VS Code로 넘어가는 회귀 검사를 추가했다. 변경 후 필수 검사를 모두 다시 실행해 통과했다. 화면 코드는 브라우저 검사 이후 변경하지 않았다.
