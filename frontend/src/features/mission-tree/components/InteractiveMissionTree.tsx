import { useState } from 'react';
import {
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  GitBranch,
  Search,
} from 'lucide-react';
import { PHASES, TEAMS } from '../data';
import { MISSION_CARDS } from '../missionCards';
import { missionTreeHref } from '../link';

export function InteractiveMissionTree() {
  const [team, setTeam] = useState('all');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(() => new Set(['A', 'A/ADCS']));
  const search = query.trim().toLowerCase();
  const cards = MISSION_CARDS.filter(
    (card) =>
      (team === 'all' || card.sub === team) &&
      (!search ||
        `${card.id} ${card.title} ${card.steps.flat().join(' ')}`
          .toLowerCase()
          .includes(search)),
  );

  function toggle(key: string) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }
  function expandAll() {
    setExpanded(
      new Set(
        PHASES.flatMap(([phase]) => [
          phase,
          ...TEAMS.map(([code]) => `${phase}/${code}`),
        ]),
      ),
    );
  }

  return (
    <section className="block" aria-labelledby="interactive-tree-title">
      <div className="block-head">
        <p className="eyebrow">EXPLORE THE MISSION</p>
        <h2 id="interactive-tree-title">One mission. Your path through it.</h2>
        <p>
          Open a Phase, choose a team and explore its Task Cards. These are the
          80 cards from the Mission Tree prototype.
        </p>
      </div>
      <div className="live-tree">
        <div className="tree-toolbar">
          <label className="tree-search">
            <Search />
            <span className="visually-hidden">Search Task Cards</span>
            <input
              value={query}
              placeholder="Search tasks, tools or card IDs"
              onChange={(event) => {
                setQuery(event.target.value);
                expandAll();
              }}
            />
          </label>
          <label className="tree-filter">
            Team
            <select
              value={team}
              onChange={(event) => {
                setTeam(event.target.value);
                expandAll();
              }}
            >
              <option value="all">All teams</option>
              {TEAMS.map(([code, name]) => (
                <option key={code} value={code}>
                  {code} · {name}
                </option>
              ))}
            </select>
          </label>
          <button className="button" onClick={expandAll}>
            Expand all
          </button>
          <button className="button" onClick={() => setExpanded(new Set())}>
            Collapse all
          </button>
        </div>
        <div className="tree-root">
          <GitBranch />
          <div>
            <strong>ACRUX-II</strong>
            <span>Mission → Phase → Team → Task Card → Tasks</span>
          </div>
        </div>
        <p className="tree-result" aria-live="polite">
          {cards.length} of {MISSION_CARDS.length} Task Cards
        </p>
        <ol className="vertical-tree">
          {PHASES.map(([phase, title]) => {
            const phaseCards = cards.filter((card) => card.phase === phase);
            if (!phaseCards.length) return null;
            const open = expanded.has(phase);
            return (
              <li key={phase} className="tree-phase">
                <button
                  className="tree-phase-toggle"
                  aria-expanded={open}
                  aria-controls={`phase-${phase}`}
                  onClick={() => toggle(phase)}
                >
                  {open ? <ChevronDown /> : <ChevronRight />}
                  <span className="tree-phase-code">{phase}</span>
                  <strong>{title}</strong>
                  <small>{phaseCards.length} cards</small>
                </button>
                <div id={`phase-${phase}`} hidden={!open}>
                  <ol className="tree-teams">
                    {TEAMS.map(([code, name]) => {
                      const teamCards = phaseCards.filter(
                        (card) => card.sub === code,
                      );
                      if (!teamCards.length) return null;
                      const key = `${phase}/${code}`;
                      const teamOpen = expanded.has(key);
                      return (
                        <li key={code}>
                          <button
                            className="tree-team-toggle"
                            aria-expanded={teamOpen}
                            aria-controls={`team-${phase}-${code}`}
                            onClick={() => toggle(key)}
                          >
                            {teamOpen ? <ChevronDown /> : <ChevronRight />}
                            <strong>{code}</strong>
                            <span>{name}</span>
                            <small>{teamCards.length}</small>
                          </button>
                          <ol
                            className="tree-cards"
                            id={`team-${phase}-${code}`}
                            hidden={!teamOpen}
                          >
                            {teamCards.map((card) => {
                              const href = missionTreeHref(
                                {
                                  kind: 'card',
                                  phase,
                                  card: card.id,
                                  tab: 'tasks',
                                },
                                code,
                              );
                              return (
                                <li key={card.id}>
                                  <details className="tree-card">
                                    <summary>
                                      <span>{card.id}</span>
                                      <strong>{card.short}</strong>
                                      <ChevronDown />
                                    </summary>
                                    <div className="tree-card-detail">
                                      <h3>{card.title}</h3>
                                      <ol>
                                        {card.steps.map(
                                          ([short, full], index) => (
                                            <li key={short}>
                                              <span>{index + 1}</span>
                                              <div>
                                                <strong>{short}</strong>
                                                <p>{full}</p>
                                              </div>
                                            </li>
                                          ),
                                        )}
                                      </ol>
                                      {href && (
                                        <a className="text-link" href={href}>
                                          Open this card in Mission Tree{' '}
                                          <ArrowUpRight />
                                        </a>
                                      )}
                                    </div>
                                  </details>
                                </li>
                              );
                            })}
                          </ol>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </li>
            );
          })}
        </ol>
        {cards.length === 0 && (
          <p className="tree-empty">
            No matching cards. Try another search or choose All teams.
          </p>
        )}
        <p className="source-note">
          Explore the project structure here. Manuals, executable workshops and
          project work continue in the separate Mission Tree app.
        </p>
      </div>
    </section>
  );
}
