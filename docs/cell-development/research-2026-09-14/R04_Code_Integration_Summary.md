# R04 — detumbling-simulator 코드와 연동 검토

**원본:** [rfonod/detumbling-simulator](https://github.com/rfonod/detumbling-simulator) · 읽기 전용으로 확인한 commit: `83aaef530307808ef01e46c136f2955ef00cc95b`. 이 문서는 정적 검토이며 실행 성공 보고서가 아니다.

## 실제 코드에서 확인한 경계

- `main(seed, N_orb_mc)`에서 인자를 주면 Monte Carlo 모드다. 따라서 seed만 붙인 호출을 기본 단일 실행과 동등하다고 취급하면 안 된다. 단일 실행은 plotting/workspace 부작용이 있고, MC 반환은 packed summary이므로 웹용 시계열 API가 아니다.
- `main_old.m`의 C_type 분기로 weighted/classical을 선택한다. `main.m`과 논문용 버전을 구분해 고정한다.
- `kepler2cart(a,e,i,Omega,omega,nu,mu)`는 m·rad 입력, m·m/s 출력이며 nu는 true anomaly다. main의 기본 궤도는 원궤도다. 일반 타원궤도에서 mean anomaly를 그대로 nu에 넣으면 안 된다.
- `q2dcm` 및 propagator는 quaternion 순서/변환 방향을 확인해야 한다. 초기 `[1,0,0,0]`을 scalar-first identity라고 추측하지 않는다.
- `propag_att.m`은 자기장을 µT→T로 바꿔 토크를 계산한다. 중력구배 토크 합산은 주석 처리돼 있다. 모델 이름만 보고 모든 외란이 활성화됐다고 주장하지 않는다.

코드 근거: [main.m](https://github.com/rfonod/detumbling-simulator/blob/83aaef530307808ef01e46c136f2955ef00cc95b/main.m), [main_old.m](https://github.com/rfonod/detumbling-simulator/blob/83aaef530307808ef01e46c136f2955ef00cc95b/main_old.m), [변환](https://github.com/rfonod/detumbling-simulator/blob/83aaef530307808ef01e46c136f2955ef00cc95b/kepler2cart.m), [propagator](https://github.com/rfonod/detumbling-simulator/blob/83aaef530307808ef01e46c136f2955ef00cc95b/propag_att.m).

## 연동 선택 — 제안

| 방식 | 적합한 역할 | 조건 |
|---|---|---|
| Python → MATLAB Engine | 기존 수치 코드를 호출하는 첫 PoC | MATLAB·호환 Python·필요 Toolbox 확보, 구조화 adapter 필요 |
| Prolog → Python → MATLAB | 입력 규칙·실행 자격·근거 추적 | Python 수치 결과를 명시적 schema로 전달 |
| Python으로 수치 코어 이식 | 장기적으로 MATLAB 없는 실행 | 별도 구현·수치 동등성 검증; 단순 wrapper가 아님 |

[MathWorks Engine](https://www.mathworks.com/help/matlab/matlab-engine-for-python.html)은 Python에서 MATLAB 호출을 지원한다. [SWI-Prolog Janus](https://www.swi-prolog.org/pldoc/man?section=janus)는 Prolog/Python 연결 경로다. Prolog가 MATLAB 수치 적분기를 직접 대체한다고 제안하지 않는다.

**첫 PoC의 완료 기준:** 버전·solver·seed·입력 schema·단위·frame·외란 스위치를 고정하고 직접 MATLAB 결과와 adapter 결과를 비교한다. 타임아웃/실패/NaN은 실패 또는 미완료로 보존한다. MATLAB 설치·라이선스·실행시간은 이번에 확인하지 않았다. 저장소 MIT와 bundled third-party 조건은 별도로 기록한다. 배포 권한·서비스 구조는 결정하지 않았다.

**연결 카드:** CUB-016~019.
