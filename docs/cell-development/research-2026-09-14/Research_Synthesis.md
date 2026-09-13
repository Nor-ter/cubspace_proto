# 종합 제안 — 목표·변수·사례 중심 온보딩

자료 확인: 2026-09-14. NASA PDF와 UiO PDF는 다운로드해 읽었으며, Fonod 논문은 접근 가능한 TU Delft 원문으로 확인했다. 저장소 핵심 파일은 commit을 고정해 읽었다. MATLAB/Prolog 실행, 성능 비교, 웹 배포는 하지 않았다.

## 학습 구조

제안 순서: **임무에서 필요한 결과 → 관측할 상태 → 변수/좌표계 → 센서·제어·구동 흐름 → 계산 사례 → 결과와 한계**. 프로젝트 관리 설명은 없어지는 대신 마지막 근거·검토 섹션으로 압축한다. 유도는 선택 확장으로 두고 핵심 물리식과 변수 의미는 기본 화면에 남긴다.

NASA 자료는 감쇠 관찰에서 평균 자기장 특성을 추정하는 심화 사례, UiO는 폐루프/변수 설명의 기초, Fonod 논문·코드는 수치 재현 사례로 배치한다. 서로 다른 모델의 이득·단위·정지 기준은 혼합하지 않는다. 상세 출처는 R01~R04에 있다.

## 전체 Input/Output 계약 초안

| 입력 종류 | 필수 정보 | 처리 경로 / 주의 |
|---|---|---|
| Cartesian orbit state | r[3], v[3], 단위, frame, epoch/time scale, 중심 천체 | 좌표 표현만으로 전파 모델은 결정되지 않음. 적절한 전파 모델을 별도 지정 |
| Keplerian elements | a,e,i,RAAN,argPeriapsis, anomaly 종류·값, epoch, 단위 | 기본 원궤도와 일반 타원궤도를 구별; mean/true anomaly 변환 필요 여부 명시 |
| TLE | 원본 두 줄, epoch, 식별/체크 정보 | SGP4 → TEME r/v → 명시적 frame 변환. 일반 Kepler 요소처럼 바로 넣지 않음 |
| Attitude state | quaternion convention/order/direction, ω frame·rad/s, inertia kg·m² | 궤도 위치 상태와 자세 상태를 구분 |
| Sensor/controller | B frame·T/µT, sample time s, mode, saturation, seed | 변환·잡음·구동·true state를 분리 |

TLE→SGP4→TEME는 [CelesTrak SGP4 설명](https://www.celestrak.org/software/tutorials/sgp4.php)과 [공식 검증 FAQ](https://celestrak.org/publications/AIAA/2006-6753/faq.php)를 근거로 한다. “Cartesian, Keplerian, TLE”는 동등한 좌표계 세 종류가 아니다. 앞의 둘은 상태 표현, TLE는 특정 전파 이론과 결합된 데이터 형식이다.

**권장 첫 범위:** 원 코드와 일치하는 고정 원궤도 Kepler 입력을 먼저 재현하고, Cartesian/TLE는 각각 adapter와 기준 테스트가 준비된 뒤 활성화한다. 미지원 입력은 명확히 거절한다. **출력 제안:** t, q, ω, B_true/B_measured, dipole command/delivered, torque, detumble event, actuator on-time, solver/status/metadata. on-time만으로 에너지 Wh를 계산하지 않는다.

## 자체 제작 계산 사례 — 교육 가정, 성능 주장 아님

1. **자기 토크:** 같은 body frame에서 m=(0.1,0,0) A·m², B=(0,30×10⁻⁶,0) T이면 τ=(0,0,3×10⁻⁶) N·m. 평행한 B이면 0. 방향과 단위가 핵심이며 Deneb 성능값이 아니다.
2. **측정 차분:** B₀=(20,0,0), B₁=(19,1,0) µT, Δt=0.5 s이면 ΔB/Δt=(-2,2,0) µT/s. 초/밀리초 및 µT/T를 혼동하는 오답을 구별한다. 제어 이득이 없으면 m의 수치를 임의 계산하지 않는다.
3. **행렬 변환:** 명시적으로 R=[[0,-1,0],[1,0,0],[0,0,1]], v=(1,0,0), v′=Rv이면 v′=(0,1,0). 이 예시는 고정 축의 active rotation으로 정의하며 frame 변환에는 정의에 맞는 역행렬을 사용한다.

## 기초 각주/학습 리소스

- 폐루프·PID·B-dot: [UiO 강의](https://www.uio.no/studier/emner/matnat/fys/FYS3240/v23/lectures/l11---control-systems-v23.pdf), p.13–20, 22–30, 35–41.
- 좌표·행렬 기초: [MIT Matrices and Transformations](https://www.ocw.mit.edu/ans7870/18/18.013a/textbook/HTML/chapter32/section05.html).
- 영상: [MIT Lecture 30](https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/resources/lecture-30-linear-transformations-and-their-matrices-1/). 강의 페이지와 영상 존재를 확인했으며 전체 재생/타임스탬프 검증은 미수행.
- 회전/좌표 변환 규약: [MathWorks Rotations, Orientation, and Quaternions](https://www.mathworks.com/help/nav/ug/rotations-orientation-and-quaternions.html).

각주에는 제목·기관·학습할 개념·PDF 페이지를 제공하고, 영상 타임스탬프는 실제 확인한 경우만 쓴다. 새 그림은 직접 제작하고 외부 PDF/책 그림을 자동 재배포하지 않는다.

## 티켓 관계

CUB-012는 기존 001의 변수·그림 확장, 014는 기존 002의 연습 문제 확장, 016은 기존 005의 시스템 I/O 계약 확장이다. 중복 구현을 피하도록 서로 연결한다. 017 수치 adapter 전에 016 schema 및 019 재현 기준을 정하고, 018 Prolog는 승인 규칙과 메타데이터 검증에 한정한다.
