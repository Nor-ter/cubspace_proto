:- encoding(utf8).
% =====================================================================
% rules.pl
%
% "What follows from what is known": the actual rules of Layer 3 (the
% Prolog reasoning backbone). facts_model.pl and facts_tasks.pl are updated
% often, but this file should be relatively stable (overview document
% Section 8.1: "MADE = what exists, Prolog = what follows").
%
% Run: swipl -s rules.pl
%   (rules.pl loads the other two facts files automatically)
% =====================================================================

:- consult('facts_model.pl').
:- consult('facts_tasks.pl').

% ---------------------------------------------------------------------
% 1. Sign-off state helpers
% ---------------------------------------------------------------------

% States among the six stages that "can be accepted as complete"
verified(TaskId) :-
    sign_off_status(TaskId, verified).
verified(TaskId) :-
    sign_off_status(TaskId, signed_off).

signed_off(TaskId) :-
    sign_off_status(TaskId, signed_off).

% ---------------------------------------------------------------------
% 2. Dependencies → blocked / ready
% ---------------------------------------------------------------------

% Blocked if another task this task depends on has not yet been signed_off
blocked(TaskId) :-
    task_depends_on(TaskId, DepTaskId),
    \+ signed_off(DepTaskId).

% "Ready to start" if not blocked and still at the proposed stage
ready(TaskId) :-
    task(TaskId, _, _, _),
    \+ blocked(TaskId),
    sign_off_status(TaskId, proposed).

% ---------------------------------------------------------------------
% 3. Requirement verification state
% ---------------------------------------------------------------------

% A requirement is considered "verified" only when a task covering the
% model element that satisfies it has been signed_off.
requirement_verified(ReqId) :-
    satisfies(_ModelElement, ReqId),
    task_source_requirement(TaskId, ReqId),
    task(TaskId, _, _, _),
    signed_off(TaskId).

requirement_open(ReqId) :-
    requirement(ReqId, _, _),
    \+ requirement_verified(ReqId).

% ---------------------------------------------------------------------
% 4. Mission objective readiness (first version, simplified per subsystem)
% ---------------------------------------------------------------------

% For a subsystem to be "ready", every requirement attached to it must be
% verified. (It is simple now because there are few requirements, but this
% rule shows its real power as the number of tasks grows.)
subsystem_ready(Subsystem) :-
    subsystem(Subsystem),
    \+ ( requirement(ReqId, _, Subsystem),
         \+ requirement_verified(ReqId) ).

mission_ready(Objective) :-
    mission_objective(Objective, Subsystem),
    subsystem_ready(Subsystem).

% ---------------------------------------------------------------------
% 5. Rules that explain "why it is not ready yet" (for debugging and status review)
% ---------------------------------------------------------------------

blocking_requirements(Subsystem, ReqId) :-
    requirement(ReqId, _, Subsystem),
    \+ requirement_verified(ReqId).

blocking_tasks(TaskId, DepTaskId) :-
    blocked(TaskId),
    task_depends_on(TaskId, DepTaskId),
    \+ signed_off(DepTaskId).
