import { useEffect, useRef } from 'react';

const STAR_COUNT = 700;
/** Cruise speed in depth units per second; the warp multiplies it. */
const CRUISE = 0.035;
const WARP = 38;
const WARP_RAMP_MS = 900;

type Star = { x: number; y: number; z: number; tint: string };

const TINTS = ['255 255 255', '255 255 255', '255 244 230', '200 220 255'];

function spawn(star: Partial<Star> = {}, z = Math.random()): Star {
  return {
    x: (Math.random() * 2 - 1) * 1.2,
    y: (Math.random() * 2 - 1) * 1.2,
    z: Math.max(z, 0.02),
    tint: star.tint ?? TINTS[Math.floor(Math.random() * TINTS.length)],
  };
}

/**
 * Deep space behind the intro: stars drift slowly towards the viewer. With
 * `warp` set they stretch into streaks and rush past, for the hand-off.
 */
export function Starfield({ warp }: { warp: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const warpRef = useRef(warp);
  useEffect(() => {
    warpRef.current = warp;
  }, [warp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stars = Array.from({ length: STAR_COUNT }, () => spawn());
    let width = 0;
    let height = 0;

    const resize = () => {
      const ratio = Math.min(devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    let frame = 0;
    let previous = performance.now();
    let warpStart = 0;
    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      if (warpRef.current && !warpStart) warpStart = now;
      const boost = warpStart
        ? 1 + (WARP - 1) * Math.min((now - warpStart) / WARP_RAMP_MS, 1) ** 2
        : 1;
      const speed = still ? 0 : CRUISE * boost;
      const scale = Math.max(width, height) * 0.5;
      const cx = width / 2;
      const cy = height / 2;
      context.clearRect(0, 0, width, height);
      context.lineCap = 'round';
      for (const star of stars) {
        const before = star.z;
        star.z -= speed * dt;
        if (star.z <= 0.02) {
          Object.assign(star, spawn(star, 1));
          continue;
        }
        const sx = cx + (star.x / star.z) * scale;
        const sy = cy + (star.y / star.z) * scale;
        if (sx < -50 || sx > width + 50 || sy < -50 || sy > height + 50) {
          Object.assign(star, spawn(star, 1));
          continue;
        }
        const near = 1 - star.z;
        const alpha = Math.min(0.15 + near * 0.95, 1);
        const size = 0.4 + near * 1.6;
        if (boost > 1.5) {
          // Streak from where the star was a moment ago.
          const px = cx + (star.x / before) * scale;
          const py = cy + (star.y / before) * scale;
          context.strokeStyle = `rgb(${star.tint} / ${alpha})`;
          context.lineWidth = size;
          context.beginPath();
          context.moveTo(px, py);
          context.lineTo(sx, sy);
          context.stroke();
        } else {
          context.fillStyle = `rgb(${star.tint} / ${alpha})`;
          context.beginPath();
          context.arc(sx, sy, size, 0, Math.PI * 2);
          context.fill();
        }
      }
    };
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="intro-stars" aria-hidden="true" />;
}
