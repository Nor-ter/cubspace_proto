import { useEffect, useRef, useState } from 'react';
import type { StoryFrame } from '@/features/story/hooks/useStoryScroll';

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);
const smoothstep = (value: number) => value * value * (3 - 2 * value);

/**
 * Maps scroll position across the `[data-intro-section]` sections to
 * { index, blend } for the 3D stage, plus the section currently in view.
 */
export function useIntroStage() {
  const frameRef = useRef<StoryFrame>({ index: 0, blend: 0 });
  const [active, setActive] = useState(0);

  useEffect(() => {
    let tops: number[] = [];
    let maxScroll = 1;
    let frame = 0;
    const measure = () => {
      const sections = document.querySelectorAll('[data-intro-section]');
      tops = [...sections].map((s) => s.getBoundingClientRect().top + scrollY);
      maxScroll = document.documentElement.scrollHeight - innerHeight;
    };
    const update = () => {
      frame = 0;
      const y = scrollY;
      let index = tops.length - 1;
      while (index > 0 && y < tops[index]) index -= 1;
      const next = tops[index + 1] ?? maxScroll;
      const progress = next > tops[index] ? clamp((y - tops[index]) / (next - tops[index])) : 0;
      const isLast = index === tops.length - 1;
      frameRef.current = { index, blend: isLast ? 0 : smoothstep(progress) };
      const middle = y + innerHeight / 2;
      let current = 0;
      tops.forEach((top, i) => {
        if (middle >= top) current = i;
      });
      if (y >= maxScroll - 2) current = tops.length - 1;
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const remeasure = () => {
      measure();
      update();
    };
    remeasure();
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', remeasure);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('scroll', schedule);
      removeEventListener('resize', remeasure);
    };
  }, []);

  return { frameRef, active };
}
