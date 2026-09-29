---
description: Starts a reviewable development task from inputs/ticket.json.
agent: ticket-implementer
---

Read AGENTS.md and inputs/ticket.json, then create the task document with npm run ticket -- generate. Implement the acceptance criteria in the generated document and run the required checks. Then pass the run ID to an independent reviewer session. The same agent must not record its own work as an independent review.

CUB REF is the actual ClickUp reference task, and run results are preserved under each task ID. Distinguish the current input from the saved snapshot, and use `revise ID` for requirement changes. Shared reports are HTML. The current CUB REF task performs both Git push and ClickUp submit. Update the existing reference card and do not create a duplicate. IDs use a space, as in `CUB REF` and `CUB XXX`, and are quoted on the CLI.

The `XXX` in `CUB XXX` is a placeholder; actual task numbers are three-digit numbers starting from `001`, `002`.
