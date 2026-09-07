:- encoding(utf8).
% =====================================================================
% rules.pl
%
% "무엇이 알려져 있는 것으로부터 따라 나오는가" — Layer 3 (Prolog 추론
% 백본)의 실제 규칙들. facts_model.pl과 facts_tasks.pl은 자주 갱신되지만,
% 이 파일은 상대적으로 안정적이어야 합니다 (개요 문서 8.1절: "MADE=무엇인가,
% Prolog=무엇이 따라나오는가").
%
% 실행: swipl -s rules.pl
%   (rules.pl 안에서 나머지 두 facts 파일을 자동으로 불러옵니다)
% =====================================================================

:- consult('facts_model.pl').
:- consult('facts_tasks.pl').

% ---------------------------------------------------------------------
% 1. Sign-off 상태 헬퍼
% ---------------------------------------------------------------------

% 여섯 단계 중 "완료로 인정 가능한" 상태
verified(TaskId) :-
    sign_off_status(TaskId, verified).
verified(TaskId) :-
    sign_off_status(TaskId, signed_off).

signed_off(TaskId) :-
    sign_off_status(TaskId, signed_off).

% ---------------------------------------------------------------------
% 2. 의존관계 → 차단(blocked) / 준비(ready)
% ---------------------------------------------------------------------

% 이 태스크가 의존하는 다른 태스크가 아직 signed_off 되지 않았다면 차단됨
blocked(TaskId) :-
    task_depends_on(TaskId, DepTaskId),
    \+ signed_off(DepTaskId).

% 차단되지 않았고, 아직 proposed 단계에 머물러 있으면 "착수 가능"
ready(TaskId) :-
    task(TaskId, _, _, _),
    \+ blocked(TaskId),
    sign_off_status(TaskId, proposed).

% ---------------------------------------------------------------------
% 3. 요구사항 검증 상태
% ---------------------------------------------------------------------

% 요구사항은, 그것을 만족하는 모델 요소를 다루는 태스크가 signed_off
% 되었을 때만 "검증됨"으로 간주한다.
requirement_verified(ReqId) :-
    satisfies(_ModelElement, ReqId),
    task_source_requirement(TaskId, ReqId),
    task(TaskId, _, _, _),
    signed_off(TaskId).

requirement_open(ReqId) :-
    requirement(ReqId, _, _),
    \+ requirement_verified(ReqId).

% ---------------------------------------------------------------------
% 4. 미션 목표 준비 상태 (서브시스템 단위로 단순화한 첫 버전)
% ---------------------------------------------------------------------

% 어떤 서브시스템이 "준비됨"이려면, 그 서브시스템에 걸린 모든 요구사항이
% 검증되어야 한다. (지금은 요구사항이 몇 개 없어서 단순하지만, 태스크가
% 늘어날수록 이 규칙이 진짜 힘을 발휘합니다.)
subsystem_ready(Subsystem) :-
    subsystem(Subsystem),
    \+ ( requirement(ReqId, _, Subsystem),
         \+ requirement_verified(ReqId) ).

mission_ready(Objective) :-
    mission_objective(Objective, Subsystem),
    subsystem_ready(Subsystem).

% ---------------------------------------------------------------------
% 5. "왜 아직 준비 안 됐는지" 설명해주는 규칙 (디버깅/현황 파악용)
% ---------------------------------------------------------------------

blocking_requirements(Subsystem, ReqId) :-
    requirement(ReqId, _, Subsystem),
    \+ requirement_verified(ReqId).

blocking_tasks(TaskId, DepTaskId) :-
    blocked(TaskId),
    task_depends_on(TaskId, DepTaskId),
    \+ signed_off(DepTaskId).
