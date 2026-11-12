# Onboarding Web v2.1 development specification

## Requirements and sources

Master requirements: Standup-NOV-WK2-20261113063258.md, sections C.2–C.4. Original source files and the Claude session JSONL remain read-only reference material. This specification describes implementation, not engineering approval.

Inputs: CubeSat_Anatomy.html, CubeSat_Anatomy_Standalone_v1.0.1.zip, ACRUX2_Subsystem_YouTube_Clips_10-15s.md, MissionTree_README.md and cubspace_missiontree-frontend-prototype.zip.

Public references: [MSP About](https://www.melbournespace.com.au/who-we-are), [MSP Projects](https://www.melbournespace.com.au/projects). Squarespace Classe is a layout reference; visual comparison remains pending.

## Architecture

React 19, TypeScript 5.9, Vite 8, Three.js 0.184, Lenis and plain CSS. No backend, database or authentication. No Tailwind processing step.

Paths below are relative to frontend/src/.

| Path | Responsibility |
| --- | --- |
| pages/OnboardingPage.tsx | Assemble active page |
| features/course/ | Navigation, pager and progress storage |
| features/start/film.ts | Deterministic time-based 3D film |
| features/start/components/MissionFilm.tsx | Playback controls and completion |
| features/about/, features/acrux/ | Introductory content |
| features/theory/data.ts | Descriptions, tools, skills, videos, quizzes, references |
| features/theory/viewer/ | Geometry, scene, selection and exploded view |
| features/mission-tree/link.ts | External URL contract |
| styles/ | Global and responsive page CSS |

## Behaviour

Page IDs are start/about/acrux/theory/mission-tree/launch. Empty or unknown hashes show Start. Navigation uses pushState and popstate/hashchange. All pages are accessible without passing quizzes.

Storage key: cubspace-onboarding-progress-v2_1. JSON fields: filmWatched (boolean), quizzesPassed (string array), team (string or null). Blocked storage falls back to in-memory progress. There is no migration from previous versions or server persistence.

The 40-second film covers Launch/Ascent/Deployment/Detumble/Antennas/Contact. Playback starts automatically except with reduced motion. Geometry, physics and timing are conceptual, not verified flight simulation or production Falcon CAD.

Theory prioritises BOX/EPS/ADCS. OBC/FSW, COMMS and PAY are drafts without quizzes. Preserve System/Subsystem/Component boundaries and REF/TBD/VERIFY qualifications. Ground stations and space environment remain external references.

All quiz answers must be selected before checking; all must be correct to store a pass. Retry clears current answers but retains an existing pass. YouTube privacy-enhanced iframes load on click. Configured start/end values select proposed clip windows; unset values deliberately show the full tutorial. Visual frame review is outstanding.

## Mission Tree URL contract

VITE_MISSION_TREE_URL specifies the separate application's root origin. Empty configuration disables the link. URLs include from=onboarding and optional team query parameters. Browser storage is not shared across origins.

| Target | Hash |
| --- | --- |
| Whole tree | #/ |
| Team workflow | #/workflow/ADCS (or another team code) |
| Task card | #/<phase>/<card>/<manual or workshop or tasks> |
| ADCS workshop | #/A/TC-ADCS-A2/workshop/A2.1 |

Example: https://mission-tree.example/?from=onboarding&team=ADCS#/workflow/ADCS. Segments are encoded. No selected team falls back to the whole tree. Query parameters are future metadata; the receiving prototype need not consume them. Its first Admin/Junior choice may replace the deep link; verify re-entry after that choice.

## Verification checklist

1. In frontend/, run npm ci, npm run lint and npm run build.
2. Check film play/pause/seek/replay/completion and reduced-motion behaviour.
3. Check every direct hash, Back/Forward, desktop/mobile widths and keyboard navigation.
4. Check viewer selection, explode/assemble/reset, panel switching, video loading, quiz scoring and retry.
5. Check progress after reload, blocked storage and WebGL failure messaging.
6. Check Launch team/destination selection and actual external tree/workflow/workshop navigation, including an unconfigured build.
7. Obtain Jenny History PPT; review Falcon CAD fidelity, ADCS timestamps and Camera TBD. Record Junior ADCS workflow validation.

Code validation on 13 November 2026: lint and production build pass; large bundle warning remains. Browser visual review, clip frame review and actual external integration have not been marked passed.

Basic Chromium checks were subsequently completed; see [verification results](onboarding-v2_1-verification.md) for tested coverage and outstanding review.

## November 13 visual and interaction update

- Silver/ivory/gold theme with Inter typography, a new SVG CubSpace mark and matching favicon.
- Header Dark mode toggle persists under cubspace-theme, with light mode as the initial default.
- ACRUX-II intro places the supplied YouTube video on the right on desktop, stacked on mobile. It requests muted autoplay on page entry; the player retains user controls and an external link.
- About separates MSP and CubSpace project vision/mission and provides four project galleries. MSP photos retain source credits; CubSpace uses its identity and application screenshots.
- All six subsystem descriptions use a right drawer. The Anatomy stage resizes with a transition into the remaining desktop space. Mobile uses a bottom sheet with a smaller model stage above it. Closing restores the full stage.
- Subsystem quizzes start collapsed; closing/reopening the same quiz keeps its answers.
- The Mission Tree intro now includes a searchable vertical tree using all 80 cards from the supplied frontend_v3 PM dataset, with Phase/team expansion and card task details. Manuals and executable notebooks remain in the external app.
- Landing-film antenna roots now use the imported model's spool positions. Chassis-based normalisation excludes the previously deployed antenna geometry; extension stays attached to its roots.
