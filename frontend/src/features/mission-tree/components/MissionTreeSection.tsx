import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { FigureDialog } from '@/components/FigureDialog';
import { PageHero } from '@/components/PageHero';
import { TypewriterText } from '@/components/TypewriterText';
import { StationTrack } from '@/components/StationTrack';
import type { Course } from '@/types/course';
import {
  HANDOFF,
  LEARNING_FLOW,
  LEARNING_FLOW_TITLE,
  MISSION_TREE_INTRO,
  SCREENS,
  SCREENS_TITLE,
  STRUCTURE,
} from '../data';
import { missionTreeHref } from '../link';
import { StructureTree } from './StructureTree';
import '@/styles/intro-pages.css';
import './MissionTreeSection.css';

export function MissionTreeSection({ course }: { course: Course }) {
  // The screenshot opened large, if any.
  const [screen, setScreen] = useState<number | null>(null);
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
          <h3 id="tree-flow">
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

      <section className="intro-block" aria-labelledby="tree-screens">
        <div className="intro-block-head">
          <h3 id="tree-screens">
            <TypewriterText text={SCREENS_TITLE} when="view" />
          </h3>
        </div>
        <div className="tree-screens">
          {SCREENS.map(([src, title, text], index) => (
            <figure key={src}>
              {/* Opens the screenshots large, starting from this one. */}
              <button
                className="tree-screen-open"
                onClick={() => setScreen(index)}
                aria-haspopup="dialog"
                aria-label={`Enlarge: ${title}`}
              >
                <img src={src} alt={`Mission Tree: ${title}`} loading="lazy" />
              </button>
              <figcaption>
                <strong>{title}</strong>
                {text}
              </figcaption>
            </figure>
          ))}
        </div>
        {screen !== null && (
          <FigureDialog
            title="Mission Tree"
            figures={SCREENS.map(([src, title]) => ({
              label: title,
              src,
              alt: `Mission Tree: ${title}`,
            }))}
            start={screen}
            onClose={() => setScreen(null)}
          />
        )}
      </section>

      <section className="tree-handoff" aria-labelledby="tree-handoff">
        <div>
          <h3 id="tree-handoff">
            <TypewriterText text={HANDOFF.title} when="view" />
          </h3>
          {appHref && <p>{HANDOFF.body}</p>}
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
