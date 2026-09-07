:- encoding(utf8).
% =====================================================================
% family.pl — Prolog 첫 튜토리얼용 연습 파일
%
% 실행법:
%   swipl -s family.pl
% 그 다음 프롬프트(?-)에 아래 튜토리얼 문서에 나오는 질의를 하나씩 쳐보세요.
% =====================================================================

% ---- 사실(Facts) : 누가 누구의 부모인가 ----
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

% ---- 규칙(Rules) ----
father(X, Y) :- parent(X, Y), male(X).
mother(X, Y) :- parent(X, Y), female(X).

grandparent(X, Z) :- parent(X, Y), parent(Y, Z).

sibling(X, Y) :- parent(P, X), parent(P, Y), X \= Y.

% 재귀(Recursion): "조상" — 부모이거나, 부모의 조상이거나
ancestor(X, Y) :- parent(X, Y).
ancestor(X, Y) :- parent(X, Z), ancestor(Z, Y).

% 음성 실패(Negation as failure): 서로 조상관계가 아니면 "무관계"
unrelated(X, Y) :-
    person(X), person(Y),
    X \= Y,
    \+ ancestor(X, Y),
    \+ ancestor(Y, X).

person(X) :- parent(X, _).
person(X) :- parent(_, X).
