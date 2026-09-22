# CUB REF 구현 결과

## 작업 입력과 이력

- 이번에 게시하는 기준 task는 `CUB REF`다. 새 작업은 `CUB 001`, `CUB 002`처럼 공백과 세 자리 번호를 사용하고 README의 일반 명령은 `CUB XXX`로 안내한다.
- `inputs/reference.json`은 실제 reference의 기준 입력, `inputs/ticket.json`은 현재 작업 입력이다. `new`는 reference를 복사해 새 입력만 준비하며 저장하지 않은 변경과 기존 ID 충돌을 차단한다.
- 실행 당시 입력은 `outputs/<ID>/ticket.json`에 저장한다. 현재 입력 편집은 기존 작업을 바꾸지 않는다. `revise`는 이전 상태를 history에 보존하고 새 입력을 반영하며 검사·리뷰를 무효화한다.
- 작업 문서, 구현 기록, 검사, 리뷰와 공유 report를 `outputs/<ID>/`에 모았다. 과거 실행은 원래 이름으로 `outputs/archive/`에 보존하며 Prolog에서도 계속 조회한다.

## HTML report

- 공유 파일은 `outputs/<ID>/report.html`과 실제 screenshot이다. 이미지가 내장된 독립 실행 HTML이므로 파일 하나로 열 수 있다.
- Desktop과 mobile에서 내용을 읽을 수 있도록 화면 폭에 맞춰 표시한다. 긴 screenshot도 원래 비율을 유지한다.
- 검사나 리뷰 상태가 바뀌면 report를 즉시 갱신하고 이전 통과 report는 history에 보존한다. 첨부 파일은 원본 SHA-256과 원격 다운로드 내용을 비교한 뒤 완료로 기록한다.

## 확인한 결과

- Desktop/mobile browser check 34건이 통과했다. 선택한 Overview, CubeSat 구조, ADCS와 mobile Overview의 실제 캡처를 HTML에 포함했다.
- Desktop 1440 px와 mobile 390 px에서 HTML의 한국어와 embedded images가 정상 표시되고 가로 넘침·JavaScript 오류가 없음을 확인했다. 최종 검사 결과와 독립 리뷰는 report와 review.json에서 확인한다.
- 테스트는 reference 보존, snapshot과 revise, 공백 ID, 기존 ID 충돌, HTML escaping·상태 갱신·첨부 변조 감지, reference 카드 갱신과 다른 task의 분리를 포함한다.

## 게시

일반 Git push와 ClickUp submit은 별도 명령이다. 이번 작업은 사용자 요청에 따라 둘 다 수행한다. 기존 ClickUp task `14ynqxyyzx6`을 명시적으로 지정해 `CUB REF`로 갱신하며 새 reference 카드를 만들지 않는다. 이전 실행·첨부는 당시 이력으로 보존한다. 원격 Git commit과 최신 HTML·screenshots는 독립 리뷰 후 실제 게시 결과로 확인한다.
