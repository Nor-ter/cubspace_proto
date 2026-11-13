import type { CSSProperties } from 'react';
import { BrandLogo } from '@/components/BrandLogo';

/** Full-screen wipe that grows from the pressed button and carries the logo. */
export function LaunchOverlay({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="launch-overlay"
      style={{ '--x': `${x}px`, '--y': `${y}px` } as CSSProperties}
      aria-hidden="true"
    >
      <span className="launch-logo">
        <BrandLogo />
        <strong>CubSpace</strong>
      </span>
    </div>
  );
}
