import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

let lenis: Lenis | null = null;

export function startSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  lenis = new Lenis({ autoRaf: true, lerp: 0.1 });
}

export function stopSmoothScroll() {
  lenis?.destroy();
  lenis = null;
}

export function scrollToY(top: number, immediate = false) {
  if (lenis) lenis.scrollTo(top, { immediate });
  else window.scrollTo({ top, behavior: immediate ? 'instant' : 'smooth' });
}

export function scrollToElement(element: Element, offset = 0) {
  scrollToY(element.getBoundingClientRect().top + window.scrollY + offset);
}
