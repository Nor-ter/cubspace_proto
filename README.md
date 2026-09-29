# CubSpace

A workflow in which an LLM agent reads a task, does the work, has it reviewed in a separate session and then produces an HTML report. It uses **CubeSat onboarding website development** as the reference, and it can also be applied to documentation or data analysis by changing the task scope and check commands.

```text
inputs/ticket.json → implement → check → independent review
                  → outputs/<ID>/ → Git commit/push → ClickUp submit
```

An agent from Codex, Claude or VS Code reads the material and modifies files. It uses engineering knowledge and reasoning, calculation and literature review, and supports conclusions with sources and check results. Prolog stores and queries task history and check results.

## Installation

Install [Conda](https://docs.conda.io/projects/conda/en/stable/user-guide/install/index.html), [Git](https://git-scm.com/downloads) and [VS Code](https://code.visualstudio.com/) first. Run the following in order on Windows, macOS or Linux. If you have already cloned the repository, start from the Conda commands in that folder.

```bash
git clone --branch onboarding_training_auto https://github.com/Nor-ter/cubspace_proto.git
cd cubspace_proto
conda env create -f environment.yml
conda activate cubspace
node scripts/setup-environment.mjs codex
conda deactivate
conda activate cubspace
npm run environment:check
code .
```

Replace `codex` in the setup command with the tool you use. **You only need to choose one.**

| Tool                         | Setup argument | Login                                         |
| ---------------------------- | -------------- | --------------------------------------------- |
| Codex CLI                    | `codex`        | `codex login`                                 |
| Claude Code CLI              | `claude`       | `claude auth login`                           |
| VS Code Chat (Copilot, etc.) | `vscode`       | Sign in to the service you use in VS Code     |

Node.js, SWI-Prolog, the selected CLI and Chromium are installed in the `cubspace` environment. Project libraries are managed in `node_modules`, and VS Code extensions in the editor. To update an existing environment or if installation problems occur, see [Environment setup](docs/environment.md).

Install whichever VS Code extension you use: **Codex** (`openai.chatgpt`), **Claude Code** (`anthropic.claude-code`) or **Copilot Chat** (`GitHub.copilot-chat`). To use the ClickUp task UI in VS Code, also install the **ClickUp** (`edsol.clickup`) extension. If `code .` does not work, open the repository with **File → Open Folder** in VS Code.

## Running the website

```bash
conda activate cubspace
npm run dev
```

Open the address shown in the terminal. The default is <http://localhost:3000>. At <http://localhost:3000/?admin=1> you can preview all learning pages. This option is an educational unlock feature, not a login feature. Press `Ctrl+C` to stop the server.

No LLM account is needed to run only the website.

## Inputs and results

Day-to-day work uses two folders.

| Location                | Purpose                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| `inputs/reference.json` | **CUB REF**: the reference input of the actual reference task. Used to create the next task. |
| `inputs/ticket.json`    | Current task description, paths to modify and acceptance criteria. Edited for each task.    |
| `outputs/<ID>/`         | Input snapshot, task document, checks and review, HTML and screenshots for that task        |
| `outputs/archive/`      | Previous run results. Keeps the original task IDs and history.                              |

**[CUB REF](https://app.clickup.com/t/14ynqxyyzx6) is the onboarding website reference task carried out with this workflow.** It continues the existing CUB-100 card, and its reference input is kept in `inputs/reference.json`. Past CUB-100 run records remain in the archive under their original names. New tasks use an ID and result folder separate from the reference.

## Working with an agent

Every task is named in the **`CUB XXX`** format. Replace `XXX` in the commands below with the actual task number. `XXX` is a three-digit task number continuing from `001`, `002`. IDs use a space. Quote the ID on the CLI.

To start a new task, first create the input from the reference. Do not `run` a completed task included in the repository again.

```bash
npm run ticket -- new "CUB XXX" "Task title"
```

This command only prepares `inputs/ticket.json` and preserves the reference and previous results. If the current input has unsaved changes, it stops without overwriting them.

1. Write the task description, paths to modify and acceptance criteria in `inputs/ticket.json`.
2. Check the check commands in `workflow/config.json`. The current configuration checks the website and Prolog.
3. Start in the `cubspace` environment.

```bash
npm run ticket -- agents
npm run ticket -- run
```

`run` saves the input to `outputs/<ID>/ticket.json` and starts the task. The default agent first checks for a logged-in Codex and otherwise uses Claude. If neither is available, it creates a prompt file for VS Code Chat and waits. You can also select `codex`, `claude` or `vscode` directly in `workflow/config.json`. The model follows the CLI setting or the value selected in VS Code.

In VS Code, attach the prompt and work with `ticket-implementer`. Run the review with `ticket-reviewer` in a **new Chat session** and register the resulting JSON. Model access depends on the service and account you are signed in to.

Website tasks may stop before review if there are no screenshots. Start the server with `npm run dev` and continue in a separate terminal.

```bash
npm run ticket -- evidence "CUB XXX"
npm run ticket -- continue "CUB XXX"
npm run ticket -- report "CUB XXX"
```

`continue` uses the saved input of that task. Changing the current `inputs/ticket.json` is not applied to past runs automatically. To change the requirements of a task in progress, edit the input and then apply it explicitly. The input ID must match, and the existing review must be obtained again.

```bash
npm run ticket -- revise "CUB XXX"
npm run ticket -- continue "CUB XXX"
```

If the screens change, regenerate `evidence` before `continue`. Start the next task by running `new` with a new number.

## Checking and publishing results

| Result to check                   | Location (`<ID>` is the task ID)                     |
| --------------------------------- | ---------------------------------------------------- |
| Saved input and task document     | `outputs/<ID>/ticket.json`, `task.md`                |
| Progress status and implementation | `outputs/<ID>/state.json`, `implementation.md`      |
| Report                            | `outputs/<ID>/report.html`, `report.md`              |
| Independent review                | `outputs/<ID>/review.json`                           |
| Browser check and screenshot list | `outputs/<ID>/browser-results.json`, `evidence.json` |
| Screenshots                       | `outputs/<ID>/screenshots/`                          |

Open the HTML and check the check results, screenshots and review. Tasks that are not yet complete can be checked in the Markdown report. The shared HTML is a standalone file with embedded images and does not load external fonts. Passing HTML from before a re-check is kept in `outputs/<ID>/history/`. HTML and screenshots are locally generated files that are not committed to Git; they are attached in ClickUp. In another checkout, regenerate them with `evidence` and `report`.

If changes are needed, fix them in the same task and check and review again. When ready, apply the changes to Git and submit the results to ClickUp.

```bash
npm run ticket -- commit "CUB XXX"
npm run ticket -- push "CUB XXX" --git-only
npm run ticket -- submit "CUB XXX"
```

The current default is `clickup.publish_on_push: false`. **Git push and ClickUp submit are separate steps.** `--git-only` applies only Git even if automatic publishing was enabled in an earlier configuration. Tasks that also submit to ClickUp perform both steps and confirm the remote Git commit and the card, HTML and screenshots. Passing code review and actual publication are confirmed separately.

## Connecting ClickUp

Search for `edsol.clickup` in VS Code **Extensions** or install it from the terminal.

```bash
code --install-extension edsol.clickup
```

Enter the token in **Command Palette → `ClickUp: Set token`**. The shortcut is `Cmd+Shift+P` on macOS and `Ctrl+Shift+P` on Windows/Linux. **`ClickUp: Set token` is not a terminal command.**

The extension is for the VS Code task UI. The CLI's API import and publish features work without the extension; save `CLICKUP_API_TOKEN=your_token` in `.clickup.env` at the project root. The file is excluded from Git. Tokens are not shared automatically between the extension and the CLI.

```bash
npm run ticket -- start TASK_ID
```

This imports the ClickUp title and description and starts the task. Prepare the scope and acceptance criteria in `inputs/ticket.json`. To import only, use `npm run ticket -- clickup TASK_ID`.

Use the following to publish a task that has passed checks and review to ClickUp. Replace `XXX` with the actual task number.

```bash
npm run ticket -- submit "CUB XXX"
```

Local tasks create or update a taskcard under the configured parent task, and tasks started from ClickUp leave a result comment on the original task. The published content is the task description, check and review results, run time, Git links, and the HTML and selected screenshots. The local card name is the ticket ID, and the status is the configured `review`. This does not mean final human approval.

After publishing, check the actual task and attachments. Tokens, credential files and the whole repository are not attached. If the transfer result is uncertain, check the remote task first and then retry.

## Project structure

`inputs/` and `outputs/` are working folders. The files below are kept in the standard project structure required to run the tools and the website.

| Location                                          | Purpose                                      |
| ------------------------------------------------- | -------------------------------------------- |
| `workflow/`                                       | Agent selection, check commands, review schema |
| `scripts/`, `tests/`                              | Automation code and tests                    |
| `prolog/`                                         | Task history, query rules, teaching examples |
| `app/`, `components/`, `src/`, `lib/`, `public/`  | Onboarding website                           |
| `AGENTS.md`, `CLAUDE.md`, `.claude/`, `.github/`  | Agent instructions                           |
| `.vscode/`, `docs/`                               | VS Code task commands and documentation      |
| `package.json`, `environment.yml`, other root settings | Node.js, Conda and build settings       |

`.workflow/` keeps local commit and publication records. This folder, `node_modules`, build caches and token files are excluded from Git.

Run individual checks with `npm test`, `npm run test:prolog`, `npm run lint`, `npm run typecheck` and `npm run build`. With the development server running, `npm run test:browser` checks the screens.

[Environment setup](docs/environment.md) · [Workflow details](docs/workflow.md) · [Engineering review](docs/engineering-review.md) · [Quiz authoring](docs/quiz-authoring.md)

Agents support engineering analysis and design review. Formal sign-off of actual satellite designs follows the project approval procedure.
