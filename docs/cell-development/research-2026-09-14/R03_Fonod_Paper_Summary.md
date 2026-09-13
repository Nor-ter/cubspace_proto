# R03 — Magnetic Detumbling of Fast-tumbling Picosatellites

**원문:** [Fonod & Gill, IAC-18-C1.3.11, 2018](https://pure.tudelft.nl/ws/portalfiles/portal/47149549/IAC_18_C1_3_11_x46290.pdf). 저자 원고 11페이지 + 저장소 표지 1페이지. 이것이 사용자가 제공한 MATLAB 저장소의 연관 논문이다.

**연구 질문:** 빠르게 회전하는 Delfi-PQ에서 제한된 자기 센서·구동기로 detumbling을 달성하면서 구동 부담을 줄일 수 있는가?

**핵심:** weighted B-dot, 자기장 측정 기반 tumble parameter, 검출 상태와 표본/구동 주기의 관계를 다룬다. 논문 p.1은 큰 초기 회전과 샘플링의 중요성, p.2의 §2.1–2.3은 좌표계·강체 회전·자기 토크를 설명한다. 논문의 Monte Carlo 결과는 해당 모델과 분산 조건의 시뮬레이션 결과다. 임의 CubeSat의 비행 성능 보장이 아니다.

**웹 적용 제안:** 동일 조건에서 제어 법칙을 비교하는 Case Example으로 사용한다. 초기 상태·샘플링·포화·실패 조건을 함께 보여주고 단일 성공 그래프를 보편적 결과처럼 제시하지 않는다. “관측 가능한 제어 지표”와 시뮬레이터 내부의 true angular rate를 구별한다.

**재현 주의:** 저장소 README는 논문 기여가 `main_old.m`의 `C_type=1`이며 현재 `main.m`은 고정 이득이라고 설명한다. 내려받은 코드에서도 그 분기를 확인했다. “최신 main 실행 = 논문 재현”은 성립하지 않는다. 이번 작업에서는 MATLAB 실행이나 논문 수치 재현을 하지 않았다.

**연결 카드:** CUB-014, CUB-017, CUB-019. 위 웹 적용은 제안이며, 논문 수식/도표를 새로 검증했다는 뜻은 아니다.
