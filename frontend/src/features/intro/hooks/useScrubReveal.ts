import { useEffect } from 'react';
import { setScrollLerp } from '@/lib/smoothScroll';

/**
 * Scroll-scrubbed reveals for the intro: every `[data-scrub]` element gets
 * `--enter` from 0 (its top at the viewport bottom) to 1 (top at 65% height),
 * so content rises with the scroll instead of popping in once.
 * Also gives the intro a heavier, gliding scroll while it is mounted.
 */
export function useScrubReveal() {
  useEffect(() => {
    setScrollLerp(0.065);
    const elements = [...document.querySelectorAll<HTMLElement>('[data-scrub]')];
    let frame = 0;
    const update = () => {
      frame = 0;
      const start = innerHeight;
      const end = innerHeight * 0.65;
      for (const el of elements) {
        const top = el.getBoundingClientRect().top;
        const enter = Math.min(Math.max((start - top) / (start - end), 0), 1);
        el.style.setProperty('--enter', enter.toFixed(4));
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    return () => {
      setScrollLerp();
      cancelAnimationFrame(frame);
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
    };
  }, []);
}
