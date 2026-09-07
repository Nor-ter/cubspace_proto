:- encoding(utf8).
% =====================================================================
% facts_model.pl
%
% "무엇이 존재하고, 무엇이 무엇을 만족하는가" — MADE 모델(Layer 1)에서
% 나오는 사실들. 지금은 MADE 모델이 아직 없으므로 ConOps/RPT-ENG-031에서
% 실제로 확인된 내용만 손으로 인코딩했습니다. Phase 1(MADE 모델링)이
% 끝나면, 이 파일은 MADE의 export 기능(있다면) 또는 수작업 갱신으로
% 대체/확장됩니다 — 즉 이 파일은 "MADE 모델의 그림자(shadow)"이지,
% 별도의 진실 소스가 아닙니다.
%
% 출처 표기 원칙: 모든 fact는 주석으로 근거 문서·절 번호를 남깁니다.
% (CubSpace 원칙 19.2 — 출처 추적성)
% =====================================================================

% ---- 서브시스템 (RPT-ENG-031 §6.5 Subsystem Architecture 목록) ----
subsystem(adcs).
subsystem(eps).
subsystem(comms).
subsystem(obc).
subsystem(structure).
subsystem(thermal).
subsystem(payload).

% ---- 미션 목표 (Project_CubSpace_Claude_Overview §21, ConOps §1.1) ----
mission_objective(demonstrate_deneb_adcs, adcs).
mission_objective(demonstrate_etp_panels, payload).
mission_objective(establish_comms, comms).

% ---- 요구사항 (ConOps 원문 근거) ----
% REQ-ADCS-01: 안테나 전개 전 각속도 5°/s 미만이어야 함 (ConOps §3.2)
requirement('REQ-ADCS-01',
    '안테나 전개를 위해 각속도가 5도/s 미만으로 낮아져야 함',
    adcs).

% REQ-ADCS-02: 궤도상 재-디텀블링 개시 임계값이 정의되어야 함 (ConOps §5.1, TBD)
requirement('REQ-ADCS-02',
    '궤도상 자연 스핀업에 대한 재-디텀블링 개시 최소 각속도 임계값 정의',
    adcs).

% REQ-EPS-01: 디텀블링 개시 전 최소 2Wh 충전 필요 (ConOps §3.1.2)
requirement('REQ-EPS-01',
    '디텀블링 개시 전 배터리에 최소 2Wh 충전 확보',
    eps).

% ---- 모델 요소 (MADE 모델링 이전 — 아직 placeholder, Phase 1에서 실제 채움) ----
model_element(me_detumble_function, adcs, function).
model_element(me_magnetorquer, adcs, component).
model_element(me_antenna_deploy, comms, function).
model_element(me_battery_pack, eps, component).

% ---- 요구사항-모델요소 할당 (satisfies/2) ----
% "이 모델 요소가 이 요구사항을 만족하도록 설계된다"
satisfies(me_detumble_function, 'REQ-ADCS-02').
satisfies(me_antenna_deploy, 'REQ-ADCS-01').
satisfies(me_battery_pack, 'REQ-EPS-01').

% ---- 고장모드 (Phase 1 FMECA 이전 — 아직 비어있음, 의도적으로 없음) ----
% failure_mode(FMID, ModelElement, Description).
% (예: FMECA 완료 후 이 섹션이 채워짐. 지금은 없다는 사실 자체가 정보임)
