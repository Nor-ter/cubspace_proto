# Prolog tutorial (CubeSat version): the same concepts, again with ACRUX-2

This has **exactly the same structure** as the earlier `family.pl` (tom/bob/liz...). It is not just the names that changed; "parent and child" has become "what a System consists of". Why this correspondence fits so well is the key point: the family tree and MADE's System < Subsystem < Component hierarchy (overview document Section 6.1) are, mathematically, **the same tree structure**. Only the data changes; the shape of the rules stays the same.

```bash
swipl -s cubesat.pl
```

---

## 1. Facts: the hierarchy

```prolog
consists_of(acrux2, adcs).
consists_of(acrux2, eps).
consists_of(adcs, magnetorquer).
consists_of(eps, battery_pack).
```

As a diagram (these are the components that actually appear in the ConOps):

```
acrux2 ─┬─ adcs ── magnetorquer (Deneb)
        ├─ eps  ─┬─ battery_pack (18650 x3)
        │        └─ thermal_heater
        ├─ comms ─┬─ lora_module
        │         └─ antenna (Endurosat)
        ├─ obc ── atmega_mcu
        └─ payload ── etp_panel
```

Just as `parent(tom, bob)` meant "tom is a parent of bob", `consists_of(acrux2, adcs)` means "acrux2 consists of adcs". The direction is also the same: from the larger item (top) to the smaller item (bottom).

## 2. Queries

```prolog
?- consists_of(acrux2, X).
X = adcs ;
X = eps ;
X = comms ;
X = obc ;
X = payload.
```

Just as `parent(tom, X)` found all of tom's children, this finds all five subsystems that directly make up ACRUX-2.

```prolog
?- consists_of(X, antenna).
X = comms.
```

Questions in the opposite direction also work: "which subsystem does the antenna belong to?"

## 3. Rules and unification

Using the same pattern as `father/mother` in family.pl (parents with a specific attribute), let us define "critical sub-elements".

```prolog
critical(antenna).       % ConOps §7.1: antenna deployment failure is mission-ending
critical(battery_pack).  % ConOps §7.1: battery thermal management failure risks permanent damage

critical_subcomponent(X, Y) :- consists_of(X, Y), critical(Y).
```

```prolog
?- critical_subcomponent(eps, X).
X = battery_pack.
```

A rule that finds items "two levels down", following the same pattern as `grandparent/2`, carries over unchanged.

```prolog
assembly(X, Z) :- consists_of(X, Y), consists_of(Y, Z).
```

```prolog
?- assembly(acrux2, X).
X = magnetorquer ;
X = battery_pack ;
X = thermal_heater ;
X = lora_module ;
X = antenna ;
X = atmega_mcu ;
X = etp_panel.
```

The same pattern as `sibling/2`, "items under the same parent element":

```prolog
sibling_component(X, Y) :- consists_of(P, X), consists_of(P, Y), X \= Y.
```

```prolog
?- sibling_component(battery_pack, X).
X = thermal_heater.
```

battery_pack and thermal_heater are both under eps, so they are identified as "siblings". Even though these are components rather than people, the tree structure is the same, so the rule works unchanged.

## 4. Recursion: exactly the same pattern as ancestor

```prolog
contains(X, Y) :- consists_of(X, Y).
contains(X, Y) :- consists_of(X, Z), contains(Z, Y).
```

```prolog
?- contains(acrux2, X).
X = adcs ;
X = eps ;
X = comms ;
X = obc ;
X = payload ;
X = magnetorquer ;
X = battery_pack ;
X = thermal_heater ;
X = lora_module ;
X = antenna ;
X = atmega_mcu ;
X = etp_panel.
```

Just as `ancestor(tom, X)` found tom's descendants across any number of generations, `contains(acrux2, X)` finds everything belonging to ACRUX-2, whether a subsystem or a component below it, regardless of level. The rule remains two lines, and even if the hierarchy later becomes one level deeper, down to the Part-pair level (for example, each individual coil inside the magnetorquer), this rule does not change, for the same reason that the `ancestor` rule did not change when a great-grandchild appeared in family.pl.

## 5. Negation as failure: "mutually independent components"

```prolog
independent(X, Y) :-
    component(X), component(Y), X \= Y,
    \+ contains(X, Y),
    \+ contains(Y, X).
```

```prolog
?- independent(antenna, battery_pack).
true.

?- independent(acrux2, antenna).
false.
```

antenna and battery_pack have no containment relation (they merely sit side by side under acrux2), so they are identified as independent, whereas acrux2 contains antenna, so they are not independent. This is exactly the same logic as the difference between `unrelated(liz, jim)` and `unrelated(tom, jim)`.

---

## 6. The three levels now connect

| Concept                  | family.pl (practice) | cubesat.pl (this one, hierarchy practice) | rules.pl (actual project)              |
| ------------------------ | -------------------- | ----------------------------------------- | -------------------------------------- |
| Facts                    | `parent(tom, bob)`   | `consists_of(acrux2, adcs)`               | `task_depends_on(A, B)`                |
| Rules with unification   | `grandparent/2`      | `assembly/2`                              | `blocked/1`                            |
| Recursion                | `ancestor/2`         | `contains/2`                              | `transitively_blocked/1` (exercise)    |
| Negation as failure      | `unrelated/2`        | `independent/2`                           | `ready/1`                              |

cubesat.pl shares its domain with rules.pl (both are ACRUX-2), but the relations it handles differ: cubesat.pl handles **"what consists of what"** (the MADE model, Layer 1), and rules.pl handles **"what depends on what and what is complete"** (Task Cards, Layers 4 to 6). In practice, once MADE modelling begins in Phase 1, `facts_model.pl` will be filled from the actual MADE model export with `consists_of`-style facts almost identical to those now in cubesat.pl. What was practised today is effectively a rehearsal of the code that will go in that place.

## 7. Exercises

1. Add a component called `magnetometer` under `payload` (one line of fact), predict what `sibling_component(etp_panel, magnetometer)` will return, and then check.
2. How does the result of `critical_subcomponent(adcs, X)` change if you add `critical(magnetorquer)`?
3. (Challenge) Define `shares_subsystem(X, Y)`, a rule that decides whether two different components belong to the same subsystem family **even indirectly** (for example, magnetorquer and a gyroscope to be added later). Before starting, think first about how it would differ from `sibling_component`.
