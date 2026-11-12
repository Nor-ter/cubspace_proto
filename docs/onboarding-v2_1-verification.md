# v2.1 verification — 13 November 2026

## Passed

- TypeScript/production build and oxlint (see current repository scripts).
- Chromium smoke checks at 1440×1000 and 390×844: all six pages rendered, no horizontal document overflow, no uncaught page errors in the page-navigation run.
- All six subsystem panels opened; desktop Theory screenshot inspected.
- Reduced-motion film started paused; play/pause, seek to completion and replay worked. Film completion persisted.
- BOX quiz all-correct submission stored theory-structure; retry cleared current answers.
- Launch stored ADCS team selection. Unconfigured external navigation was disabled.
- Mobile menu navigated to Theory; mobile Theory screenshot inspected.

The first automated pointer test waited on animated subsystem buttons because their positions were not stable. Subsequent panel checks used forced pointer clicks with reduced motion. This does not establish ordinary pointer usability for every animated position; include that in manual review.

## Outstanding

- Actual Mission Tree app deployment and first-visit deep-link integration.
- Complete keyboard, browser Back/Forward, blocked-storage and WebGL failure exercises.
- Full mobile/desktop visual review across all content, especially long subsystem panels.
- YouTube availability and frame-by-frame clip selection; ADCS window remains TBD.
- Falcon CAD fidelity, Jenny History PPT and team review of Camera TBD.
- Junior/Board sign-off. A successful frontend check is not engineering approval.

No remote application was changed or published. Original Claude session JSONL was read only. QA scripts and screenshots were kept outside the repository in a temporary directory.

## Subsequent UI verification

- All four galleries opened and their images loaded. CubSpace next-image navigation and Escape close passed.
- Six subsystem drawers opened with the Anatomy stage entirely to the left of the desktop drawer.
- Subsystem quizzes began collapsed; an answer survived collapsing and reopening.
- Tree team filter plus B-dot search returned two real cards, task expansion displayed three steps, and unmatched search showed an empty state.
- Light/dark theme persistence and navigation checked at 1440, 1024 and 390 px widths without horizontal overflow.
- Drawer/gallery/tree interaction run reported no uncaught JavaScript errors. Screenshots reviewed on desktop and mobile.
- The autoplay iframe requests were checked; actual YouTube playback still depends on the browser and external service.
