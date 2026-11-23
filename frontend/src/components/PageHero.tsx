import type { ReactNode } from 'react';
import { TypewriterText } from './TypewriterText';

/**
 * Lesson page header, spec-sheet style (matches About): a full-width band
 * under a hairline grid, the title typed on in capitals and an optional
 * lead (the fixed context bar already shows the page number). The title
 * types again each time the page opens.
 */
export function PageHero({
  active,
  title,
  children,
  art,
}: {
  active: boolean;
  title: string;
  children?: ReactNode;
  /** A drawing on the right of the title, such as the CubeSat sizes. */
  art?: ReactNode;
}) {
  const sentences = title.split(/(?<=\.)\s+/);
  return (
    <header className="page-hero">
      <div className="page-hero-grid" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="page-hero-copy">
        <h2 className="page-hero-title">
          {/* Each sentence starts its own line, typed as one sequence. */}
          {active &&
            sentences.map((sentence, index) => (
              <span key={sentence} className="page-hero-line">
                <TypewriterText
                  text={sentence}
                  start={sentences
                    .slice(0, index)
                    .reduce((sum, s) => sum + s.length, 0)}
                  when="view"
                />
              </span>
            ))}
        </h2>
        {children && <div className="page-hero-lead">{children}</div>}
      </div>
      {art && <div className="page-hero-art">{art}</div>}
      <div className="page-hero-loader" aria-hidden="true">
        {active && <span />}
      </div>
    </header>
  );
}
