:- encoding(utf8).

% 아래 술어들은 ClickUp 갱신 때마다 값이 바뀝니다. dynamic으로 선언해두면
% 파일을 다시 로드하지 않고도(swipl 세션 안에서) assertz/retractall로
% 상태를 직접 갱신해볼 수 있습니다 — 이 파일을 손으로 고치는 게 기본
% 워크플로우지만, 세션 중 실험해볼 때 유용합니다.
:- dynamic sign_off_status/2.
:- dynamic task/4.
:- dynamic task_depends_on/2.
:- dynamic human_reviewer/2.
:- dynamic evidence/3.

% =====================================================================
% facts_tasks.pl
%
% "누가, 무엇을, 어떤 상태로 진행하고 있는가" — ClickUp(Layer 4/5/6)에서
% 나오는 사실들. 지금 단계에서는 ClickUp을 손으로 보면서 이 파일을
% 갱신하는 걸 전제로 합니다 (커넥터를 연결하지 않기로 하셨으니까요).
% 나중에 자동화하고 싶으면, ClickUp API를 직접 스크립트로 호출해서
% (MCP 커넥터와는 별개로) 이 파일을 재생성하는 것도 가능합니다 —
% 지금은 그 단계가 아니니 수동 갱신으로 시작합니다.
%
% sign_off_status 값은 반드시 여섯 단계 중 하나:
%   proposed / modeled / analysed / tested / verified / signed_off
% (Project_CubSpace_Claude_Overview §19.3 — 절대 섞어 쓰지 말 것)
% =====================================================================

% ---- Cell (담당자·서브시스템) ----
% cell(CellId, Subsystem, OwnerName).
cell(adcs_cell, adcs, 'TBD - Cell Owner 미지정').
cell(eps_cell, eps, 'TBD - Cell Owner 미지정').

% ---- Task Card ----
% task(TaskId, Title, Track, Cell).
task('TASK-ADCS-001', '디텀블링 재개시 최소 각속도 임계값 정의', track_b, adcs_cell).
task('TASK-EPS-001',  '전체 전력예산 확정 (서브시스템별 배분)', track_b, eps_cell).

% ---- Task가 근거하는 요구사항 ----
task_source_requirement('TASK-ADCS-001', 'REQ-ADCS-02').

% ---- Task 간 의존관계 ----
% "TASK-ADCS-001은 TASK-EPS-001에 약하게 의존한다" (지난 대화에서 논의한 그대로)
task_depends_on('TASK-ADCS-001', 'TASK-EPS-001').

% ---- 현재 Sign-off 상태 (2026-08-29 기준 스냅샷) ----
sign_off_status('TASK-ADCS-001', proposed).
sign_off_status('TASK-EPS-001', proposed).

% ---- 리뷰어 (Cell Owner 미지정 상태이므로 아직 없음) ----
% human_reviewer(TaskId, PersonName).

% ---- 증거 (아직 산출물 없음 — 비어있는 것 자체가 정보) ----
% evidence(EvidenceId, TaskId, Description).
