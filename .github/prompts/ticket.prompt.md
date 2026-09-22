---
description: inputs/ticket.json에서 검토 가능한 개발 작업을 시작합니다.
agent: ticket-implementer
---

AGENTS.md와 inputs/ticket.json을 읽고 npm run ticket -- generate로 작업 문서를 만드세요. 생성된 문서의 완료 기준을 구현하고 필수 검사를 실행하세요. 이후 독립 reviewer 세션에 실행 ID를 전달하세요. 같은 에이전트가 자신의 작업을 독립 리뷰로 기록하지 마세요.

CUB REF는 실제 ClickUp reference task이며 실행 결과는 각 작업 ID로 보존합니다. 현재 입력과 저장된 snapshot을 구분하고, 요구사항 수정은 `revise ID`를 사용합니다. 공유용 보고서는 HTML입니다. 현재 CUB REF 작업은 Git push와 ClickUp submit까지 수행합니다. 기존 reference 카드를 갱신하고 중복 생성하지 않습니다. ID는 `CUB REF`, `CUB XXX`처럼 공백을 사용하며 CLI에서는 따옴표로 감쌉니다.

`CUB XXX`의 `XXX`는 placeholder이며 실제 작업 번호는 `001`, `002`부터 시작하는 세 자리 숫자를 사용합니다.
