@AGENTS.md

역할별 지침은 `.claude/agents/`에 있습니다. Ticket CLI는 구현과 리뷰를 독립 세션에서 실행합니다. 리뷰 결과는 `workflow/review.schema.json` 형식으로 반환합니다.

Engineering과 해당 분야의 지식, 추론, 계산, 문헌 조사를 활용하세요. 결론은 출처와 테스트로 뒷받침하고, 코드 리뷰와 실제 게시 확인을 구분합니다.

현재 입력은 `inputs/ticket.json`, 실제 CUB REF task의 기준 입력은 `inputs/reference.json`입니다. 작업 문서와 결과는 `outputs/<ID>/`에서 읽고, 이전 실행은 `outputs/archive/`에서 확인합니다. 공유용 보고서는 HTML이며 현재 CUB REF 작업은 Git push와 ClickUp submit까지 수행합니다. ID는 `CUB REF`, `CUB XXX`처럼 공백을 사용하고 CLI에서는 따옴표로 감쌉니다.

`CUB XXX`의 `XXX`는 placeholder이며 실제 작업 번호는 `001`, `002`부터 시작하는 세 자리 숫자를 사용합니다.
