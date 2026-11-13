import { ArrowUpRight } from 'lucide-react';
import { RevealText } from '@/components/RevealText';
import { StationTrack } from '@/components/StationTrack';
import type { Course } from '@/types/course';
import {
  HANDOFF,
  LEARNING_FLOW,
  LEARNING_FLOW_TITLE,
  LIMITS,
  LIMITS_TITLE,
  MISSION_TREE_INTRO,
  STRUCTURE,
  TREE_INTRO,
} from '../data';
import { missionTreeHref } from '../link';
import { TaskTree } from './TaskTree';
import '@/styles/intro-pages.css';
import './MissionTreeSection.css';

export function MissionTreeSection({ course }: { course: Course }) {
  const appHref = missionTreeHref({ kind: 'tree' }, null);
  return (
    <section
      id="mission-tree"
      tabIndex={-1}
      className={`section mission-tree-section page-view ${course.activePage === 'mission-tree' ? 'active' : ''}`}
    >
      <div className="section-head intro-head">
        <div>
          <h2>
            <RevealText>{MISSION_TREE_INTRO.headline}</RevealText>
          </h2>
          <p>{MISSION_TREE_INTRO.lead}</p>
        </div>
      </div>

      <div className="tree-intro">
        <div className="intro-prose">
          {MISSION_TREE_INTRO.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {/* One path from the mission down to a task, drawn as the tree draws it. */}
        <ol
          className="structure-path"
          aria-label="How Mission Tree is organised"
        >
          {STRUCTURE.map(([level, example], index) => (
            <li key={level} style={{ '--depth': index } as React.CSSProperties}>
              <span>{level}</span>
              <strong>{example}</strong>
            </li>
          ))}
        </ol>
      </div>

      <section className="intro-block" aria-labelledby="tree-flow">
        <div className="intro-block-head">
          <h3 id="tree-flow">{LEARNING_FLOW_TITLE}</h3>
        </div>
        <StationTrack
          stations={LEARNING_FLOW.map(([title, text], index) => ({
            key: title,
            mark: String(index + 1),
            title,
            text,
          }))}
        />
      </section>

      <section className="intro-block" aria-labelledby="tree-explore">
        <div className="intro-block-head">
          <h3 id="tree-explore">{TREE_INTRO.title}</h3>
          <p>{TREE_INTRO.body}</p>
        </div>
        <TaskTree />
        <p className="intro-source">{TREE_INTRO.note}</p>
      </section>

      <section className="intro-block" aria-labelledby="tree-limits">
        <div className="intro-block-head">
          <h3 id="tree-limits">{LIMITS_TITLE}</h3>
        </div>
        <ul className="limit-list">
          {LIMITS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="tree-handoff" aria-labelledby="tree-handoff">
        <div>
          <h3 id="tree-handoff">{HANDOFF.title}</h3>
          <p>{appHref ? HANDOFF.body : HANDOFF.unavailable}</p>
        </div>
        {appHref ? (
          <a
            className="tree-handoff-link"
            href={appHref}
            target="_blank"
            rel="noreferrer"
          >
            Open Mission Tree <ArrowUpRight aria-hidden="true" />
          </a>
        ) : (
          <span className="tree-handoff-link is-disabled" aria-disabled="true">
            Open Mission Tree <ArrowUpRight aria-hidden="true" />
          </span>
        )}
      </section>
    </section>
  );
}
