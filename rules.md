# Rules

## 0. Rules for This Document

### 0.1 Writing principles

1. **Single author.** Only Daehyeon Kim writes and edits this document. Changes by anyone else are not allowed unless Daehyeon Kim gives permission.
2. **One place.** Rules are written only in this document, nowhere else.
3. **Known rules only.** Write only rules the whole team already knows.
4. **Scope.** This document covers writing code and managing it with Git only. Team operations are out of scope.
5. **Be clear.** Write each rule so it can be read only one way.

### 0.2 Change process

1. **Proposals.** Anyone may propose a change at any time.
2. **Editing.** Only Daehyeon Kim, or someone Daehyeon Kim has given permission, may edit this document.
3. **Discuss, then announce.** A rule change must be discussed with the team before it is made, and announced to the team after it is made. Any channel is fine (KakaoTalk, ClickUp, GitHub, etc.).
4. **History.** There is no separate change log. The Git commit history of this file is the change history.
5. **Existing code.** When a rule changes, all existing code must be updated to follow the new rule.

## 1. Structure

### 1.1 Repo layout

The repository is a monorepo with four top-level folders.

```
/
├── frontend/   Web app (React + TypeScript + Vite)
├── backend/    API server (FastAPI)
├── db/         Database (Neo4j)
└── docs/       Project documents, including this file (rules.md)
```

- New work goes inside one of these four folders. Do not add another top-level folder.
- Onboarding Web is not part of this repository. It stays in its own repository.

### 1.2 Frontend

```
frontend/
├── index.html          Empty shell the browser loads first
├── package.json        Dependency list and run commands
├── vite.config.ts      Vite settings (plugins, proxy)
├── tsconfig.json       TypeScript checking rules
├── .env.example        Env var template (backend URL, etc.)
├── public/             Files served as-is (favicon, etc.)
└── src/
    ├── main.tsx        Entry point that mounts React onto the HTML root
    ├── App.tsx         Route registration and shared layout
    ├── pages/          One file per route (assembles a screen)
    ├── features/       One folder per feature (e.g. mission-tree/, chat/)
    │   └── mission-tree/
    │       ├── components/   Components used only by this feature
    │       ├── hooks/        Data loading and state logic for this feature
    │       ├── api.ts        Backend calls made by this feature
    │       └── types.ts      Types for this feature
    ├── components/     Shared UI used across features
    ├── hooks/          Shared hooks
    ├── lib/            Fetch wrapper, utility functions
    ├── types/          Shared types
    ├── styles/         Global CSS
    └── assets/         Images and fonts imported by code
```

- A page only assembles a screen. The parts it uses live in `features/` or in the shared folders.
- Code used by only one feature lives inside that feature's folder.
- Code used by two or more features lives in the shared folders (`components/`, `hooks/`, `lib/`, `types/`).

### 1.3 Backend

### 1.4 DB

### 1.5 Dependency rules

```
frontend ──HTTP API──▶ backend ──▶ db
```

- The frontend talks to the backend only through its HTTP API. It never imports backend code.
- The frontend never accesses the database directly.

## 2. Coding

### 2.1 Naming

**Common**

- Use English names.

**Frontend**

| Folders        |                                 |
| -------------- | ------------------------------- |
| Feature folder | kebab-case — `mission-tree/` |

| Files             |                                                         |
| ----------------- | ------------------------------------------------------- |
| Component, page   | PascalCase — `StepView.tsx`, `MissionTreePage.tsx` |
| Hook              | `use` + PascalCase — `useRoute.ts`                 |
| Other `.ts`     | camelCase — `teams.ts`                               |
| Component CSS     | same name as its component — `StepView.css`          |
| Other CSS, assets | kebab-case — `global.css`, `msp-mark.png`          |

| Code               |                                                |
| ------------------ | ---------------------------------------------- |
| Component          | PascalCase, same as its file — `StepView`   |
| Variable, function | camelCase — `expandAll`                     |
| Constant           | UPPER_SNAKE_CASE — `MOVE_MS`                |
| Type, interface    | PascalCase, no `I` prefix — `MissionNode` |
| CSS class          | kebab-case — `.team-row`                    |
| CSS variable       | kebab-case — `--team-sys`                   |

### 2.2 Code style

**Frontend**

- Use single quotes, no semicolons, and at most 150 characters per line.
- Lint with ESLint (`eslint.config.js`) and type-check with TypeScript (`tsconfig.json`).
- Run `npm run lint` and `npm run build` before every commit. Do not commit code with lint or type errors.

### 2.3 Env & secrets

## 3. Collaboration

### 3.1 Branches

- `main` always works. Never push to `main` directly; merge only through a PR.
- Branch from `main`. Delete the branch after it is merged.
- One branch = one PR = one purpose. If you cannot describe it in one sentence with one type, or cannot merge it within 1 week, split it.
- Name: `<type>/<short-description>` (kebab-case) — `fix/connector-width`

| Type         | Use for                                          |
| ------------ | ------------------------------------------------ |
| `feat`     | A new feature                                    |
| `fix`      | A bug fix                                        |
| `docs`     | Documents only                                   |
| `refactor` | Structure changes with no change in behavior     |
| `chore`    | Anything else (config, packages, `.gitignore`) |

### 3.2 Commits & push

- Message: `<type>(<scope>): <summary>`
  ex:`fix(frontend): end the trunk at the F station`
- - type: same as 3.1
  - scope: `frontend`, `backend`, `db`, `docs`
  - summary: English, imperative, lowercase, no period, 72 characters or fewer
  - Add a body only when needed, to explain why.
- One commit = one change.
- Push only to your own branch.
- Force-push only to the branch you are working on. Never force-push to `main` or to a branch someone else is working on.

### 3.3 PR, review & merge

- PR title: `<type>(<scope>): <summary>`, same as a commit message (3.2).
- PR description: fill in What, Why and How to check (`.github/pull_request_template.md`). Add screenshots for UI changes.
- Review: 1 approval from any other team member.
- Merge only when all of these are true:
  - The PR has 1 approval.
  - `npm run lint` and `npm run build` pass.
  - All review comments are resolved.
- The author may merge their own PR after approval.
- Use Squash and merge: however many commits the branch has, it lands on `main` as one commit.
