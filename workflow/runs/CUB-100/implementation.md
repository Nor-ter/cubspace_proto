## 변경 내용

- 새 작업 문서와 실행 ID를 `CUB-100`으로 통일했다. 같은 ID로 다시 생성해도 기존 작업은 덮어쓰지 않는다. 과거 실행 ID는 계속 조회할 수 있다.
- `Task → Perform task card` 아래에 `Taskcard 100`을 게시하도록 설정했다. 기존 CUB subtasks와 같은 `review` 상태를 사용한다.
- `npm run ticket -- push CUB-100`은 Git push 성공 후 ClickUp 게시를 실행한다. 일반 Git push에는 hook을 추가하지 않았다.
- 게시 내용은 작업 범위·완료 기준, 검사 결과, 독립 리뷰, 실행 시간, commit과 결과 파일 링크다. 기존 자동화 taskcard는 식별자로 찾아 갱신한다.
- 같은 이름의 수동 task는 변경하지 않는다. 생성 응답이 불확실하면 중복 POST를 막고, 다음 실행에서 원격 task를 조회해 확인한다.

## 포함된 최근 업데이트

이 작업은 최근 온보딩 웹사이트와 자동화 업데이트 위에 추가했다. README와 화면의 한국어 문구를 자연스럽게 정리했고, 공통 Conda 설치 흐름과 Windows SWI-Prolog 경로를 추가했다. Node, Prolog와 agent CLI는 활성 환경 내부 경로를 사용한다.

직전 업데이트에서는 unit 41개와 desktop/mobile 화면 검사 34개가 통과했다. 이번 변경은 workflow와 문서에 한정되며 화면은 수정하지 않았다. Windows/Linux의 실제 설치 실행은 아직 검증하지 않았다.

## 검사

이번 필수 검사에서 unit 52개, lint, TypeScript, production build와 Prolog 검사가 통과했다. 단위 검사는 task 생성·갱신, 중복·수동 task 보호, 잘못된 상태, 응답 불확실성, 동시 실행, 짧은 ID 재생성 방지와 Git push 이후 게시 실패 처리를 다룬다. ClickUp 쓰기 검사는 이 단계에서 fake HTTP를 사용했다.

## 게시 대상

- Parent: [Perform task card](https://app.clickup.com/t/14ynqxyy8d4)
- List: Task
- 이름: Taskcard 100
- 상태: review

실제 게시와 Git push는 필수 검사와 독립 리뷰가 통과한 뒤 실행한다. 게시 완료 여부는 원격 task readback 및 `.workflow/taskcards/CUB-100.json`에 기록한다. `review`는 사람의 최종 승인을 뜻하지 않는다.

## 리뷰 후 정리

첫 리뷰는 실제 게시 근거가 없다는 점을 지적했다. 사용자가 두 단계 분리와 실제 게시를 명시적으로 승인했다. 실제 게시 목표는 delivery_criteria로 유지하고, 게시 전 코드 승인과 게시 후 원격 확인 단계를 구분했다. 검사·독립 리뷰가 통과해야 commit/push를 허용하는 조건은 그대로다. 실제 게시 확인 전에는 외부 작업 완료를 기록하지 않는다. README에는 결과 파일 확인, 만족 시 commit/push, 수정 시 continue 경로를 안내한다.
