# Engineering content review — 2026-09-08

Scope: seven reading pages, six quiz sessions, main teaching panels, subsystem properties, ADCS diagram and Prolog examples. General physics is distinguished from source project statements and illustrative assumptions.

## Corrections

- Quiz RadioGroup width: remove the 100% width plus left-margin overflow.
- Orbit: centre a textured spherical Earth and satellite asset geometrically; use the same orbit frame for line and satellite, depth testing for occultation and elapsed-time animation. Display is explicitly not to scale or a flight simulation.
- Reading steps: separate 7 reference readings from 6 quiz sessions; consistent navigation, ordered cards with descriptions and responsive connector placement.
- ADCS: distinguish detumbling from full attitude determination/pointing; magnetic torque is m×B and has directional limitations. Explain B-dot energy damping with assumptions and units.
- MADE: torque is not energy. Explain Energy as the project model category; units, state flags, scope and source-based hierarchy.
- Prolog: exact supported queries only, direct subsystem rule added, empty evidence predicates declared, no implication that a fact is approved or a query is flight authorization.
- Replace slogan recall with evidence-based engineering judgement.

## Source conflicts retained for engineering disposition

- ConOps §2: 3 cells; Modeling §1/§2.2: 3–4 parallel cells TBD.
- ConOps 40% maximum DoD versus payload operation above 40% SOC. These are different thresholds.
- ConOps power margin 0.31−0.20 = 0.11 W, approximately 0.1 W in source.
- Antenna energy 5 V×0.25 A×10 s = 0.00347 Wh versus conservative 0.005 Wh source estimate.
- ConOps §5.1: offset centre of mass alone does not cause spontaneous spin-up; external torques are needed to change inertial angular momentum.
- ConOps <5°/s lacks vector/axis interpretation and dwell criterion; no invented acceptance test.
- Low-energy emergency deployment exception is retained; normal order is not universal.
- Deneb axes/driver details and GLB wings are not established flight hardware specifications. Camera remains TBD.

References appear beside the new engineering explanations. NASA GNC, NASA Systems Engineering Handbook, NASA orbital mechanics, NASA magnetic-control reference, SWI-Prolog and provided ConOps/Modeling documents were consulted. Browser quizzes remain training-only and are not design sign-off.

## Verification results

- The 8 existing learning logic tests pass.
- 30 quizzes: duplicate ID, duplicate option, answer index and explanation presence checks pass.
- All 7 reading materials are linked to engineering explanations.
- Rendering and horizontal overflow checks pass for the 7 reading materials on desktop.
- No horizontal overflow for the 7 reading materials and 6 quiz sessions at 390 px on mobile. All options stay within the question card boundary.
- Confirmed in a real browser: 4/5 incorrect-answer feedback → answer corrected → 5/5 completion. The verification progress record was restored to the initial state (0/6).
- Supported Prolog queries display the specified results, and unsupported queries such as component(eps, X). show guidance instead of fabricating results.
- Orbit centring and front/back occlusion confirmed on screen. No browser error logs.
- Default lint and TypeScript checks pass. This does not resolve the existing lint issues in the whole generated components/ui library.
- The build warning for chunks over 500 kB is a performance improvement candidate, not a build failure.

This review is an educational content and software verification. It does not arbitrarily settle the actual flight configuration and numerical conflicts remaining in the documents.
