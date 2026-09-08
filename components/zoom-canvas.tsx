'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Minus, Plus, Scan } from 'lucide-react';
export function ZoomCanvas({
  children,
  width = 1100,
  height = 350,
  overlay,
}: {
  children: ReactNode;
  width?: number;
  height?: number;
  overlay?: ReactNode;
}) {
  const host = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(
    null,
  );
  const [view, setView] = useState({ scale: 1, x: 16, y: 25 });
  const fit = () => {
    const e = host.current;
    if (e)
      setView({
        scale: Math.min(
          (e.clientWidth - 32) / width,
          (e.clientHeight - 50) / height,
          1,
        ),
        x: 16,
        y: 25,
      });
  };
  useEffect(() => {
    const e = host.current;
    if (!e) return;
    const observer = new ResizeObserver(() => {
      setView({
        scale: Math.min(
          (e.clientWidth - 32) / width,
          (e.clientHeight - 50) / height,
          1,
        ),
        x: 16,
        y: 25,
      });
    });
    observer.observe(e);
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = e.getBoundingClientRect();
      const x = event.clientX - rect.left,
        y = event.clientY - rect.top;
      setView((v) => {
        const scale = Math.max(
          0.15,
          Math.min(2.5, v.scale * Math.exp(-event.deltaY * 0.0015)),
        );
        return {
          scale,
          x: x - ((x - v.x) * scale) / v.scale,
          y: y - ((y - v.y) * scale) / v.scale,
        };
      });
    };
    e.addEventListener('wheel', wheel, { passive: false });
    return () => {
      observer.disconnect();
      e.removeEventListener('wheel', wheel);
    };
  }, [width, height]);
  return (
    <div className="zoom-shell">
      <div className="zoom-tools">
        <span>휠 확대·축소 · 빈 공간 드래그 이동</span>
        <button
          aria-label="축소"
          onClick={() =>
            setView((v) => ({ ...v, scale: Math.max(0.15, v.scale / 1.2) }))
          }
        >
          <Minus />
        </button>
        <output>{Math.round(view.scale * 100)}%</output>
        <button
          aria-label="확대"
          onClick={() =>
            setView((v) => ({ ...v, scale: Math.min(2.5, v.scale * 1.2) }))
          }
        >
          <Plus />
        </button>
        <button aria-label="전체 흐름 맞춤" onClick={fit}>
          <Scan />
        </button>
      </div>
      <div
        className="zoom-viewport"
        ref={host}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest('button,a,summary')) return;
          drag.current = { x: e.clientX, y: e.clientY, ox: view.x, oy: view.y };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (d)
            setView((v) => ({
              ...v,
              x: d.ox + e.clientX - d.x,
              y: d.oy + e.clientY - d.y,
            }));
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        <div
          className="zoom-stage"
          style={{
            width,
            height,
            transform: `translate(${view.x}px,${view.y}px) scale(${view.scale})`,
          }}
        >
          {children}
        </div>
        {overlay}
      </div>
    </div>
  );
}
