# Prolog records and teaching model

The run records of the current development automation are `run_memory.pl` and `run_rules.pl`. See [Ticket automation](../docs/workflow.md) for the detailed commands. Facts are generated from the run state files and kept separate from the historical model examples below. If SWI-Prolog could not be installed in the current environment, native query verification is not reported as performed.

## Previous teaching model (historical snapshot)

The description below is a record of the previous `facts_model.pl`, `facts_tasks.pl` and `rules.pl`. It is not the live state of the new development pipeline.

# CubSpace Prolog Knowledge Backbone: first executable version

This turns Chapter 8 of the overview document (Layer 3, Prolog Knowledge & Reasoning Backbone) into code that actually runs. It was written and tested with SWI-Prolog, and the three files in this folder are all you need to run it.

## Why it is split into three files

One principle CubSpace strongly emphasises is that "MADE answers what exists; Prolog answers what follows" (Section 8.1). Therefore **facts and rules are separated**.

| File             | Content                                                      | Update frequency           | Source of truth              |
| ---------------- | ------------------------------------------------------------ | -------------------------- | ---------------------------- |
| `facts_model.pl` | Subsystems, requirements, model elements: "what exists"      | Whenever the MADE model changes | MADE model (Layer 1)     |
| `facts_tasks.pl` | Cell, Task Card and Sign-off states: "what is in progress"   | Whenever ClickUp changes   | ClickUp (Layers 4 to 6)      |
| `rules.pl`       | Inference rules: "so what follows"                           | Rarely changes             | This file itself is the CubSpace logic |

In other words, these Prolog files are not themselves the source of the "knowledge tower"; they are a **shadow that reflects the two sources, MADE and ClickUp, every day**. Prolog does not create truth; it only answers what follows logically from facts that have already been approved. The CubSpace Section 19.4 principle that "AI and tools do not finalise mission knowledge" applies here as well.

## How to run

```bash
# Installation (once)
sudo apt-get install swi-prolog-nox   # or https://www.swi-prolog.org/download

# Interactive queries
cd prolog
swipl -s rules.pl
```

```prolog
?- ready(X).                    % Which tasks can be started right now?
?- blocked(X).                  % Which tasks are blocked?
?- blocking_tasks(T, D).        % What is blocking what (T is blocked by D)
?- requirement_open(R).         % Which requirements are not yet verified?
?- subsystem_ready(adcs).       % Is the ADCS subsystem ready? (currently no)
?- mission_ready(demonstrate_deneb_adcs).  % Queries are also possible per mission objective
```

## What the current data actually shows (2026-08-29 snapshot)

Running this folder as is:

- `ready(X)` returns only `TASK-EPS-001`. `TASK-ADCS-001` depends on `TASK-EPS-001`, so it is correctly identified as not yet startable (`blocked`). This shows the "weak dependency between the ADCS Cell and the EPS Cell" discussed in the previous conversation actually working.
- `requirement_open(R)` shows that all three requirements (`REQ-ADCS-01`, `REQ-ADCS-02`, `REQ-EPS-01`) are still open, because no task has been signed off yet.
- `subsystem_ready(adcs)` is **false**, because there is not yet a single task covering `REQ-ADCS-01` (antenna deployment threshold). This is exactly a case of Prolog finding "hidden work not yet registered in Track B": one more Task Card for `REQ-ADCS-01` needs to be created.

If you change both `TASK-EPS-001` and `TASK-ADCS-001` to `signed_off` and query again (edit the `sign_off_status` values in `facts_tasks.pl` and rerun), `REQ-ADCS-02` changes to `requirement_verified`, but `subsystem_ready(adcs)` still remains false, because there is still no task covering `REQ-ADCS-01`. Experimenting by changing values directly like this gives a feel for how the rules respond.

**Caution (one important pitfall):** `subsystem_ready(comms)`, `subsystem_ready(payload)` and so on currently return `true`. This does not mean "COMMS is actually ready"; it means that **no requirements have been registered for COMMS yet, so the condition over an empty set is logically true** (a property of universal quantification: "there is no unsatisfied requirement" also includes "there are no requirements at all"). This illusion disappears as requirements and tasks are added. Keep this in mind when reading Prolog results at this stage.

## Workflow: how to maintain these three files

1. **Whenever a Task Card state changes in ClickUp**, update `facts_tasks.pl` by hand (Cell, task, task_depends_on, sign_off_status). Since the ClickUp connector is not being used for now, manual work is the default. If needed later, a separate script can call the ClickUp REST API to generate this file automatically (this can be done independently of connecting the connector).
2. **Whenever MADE modelling (Phase 1) progresses**, fill `facts_model.pl` with the actual subsystems, requirements, model elements and failure modes. It is currently at placeholder level.
3. **`rules.pl` rarely needs to be touched.** When a new question arises (for example, "does this failure mode have detection logic?"), add a rule here. Section 8.3 of the overview document has a list of example questions.
4. Periodically (for example, weekly) run a few queries with `swipl -s rules.pl -g "..."` and copy the results into the ClickUp "status" note or the CubSpace Mission Knowledge & Control Tower document. That is what it means for the "knowledge tower" to be alive.

## Rules to add next

- `failure_detected(FailureMode)` / `failure_rectified(FailureMode)`: once the FMECA is filled in
- `evidence_sufficient(TaskId)`: based on the number of required_evidence items and whether they are signed
- `next_task(Cell, TaskId)`: a rule that picks what to take next in a given Cell, including priority (not blocked, highest requirement importance first)

These three were deliberately left empty because the current data does not yet provide enough basis to fill them (no FMECA, no evidence), in keeping with the principle of not fabricating facts.
