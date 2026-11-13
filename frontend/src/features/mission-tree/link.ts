// The single place that knows how Onboarding Web hands a visitor over to the
// Mission Tree web app. Mission Tree is a separate app on its own origin, so
// the handover is a URL: nothing is shared through browser storage.
//
//   {VITE_MISSION_TREE_URL}/?from=onboarding&team=ADCS#/<phase>/<card>/tasks
//
// The hash routes below match Mission Tree frontend_v3 (`useRoute.ts`,
// `usePage.ts`). The query string is new: Mission Tree v3 ignores it today and
// can read it later to keep the chosen team or offer a way back.

const MISSION_TREE_URL: string = (
  import.meta.env.VITE_MISSION_TREE_URL ?? ''
).replace(/\/+$/, '');

const isMissionTreeConfigured = MISSION_TREE_URL !== '';

type MissionTreeTarget =
  /** `#/`: the whole tree. */
  | { kind: 'tree' }
  /** `#/<phase>/<card>/tasks`: a Task Card with its task panel open. */
  | { kind: 'card'; phase: string; card: string; tab: 'tasks' };

function hashFor(target: MissionTreeTarget) {
  if (target.kind === 'tree') return '#/';
  const parts = [target.phase, target.card, target.tab];
  return `#/${parts.map(encodeURIComponent).join('/')}`;
}

/** Returns null while no Mission Tree address is configured for this build. */
export function missionTreeHref(
  target: MissionTreeTarget,
  team: string | null,
): string | null {
  if (!isMissionTreeConfigured) return null;
  const query = new URLSearchParams({ from: 'onboarding' });
  if (team) query.set('team', team);
  return `${MISSION_TREE_URL}/?${query}${hashFor(target)}`;
}
