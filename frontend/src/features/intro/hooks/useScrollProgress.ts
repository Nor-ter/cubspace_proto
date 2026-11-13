import { useEffect, useRef } from 'react';

/**
 * Writes `--p` (0 → 1) on the element as it scrolls through the viewport:
 * 0 when its top reaches the viewport top, 1 when its bottom reaches the viewport bottom.
 * Driving CSS directly avoids a React render per frame.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const range = Math.max(rect.height - innerHeight, 1);
      const p = Math.min(Math.max(-rect.top / range, 0), 1);
      el.style.setProperty('--p', p.toFixed(4));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
    };
  }, []);
  return ref;
}
