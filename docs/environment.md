# Development environment

Installation uses the same commands on Windows, macOS and Linux. Automated setup targets Windows x64, macOS (Apple Silicon/Intel) and Linux x64. Install Conda and Git first, and run the commands from the project root. Node.js, SWI-Prolog, the selected agent CLI and the browser check tools are managed in the `cubspace` Conda environment.

```bash
conda env create -f environment.yml
conda activate cubspace
node scripts/setup-environment.mjs codex
conda deactivate
conda activate cubspace
npm run environment:check
npm run dev
```

If the environment already exists, use the command below instead of the first line.

```bash
conda env update -n cubspace -f environment.yml
```

## Agent selection

No LLM account is needed to run only the website. Choose just one tool for automated implementation and review.

| Tool            | Setup command                               | Login                                   |
| --------------- | ------------------------------------------- | --------------------------------------- |
| Codex CLI       | `node scripts/setup-environment.mjs codex`  | `codex login`                           |
| Claude Code CLI | `node scripts/setup-environment.mjs claude` | `claude auth login`                     |
| VS Code Chat    | `node scripts/setup-environment.mjs vscode` | Sign in within the VS Code extension used |

If the argument is omitted, `vscode` is used. Only the selected CLI is installed additionally, and already installed CLIs are not removed. `vscode` is the option that skips CLI installation. Install and sign in to VS Code extensions directly in the editor.

The models available in VS Code depend on the extension and account. Installing the project alone does not grant access to Copilot or other services' models.

## Installation locations

| Item                                    | Location                          |
| --------------------------------------- | --------------------------------- |
| Node.js, npm, selected CLI, SWI-Prolog  | Inside the `cubspace` environment |
| npm cache                               | `var/npm-cache` inside the environment |
| Chromium                                | `var/playwright` inside the environment |
| Project libraries                       | `node_modules` in the repository  |

The setup script prepares SWI-Prolog for the operating system. On Windows, the official distribution is extracted inside the environment, so no separate installation wizard is run. On Linux, the conda-forge package is used. When the official distribution is used, its SHA256 is verified. VS Code and its extensions, Git and Conda itself are installed separately. Login information stays in each service's user settings and is not copied into the Conda environment.

`NPM_CONFIG_PREFIX`, `NPM_CONFIG_CACHE` and `PLAYWRIGHT_BROWSERS_PATH` are stored in the Conda environment settings, so reactivate the environment once after setup. If the environment is moved, run the setup script again.

`npm run environment:check` confirms that the required tools are present in the environment and checks Prolog queries and the Chromium path. Codex and Claude versions are checked only if they are installed. Check the CLI login state and the agent that will be selected with `npm run ticket -- agents`. It does not check remote service connectivity or remaining usage.

## Terminal setup

- **When `conda` is not recognised:** open the terminal provided by Conda, or apply `conda init` to your shell and reopen the terminal.
- **When PowerShell blocks `npm.ps1`:** use `npm.cmd` instead of `npm`. For example, run `npm.cmd run dev`.
- **When VS Code tasks cannot find the tools:** open the folder with `code .` from a terminal where `conda activate cubspace` has been run.
- **When Chromium libraries are missing on Linux:** install the operating system packages shown in the Playwright error. System libraries may be required separately from the Chromium installed in Conda.

## Prolog and browser checks

```bash
npm run test:prolog
npm run prolog -- -q -s prolog/run_rules.pl
```

Query the history in the Prolog console as follows.

```prolog
reviewed_run(Run).
needs_attention(Run).
halt.
```

Prolog queries the stored check and review history. Whether the current changes can be committed is checked separately by `scripts/ticket.mjs`.

Browser checks are run with the development server running, from another terminal in the same environment.

```bash
npm run test:browser
```

Task screenshots are generated with `npm run ticket -- evidence ID` while the development server is running. `ID` is the actual task ID, quoted as in `"CUB XXX"`. `npm run ticket -- report ID` generates `outputs/<ID>/report.html`. The inputs, results and Git procedure are summarised in the README.

To reinstall only Chromium, run `npm run browser:install`. For task execution and review procedures, see the [workflow document](workflow.md).

[SWI-Prolog official distribution](https://www.swi-prolog.org/download/stable) · [SWI-Prolog installation documentation](https://www.swi-prolog.org/build/unix.md)

The `XXX` in `CUB XXX` is a placeholder; actual task numbers are three-digit numbers starting from `001`, `002`.
