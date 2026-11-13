import { scrollToY } from './smoothScroll';

export const ROUTE_CHANGE = 'cubspace:route-change';

let pendingEnter = false;

/** Client-side navigation between top-level pages without a full reload. */
export function navigate(path: string, { enter = false } = {}) {
  pendingEnter = enter;
  history.pushState(null, '', path);
  scrollToY(0, true);
  dispatchEvent(new Event(ROUTE_CHANGE));
}

/** True once after a navigate() that asked the next page to play its entrance. */
export function consumeEnterTransition() {
  const value = pendingEnter;
  pendingEnter = false;
  return value;
}
