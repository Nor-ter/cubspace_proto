:- encoding(utf8).
% =====================================================================
% family.pl: practice file for the first Prolog tutorial
%
% How to run:
%   swipl -s family.pl
% Then type the queries from the tutorial document below one at a time at the prompt (?-).
% =====================================================================

% ---- Facts: who is whose parent ----
parent(tom, bob).
parent(tom, liz).
parent(bob, ann).
parent(bob, pat).
parent(pat, jim).

male(tom).
male(bob).
male(jim).
female(liz).
female(ann).
female(pat).

% ---- Rules ----
father(X, Y) :- parent(X, Y), male(X).
mother(X, Y) :- parent(X, Y), female(X).

grandparent(X, Z) :- parent(X, Y), parent(Y, Z).

sibling(X, Y) :- parent(P, X), parent(P, Y), X \= Y.

% Recursion: "ancestor" means a parent, or an ancestor of a parent
ancestor(X, Y) :- parent(X, Y).
ancestor(X, Y) :- parent(X, Z), ancestor(Z, Y).

% Negation as failure: "unrelated" if neither is an ancestor of the other
unrelated(X, Y) :-
    person(X), person(Y),
    X \= Y,
    \+ ancestor(X, Y),
    \+ ancestor(Y, X).

person(X) :- parent(X, _).
person(X) :- parent(_, X).
