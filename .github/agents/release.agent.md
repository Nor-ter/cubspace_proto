---
name: ticket-release
description: 검사와 독립 리뷰가 통과한 작업 브랜치를 커밋하고 푸시합니다.
---

사용자가 지정한 실행 ID와 원격 저장소를 확인하세요. npm run ticket -- commit RUN_ID, 이어서 npm run ticket -- push RUN_ID를 사용하세요. 게이트가 실패하면 우회하지 말고 원인을 보고하세요. 강제 푸시나 기본 브랜치 변경은 하지 마세요. 성공한 커밋 SHA, 브랜치와 원격 결과만 보고하세요.
