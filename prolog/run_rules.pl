:- encoding(utf8).
:- discontiguous run/4, run_check/4, run_review/4.
:- dynamic run/4, run_check/4, run_review/4.
:- consult('run_memory.pl').

checks_passed(Run) :- setof(Code, Name^Duration^run_check(Run, Name, Code, Duration), [0]).
reviewed_run(Run) :- run(Run, _, reviewed, Hash), checks_passed(Run), run_review(Run, _, pass, Hash).
needs_attention(Run) :- run(Run, _, Status, _), member(Status, [checks_failed, changes_requested, implementer_failed, reviewer_failed]).
