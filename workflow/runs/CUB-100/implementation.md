# CUB-100 구현 기록

## 변경 내용

- 기존 ClickUp task의 이름을 `CUB-100`으로 갱신한다. Parent는 `Task → Perform task card`, status는 `review`다. 기존 식별자로 카드를 찾아 다른 subtask나 parent를 변경하지 않는다.
- 실제 browser check의 screenshot 4장과 이미지를 내장한 독립 실행 HTML report를 생성한다. 캡처 목록과 파일 hash를 코드 리뷰에 연결하고, 코드·화면·첨부 파일이 바뀌면 재검증한다.
- ClickUp에 HTML과 PNG를 첨부하고 원격 파일을 내려받아 크기와 SHA-256을 비교한다. 다운로드에는 API token을 보내지 않는다. 중단된 업로드는 확인된 첨부부터 이어가며 불확실한 POST를 자동 반복하지 않는다.
- README에 ClickUp extension 설치와 Command Palette token 설정, 별도 CLI 인증, 결과 위치, 수정·리뷰·게시 순서를 정리했다. Agent의 engineering 지식과 추론 활용을 명시하고 parent task, status 등 익숙한 용어를 유지했다.
- `mds/`에는 `CUB-100.md`만 남겼다. 과거 작업 문서는 Git history, 실행 이력은 `workflow/runs/`에 보존한다.

## 화면 확인

Desktop 1440 px와 mobile 390 px에서 34건의 browser check가 통과했다. JavaScript 오류, 이미지 누락, 가로 넘침과 학습 페이지 이동을 확인했다. 첨부할 Overview, CubeSat geometry, ADCS lesson, Mobile overview의 실제 캡처도 확인했다.

- 검사 목록: `workflow/runs/CUB-100/browser-results.json`
- 캡처 목록과 SHA-256: `workflow/runs/CUB-100/evidence.json`
- PNG 원본: `workflow/runs/CUB-100/screenshots/`
- 독립 실행 report: `.workflow/results/CUB-100/CUB-100.html`

## QA와 게시

단위 검사는 오래된 리뷰 표시, 누락·변조된 캡처, HTML escaping, 첨부 재시도와 중복 방지, 원격 파일 내용 불일치를 포함한다. 필수 검사 결과와 시간은 `report.md`, 독립 리뷰는 `review.json`에 기록한다.

독립 QA에서 발견한 오래된 HTML 통과 표시, screenshot 없이 작성하는 중간 보고서의 실패, 원격 첨부의 metadata만 비교하던 문제를 수정했다. Git push와 ClickUp 게시 확인은 코드 리뷰 이후 별도로 수행한다.

게시 대상은 [CUB-100](https://app.clickup.com/t/14ynqxyyzx6)이다. Taskcard 본문은 작업 내용, 검사·리뷰 결과, 실행 시간과 Git 링크를 포함한다. `review` status는 사람의 최종 승인을 뜻하지 않는다. 실제 전송 기록은 `.workflow/taskcards/CUB-100.json`, `.workflow/attachments/CUB-100.json`에서 확인한다.

## 실제 API 응답 반영

첫 게시에서 Git push와 기존 task의 `CUB-100` 이름 변경이 완료됐다. HTML도 저장됐지만 ClickUp이 attachment ID를 `UUID.html` 형태로 반환해 확인 단계가 중단됐다. 원격 목록을 조회해 기존 첨부를 확인했으며, attachment ID의 파일 확장자를 처리하도록 검증과 회귀 테스트를 보완했다. Task ID 검증은 그대로 유지한다. 수정본의 검사와 독립 리뷰 후 게시를 이어가며 이전 보고서는 해당 commit의 기록으로 보존한다.

재리뷰에서 확인한 report lifecycle도 수정했다. 재검사·리뷰 시작 및 판정 등록 시 현재 Markdown과 HTML을 바로 갱신하고, 이전 통과 HTML은 `.workflow/results/CUB-100/history/`에 보존한다. 단위 테스트 74건과 필수 검사 5종이 통과했으며, 재검사 직후 현재 소스 해시와 pending 상태가 표시되는 것을 확인했다.
