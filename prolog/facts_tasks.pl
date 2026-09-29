:- encoding(utf8).

% The predicates below change value whenever ClickUp is updated. Declaring
% them dynamic lets you update the state directly with assertz/retractall
% (inside a swipl session) without reloading the file. Editing this file
% by hand is the default workflow, but this is useful for experiments
% during a session.
:- dynamic sign_off_status/2.
:- dynamic task/4.
:- dynamic task_depends_on/2.
:- dynamic human_reviewer/2.
:- dynamic evidence/3.

% =====================================================================
% facts_tasks.pl
%
% "Who is doing what, and in what state": facts coming from ClickUp
% (Layers 4/5/6). At this stage the file is assumed to be updated by
% looking at ClickUp by hand (since it was decided not to connect the
% connector). If automation is wanted later, a script can call the
% ClickUp API directly (separately from the MCP connector) to regenerate
% this file; that is not the current stage, so it starts with manual updates.
%
% The sign_off_status value must be one of the six stages:
%   proposed / modeled / analysed / tested / verified / signed_off
% (Project_CubSpace_Claude_Overview §19.3; never mix them)
% =====================================================================

% ---- Cells (owner and subsystem) ----
% cell(CellId, Subsystem, OwnerName).
cell(adcs_cell, adcs, 'TBD - Cell Owner not assigned').
cell(eps_cell, eps, 'TBD - Cell Owner not assigned').

% ---- Task Cards ----
% task(TaskId, Title, Track, Cell).
task('TASK-ADCS-001', 'Define minimum angular rate threshold for re-initiating detumbling', track_b, adcs_cell).
task('TASK-EPS-001',  'Finalise the overall power budget (allocation per subsystem)', track_b, eps_cell).

% ---- Requirements that tasks are based on ----
task_source_requirement('TASK-ADCS-001', 'REQ-ADCS-02').

% ---- Dependencies between tasks ----
% "TASK-ADCS-001 depends weakly on TASK-EPS-001" (exactly as discussed in the previous conversation)
task_depends_on('TASK-ADCS-001', 'TASK-EPS-001').

% ---- Current sign-off state (snapshot as of 2026-08-29) ----
sign_off_status('TASK-ADCS-001', proposed).
sign_off_status('TASK-EPS-001', proposed).

% ---- Reviewers (none yet, since Cell Owners are not assigned) ----
% human_reviewer(TaskId, PersonName).

% ---- Evidence (no deliverables yet; the emptiness itself is information) ----
% evidence(EvidenceId, TaskId, Description).
