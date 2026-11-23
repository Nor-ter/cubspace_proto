import { useEffect, useState, type CSSProperties } from 'react';
import {
  ArrowUpRight,
  Pause,
  Play,
  RotateCcw,
  Search,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { PHASES, TEAMS } from '../data';
import { missionTreeHref } from '../link';
import { MISSION_CARDS } from '../missionCards';
import './TaskTree.css';
import './PlayTree.css';

type Selection = {
  kind: 'mission' | 'phase' | 'team' | 'manual' | 'workshop' | 'task';
  id?: string;
};
type Point = { x: number; y: number };
const ROOT: Point = { x: 550, y: 672 };
const spread = (index: number, count: number, left = 95, right = 1005) =>
  count === 1 ? 550 : left + ((right - left) * index) / (count - 1);
const curve = (from: Point, to: Point) =>
  `M${from.x},${from.y} C${from.x},${(from.y + to.y) / 2} ${to.x},${(from.y + to.y) / 2} ${to.x},${to.y}`;

function Node({
  x,
  y,
  title,
  label,
  selected,
  onClick,
  colour,
  delay = 0,
  count,
}: Point & {
  title: string;
  label: string;
  selected: boolean;
  onClick: () => void;
  colour?: string;
  delay?: number;
  count?: number;
}) {
  return (
    <foreignObject
      x={x - 66}
      y={y - 11}
      width="132"
      height="88"
      className="play-node"
      style={
        {
          '--node-colour': colour ?? 'var(--text)',
          animationDelay: `${delay}ms`,
        } as CSSProperties
      }
    >
      <button
        type="button"
        title={title}
        aria-label={title}
        aria-pressed={selected}
        onClick={onClick}
      >
        <span className="play-node-dot" aria-hidden="true" />
        <strong>{label}</strong>
        {count !== undefined && (
          <small>
            {count} {count === 1 ? 'task' : 'tasks'}
          </small>
        )}
      </button>
    </foreignObject>
  );
}

export function TaskTree() {
  const [phase, setPhase] = useState('Pre-A');
  const [team, setTeam] = useState('SYS');
  const [filter, setFilter] = useState('ALL');
  const [query, setQuery] = useState('');
  const [growth, setGrowth] = useState(4);
  const [playing, setPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [selection, setSelection] = useState<Selection>({ kind: 'mission' });
  const search = query.trim().toLowerCase();
  const cards = MISSION_CARDS.filter(
    (card) =>
      (filter === 'ALL' || card.sub === filter) &&
      (!search ||
        `${card.id} ${card.short} ${card.title} ${card.steps.flat().join(' ')}`
          .toLowerCase()
          .includes(search)),
  );
  const phases = PHASES.filter(([id]) =>
    cards.some((card) => card.phase === id),
  );
  const activePhase = phases.some(([id]) => id === phase)
    ? phase
    : phases[0]?.[0];
  const phaseCards = cards.filter((card) => card.phase === activePhase);
  const teams = TEAMS.filter(([id]) =>
    phaseCards.some((card) => card.sub === id),
  );
  const activeTeam = teams.some(([id]) => id === team) ? team : teams[0]?.[0];
  const teamCards = phaseCards.filter((card) => card.sub === activeTeam);
  const phaseTitle = PHASES.find(([id]) => id === activePhase)?.[1];
  const teamTitle = TEAMS.find(([id]) => id === activeTeam)?.[1];
  const selectedCard = teamCards.find((card) => card.id === selection.id);
  const colour = `var(--team-${activeTeam?.toLowerCase() ?? 'sys'})`;
  const phaseNodes = phases.map(([id], i) => ({
    id,
    x: spread(i, phases.length),
    y: 550,
  }));
  const teamNodes = teams.map(([id], i) => ({
    id,
    x: spread(i, teams.length, 130, 970),
    y:
      355 +
      30 * ((i - (teams.length - 1) / 2) / Math.max(1, teams.length / 2)) ** 2,
  }));
  const phasePoint = phaseNodes.find((node) => node.id === activePhase) ?? ROOT;
  const teamPoint = teamNodes.find((node) => node.id === activeTeam) ?? ROOT;
  const manual = { x: 440, y: 225 };
  const workshop = { x: 660, y: 225 };
  const taskNodes = teamCards.map((card, i) => ({
    card,
    x: spread(i, teamCards.length, 150, 950),
    y:
      90 +
      25 *
        ((i - (teamCards.length - 1) / 2) /
          Math.max(1, teamCards.length / 2)) **
          2,
  }));
  const shownGrowth = search || filter !== 'ALL' ? 4 : growth;
  const isGrowing = playing && growth < 4;
  useEffect(() => {
    if (!playing || growth >= 4) return;
    const timer = setTimeout(
      () => setGrowth((level) => Math.min(4, level + 1)),
      850,
    );
    return () => clearTimeout(timer);
  }, [playing, growth]);
  function reset() {
    setGrowth(4);
    setPlaying(false);
    setPhase('Pre-A');
    setTeam('SYS');
    setFilter('ALL');
    setQuery('');
    setSelection({ kind: 'mission' });
    setZoom(1);
  }
  function choosePhase(id: string) {
    setPhase(id);
    setGrowth(2);
    setPlaying(false);
    setSelection({ kind: 'phase', id });
  }
  function chooseTeam(id: string) {
    setTeam(id);
    setGrowth(3);
    setPlaying(false);
    setSelection({ kind: 'team', id });
  }
  const appHref =
    selectedCard && selection.kind === 'task'
      ? missionTreeHref(
          {
            kind: 'card',
            phase: selectedCard.phase,
            card: selectedCard.id,
            tab: 'tasks',
          },
          selectedCard.sub,
        )
      : missionTreeHref({ kind: 'tree' }, activeTeam ?? null);
  const panelTitle =
    selection.kind === 'task' && selectedCard
      ? selectedCard.title
      : selection.kind === 'phase'
        ? `Phase ${activePhase}: ${phaseTitle}`
        : selection.kind === 'team'
          ? `${activeTeam}: ${teamTitle}`
          : selection.kind === 'manual'
            ? `Manual · ${activeTeam} · Phase ${activePhase}`
            : selection.kind === 'workshop'
              ? `Workshop · ${activeTeam} · Phase ${activePhase}`
              : 'ACRUX-II mission';
  return (
    <div className="task-tree play-tree">
      <div className="tree-tools">
        <label className="tree-search">
          <Search aria-hidden="true" />
          <span className="sr-only">Search Tasks</span>
          <input
            type="search"
            placeholder="Search tasks, tools or IDs"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelection({ kind: 'mission' });
            }}
          />
        </label>
        <div className="tree-tool-group">
          <button
            className="tree-tool"
            onClick={() => {
              if (isGrowing) setPlaying(false);
              else {
                setQuery('');
                setFilter('ALL');
                setGrowth(0);
                setPlaying(true);
              }
            }}
          >
            {isGrowing ? <Pause /> : <Play />}
            {isGrowing ? 'Pause growth' : 'Grow tree'}
          </button>
          <button className="tree-tool" onClick={reset}>
            <RotateCcw />
            Reset
          </button>
        </div>
      </div>
      <fieldset className="tree-teams-filter">
        <legend className="sr-only">Team</legend>
        <button
          aria-pressed={filter === 'ALL'}
          onClick={() => setFilter('ALL')}
        >
          All teams
        </button>
        {TEAMS.map(([code, name]) => (
          <button
            key={code}
            title={name}
            aria-pressed={filter === code}
            style={
              {
                '--layer': `var(--team-${code.toLowerCase()})`,
              } as CSSProperties
            }
            onClick={() => {
              setFilter(code);
              setTeam(code);
              setSelection({ kind: 'team', id: code });
            }}
          >
            <i className="team-dot" aria-hidden="true" />
            {code}
          </button>
        ))}
      </fieldset>
      <div className="play-tree-status">
        <p aria-live="polite">
          {cards.length} of {MISSION_CARDS.length} tasks ·{' '}
          {activePhase ? `Phase ${activePhase}` : 'No matches'}
          {shownGrowth >= 3 && activeTeam ? ` · ${activeTeam}` : ''}
        </p>
        <div>
          <button
            aria-label="Zoom out tree"
            onClick={() => setZoom((value) => Math.max(0.75, value - 0.15))}
          >
            <ZoomOut />
          </button>
          <button aria-label="Reset tree zoom" onClick={() => setZoom(1)}>
            {Math.round(zoom * 100)}%
          </button>
          <button
            aria-label="Zoom in tree"
            onClick={() => setZoom((value) => Math.min(1.75, value + 0.15))}
          >
            <ZoomIn />
          </button>
        </div>
      </div>
      <p className="play-tree-hint">
        Choose a Phase from left to right. Grow a team branch, open its Manual
        and Workshop, then explore the task leaves.
      </p>
      {cards.length === 0 ? (
        <p className="tree-empty">
          No tasks match. Try another search or choose All teams.
        </p>
      ) : (
        <section
          className="play-tree-viewport"
          aria-label="Interactive mission tree. Scroll horizontally to explore the Phases."
        >
          <svg
            className="play-tree-diagram"
            viewBox="0 0 1100 760"
            style={{ width: `${1100 * zoom}px`, height: `${760 * zoom}px` }}
            aria-label="ACRUX-II mission growing from its root through horizontal Phases to teams, learning and tasks"
          >
            <ellipse
              className="play-crown"
              cx="550"
              cy="295"
              rx="490"
              ry="285"
            />
            <g className="play-roots" aria-hidden="true">
              {[-105, -50, 50, 105].map((x) => (
                <path
                  key={x}
                  d={`M550 672 C550 708 ${550 + x * 0.4} 725 ${550 + x} ${Math.abs(x) > 80 ? 728 : 745}`}
                />
              ))}
            </g>
            <text className="play-level-label" x="26" y="671">
              MISSION
            </text>
            {shownGrowth >= 1 && (
              <g key="phases">
                <text className="play-level-label" x="26" y="505">
                  PHASES
                </text>
                {phaseNodes.map((node, i) => (
                  <path
                    key={node.id}
                    className={`play-branch ${node.id === activePhase ? 'is-active' : ''}`}
                    pathLength="1"
                    d={curve(ROOT, node)}
                    style={{ animationDelay: `${i * 55}ms`, strokeWidth: 4 }}
                  />
                ))}
              </g>
            )}
            {shownGrowth >= 2 && (
              <g key={`teams-${activePhase}`}>
                <text className="play-level-label" x="26" y="315">
                  SUBSYSTEM / TEAM
                </text>
                {teamNodes.map((node, i) => (
                  <path
                    key={node.id}
                    className={`play-branch ${node.id === activeTeam ? 'is-active' : ''}`}
                    pathLength="1"
                    d={curve(phasePoint, node)}
                    style={{ animationDelay: `${i * 55}ms`, strokeWidth: 2.5 }}
                  />
                ))}
              </g>
            )}
            {shownGrowth >= 3 && (
              <g
                key={`learning-${activePhase}-${activeTeam}`}
                style={{ '--branch-colour': colour } as CSSProperties}
              >
                <text className="play-level-label" x="26" y="220">
                  MANUAL / WORKSHOP
                </text>
                <path
                  className="play-branch is-active"
                  pathLength="1"
                  d={curve(teamPoint, manual)}
                />
                <path
                  className="play-branch is-active"
                  pathLength="1"
                  d={`M440 225 Q550 260 660 225`}
                />
              </g>
            )}
            {shownGrowth >= 4 && (
              <g
                key={`tasks-${activePhase}-${activeTeam}`}
                style={{ '--branch-colour': colour } as CSSProperties}
              >
                <text className="play-level-label" x="26" y="38">
                  TASKS
                </text>
                {taskNodes.map((node, i) => (
                  <path
                    key={node.card.id}
                    className="play-branch is-active"
                    pathLength="1"
                    d={curve(workshop, node)}
                    style={{ animationDelay: `${i * 70}ms`, strokeWidth: 1.5 }}
                  />
                ))}
              </g>
            )}
            <Node
              {...ROOT}
              title="ACRUX-II mission: grow Phase branches"
              label="ACRUX-II"
              selected={selection.kind === 'mission'}
              onClick={() => {
                setGrowth(1);
                setSelection({ kind: 'mission' });
                setPlaying(false);
              }}
            />
            {shownGrowth >= 1 &&
              phaseNodes.map((node, i) => (
                <Node
                  key={node.id}
                  {...node}
                  title={`Phase ${node.id}: ${PHASES.find(([id]) => id === node.id)?.[1]}`}
                  label={node.id === 'Pre-A' ? 'Pre-A' : `Phase ${node.id}`}
                  selected={node.id === activePhase}
                  count={cards.filter((card) => card.phase === node.id).length}
                  delay={i * 55}
                  onClick={() => choosePhase(node.id)}
                />
              ))}
            {shownGrowth >= 2 &&
              teamNodes.map((node, i) => (
                <Node
                  key={`${activePhase}-${node.id}`}
                  {...node}
                  title={`${node.id}: ${TEAMS.find(([id]) => id === node.id)?.[1]}`}
                  label={node.id}
                  selected={node.id === activeTeam}
                  colour={`var(--team-${node.id.toLowerCase()})`}
                  count={
                    phaseCards.filter((card) => card.sub === node.id).length
                  }
                  delay={i * 55}
                  onClick={() => chooseTeam(node.id)}
                />
              ))}
            {shownGrowth >= 3 && (
              <>
                <Node
                  {...manual}
                  title="Open Manual guidance"
                  label="Manual"
                  colour={colour}
                  selected={selection.kind === 'manual'}
                  onClick={() => setSelection({ kind: 'manual' })}
                />
                <Node
                  {...workshop}
                  title="Open Workshop guidance and grow task leaves"
                  label="Workshop"
                  colour={colour}
                  selected={selection.kind === 'workshop'}
                  onClick={() => {
                    setSelection({ kind: 'workshop' });
                    setGrowth(4);
                  }}
                />
              </>
            )}
            {shownGrowth >= 4 &&
              taskNodes.map((node, i) => (
                <Node
                  key={node.card.id}
                  {...node}
                  title={`${node.card.id}: ${node.card.title}`}
                  label={node.card.id.split('-').pop() ?? node.card.id}
                  colour={colour}
                  selected={
                    selection.kind === 'task' && selection.id === node.card.id
                  }
                  delay={i * 70}
                  onClick={() => {
                    setSelection({ kind: 'task', id: node.card.id });
                    setPlaying(false);
                  }}
                />
              ))}
          </svg>
        </section>
      )}
      <section
        className="play-tree-detail"
        aria-labelledby="play-tree-detail-title"
        style={{ '--branch-colour': colour } as CSSProperties}
      >
        <p className="play-tree-eyebrow">
          {selection.kind === 'task' && selectedCard
            ? selectedCard.id
            : 'Selected branch'}
        </p>
        <h4 id="play-tree-detail-title">{panelTitle}</h4>
        {selection.kind === 'task' && selectedCard ? (
          <ol>
            {selectedCard.steps.map(([short, full]) => (
              <li key={short}>
                <strong>{short}</strong>
                <p>{full}</p>
              </li>
            ))}
          </ol>
        ) : selection.kind === 'manual' ? (
          <p>
            Read the technical manual attached to {activeTeam} and Phase{' '}
            {activePhase}. Manuals continue in the Mission Tree app.
          </p>
        ) : selection.kind === 'workshop' ? (
          <p>
            Solve the browser workshop, then select a task leaf above to inspect
            the project work. Your lead assigns the real project task.
          </p>
        ) : selection.kind === 'team' ? (
          <p>
            {teamCards.length} task cards are available for {teamTitle} in Phase{' '}
            {activePhase}. Choose Manual or Workshop to grow the next part of
            this branch.
          </p>
        ) : selection.kind === 'phase' ? (
          <p>
            {phaseCards.length} task cards across {teams.length} teams. Select a
            team node to continue growing the tree.
          </p>
        ) : (
          <p>
            One mission, {PHASES.length} Phases and {MISSION_CARDS.length} task
            cards. Click a Phase or press Grow tree to see the branches unfold.
            This is an interactive example; learning materials and project work
            continue in Mission Tree.
          </p>
        )}
        {appHref && (
          <a
            className="task-link"
            href={appHref}
            target="_blank"
            rel="noreferrer"
          >
            Continue in Mission Tree <ArrowUpRight aria-hidden="true" />
          </a>
        )}
      </section>
      {search && cards.length > 0 && (
        <div className="play-search-results">
          <h4>Matching tasks</h4>
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => {
                setPhase(card.phase);
                setTeam(card.sub);
                setGrowth(4);
                setSelection({ kind: 'task', id: card.id });
              }}
            >
              {card.id} · {card.short}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
