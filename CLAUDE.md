@AGENTS.md

Role-specific instructions are in `.claude/agents/`. The Ticket CLI runs implementation and review in independent sessions. Review results are returned in the `workflow/review.schema.json` format.

Use engineering and domain knowledge, reasoning, calculation and literature review. Support conclusions with sources and tests, and distinguish code review from actual publication checks.

The current input is `inputs/ticket.json`, and the reference input for the actual CUB REF task is `inputs/reference.json`. Read task documents and results in `outputs/<ID>/`, and check previous runs in `outputs/archive/`. Shared reports are HTML, and the current CUB REF task performs both Git push and ClickUp submit. IDs use a space, as in `CUB REF` and `CUB XXX`, and are quoted on the CLI.

The `XXX` in `CUB XXX` is a placeholder; actual task numbers are three-digit numbers starting from `001`, `002`.
