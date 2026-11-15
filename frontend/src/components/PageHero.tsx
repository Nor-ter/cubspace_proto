import type { ReactNode } from 'react';
import { NAV } from '@/features/course/data';
import type { PageId } from '@/types/course';
import { TypewriterText } from './TypewriterText';

/**
 * Lesson page header, spec-sheet style (matches About): a full-width band
 * under a hairline grid, a "03 · CUBESAT" label, the title typed on in
 * capitals and an optional lead. The title types again each time the page
 * opens.
 */
export function PageHero({
  page,
  active,
  title,
  children,
}: {
  page: PageId;
  active: boolean;
  title: string;
  children?: ReactNode;
}) {
  const index = NAV.findIndex(([id]) => id === page);
  const name = NAV[index]?.[1] ?? '';
  return (
    <header className="page-hero">
      <div className="page-hero-grid" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="page-hero-copy">
        <p className="page-hero-label">
          {String(index + 1).padStart(2, '0')} · {name}
        </p>
        <h2 className="page-hero-title">
          {active && <TypewriterText text={title} when="view" />}
        </h2>
        {children && <div className="page-hero-lead">{children}</div>}
      </div>
      <div className="page-hero-loader" aria-hidden="true">
        {active && <span />}
      </div>
    </header>
  );
}
