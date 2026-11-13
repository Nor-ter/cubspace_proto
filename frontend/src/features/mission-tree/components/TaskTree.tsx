import { useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { PHASES, TEAMS } from '../data';
import { missionTreeHref } from '../link';
import { MISSION_CARDS, type MissionCard } from '../missionCards';
import './TaskTree.css';

const ALL = 'ALL';

// "TC-ADCS-A2" → "A2", the code Mission Tree shows on a card.
const cardCode = (card: MissionCard) => card.id.split('-').pop() ?? card.id;

const allBranchKeys = () =>
  PHASES.flatMap(([phase]) => [
    phase,
    ...TEAMS.map(([team]) => `${phase}/${team}`),
  ]);

// Step by step, Down (DESIGN.md): Phase stations on a trunk, team cards,
// Task Cards and task rows, joined by rounded "ㄴ" elbows. Opens with nothing
// expanded; filtering or searching opens every branch that still has cards.
export function TaskTree() {
  const [team, setTeam] = useState(ALL);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const search = query.trim().toLowerCase();
  const cards = MISSION_CARDS.filter(
    (card) =>
      (team === ALL || card.sub === team) &&
      (!search ||
        `${card.id} ${card.short} ${card.title} ${card.steps.flat().join(' ')}`
          .toLowerCase()
          .includes(search)),
  );

  function toggle(key: string) {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }
  const expandAll = () => setOpen(new Set(allBranchKeys()));
  const collapseAll = () => setOpen(new Set());

  return (
    <div className="task-tree">
      <div className="tree-tools">
        <label className="tree-search">
          <Search aria-hidden="true" />
          <span className="sr-only">Search Task Cards</span>
          <input
            type="search"
            value={query}
            placeholder="Search tasks, tools or card IDs"
            onChange={(event) => {
              setQuery(event.target.value);
              if (event.target.value.trim()) expandAll();
            }}
          />
        </label>
        <div className="tree-tool-group">
          <button className="tree-tool" onClick={expandAll}>
            Expand all
          </button>
          <button className="tree-tool" onClick={collapseAll}>
            Collapse all
          </button>
        </div>
      </div>

      <fieldset className="tree-teams-filter">
        <legend className="sr-only">Team</legend>
        <button
          aria-pressed={team === ALL}
          onClick={() => {
            setTeam(ALL);
            collapseAll();
          }}
        >
          All teams
        </button>
        {TEAMS.map(([code, name]) => (
          <button
            key={code}
            aria-pressed={team === code}
            title={name}
            style={
              {
                '--layer': `var(--team-${code.toLowerCase()})`,
              } as React.CSSProperties
            }
            onClick={() => {
              setTeam(code);
              expandAll();
            }}
          >
            <i className="team-dot" aria-hidden="true" />
            {code}
          </button>
        ))}
      </fieldset>

      <p className="tree-count" aria-live="polite">
        {cards.length === MISSION_CARDS.length
          ? `${cards.length} Task Cards`
          : `${cards.length} of ${MISSION_CARDS.length} Task Cards`}
      </p>

      {cards.length === 0 ? (
        <p className="tree-empty">
          No Task Card matches. Try another search or choose All teams.
        </p>
      ) : (
        <ol className="tree-phases">
          {PHASES.map(([phase, title]) => {
            const phaseCards = cards.filter((card) => card.phase === phase);
            if (!phaseCards.length) return null;
            const isOpen = open.has(phase);
            const teams = TEAMS.filter(([code]) =>
              phaseCards.some((card) => card.sub === code),
            );
            return (
              <li key={phase} className={isOpen ? 'phase is-open' : 'phase'}>
                <button
                  className="phase-head"
                  aria-expanded={isOpen}
                  aria-controls={`tree-phase-${phase}`}
                  onClick={() => toggle(phase)}
                >
                  <span
                    className={phase.length > 1 ? 'station is-long' : 'station'}
                    aria-hidden="true"
                  >
                    {phase}
                  </span>
                  <span className="phase-text">
                    <strong>
                      <span className="sr-only">Phase {phase}: </span>
                      {title}
                    </strong>
                    <span className="phase-meta">
                      <span className="count-pill">{phaseCards.length}</span>
                      {phaseCards.length === 1
                        ? 'Task Card'
                        : 'Task Cards'} ·{' '}
                      {teams.length} {teams.length === 1 ? 'team' : 'teams'}
                    </span>
                  </span>
                </button>
                {isOpen && (
                  <ol className="tree-branch" id={`tree-phase-${phase}`}>
                    {teams.map(([code, name]) => {
                      const key = `${phase}/${code}`;
                      const teamCards = phaseCards.filter(
                        (card) => card.sub === code,
                      );
                      const isTeamOpen = open.has(key);
                      return (
                        <li
                          key={code}
                          className="tree-node"
                          style={
                            {
                              '--layer': `var(--team-${code.toLowerCase()})`,
                            } as React.CSSProperties
                          }
                        >
                          <button
                            className={
                              isTeamOpen ? 'node-card is-open' : 'node-card'
                            }
                            aria-expanded={isTeamOpen}
                            aria-controls={`tree-team-${phase}-${code}`}
                            onClick={() => toggle(key)}
                          >
                            <span className="node-code">
                              <i className="team-dot" aria-hidden="true" />
                              {code}
                            </span>
                            <strong>{name}</strong>
                            <span className="count-pill">
                              {teamCards.length}
                            </span>
                          </button>
                          {isTeamOpen && (
                            <ol
                              className="tree-branch is-layer"
                              id={`tree-team-${phase}-${code}`}
                            >
                              {teamCards.map((card) => (
                                <TaskCardNode
                                  key={card.id}
                                  card={card}
                                  isOpen={open.has(card.id)}
                                  onToggle={() => toggle(card.id)}
                                />
                              ))}
                            </ol>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function TaskCardNode({
  card,
  isOpen,
  onToggle,
}: {
  card: MissionCard;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const code = cardCode(card);
  const href = missionTreeHref(
    { kind: 'card', phase: card.phase, card: card.id, tab: 'tasks' },
    card.sub,
  );
  return (
    <li className="tree-node">
      <button
        className={
          isOpen ? 'node-card is-task-card is-open' : 'node-card is-task-card'
        }
        aria-expanded={isOpen}
        aria-controls={`tree-card-${card.id}`}
        onClick={onToggle}
      >
        <span className="node-code">
          <i className="team-dot" aria-hidden="true" />
          {code}
        </span>
        <strong>{card.short}</strong>
        <span className="count-pill">{card.steps.length}</span>
      </button>
      {isOpen && (
        <div className="task-detail" id={`tree-card-${card.id}`}>
          <p className="task-title">{card.title}</p>
          <ol className="tree-branch is-layer is-tasks">
            {card.steps.map(([short, full], index) => (
              <li key={short} className="task-row">
                <span className="task-code">
                  {code}.{index + 1}
                </span>
                <div>
                  <strong>{short}</strong>
                  <p>{full}</p>
                </div>
              </li>
            ))}
          </ol>
          {href && (
            <a
              className="task-link"
              href={href}
              target="_blank"
              rel="noreferrer"
            >
              Open {code} in Mission Tree <ArrowUpRight aria-hidden="true" />
            </a>
          )}
        </div>
      )}
    </li>
  );
}
