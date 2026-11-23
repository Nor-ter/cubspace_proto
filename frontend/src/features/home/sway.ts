import type { FilmView } from './film';

// While Start waits, the camera drifts slowly from side to side and leans
// towards the pointer, so Earth moves with it while the stars turn the other
// way. All of it settles before the countdown.
const SWAY_WORLD = 0.16;
const SWAY_PERIOD_S = 9;
/** Camera reach towards the pointer at the screen edge, world units. */
const POINTER_SIDE = 0.34;
const POINTER_LIFT = 0.14;
/** Star-field turn at the screen edge, radians. */
const POINTER_STARS = 0.06;
/** How quickly the view catches up with the pointer, per second. */
const POINTER_EASE = 3;

// Pointer parallax for one scene. `step` eases towards the pointer and returns
// the camera nudge; `active` false fades the sway out.
export function createSway(reducedMotion: boolean) {
  let amount = reducedMotion ? 0 : 1;
  const target = { x: 0, y: 0 };
  const eased = { x: 0, y: 0 };
  const onMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    target.x = (event.clientX / innerWidth) * 2 - 1;
    target.y = (event.clientY / innerHeight) * 2 - 1;
  };
  const onLeave = () => {
    target.x = 0;
    target.y = 0;
  };
  if (!reducedMotion) {
    addEventListener('pointermove', onMove);
    document.documentElement.addEventListener('pointerleave', onLeave);
  }
  return {
    step(now: number, dt: number, active: boolean): FilmView {
      amount +=
        ((active && !reducedMotion ? 1 : 0) - amount) * Math.min(dt * 2, 1);
      const follow = Math.min(dt * POINTER_EASE, 1);
      eased.x += (target.x - eased.x) * follow;
      eased.y += (target.y - eased.y) * follow;
      const drift =
        SWAY_WORLD * Math.sin(((now / 1000) * Math.PI * 2) / SWAY_PERIOD_S);
      return {
        side: amount * (drift + eased.x * POINTER_SIDE),
        lift: amount * -eased.y * POINTER_LIFT,
        stars: [
          amount * eased.x * POINTER_STARS,
          amount * eased.y * POINTER_STARS * 0.6,
        ],
      };
    },
    dispose() {
      removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    },
  };
}
