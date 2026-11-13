import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { SUBSYSTEMS } from '../data';
import type { Selection, SubsystemContent } from '../viewer/types';
import './SubsystemPanel.css';

// The guide ends a paragraph or task with its citations, e.g. "… [1, 5, 6]".
function splitCitation(text: string): [string, number[]] {
  const match = text.match(/\s*\[([\d,\s]+)\]$/);
  if (!match) return [text, []];
  return [
    text.slice(0, match.index),
    match[1].split(',').map((id) => Number(id.trim())),
  ];
}

const layer = (subsystem: SubsystemContent) =>
  ({ '--layer': subsystem.colour }) as React.CSSProperties;

function Cited({ text }: { text: string }) {
  const [body, cites] = splitCitation(text);
  return (
    <>
      {body}
      {cites.length > 0 && <span className="cite"> [{cites.join(', ')}]</span>}
    </>
  );
}

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
        Whole spacecraft
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
        <h3 className="subsystem-overview-title">
          Six subsystems work as one spacecraft.
        </h3>
        <ol className="subsystem-overview">
          {SUBSYSTEMS.map((item, itemIndex) => (
            <li key={item.id} style={layer(item)}>
              <button onClick={() => onSelect(item.id)}>
                <span className="subsystem-number">2.{itemIndex + 1}</span>
                <span className="subsystem-overview-text">
                  <span className="subsystem-code">
                    <i className="layer-dot" aria-hidden="true" />
                    {item.code}
                  </span>
                  <strong>{item.title}</strong>
                  <span>{item.objective}</span>
                </span>
                <ArrowRight aria-hidden="true" />
              </button>
            </li>
          ))}
        </ol>
      </div>
    );

  const previous = SUBSYSTEMS[index - 1];
  const next = SUBSYSTEMS[index + 1];
  return (
    <article
      className="subsystem-panel"
      style={layer(subsystem)}
      aria-labelledby="subsystem-title"
    >
      <header className="subsystem-head">
        <span className="subsystem-code">
          <i className="layer-dot" aria-hidden="true" />
          2.{index + 1} · {subsystem.code}
        </span>
        <h3 id="subsystem-title">{subsystem.title}</h3>
      </header>

      <p className="subsystem-summary">
        <Cited text={subsystem.summary} />
      </p>

      <dl className="subsystem-facts">
        <div className="is-objective">
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
        <div className="is-outcome">
          <dt>Learning outcome</dt>
          <dd>{subsystem.learningOutcome}</dd>
        </div>
        <div>
          <dt>In the 3D model</dt>
          <dd>
            <ul className="subsystem-parts">
              {subsystem.parts.map((part) => (
                <li key={part}>{part}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>

      <section className="subsystem-sources" aria-label="References">
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

      <nav className="subsystem-steps" aria-label="Subsystems">
        {previous ? (
          <button onClick={() => onSelect(previous.id)}>
            <ArrowLeft aria-hidden="true" />
            <span>
              <small>Previous</small>
              {previous.title}
            </span>
          </button>
        ) : (
          <button onClick={() => onSelect('all')}>
            <ArrowLeft aria-hidden="true" />
            <span>
              <small>Back to</small>
              All subsystems
            </span>
          </button>
        )}
        {next && (
          <button className="is-next" onClick={() => onSelect(next.id)}>
            <span>
              <small>Next</small>
              {next.title}
            </span>
            <ArrowRight aria-hidden="true" />
          </button>
        )}
      </nav>
    </article>
  );
}
