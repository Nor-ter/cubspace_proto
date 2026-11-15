import { scrollToY } from './smoothScroll';

export const ROUTE_CHANGE = 'cubspace:route-change';

// When the intro last handed off to the course. Read without clearing, so
// React's double-invoked initialisers in development both see it; it simply
// goes stale after a moment.
let handedOffAt = -Infinity;
const HANDOFF_WINDOW_MS = 1500;

/** Client-side navigation between top-level pages without a full reload. */
export function navigate(path: string, { fromIntro = false } = {}) {
  handedOffAt = fromIntro ? performance.now() : -Infinity;
  history.pushState(null, '', path);
  scrollToY(0, true);
  dispatchEvent(new Event(ROUTE_CHANGE));
}

/** True right after the intro's Start: the course fades its scene in. */
export function cameFromIntro() {
  return performance.now() - handedOffAt < HANDOFF_WINDOW_MS;
}
