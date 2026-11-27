import { ArrowUpRight } from 'lucide-react';
import { Cited } from '@/components/Cited';
import { SUBSYSTEMS } from '../data';
import type { Selection, SubsystemContent } from '../viewer/types';
import './SubsystemPanel.css';

const layer = (subsystem: SubsystemContent) =>
  ({ '--layer': subsystem.colour }) as React.CSSProperties;

export function SubsystemPicker({
  selected,
  onSelect,
}: {
  selected: Selection;
  onSelect: (id: Selection) => void;
}) {
  return (
    <fieldset className="subsystem-picker">
      <legend className="sr-only">Subsystem</legend>
      <button aria-pressed={selected === 'all'} onClick={() => onSelect('all')}>
        Overview
      </button>
      {SUBSYSTEMS.map((subsystem) => (
        <button
          key={subsystem.id}
          style={layer(subsystem)}
          aria-pressed={selected === subsystem.id}
          onClick={() => onSelect(subsystem.id)}
        >
          <i className="layer-dot" aria-hidden="true" />
          {subsystem.code}
        </button>
      ))}
    </fieldset>
  );
}

/** The reading panel's title: the overview's line or a subsystem's code,
 * in its colour. */
export function SubsystemHeading({ selected }: { selected: Selection }) {
  const subsystem = SUBSYSTEMS.find((item) => item.id === selected);
  if (!subsystem)
    return <h3 className="subsystem-overview-title">Six subsystems</h3>;
  return (
    <header className="subsystem-head" style={layer(subsystem)}>
      <h3 id="subsystem-title">
        <i className="layer-dot" aria-hidden="true" />
        {subsystem.code}
      </h3>
    </header>
  );
}

export function SubsystemPanel({
  selected,
  onSelect,
}: {
  selected: Selection;
  onSelect: (id: Selection) => void;
}) {
  const index = SUBSYSTEMS.findIndex((item) => item.id === selected);
  const subsystem = SUBSYSTEMS[index];

  if (!subsystem)
    return (
      <div className="subsystem-panel">
        {/* Its title sits in the toolbar row, beside the picker. */}
        <ol className="subsystem-overview">
          {SUBSYSTEMS.map((item) => (
            <li key={item.id} style={layer(item)}>
              <button
                onClick={() => onSelect(item.id)}
                aria-label={`${item.title}: ${item.objective}`}
              >
                <span className="subsystem-overview-text">
                  <span className="subsystem-code">
                    <i className="layer-dot" aria-hidden="true" />
                    {item.code}
                  </span>
                  <span>{item.objective}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    );

  return (
    <article
      className="subsystem-panel"
      style={layer(subsystem)}
      aria-labelledby="subsystem-title"
    >
      <p className="subsystem-summary">
        <Cited text={subsystem.summary} />
      </p>

      <dl className="subsystem-facts">
        <div>
          <dt>Objective</dt>
          <dd>{subsystem.objective}</dd>
        </div>
        <div>
          <dt>Tasks</dt>
          <dd>
            <ul className="subsystem-tasks">
              {subsystem.tasks.map((task) => (
                <li key={task}>
                  <Cited text={task} />
                </li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt>Skills</dt>
          <dd>{subsystem.skills}</dd>
        </div>
        <div>
          <dt>Learning outcome</dt>
          <dd>{subsystem.learningOutcome}</dd>
        </div>
      </dl>

      <section className="guide-references" aria-label="References">
        <h4>References</h4>
        <ol>
          {subsystem.sources.map((source) => (
            <li key={source.id}>
              <span>[{source.id}]</span>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.title}
                <ArrowUpRight aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
