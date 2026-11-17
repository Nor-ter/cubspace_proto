import { ArrowUpRight } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { TypewriterText } from '@/components/TypewriterText';
import { StationTrack } from '@/components/StationTrack';
import type { Course } from '@/types/course';
import {
  HANDOFF,
  LEARNING_FLOW,
  LEARNING_FLOW_TITLE,
  MISSION_TREE_INTRO,
  STRUCTURE,
  TREE_INTRO,
} from '../data';
import { missionTreeHref } from '../link';
import { StructureTree } from './StructureTree';
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
      <PageHero
        active={course.activePage === 'mission-tree'}
        title={MISSION_TREE_INTRO.headline}
      >
        <p>{MISSION_TREE_INTRO.lead}</p>
      </PageHero>

      {/* Names the app the paragraphs below describe, headed like the
          "CubeSat mission" block on ACRUX-II. */}
      <div className="intro-block-head">
        <h3 className="mark-green">
          <TypewriterText text="Mission Tree" when="view" />
        </h3>
      </div>

      <div className="tree-intro">
        <div className="intro-prose">
          {MISSION_TREE_INTRO.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <StructureTree />
      </div>

      <section className="intro-block" aria-labelledby="tree-flow">
        <div className="intro-block-head">
          <h3 id="tree-flow" className="mark-green">
            <TypewriterText text={LEARNING_FLOW_TITLE} when="view" />
          </h3>
        </div>
        {/* The levels above lead in, small and faint: Mission, Phase,
            Subsystem / team, then the three steps. */}
        <StationTrack
          stations={[
            ...STRUCTURE.slice(0, 3).map((title) => ({
              key: title,
              title,
              text: '',
              minor: true,
            })),
            ...LEARNING_FLOW.map(([title, text], index) => ({
              key: title,
              mark: String(index + 1),
              title,
              text,
            })),
          ]}
        />
      </section>

      <section className="intro-block" aria-labelledby="tree-explore">
        <div className="intro-block-head">
          <h3 id="tree-explore">
            <TypewriterText text={TREE_INTRO.title} when="view" />
          </h3>
          <p>{TREE_INTRO.body}</p>
        </div>
        <TaskTree />
        <p className="intro-source">{TREE_INTRO.note}</p>
      </section>

      <section className="tree-handoff" aria-labelledby="tree-handoff">
        <div>
          <h3 id="tree-handoff">
            <TypewriterText text={HANDOFF.title} when="view" />
          </h3>
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
