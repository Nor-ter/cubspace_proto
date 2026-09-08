# Engineering content review — 2026-09-08

Scope: seven reading pages, six quiz sessions, main teaching panels, subsystem properties, ADCS diagram and Prolog examples. General physics is distinguished from source project statements and illustrative assumptions.

## Corrections
- Quiz RadioGroup width: remove the 100% width plus left-margin overflow.
- Orbit: centre a textured spherical Earth and satellite asset geometrically; use the same orbit frame for line and satellite, depth testing for occultation and elapsed-time animation. Display is explicitly not to scale or a flight simulation.
- Reading steps: separate 7 reference readings from 6 quiz sessions; consistent navigation, ordered cards with descriptions and responsive connector placement.
- ADCS: distinguish detumbling from full attitude determination/pointing; magnetic torque is m×B and has directional limitations. Explain B-dot energy damping with assumptions and units.
- MADE: torque is not energy. Explain Energy as the project model category; units, state flags, scope and source-based hierarchy.
- Prolog: exact supported queries only, direct subsystem rule added, empty evidence predicates declared, no implication that a fact is approved or a query is flight authorization.
- Replace slogan recall with evidence-based engineering judgement.

## Source conflicts retained for engineering disposition
- ConOps §2: 3 cells; Modeling §1/§2.2: 3–4 parallel cells TBD.
- ConOps 40% maximum DoD versus payload operation above 40% SOC. These are different thresholds.
- ConOps power margin 0.31−0.20 = 0.11 W, approximately 0.1 W in source.
- Antenna energy 5 V×0.25 A×10 s = 0.00347 Wh versus conservative 0.005 Wh source estimate.
- ConOps §5.1: offset centre of mass alone does not cause spontaneous spin-up; external torques are needed to change inertial angular momentum.
- ConOps <5°/s lacks vector/axis interpretation and dwell criterion; no invented acceptance test.
- Low-energy emergency deployment exception is retained; normal order is not universal.
- Deneb axes/driver details and GLB wings are not established flight hardware specifications. Camera remains TBD.

References appear beside the new engineering explanations. NASA GNC, NASA Systems Engineering Handbook, NASA orbital mechanics, NASA magnetic-control reference, SWI-Prolog and provided ConOps/Modeling documents were consulted. Browser quizzes remain training-only and are not design sign-off.

## 검증 결과
- 기존 학습 로직 테스트 8개 통과.
- 30개 퀴즈: ID 중복, 선택지 중복, 정답 인덱스, 해설 존재 검사 통과.
- 7개 읽기 자료 모두 공학 설명과 연결됨.
- 데스크톱 7개 읽기 자료 렌더링 및 가로 넘침 검사 통과.
- 모바일 390px에서 7개 읽기 자료, 6개 퀴즈 세션 가로 넘침 없음. 모든 선택지가 질문 카드 경계 안에 포함됨.
- 실제 브라우저에서 4/5 오답 피드백 → 답 수정 → 5/5 완료 확인. 검증용 진행 기록은 시작 상태(0/6)로 복원.
- Prolog 지원 질의는 지정 결과를 표시하고, component(eps, X). 같은 미지원 질의는 결과를 꾸며내지 않고 안내 표시.
- 궤도 중심과 앞뒤 가림을 화면에서 확인. 브라우저 오류 로그 없음.
- 기본 린트와 TypeScript 검사 통과. 전체 components/ui 생성 라이브러리의 기존 린트 이슈까지 해결한 것은 아님.
- 빌드의 500 kB 초과 청크 경고는 성능 개선 후보이며 빌드 실패는 아님.

이 검토는 교육 콘텐츠·소프트웨어 검증입니다. 문서에 남은 실제 비행 형상·수치 충돌을 임의로 확정하지 않았습니다.
