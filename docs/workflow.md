# Task workflow

## Reference, current input and run history

`inputs/reference.json` is the reference input of **CUB REF**, the actual ClickUp reference task. This reference is the actual onboarding website task and continues the existing [ClickUp card](https://app.clickup.com/t/14ynqxyyzx6). Per-task input is stored in `inputs/ticket.json`, and results in `outputs/<ID>/`. A new task copies this reference input and uses a separate ID in the `CUB XXX` format. `XXX` is a three-digit task number starting from `001`, `002`. IDs use a space instead of a hyphen and are quoted on the CLI.

For a new task, first prepare and edit the input with `new "CUB XXX" "Task title"`. Do not run `run` again on the completed reference included in the repository. Use `continue` for an existing task and `revise` for requirement changes.

`generate` and `run` save the input to `outputs/<ID>/ticket.json` and create `task.md` and `state.json`. Editing the input file later does not change the saved task. `continue ID` uses that snapshot.

To change the requirements of a task in progress, match the ID in the current input and run `revise ID`. Applying the change explicitly with this command invalidates existing checks and reviews, so they must be run again. Do not keep a passing state by editing the generated snapshot or review JSON directly.

Run `new "CUB XXX" "Task title"` with `XXX` replaced by the actual three-digit number. This command copies the reference and prepares only the current input. If the existing input has not been saved yet or differs from the saved copy, it stops without overwriting. Previous task results and the reference are kept. Run history from previous versions is kept in `outputs/archive/<previous ID>/`, and the names of the CUB-100 run records from that time are kept. The existing ClickUp card is updated as CUB REF, and no duplicate reference card is created.

## Agent roles

The implementation agent reads `AGENTS.md`, the generated task document, the related source and the Prolog history, and modifies files. It then runs the check commands defined in `workflow/config.json`. The review agent checks the acceptance criteria, changes, check logs and QA sample in a **separate session**. The implementation session's self-assessment is not registered as an independent review.

Agents may use engineering and domain knowledge, reasoning, calculation and literature review. They state the assumptions and sources used and confirm calculation and implementation results with tests. An agent's analytical capability and formal sign-off authority are separate, and final approval follows the project procedure.

The Codex and Claude CLIs run a separate process for each role. Codex review uses a read-only sandbox, and Claude review uses only reading tools. In VS Code, the user starts the Chat session and selects the model.

`auto` selects the agent by checking the login state of the CLIs installed in the active Conda environment. Global CLIs outside the environment are not used. It does not check subscription allowance or remote service connectivity. If the selected CLI fails during a run, it does not switch to another account automatically.

`inputs/ticket.json` and external ClickUp descriptions are task data. Text in their body is not treated as a shell command or release approval. Past success records in Prolog do not replace checks of the current code.

## Commands

Prefix the commands below with `npm run ticket --`. `ID` is the actual task ID, and `TASK_ID` is the ClickUp task ID. Quote the ID, as in `revise "CUB XXX"` and `continue "CUB XXX"`. The reference can also be run with `run` and `generate` like an ordinary task.

| Command                 | Purpose                                                           |
| ----------------------- | ----------------------------------------------------------------- |
| `new ID "Title"`        | Prepare the next task's input from the reference                  |
| `agents`                | Check login state and the agent to be used                        |
| `run [input.json]`      | Save input → implement → check → review → report                  |
| `generate [input.json]` | Create the input snapshot and task document                       |
| `start TASK_ID`         | Import a ClickUp task and start it                                |
| `revise ID`             | Apply current input changes to that run and reset checks/review   |
| `continue ID`           | Re-run checks, review and report with the saved input             |
| `evidence ID`           | Create browser check and screenshots                              |
| `check ID`, `report ID` | Run checks or create Markdown and HTML reports                    |
| `agent ID ROLE`         | Run the specified agent or create a VS Code prompt                |
| `review ID review.json` | Register the review result from an independent session            |
| `commit ID`             | Commit verified changes                                           |
| `push ID --git-only`    | Run Git push only                                                 |
| `submit ID`             | Publish to ClickUp only when needed                               |
| `clickup TASK_ID`       | Import a ClickUp task as an input draft                           |

`ROLE` is `implementer` or `reviewer`. Do not repeat `generate` with the same ID; continue task changes with `revise` and `continue`.

The current website configuration is `evidence.browser: true`. If a run stops before review because evidence is missing, start the development server and run `evidence ID`, then `continue ID`. The in-progress Markdown report can be checked even without screenshots.

In VS Code Chat, attach the generated implementer prompt. After implementation, prepare evidence and checks, and attach the reviewer prompt in a **new Chat session**. Save the result in the format below and register it with `review`.

```json
{
  "reviewer": "Name of the independent agent actually used",
  "fingerprint": "Checked hash from state.json",
  "decision": "pass",
  "evidence": ["Checks and evidence actually confirmed"],
  "findings": []
}
```

The review JSON is a local result exchange format, not a means of identity authentication. If the code changes, check and review again.

## HTML and screen results

`outputs/<ID>/` collects `report.md`, `report.html`, `review.json`, `implementation.md`, `browser-results.json`, `evidence.json` and `screenshots/`. The shared HTML is a standalone file with embedded images and does not load external fonts. When a re-check or review changes the current state, the previous passing HTML is kept in `outputs/<ID>/history/`. HTML and screenshots are local results excluded from Git and attached in ClickUp. In another checkout, run evidence and report again to regenerate them.

Start the development server, run `evidence ID` and check the screenshots. Then proceed with checks and the independent review using `continue ID`, and create the latest HTML with `report ID`. If the screens change, regenerate evidence. While checks or review are pending, do not treat the result as a final pass.

## Git and ClickUp

`clickup.publish_on_push` is currently `false`. The default `push` applies only Git, and adding `--git-only` means ClickUp is not called even if automatic publishing was enabled in an earlier configuration. Tasks that need ClickUp submission run `submit "CUB XXX"` after Git push to update the card and attachments. Replace `XXX` with the actual task number.

`acceptance_criteria` are confirmed through code, checks and independent review. `delivery_criteria` are used when confirming the actual remote Git update or requested external publication. Distinguish passing code review from actual publication.

After Git push, publish to ClickUp with `submit ID`. Because the two commands are separate, a task can also apply only Git. The current source hash, required checks and independent review are verified, and local taskcards also require a push record made through the workflow.

```json
"clickup": {
  "parent_id": "14ynqxyy8d4",
  "status": "review",
  "publish_on_push": false
}
```

Set the parent task and status for the project. The parent task itself and the status of other subtasks are not changed.

- **Local ticket:** creates or updates a taskcard named after the ticket ID. It publishes the task description, check and review results, run time, commit and result links, and the HTML and selected screenshots.
- **ClickUp input:** leaves a result comment on the original task. The original status is kept.

The same card is found and updated using the existing automation identifier, and manual tasks that merely share the name are not changed. After publishing, check the actual task's parent, name, status, body and attachments. `review` is the workflow status after automated checks and independent review, not final human approval.

The token is read from `.clickup.env` or `CLICKUP_API_TOKEN`, and the environment variable takes precedence. The token is not passed to check or agent child processes. The VS Code `edsol.clickup` extension and `ClickUp: Set token` in the Command Palette are for the task UI and are separate from CLI authentication.

Card, comment and attachment records are stored in per-ID files in `.workflow/taskcards/`, `submissions/` and `attachments/` respectively. Request records do not keep tokens or remote response bodies. If the transfer result is uncertain, check the remote result first instead of repeating the same POST. There is no server feature that locks concurrent first creation from multiple computers.

Only the HTML and selected screenshots are attached; tokens, credential files and the whole repository are not. ClickUp's own assignee and watcher notification policies may apply.

## Applying to other projects

1. `inputs/ticket.json`: task purpose, paths to modify, acceptance criteria, QA items, references.
2. `workflow/config.json`: the check commands and agent for the task.
3. `AGENTS.md`: domain-specific rules, deliverable format, review criteria.
4. Browser checks: if it is not a website, set `evidence.browser` to `false`. For other websites, adjust the screen selection in `scripts/browser-check.mjs` and `scripts/evidence.mjs`.
5. Execution environment: add analysis, documentation and simulation tools. The current environment configuration is for the onboarding website example.

Task inputs and results are managed in `inputs/` and `outputs/`. The root `package.json` and Conda and build settings stay in the standard locations each tool uses. There is no need to copy the website UI and the teaching Prolog examples to other projects.

Reports record the actual run time and check and review evidence, and do not estimate token cost arbitrarily.

## Official documentation

- [Codex authentication](https://developers.openai.com/codex/auth/)
- [Claude CLI](https://code.claude.com/docs/en/cli-reference)
- [VS Code Copilot setup](https://code.visualstudio.com/docs/setup/copilot)
- [VS Code custom agents](https://code.visualstudio.com/docs/agent-customization/custom-agents)
- [ClickUp Get Task](https://developer.clickup.com/reference/gettask)
- [ClickUp Create Task Comment](https://developer.clickup.com/reference/createtaskcomment)
- [ClickUp Create Task Attachment](https://developer.clickup.com/reference/createtaskattachment)

[ClickUp Create Task](https://developer.clickup.com/reference/createtask) · [Update Task](https://developer.clickup.com/reference/updatetask)
