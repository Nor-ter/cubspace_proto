:- encoding(utf8).
% =====================================================================
% facts_model.pl
%
% "What exists, and what satisfies what": facts coming from the MADE
% model (Layer 1). There is no MADE model yet, so only content actually
% confirmed in ConOps/RPT-ENG-031 has been encoded by hand. Once Phase 1
% (MADE modelling) is complete, this file will be replaced or extended by
% MADE's export feature (if available) or by manual updates; that is,
% this file is a "shadow of the MADE model", not a separate source of truth.
%
% Source citation principle: every fact records its source document and
% section number in a comment. (CubSpace principle 19.2, source traceability)
% =====================================================================

% ---- Subsystems (RPT-ENG-031 §6.5 Subsystem Architecture list) ----
subsystem(adcs).
subsystem(eps).
subsystem(comms).
subsystem(obc).
subsystem(structure).
subsystem(thermal).
subsystem(payload).

% ---- Mission objectives (Project_CubSpace_Claude_Overview §21, ConOps §1.1) ----
mission_objective(demonstrate_deneb_adcs, adcs).
mission_objective(demonstrate_etp_panels, payload).
mission_objective(establish_comms, comms).

% ---- Requirements (based on the ConOps text) ----
% REQ-ADCS-01: angular rate must be below 5°/s before antenna deployment (ConOps §3.2)
requirement('REQ-ADCS-01',
    'Angular rate must fall below 5 deg/s for antenna deployment',
    adcs).

% REQ-ADCS-02: the on-orbit re-detumbling initiation threshold must be defined (ConOps §5.1, TBD)
requirement('REQ-ADCS-02',
    'Define the minimum angular rate threshold for initiating re-detumbling against natural on-orbit spin-up',
    adcs).

% REQ-EPS-01: at least 2 Wh of charge required before detumbling starts (ConOps §3.1.2)
requirement('REQ-EPS-01',
    'Secure at least 2 Wh of battery charge before detumbling starts',
    eps).

% ---- Model elements (before MADE modelling; still placeholders, filled in Phase 1) ----
model_element(me_detumble_function, adcs, function).
model_element(me_magnetorquer, adcs, component).
model_element(me_antenna_deploy, comms, function).
model_element(me_battery_pack, eps, component).

% ---- Requirement to model element allocation (satisfies/2) ----
% "This model element is designed to satisfy this requirement"
satisfies(me_detumble_function, 'REQ-ADCS-02').
satisfies(me_antenna_deploy, 'REQ-ADCS-01').
satisfies(me_battery_pack, 'REQ-EPS-01').

% ---- Failure modes (before the Phase 1 FMECA; still empty, intentionally absent) ----
% failure_mode(FMID, ModelElement, Description).
% (For example, this section is filled after the FMECA is complete. For now, its absence is itself information.)
