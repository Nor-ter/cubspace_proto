---
name: Mission Tree
description: The whole satellite mission as a CAD model space under an airborne-style bar, opened one step at a time or read as one sheet.
colors:
  paper: "#fbf4e6"
  paper-raised: "#fffaf0"
  ink: "#191919"
  ink-secondary: "#57534b"
  ink-tertiary: "#8c867a"
  hairline: "#e6dccb"
  control-line: "#bdb3a2"
  trace: "#8c867a"
  grip: "#1f6fd1"
  alert: "#d7261e"
  layer-sys: "#3b3833"
  layer-box: "#a3609f"
  layer-eps: "#bf625c"
  layer-adcs: "#bb7a3f"
  layer-com: "#4a92a3"
  layer-obc: "#5f70b3"
  layer-pay: "#9c8530"
  paper-night: "#191919"
  paper-raised-night: "#232220"
  ink-night: "#fbf4e6"
  ink-secondary-night: "#b0aa9e"
  ink-tertiary-night: "#7d7870"
  hairline-night: "#2c2a27"
  control-line-night: "#4d4a44"
  trace-night: "#8a857b"
  grip-night: "#4d9bff"
  alert-night: "#ff6b5e"
  layer-sys-night: "#e8e1d3"
  layer-box-night: "#dba8d8"
  layer-eps-night: "#eba7a2"
  layer-adcs-night: "#efbe91"
  layer-com-night: "#9fd0dc"
  layer-obc-night: "#aab6e8"
  layer-pay-night: "#e6d595"
  bar: "#191919"
  bar-ink: "#fbf4e6"
typography:
  wordmark:
    fontFamily: "Archivo Variable, Inter Tight Variable, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 900
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 125"
  display:
    fontFamily: "Archivo Variable, Inter Tight Variable, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Archivo Variable, Inter Tight Variable, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 125"
  phase-title:
    fontFamily: "Archivo Variable, Inter Tight Variable, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 112"
  station:
    fontFamily: "Archivo Variable, Inter Tight Variable, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 900
    fontVariation: "'wdth' 125"
  card-name:
    fontFamily: "Inter Tight Variable, -apple-system, Apple SD Gothic Neo, Segoe UI, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  card-code:
    fontFamily: "Inter Tight Variable, -apple-system, Apple SD Gothic Neo, Segoe UI, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.06em"
  body:
    fontFamily: "Inter Tight Variable, -apple-system, Apple SD Gothic Neo, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: "-0.01em"
    fontFeature: "tnum"
  task:
    fontFamily: "Inter Tight Variable, -apple-system, Apple SD Gothic Neo, Segoe UI, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.3
  label:
    fontFamily: "Inter Tight Variable, -apple-system, Apple SD Gothic Neo, Segoe UI, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
  count:
    fontFamily: "Inter Tight Variable, -apple-system, Apple SD Gothic Neo, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
  drawing-code:
    fontFamily: "JetBrains Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.6875rem"
    fontWeight: 700
  drawing-note:
    fontFamily: "JetBrains Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: "0.04em"
rounded:
  tool: "2px"
  card: "14px"
  pill: "999px"
  circle: "50%"
spacing:
  card-gap: "12px"
  team-gap: "18px"
  task-gap: "2px"
  indent: "28px"
  row-card: "44px"
  row-task: "26px"
  page-x: "28px"
components:
  bar-pill:
    backgroundColor: "{colors.paper-raised-night}"
    textColor: "{colors.bar-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    height: "30px"
  bar-pill-selected:
    backgroundColor: "{colors.bar-ink}"
    textColor: "{colors.bar}"
  tool-button:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.tool}"
    padding: "0 14px"
    height: "34px"
  level-pill:
    backgroundColor: "transparent"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "26px"
  level-pill-selected:
    backgroundColor: "{colors.grip}"
    textColor: "#ffffff"
  phase-station:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.station}"
    rounded: "{rounded.circle}"
    size: "44px"
  phase-station-open:
    textColor: "{colors.grip}"
  node-card:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.card-name}"
    rounded: "{rounded.card}"
    padding: "6px 12px 6px 14px"
    height: "44px"
  team-card:
    width: "220px"
  count-pill:
    typography: "{typography.count}"
    rounded: "{rounded.pill}"
    padding: "0 8px"
    height: "22px"
  material-slot:
    backgroundColor: "transparent"
    rounded: "{rounded.tool}"
    size: "9px"
  material-slot-filled:
    backgroundColor: "{colors.ink}"
    size: "9px"
  team-dot:
    rounded: "{rounded.circle}"
    size: "8px"
  minimap:
    backgroundColor: "{colors.paper-raised}"
    rounded: "{rounded.tool}"
---

# Design System: Mission Tree

This file describes **frontend_v3** (port 5175), the version that joins v1's step-by-step expansion with v2's whole-mission drawing. The v2 system ("One Drawing, Day and Night", Geologica, cool paper, square corners) lives in git history and in `frontend_v2`.

## Overview

**Creative North Star: "Model Space Under an Airborne Bar"**

The mission is drawn in a CAD model space: a gridded workspace with a faint space drawing behind it, in which the satellite mission is a drawing and every team is a layer. On top sits a band that is not CAD at all: a warm-black strip with cream rounded pills, borrowed from airborne.studio. The split is deliberate. The bar is the product's voice and the workspace is the instrument. In the workspace, only the ground is CAD: grid, linework, selection grips and drawing notes. The things you press (team and Task Card nodes) are rounded airborne cards that look clickable.

This is an operate-mode tool for students who come in cold. It always opens on **Step by step**, with nothing expanded. They open one Phase, then a Subsystem, then a Task Card, then that card's materials. **Whole sheet** puts everything on one drawing for people who already know their way. Both views lead to the same Phase detail and the same material panel.

Confirmed rejections from the iterations: no green anywhere (it hurt the eyes), no neon or high-chroma team colours, no team numbers (they read as an order), no diagonal connectors, no circuit-board traces or wiring harness motif, no subway map, no Earth-to-orbit "ascent" trunk, no line after the F station, no workshop progress status.

**Key Characteristics:**
- Two airborne colours, warm black `#191919` and cream `#FBF4E6`, carry both themes; Night (black ground) is the product's default face.
- The workspace is a CAD model space: a 16 / 80px grid, a crosshair cursor, a CAD-drafted Earth, moon and orbit drawn faintly behind the content.
- Teams are layers: pastel layer colours, told apart by colour and code, never by number.
- Rounded everything that you touch: 14px cards, pill counts and pill bar controls; rounded "ㄴ" elbows on every connector, curved to the card radius.
- One line weight for the whole step tree (2.25px), so the trunk, branches and task lines read as one drawing.
- Selection is CAD selection: grip blue, a dashed outline and four square grips.
- Motion moves the real cards (FLIP); nothing cross-fades a screenshot.

## Colors

Two airborne neutrals, CAD selection blue, and seven pastel layer colours. All values are custom properties in `frontend_v3/src/styles/global.css`. The bar's colours are overridden locally in `frontend_v3/src/styles/cad.css`. Day is declared in `:root` and Night in `:root[data-theme='night']`. The page always carries a resolved `data-theme` of `day` or `night`; `theme.ts` turns Auto into one of them.

### Primary
- **Warm Black / Cream** (`--ink` / `--paper`): by Night, cream text on a warm-black model space; by Day, the reverse. All names, station rings, filled material slots.

### Secondary
- **Grip Blue** (`--grip`, Day `#1f6fd1`, Night `#4d9bff`): CAD selection. The expanded Phase station (dashed ring and grips), a hovered station, the pressed level pill, focus outlines, text selection. It is the only accent and it always means "selected / in focus".
- **Pastel Layers** (`--team-*`): seven team colours on the CAD layer pattern, softened to pastels. By Day they are mid-light so they still read as text on cream. By Night they are light pastels. There is **no green**: ADCS, which was green in v2, is now orange. SYS is the theme's opposite neutral.

### Tertiary
- **Alert Red** (`--alert`): viewer error titles only.

### Neutral
- **Raised Paper** (`--paper-2`): node cards, panel, floating tool surfaces.
- **Trace** (`--trace`): lines without a layer: the trunk and the line from a Phase down to its teams.
- **Secondary Ink** (`--ink-2`, ≥7:1): counts, meta lines, unpressed level pills, labels.
- **Tertiary Ink** (`--ink-3`): task codes, empty slot borders, disabled.
- **Hairline / Control Line** (`--line`, `--line-2`): card borders at rest, control borders, empty states.
- **Float** (`--float`, `--float-line`): translucent surfaces that sit on the grid (tool buttons, column header, minimap), with a solid fallback under `prefers-reduced-transparency`.

### Named Rules
**The Bar Is Always Dark Rule.** The top bar is warm black with cream text in both themes. Its team dots use the Night pastels, because the Day SYS grey would disappear on black.

**The No Green Rule.** No token, layer or highlight may be green or neon.

**The Layer Rule.** A team's colour belongs to its whole branch: the line into the team, the line into its Task Cards and tasks, the dot on every card, the code text, and the card border on hover, when open or when current. It tints surfaces only by mixing: 10% on hover and 22% for the Task Card open in the panel. Picking a team in the bar fades every other team to 0.3.

**The Two Themes Rule.** Every new colour is declared for Day and for Night. Night is the reference look.

## Typography

**Display Font:** Archivo Variable, at width 112–125% and weight 800–900 (stands in for airborne's wide heavy display face).
**Body Font:** Inter Tight Variable, weight 500 by default and 700 for names (stands in for Neue Haas Grotesk Display).
**Drawing Font:** JetBrains Mono Variable, for things that sit on the drawing as notation.

**Character:** A wide, heavy display face for things you navigate to, set against a tight grotesk for things you read. The monospace appears only where the CAD drawing speaks: leaf codes on the sheet, station-like codes, and notes in the background art. Body weight was raised to 500 because thin text was hard to read on the dark ground.

### Hierarchy
- **Wordmark** (Archivo 900, width 125%, 1.1875rem, uppercase): "MISSION TREE" in the bar; 1rem at ≤1360px.
- **Display** (Archivo 900, width 125%, 1.875rem, 1.05): the Phase detail heading; 1.5rem on narrow screens.
- **Headline** (Archivo 900, width 125%, 1.5rem): the material panel title.
- **Phase Title** (Archivo 800, width 112%, 0.9375rem, 1.2): Phase names under the trunk in Step by step.
- **Station** (Archivo 900, width 125%, 0.875rem): the letter in a Phase circle; "Pre-A" drops to 0.625rem at width 100%.
- **Card Name** (Inter Tight 700, 0.9375rem, −0.015em): the lower line of a team or Task Card card.
- **Card Code** (Inter Tight 700, 0.6875rem, +0.06em, in the layer colour): the upper line (SYS, A1).
- **Task** (Inter Tight 500, 0.8125rem): task rows under a Task Card; their code (A1.1) in tertiary ink.
- **Body** (Inter Tight 500, 0.875rem, 1.45, −0.01em, tabular figures).
- **Count** (Inter Tight 700, 0.75rem): "+6" in count pills.
- **Drawing Code / Note** (JetBrains Mono, 0.6875rem 700 / 11px 400): sheet leaf codes, and dimension and label text in the background art.

### Named Rules
**The Notation Rule.** Mono is for notation on the drawing, not for UI labels. A code inside a card is Inter Tight in the layer colour.

## Layout

A sticky 60px bar sits over a full-viewport grid. `CadSpace` is a fixed layer behind everything, at `z-index: −1`.

**Step by step, Across (default).** A horizontal trunk runs from the Pre-A station to the F station and ends at F's centre (`--trunk-end`, measured by `hooks/useTrunkEnd.ts`). Phase names sit 30px below the trunk, so the line never runs through text. Opening a Phase drops a vertical stem to team cards (220px wide, 18px apart). Each team drops a stem to Task Card cards (12px apart). Each card drops a stem to task rows (26px rows, 2px apart). Each level is indented 28px (`--k`). Collapsed Phases are spaced evenly. An open Phase widens its column and the others move aside.

**Step by step, Down.** The trunk runs top to bottom. Each Phase is a row whose branch runs right through four columns, with a header bar above: **Phase · Subsystem · Materials · Task**. The column names are level pills. Pressing one expands the whole tree to that level, and pressing the active one again collapses a level. Column widths are 210 / 300px (`--w-team`, `--w-card`), dropping to 190 / 270px at ≤1360px.

**Whole sheet.** The whole mission on one drawing: seven Phase columns along the trunk, each with team code headers and leaf rows (code, name, two slots). Connector lines are thin (1px) at this density, but use the same rounded elbows.

**Phase detail.** Opened from a station. It has a framed sheet with a display heading, the gate box ("To close Phase X", numbered steps), Expand all / Collapse all, and team groups of Task Card rows.

**Material panel.** Opening a Task Card's material turns the workspace into two columns: a branch pane on the left and the panel on the right. The pane takes the shape of the view it came from. From Step by step it is a narrow (300px) column of the same rounded cards, keeping the expansion state, with the current card tinted. From Whole sheet or detail it is the sheet-style branch. The panel has a crumb, a headline title, Manual > Workshop > Tasks chevron tabs and a viewer, and it can go full width. Esc returns to the original view with its scroll and expansion intact.

**Minimap.** Floats 16px from the bottom-left (the bottom-right belongs to the Earth drawing) and collapses to a button. In Down mode and in the branch pane it can cover the lowest left nodes; this is an open issue.

**Breakpoints.** At ≤1360px the bar drops the "Mission:" label and tightens, and step columns narrow. At ≤1000px the panel becomes a full-screen overlay and the branch pane and minimap hide.

## Elevation & Depth

Mostly flat. Depth comes from the ground and the line, not from shadow. The grid is the deepest layer. The CAD space drawing sits on it at 10–38% opacity (MSP marker at 70%). Then come cards on raised paper with a 1px border. Floating tools use translucent `--float` with a hairline.

### Shadow Vocabulary
- **Minimap float** (`box-shadow: 0 2px 8px rgb(0 0 0 / 0.35)`): the only shadow on the workspace.
- **Mobile panel lift** (inherited from v2, `0 -8px 32px rgb(0 0 0 / 0.18)`): the full-screen panel below 1000px.

### Named Rules
**The Ground Is Drawn Rule.** The background is a drawing, not a texture. Every element in it is a CAD entity: grid, graticule, coastline, orbit, dimension lines, leader notes. It stays faint enough that no node ever competes with it.

## Shapes

- **Cards** (team, Task Card): 14px radius, 1px border, raised paper. The card is the click target.
- **Pills**: bar controls, the view switch, level pills and count pills (999px).
- **Tool buttons and floating surfaces in the workspace**: 2px corners (`--r`), the one CAD-square remnant.
- **Phase station**: a 44px hollow circle with a 3px ink ring (a CAD circle object). When expanded, the ring turns grip-blue and dashed, with four 7px square grips at the compass points.
- **Team dot**: an 8px filled circle in the layer colour, the same in the bar, on team cards and before Task Card codes. No numbers.
- **Material slots**: two 9px squares after a Task Card (left Technical manual, right Workshop); filled ink when the material exists, a tertiary-ink outline when not yet written.
- **Connectors**: one rounded "ㄴ" elbow per child. The `::after` of each list item draws the vertical end and the horizontal run as one piece, with `border-bottom-left-radius` equal to the bend: 14px for card rows (the card radius) and 11px for task rows. The stem (`::before`) stops where the bend starts. Every connector in Step by step is 2.25px (`--lw`, with `--lw-task` and `--lw-main` aliased to it). In Whole sheet and the sheet-style pane they are 1px with 8 / 6px bends. Down's first child continues the incoming horizontal line straight, without a bend.

## Components

### Top Bar
A warm-black band, 60px, with groups of cream pills: the wordmark; Mission + cohort select; the Step by step / Whole sheet switch; Across / Down; Day / Night / Auto (sun, orbiting satellite, half disc); and Team, showing layer toggles as a dot plus a code. A pressed pill inverts to cream with black text.

### Node Cards
Two lines in a grid: dot + code (layer colour) above, the name (700) below, with material slots and a count pill on the right. Hover gives a layer-colour border and a 10% tint. An open card keeps the layer border. The card open in the material panel (`aria-current`) gets a 22% tint. On a Task Card, an invisible button covers the whole card (`.card-hit::after`) to toggle tasks; the slots and count sit above it at `z-index: 1`. Focus draws the dashed grip outline around the whole card.

### Phase Head
A station, then the name under the trunk, then a count pill and "N teams". Hovering turns the ring and letter grip-blue. Pressing toggles the Phase open or closed in place (no page change).

### Level Pills (Down column header)
Phase · Subsystem · Materials · Task on a floating bar. The current depth is a filled grip pill.

### Tool Buttons
Expand all / Collapse all: 34px, 2px corners, float surface, 1px float-line border.

### Minimap
A miniature of the whole tree on a float surface, with the current path lit in layer colours. It shows no numbers.

### CadSpace (background)
Groups are pinned to screen corners, so viewport ratio never scales or clips them.
- **Earth (bottom-right)**: a quarter circle, `clamp(300px, min(32vw, 62vh), 560px)`. It holds an orthographic Australia with Tasmania, a 15° graticule, an R 6,371 km dimension, a dashed LEO orbit with h 500 km, an ACRUX-II satellite node, and an MSP · MELBOURNE target marker.
- **Moon (bottom-left, above the minimap)**: a small circle with a centre mark.
- **Sky**: fixed-seed `+` star marks (none over the Earth) and one chain-dotted transfer ellipse with a non-scaling stroke.

### Motion
- **Expand / collapse:** a height animation on the child list (WAAPI). Opening takes 260–420ms depending on height, on `cubic-bezier(0.16, 1, 0.3, 1)`. Closing takes 220ms on `cubic-bezier(0.4, 0, 0.6, 1)`, with `fill: forwards` so it never flashes full height.
- **Orientation flip:** Across ↔ Down moves the same parts (620ms, `cubic-bezier(0.3, 0, 0, 1)`, staggered 28ms per Phase and 18ms per team).
- **Branch move:** opening material moves the Phase head and team pieces (`data-part`) from the tree into the branch pane (FLIP, 560ms, same curve). From Step by step the pieces keep their card shape. A ghost of the tree fades out as the panel fades from 0.25 to 1 (460ms). Closing reverses it.
- **Phase detail:** a circle clip grows from the station (700ms) and shrinks back (480ms).
- Every move is instant under `prefers-reduced-motion`.

## Do's and Don'ts

### Do:
- **Do** keep the bar warm black with cream pills in both themes, and keep CAD below it.
- **Do** draw every new connector as a rounded "ㄴ" elbow with its bend equal to the card radius, at `--lw`.
- **Do** carry a team's identity by layer colour plus code, and let the whole branch take that colour.
- **Do** use grip blue only for selection and focus.
- **Do** make anything clickable look like a card or a pill; keep CAD styling for the ground and notation.
- **Do** declare new colours for Day and Night, and check Night first.
- **Do** move real elements with FLIP and keep the origin view's shape through a transition.

### Don't:
- **Don't** use green, neon or saturated layer colours.
- **Don't** number teams or show them in an order that implies rank.
- **Don't** draw diagonal or square-cornered connectors, or let the trunk run past F.
- **Don't** let a line run behind text; put names beside or below lines.
- **Don't** add shadows beyond the minimap (and the mobile panel).
- **Don't** let the background drawing scale with the viewport; pin its groups to corners.
- **Don't** show workshop progress status.
