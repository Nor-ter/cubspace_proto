:- encoding(utf8).
:- ensure_loaded('mission_facts.pl').

% Directed Mission Tree edges; Cell/Task assignment is separate.
mission_edge(Parent, Child) :-
    mission_path(_, Path), append(_, [Parent,Child|_], Path).

% Leaves are relative to this extracted draft snapshot, not a complete mission.
task_leaf(Task, Leaf, Cell, Status) :-
    mission_path(Task, Path), last(Path, Leaf),
    task_cell(Task, Cell), cell_leaf(Cell, Leaf),
    \+ mission_edge(Leaf, _), sign_off(Task, Status).

tasks_under(Node, Task) :- mission_path(Task, Path), member(Node, Path).
needs_work(Task) :- task_leaf(Task, _, _, red).
needs_review(Task) :- task_leaf(Task, _, _, yellow).
human_signed(Task) :- task_leaf(Task, _, _, green).
% human_signed is recorded state only; never infer release authorization here.
