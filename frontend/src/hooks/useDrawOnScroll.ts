import { useEffect } from 'react';

const DRAWN = 'is-drawn';
const MOTION = 'motion';

// Draws each matching element when it scrolls into view, and resets it when it
// leaves below the viewport or is hidden, so it draws again on the next visit.
export function useDrawOnScroll(selector: string, rescanKey: unknown) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add(MOTION);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting, boundingClientRect }) => {
          if (isIntersecting) target.classList.add(DRAWN);
          else if (boundingClientRect.width === 0 || boundingClientRect.top > 0)
            target.classList.remove(DRAWN);
        });
      },
      { threshold: 0.25 },
    );
    document.querySelectorAll(selector).forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [selector, rescanKey]);
}
