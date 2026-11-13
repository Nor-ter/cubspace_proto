import { ArrowRight } from 'lucide-react';
import { FIGURE } from '../data';
import './MissionFigure.css';

// Figure 1 of the guide, drawn as a Mission Tree: the mission branches into
// six subsystem layers, which join again in their tasks, knowledge and
// workshops. That last node opens the Mission Tree page.
export function MissionFigure({ onOpenTree }: { onOpenTree: () => void }) {
  return (
    <figure className="mission-figure">
      <div className="figure-root">{FIGURE.root}</div>
      <ol className="figure-subsystems">
        {FIGURE.subsystems.map((subsystem) => (
          <li
            key={subsystem.code}
            style={
              {
                '--layer': `var(--team-${subsystem.code.toLowerCase()})`,
              } as React.CSSProperties
            }
          >
            <span className="figure-code">
              <i className="figure-dot" aria-hidden="true" />
              {subsystem.code}
            </span>
            <strong>{subsystem.name}</strong>
            <span className="figure-role">{subsystem.role}</span>
          </li>
        ))}
      </ol>
      <button className="figure-leaf" onClick={onOpenTree}>
        {FIGURE.leaf}
        <ArrowRight aria-hidden="true" />
      </button>
      <figcaption>
        <strong>Figure 1.</strong> {FIGURE.caption}
      </figcaption>
    </figure>
  );
}
