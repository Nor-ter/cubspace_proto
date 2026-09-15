# CUB-001 — AI Verification / Human Inspection

- 상태: **Yellow — Human Inspection 대기**. 실제 Sign-off: Pending.
- 검증일: 2026-09-15 (Australia/Sydney).
- 대상: Nor-ter/cubspace_proto, onboarding_training 로컬 작업본.
- 기준 commit: `2a2c6a44aade2fc27b5ada7f867429b132d4add6`.
- 후보 ID: `CUB-001-local-01` (아래 SHA256으로 변경 파일 식별).
- URL: http://127.0.0.1:3000/?admin=1#anatomy
- 접근: 이 PC에서 개발 서버가 실행 중이어야 합니다. 기존 검토 모드(admin=1)로 퀴즈 잠금 없이 탐색합니다. 다른 기기에서 접근한 결과는 없습니다.
- 제공된 Card의 Mission Tree 경로는 제안/Draft이며 승인된 Tree 버전·승인자는 TBD입니다. Card가 참조한 INDEX.md 원본은 제공되지 않았고 저장소에서도 발견되지 않았습니다.

## 변경 범위

공학 설명의 수식 11개를 이름·식·용도·기호/단위가 있는 독립 블록으로 표시했습니다. 나머지 공학 설명의 추적 흐름·Prolog 사실/규칙/질의·변경 기록도 같은 블록 구조로 표시합니다. 기존 수식 문자열, 원리, 예시, 가정, 검토 항목과 출처 링크를 보존했습니다. 기존 소스 파일 engineering.ts는 변경하지 않았습니다.

## AI Verification

| 항목 | 결과 | 근거 |
|---|---|---|
| AC-1 | Pass | 7개 공학 설명에 총 16개 독립 블록. ADCS의 각운동량·강체 회전 운동 방정식·자기 토크 이름, 수식, 용도를 브라우저 DOM과 화면에서 확인. |
| AC-2 | Pass | 수식 11개 원문과 HEAD 문자열 비교 일치. engineering.ts diff 없음. 각 수식 블록 안에 기호·단위 설명 표시. 기존 출처 링크 유지. |
| AC-3 | Pass (브라우저 뷰포트) | 320px에서 6개 섹션 전체 블록의 scrollWidth=clientWidth, 블록 간 간격 12px 이상. 페이지 폭 305px로 뷰포트 320px 이내. 긴 식은 내부 스크롤. ADCS 자기 토크 영역 clientWidth 202px, scrollWidth 249px, ArrowRight 후 scrollLeft 40px 확인. 375px ADCS와 1280px 데스크톱도 확인. |
| TypeScript | Pass | npx tsc --noEmit |
| Lint | Pass | npm run lint |
| 회귀 테스트 | Pass | npm test: 8/8 |
| 프로덕션 빌드 | Pass | npm run build. 500kB 초과 chunk 경고와 Vinext 경로 자동 분류 안내가 있으며 빌드는 성공. |
| Diff 검사 | Pass | git diff --check |
| 실제 모바일 기기·화면 읽기 도구 | Not Run | 브라우저 뷰포트 검증만 수행. |
| Human Inspection / Sign-off | Not Run / Pending | 사람의 실제 확인 및 승인 기록 없음. |
| Push / Publish | Not Run | 로컬 후보를 제공하는 단계. |

## 후보 파일 SHA256

| 파일 | SHA256 |
|---|---|
| components/engineering-note.tsx | 209620CBD60822939D40E0EA976070184A7D7E3058603ADD96D3CFEAB08F88E1 |
| src/data/equations.ts | 5A686FC8328D087C5B2D0466F568077264E82F962D1FF2D64F4AAF7E2062852A |
| app/globals.css | 9B80DF13BE1D6C8A6452BF3C858C4F03312F77ABDEF5E70F02D1E987C04976D9 |

## Human Inspection 절차

1. 위 URL에서 위성 구조 → ADCS 아래 공학 설명으로 이동합니다.
2. 세 독립 블록의 이름·식·용도와 해당 기호/단위를 확인합니다. 원리·예시·출처가 유지됐는지 확인합니다.
3. 창을 모바일 폭으로 줄여 블록 겹침, 설명 줄바꿈, 긴 식의 가로 스크롤을 확인합니다. 임무 이해·시스템 모델·MADE 탐색·Prolog·첫 번째 과제에서도 동일한 구조를 확인합니다.

- Inspector / 기기 / 브라우저 / 확인 시각: Pending
- AC-1 / AC-2 / AC-3 실제 관찰 결과: Pending
- 수정 요청: Pending
- 승인자 / 결정 / 승인 시각: Pending
- 승인 후보: Pending (CUB-001-local-01 및 위 파일 해시와 일치 여부)
- 허용 Update / Publish 작업 및 대상: Pending
- 최종 상태: Yellow. 실제 승인을 대신 작성하지 않음.
