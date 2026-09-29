# First Prolog tutorial: learning with a family example

Open `family.pl` and read along while typing the queries below yourself, one at a time. Every result shown here was confirmed by actually running it in SWI-Prolog.

```bash
swipl -s family.pl
```

When the prompt changes to `?-`, you are ready. Always end each query with a full stop (`.`).

---

## 1. Facts: they are just statements

`family.pl` contains the following.

```prolog
parent(tom, bob).
parent(tom, liz).
parent(bob, ann).
parent(bob, pat).
parent(pat, jim).
```

`parent(tom, bob).` is a single fact: "tom is a parent of bob". It is not code; it is just a statement. Drawn as a family tree, it looks like this.

```
tom ─┬─ bob ─┬─ ann
     │       └─ pat ─ jim
     └─ liz
```

## 2. Queries: asking the facts

```prolog
?- parent(tom, bob).
true.
```

Asking whether `tom` is a parent of `bob` gives `true`. We simply asked about a fact that is already known.

Now let us add a **variable**. In Prolog, every name starting with an upper-case letter (`X`, `Y`, `Name`...) is a variable.

```prolog
?- parent(tom, X).
X = bob ;
X = liz.
```

When asked what `X` can be, Prolog scans the list of facts and finds **every matching value**, one at a time. Typing a semicolon (`;`) means "show me more answers if there are any". This is Prolog's first characteristic: **a single question can have several answers, and Prolog finds all of them.**

You can also ask in the opposite direction.

```prolog
?- parent(X, jim).
X = pat.
```

The important point is that the same fact `parent/2` lets you ask both "who are tom's children?" and "who is jim's parent?". We are used to writing functions in one direction only, "input → output", but Prolog facts and rules have no direction. Fill in either side and ask, and it finds the rest.

## 3. Rules: creating new relations from facts

```prolog
grandparent(X, Z) :- parent(X, Y), parent(Y, Z).
```

How to read it: "If X is a parent of Y and Y is a parent of Z, then X is a grandparent of Z." `:-` means "if", and the comma (`,`) means "and (AND)".

```prolog
?- grandparent(tom, X).
X = ann ;
X = pat.
```

Notice that `Y` does not appear anywhere in the answer. `Y` is an **intermediate variable** used only inside the rule. Prolog internally tries "what if Y is bob? what if it is liz?" and finds the combinations that satisfy both conditions at once. This is **unification**: the process of fitting values to variables to find the values that make the whole rule true.

The sibling relation can be built in the same way.

```prolog
sibling(X, Y) :- parent(P, X), parent(P, Y), X \= Y.
```

"If P is a parent of X, P is a parent of Y, and X and Y are different people, then X and Y are siblings." (`\=` means "is different from")

```prolog
?- sibling(ann, X).
X = pat.
```

## 4. Recursion: this is Prolog's real power

Let us define "ancestor". A parent is of course an ancestor, a parent's parent is also an ancestor, and so on upwards, however many generations back. How can this be written as a single rule?

```prolog
ancestor(X, Y) :- parent(X, Y).                    % base case
ancestor(X, Y) :- parent(X, Z), ancestor(Z, Y).     % recursive case
```

First line: "A direct parent is an ancestor." Second line: "If X is a parent of Z and Z is an ancestor of Y, then X is also an ancestor of Y." The rule calls itself (`ancestor`) inside its own definition. This is recursion.

```prolog
?- ancestor(tom, X).
X = bob ;
X = liz ;
X = ann ;
X = pat ;
X = jim.
```

It finds not only `tom`'s direct children (`bob`, `liz`) but also the grandchildren (`ann`, `pat`) and great-grandchild (`jim`). The rule is only two lines, yet it works however many generations the family tree grows to; there is no need to write more rules for each generation. **This is exactly the approach needed in our CubSpace project to handle task dependency chains (A depends on B, B depends on C, ...).**

## 5. Negation as failure: expressing "not known"

```prolog
unrelated(X, Y) :-
    person(X), person(Y), X \= Y,
    \+ ancestor(X, Y),
    \+ ancestor(Y, X).
```

`\+` means "cannot be proved". "If it cannot be proved that X is an ancestor of Y, and it cannot be proved that Y is an ancestor of X, then the two are unrelated."

```prolog
?- unrelated(liz, jim).
true.

?- unrelated(tom, jim).
false.
```

`liz` and `jim` are not connected in either direction of the family tree, so the answer is `true`. `tom` is an ancestor of `jim` (confirmed in Section 4), so the answer is `false`. The important point is that Prolog did not "actively prove that they are unrelated"; it answered on the basis that "no evidence of a relation was found". This subtle difference is exactly the same principle as distinguishing "not verified" from "verification failed" in CubSpace.

---

## 6. Looking at our `rules.pl` again

The CubSpace code we built earlier follows exactly the same patterns as this tutorial.

| family.pl                                                            | rules.pl                                                               | Why they are the same                     |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------- |
| `parent(tom, bob).`                                                  | `task_depends_on('TASK-ADCS-001', 'TASK-EPS-001').`                    | Both are facts expressing a "relation"    |
| `grandparent(X,Z) :- parent(X,Y), parent(Y,Z).`                      | `blocked(TaskId) :- task_depends_on(TaskId, Dep), \+ signed_off(Dep).` | Both are rules joining several conditions with AND |
| `ancestor(X,Y) :- ...; ancestor(X,Y) :- parent(X,Z), ancestor(Z,Y).` | `transitively_blocked/1`, which we wrote as an exercise                | Both follow a chain recursively           |
| `\+` in `unrelated/2`                                                | `ready(TaskId) :- ..., \+ blocked(TaskId), ...`                        | Both use "not proved" as a condition      |

In other words, the four things learned today (facts, rules with unification, recursion, negation as failure) are all there is to our project code. There are no new concepts; the same patterns are applied with a different domain.

## 7. Exercises to try yourself

Open `family.pl` and add the following. The answers are not given; ask any time you get stuck.

1. Using `mother(X, Y)`, write a query that finds who `pat`'s mother is.
2. Running `sibling(bob, X)` returns `liz`. Reread the rule and explain why `X = bob` itself is not returned. (Hint: the `X \= Y` part)
3. (Challenge) `cousin(X, Y)`: define the cousin relation. "Two people are cousins if their parents are siblings."

Solving exercise 3 is exactly the same thought process as turning a real question in our `rules.pl`, such as "should two tasks belonging to different Cells be considered related if they share the same parent requirement?", into a rule.
