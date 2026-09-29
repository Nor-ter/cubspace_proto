# CUB 101 implementation record

Implementation tool: Claude Code (claude-opus-5-5), interactive session. The independent review is run separately through `continue` with the configured agent.

## Changes

- **Instructions and docs:** `AGENTS.md`, `CLAUDE.md`, `.claude/agents/*`, `.github/agents/*`, `.github/prompts/ticket.prompt.md`, `.vscode/tasks.json`, `README.md`, `docs/environment.md`, `docs/workflow.md`, `docs/engineering-review.md` (verification section), `prolog/README.md`. The language rule in `AGENTS.md` now requires English user explanations, README, documentation and reports. A new bullet states that `outputs/archive/`, `outputs/CUB REF/` and `inputs/reference.json` stay as recorded, including their Korean text.
- **Prolog:** comments and string data in `prolog/facts_model.pl`, `prolog/facts_tasks.pl` and `prolog/rules.pl`; the tutorials `prolog/tutorial/*.md`, `*.pl` and `Prolog_Knowledge_Tower_Visual_Guide.html`. Predicates, atoms, IDs and rule logic are unchanged.
- **Workflow scripts:** all CLI and error messages in `scripts/*.mjs`; the `task.md` template (`scripts/ticket-lib.mjs`), the `report.md` template (`scripts/ticket.mjs`) and the HTML report footer (`scripts/evidence.mjs`, now `lang="en"`). Check logic and gates are unchanged.
- **Website:** all UI text in `app/`, `components/` and `src/data/*`; `app/layout.tsx` is now `lang="en"`. Equations (KaTeX strings), units, section citations (ConOps §, Modeling §) and source URLs are preserved.
- **Website detail:** `src/math-token.ts`: the Korean unit key for minutes became `min`, and the explicit-math key now matches the translated text `C·dT/dt=Q_in−Q_out`.
- **Website detail:** `components/role-icon.tsx`: the Korean keyword alternatives were replaced with English equivalents (sun, communication, sensor, verif, approv, purpose, satellite), so icon selection for the translated labels stays the same.
- **Website detail:** `app/globals.css`: `.lesson-title h1` now sets `white-space: normal; overflow-wrap: break-word`. The earlier `nowrap` rule overflowed at 390 px with the longer English titles on `/learn/04` and `/learn/06`.
- **Tests:** assertions on translated messages and the Korean fixture strings in `tests/*.mjs` were updated to the English equivalents. Some messages were worded to keep the case-sensitive fragments the existing tests use ("Browser", "Screenshot", "Task ID").
- **Run output:** `outputs/CUB 101/task.md` was regenerated from the unchanged snapshot `outputs/CUB 101/ticket.json` using the translated `markdown()` template. The snapshot and its hash were not modified.

## Hangul scan

A regex scan (`[\x{AC00}-\x{D7A3}\x{3131}-\x{318E}]`) of `git ls-files -co --exclude-standard` shows zero Hangul lines outside `outputs/archive/`, `outputs/CUB REF/` and `inputs/reference.json`. Those three are unchanged in `git status`. The only remaining Korean-related token is the `'Noto Sans KR'` font fallback name in `app/globals.css` and the visual guide CSS; it is a font family identifier, not text.

## Checks run (cubspace Conda environment)

| Check | Result |
| --- | --- |
| `npm test` | 83/83 pass |
| `npm run lint` | exit 0 |
| `npm run typecheck` | exit 0 |
| `npm run build` | build complete |
| `npm run test:prolog` | 2/2 pass (existing choicepoint warning in unchanged `tests/run-rules.pl`) |
| `npm run ticket -- evidence "CUB 101"` | 34 browser checks, 0 failures (after the `.lesson-title h1` wrap fix; the first run failed with 390 px overflow on `/learn/04` and `/learn/06`) |

Screenshots of the home page at 1440 px and 390 px were inspected visually; the English text renders without clipping.

## Publication note

The first ClickUp submit created taskcard 14ynqxz1bdq, but readback did not match: ClickUp auto-linked the compound filename in AC-4 and reformatted nested bullets. AC-4 was reworded through `revise` (wording only, same meaning), nested bullets here were flattened, and checks and the independent review were rerun.

## Remaining items

- Translation accuracy was checked against the source text by the implementer only. The engineering content (values, units, section references) was carried over one-for-one and no values were changed.
- The em-dash in the source label `PHM Technology — MADe` is part of an external product name and was kept.
