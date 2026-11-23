import { scrollToY } from './smoothScroll';

/** Let the viewer handle the wheel without forwarding it to native or smooth page scrolling. */
export function isolateCanvasWheel(canvas: HTMLCanvasElement) {
  canvas.setAttribute('data-lenis-prevent-wheel', '');
  const onWheel = (event: WheelEvent) => {
    event.preventDefault();
    event.stopPropagation();
    // Stop any page-scroll momentum left over from entering the canvas.
    scrollToY(window.scrollY, true);
  };
  canvas.addEventListener('wheel', onWheel, { passive: false });
  return () => {
    canvas.removeEventListener('wheel', onWheel);
    canvas.removeAttribute('data-lenis-prevent-wheel');
  };
}
