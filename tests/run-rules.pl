% Run with swipl -q -s tests/run-rules.pl -g run_tests -t halt.
:- consult('../prolog/run_rules.pl').
:- begin_tests(run_rules).

test(reviewed_snapshot_has_one_solution, [setup(seed), cleanup(clear)]) :-
    findall(R, (member(R, [qa_pass, qa_fail, qa_stale]), reviewed_run(R)), Runs),
    assertion(Runs == [qa_pass]),
    findall(R, (checks_passed(R), memberchk(R, [qa_pass, qa_fail, qa_stale])), Passed),
    assertion(Passed == [qa_pass, qa_stale]).

seed :-
    assertz(user:run(qa_pass, qa_ticket, reviewed, h1)),
    assertz(user:run_check(qa_pass, unit, 0, 10)),
    assertz(user:run_check(qa_pass, build, 0, 20)),
    assertz(user:run_review(qa_pass, reviewer, pass, h1)),
    assertz(user:run(qa_fail, qa_ticket, reviewed, h1)),
    assertz(user:run_check(qa_fail, unit, 1, 10)),
    assertz(user:run_review(qa_fail, reviewer, pass, h1)),
    assertz(user:run(qa_stale, qa_ticket, reviewed, h2)),
    assertz(user:run_check(qa_stale, unit, 0, 10)),
    assertz(user:run_review(qa_stale, reviewer, pass, h1)).

clear :-
    forall(member(R, [qa_pass, qa_fail, qa_stale]),
      (retractall(user:run(R, _, _, _)),
       retractall(user:run_check(R, _, _, _)),
       retractall(user:run_review(R, _, _, _)))).

:- end_tests(run_rules).
