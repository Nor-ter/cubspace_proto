# CubSpace Onboarding Web v2.1

An English onboarding prototype for new ACRUX-II engineers, connecting mission context, subsystem learning and the separate Mission Tree application.

## Run locally

Requires Node.js **22.13 or later**.

```powershell
cd frontend
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open http://localhost:3000. Set `VITE_MISSION_TREE_URL` in `.env.local` to the Mission Tree application's root origin. The example `http://localhost:5173` requires that separate application to be running. Leave the variable empty to disable external navigation. Restart Vite after changing configuration; production configuration requires a rebuild.

## v2.0 to v2.1: complete change record

### Page structure and navigation

The learning flow is now **Start → About → ACRUX-II → Theory → Mission Tree → Launch**. Every page is accessible without passing a quiz. The previous Home/Story/Admin screens and their sequential quiz-lock system have been replaced.

Direct routes use `#start`, `#about`, `#acrux`, `#theory`, `#mission-tree` and `#launch`. Empty or unknown hashes show Start. Browser Back/Forward navigation is supported. The old `/admin` and `?admin=1` unlock flows are no longer implemented.

### Identity, layout and themes

- Silver, ivory and gold replace the previous accent palette, following the supplied CubSpace design-system references.
- Inter is the display/body typeface; JetBrains Mono labels identify technical metadata.
- A new vector CubeSat mark combines a silver chassis, solar panels, a C monogram and a gold orbit. Header, footer and favicon use the updated identity.
- Buttons, cards, borders, status tags, navigation and responsive layouts share the new tokens.
- A header **Dark mode On/Off** toggle switches between ivory/light and charcoal/dark surfaces and persists across reloads.
- The film and model viewer retain dark space backgrounds in both themes. Reduced-motion settings are respected.

### Start: one continuous mission

The landing page is a deterministic **40-second 3D mission film**: Launch → Ascent → Deployment → Detumble → Antennas → Contact. It includes play, pause, replay, a seek timeline, captions, illustrative telemetry and a completion state. Playback starts automatically except for reduced-motion visitors.

The antenna fix normalises the imported satellite against its chassis rather than the deployed antenna bounds, hides the static antenna rods, attaches the animated replacements to the actual model spool positions, and extends them outward without moving their roots. Geometry and timing remain conceptual rather than verified Falcon CAD or flight simulation.

### About: MSP and CubSpace

- Separate MSP and CubSpace introductions, each with **Our Vision / Our Mission**. CubSpace statements describe this project's learning and engineering purpose.
- Stacked separator lines were replaced with clearly grouped purpose cards.
- MSP history remains based on public sources, with later history explicitly pending the Jenny History PPT.
- Four selectable project cards: **01 ACRUX-2, 02 Humanoid, 03 Animatronics, 04 CubSpace Project**.
- Each card opens an accessible image gallery with captions, close/Escape support and image navigation when multiple images are available.
- MSP galleries use official project-page photographs and source credits. The ACRUX photograph is labelled as ACRUX-1 flight heritage, not new ACRUX-II hardware. CubSpace shows its mark and current application screenshots.

### ACRUX-II: introduction and video

Mission background, facts, success steps, operations and technology demonstrations are presented together. The supplied [mission video](https://www.youtube.com/watch?v=cCGppiJOoZY) sits **to the right of the introductory text on desktop**, stacking on mobile. It requests **muted autoplay on page entry**, retains player controls and provides a YouTube link. Playback availability depends on YouTube and browser autoplay policy.

### Theory: anatomy and subsystem subpages

- Central interactive 1U viewer: rotate, zoom, select, explode/assemble and reset.
- All six subsystem buttons and model selection open a **right-side description drawer**, preserving the main page.
- Opening the drawer smoothly fits the Anatomy stage into the available left space; closing restores its width. Mobile uses a bottom sheet with a compact model stage above it.
- Drawers contain role, objective, tasks, required tools/skills, video, model items, references and learning outcome. Close and Escape are supported.
- **Quick Quiz is collapsible**, initially closed. Answers survive collapsing/reopening within the same subsystem; switching subsystems resets the current answer UI.
- BOX, EPS and ADCS are the initial teaching priorities. OBC/FSW, COMMS and PAY remain labelled drafts without quizzes pending team review.
- All answers must be selected before checking; all must be correct to record a pass. Retry clears answers but keeps an existing pass.
- Subsystem tutorial clips load on request, use the supplied clip-sheet IDs/windows and distinguish illustrative tutorials from flight hardware. The ADCS clip window remains unselected.

### Mission Tree: interactive vertical preview

The former statistics and horizontal Phase tiles are replaced by a **vertical, interactive Mission → Phase → Team → Task Card → Tasks tree**. Its 80 cards and task steps are imported from `frontend_v3/src/features/feature_a/pmCards.ts` in the supplied Mission Tree ZIP (CUB-TM-00-1U R6).

Features include Phase/team expansion, expand/collapse all, team filtering, card/tool/text search, matching-card counts, empty results and expandable real task steps. Configured builds link individual cards to the separate Mission Tree app. Manuals and executable workshops continue there; this preview does not submit work or record engineering approvals.

### Launch: external handoff

Choose a team and a destination: the whole tree, a team workflow or the ADCS detumbling workshop. An informational readiness checklist shows film/quiz progress without blocking access.

URL examples:

- `https://mission-tree.example/?from=onboarding&team=ADCS#/workflow/ADCS`
- `https://mission-tree.example/?from=onboarding&team=ADCS#/A/TC-ADCS-A2/workshop/A2.1`

The external app's first Admin/Junior selection may replace an incoming deep link; verify re-entry after that choice. Query parameters are metadata for future integration, not authentication or guaranteed shared state.

## Development specification

React 19, TypeScript 5.9, Vite 8, Three.js 0.184, Lenis, Lucide and plain CSS. Inter replaces the earlier Archivo/Inter Tight font dependencies. The obsolete Tailwind PostCSS configuration was removed. No backend, database or login is included.

| Location | Responsibility |
| --- | --- |
| frontend/src/pages/OnboardingPage.tsx | Assemble the six pages |
| frontend/src/features/course/ | Navigation and learning progress |
| frontend/src/features/start/film.ts | Continuous mission scene and antenna animation |
| frontend/src/features/about/ | MSP/CubSpace content and project galleries |
| frontend/src/features/acrux/ | Mission overview and autoplay video |
| frontend/src/features/theory/ | Viewer, subsystem drawers, tutorials and quizzes |
| frontend/src/features/mission-tree/ | Interactive tree data, preview and external URL contract |
| frontend/src/hooks/useTheme.ts | Theme selection and persistence |
| frontend/src/styles/ | Shared tokens and responsive page/theme styles |
| frontend/public/images/projects/ | Credited project photos and application screenshots |

Local storage keys: `cubspace-onboarding-progress-v2_1` stores film completion, quiz passes and team; `cubspace-theme` stores the selected theme. Storage failure falls back to in-memory use. Old-version progress is not migrated. No state is shared with the external app through storage.

## Commands and validation

Run in `frontend/`:

| Command | Purpose |
| --- | --- |
| npm run dev | Start development server |
| npm run lint | oxlint checks |
| npm run typecheck | TypeScript checks |
| npm run build | Type check and production bundle |
| npm run preview | Serve production bundle locally |
| npm run format | Format source |

Lint and production build pass. Chromium checks cover desktop/mobile rendering, theme persistence, galleries, subsystem drawers, quiz toggling, search/filter/task expansion and no-result behaviour. A large JavaScript bundle warning remains. See the [verification record](docs/onboarding-v2_1-verification.md) for exact coverage and remaining checks.

## Lead developer follow-up

| Item | Outstanding review | Meeting owner |
| --- | --- | --- |
| Start | Falcon CAD fidelity and educational sequence review | DH, HD |
| About | Jenny History PPT and later MSP history | TH |
| ACRUX-II | Reconcile public camera description with meeting Camera TBD | TH |
| Theory | BOX/EPS/ADCS content review; remaining draft quizzes | JY |
| Videos | Frame-by-frame selection and ADCS timestamps; actual external playback | TH |
| Mission Tree | Production origin, first-visit deep links and Junior ADCS workflow | DH |
| UI | Full keyboard, blocked-storage, WebGL-failure and cross-browser review | DH, HD |
| Approval | Internal/Board review and Junior workflow sign-off | Team |

Meeting checkpoints: 21 November internal review, 24 November 18:00 Board review, 27 November onboarding day. The team confirms dates and approvals.

Master requirements: Standup-NOV-WK2-20261113063258.md. Supporting references include CubeSat_Anatomy v1.0.1, the supplied YouTube clip sheet and Mission Tree prototype. Public sources: [MSP About](https://www.melbournespace.com.au/who-we-are), [MSP Projects](https://www.melbournespace.com.au/projects). Original source archives and the historical Claude session were read only and are not included in this repository.

See [detailed specification](docs/onboarding-v2_1-spec.md), [quiz authoring](docs/quiz-authoring.md) and [verification](docs/onboarding-v2_1-verification.md). DESIGN.md and docs/engineering-review.md retain earlier design/review history and are not v2.1 approval records.
