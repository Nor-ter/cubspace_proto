import { RevealText } from '@/components/RevealText';
import { scrollToElement } from '@/lib/smoothScroll';
import type { Course } from '@/types/course';
import {
  CUBESAT_MISSION,
  KEY_TERMS,
  PARAGRAPHS,
  REFERENCES,
  SKILLS,
  TASKS,
} from '../data';
import { MissionFigure } from './MissionFigure';
import '@/styles/intro-pages.css';
import './CubesatSection.css';

const refId = (id: number) => `cubesat-ref-${id}`;

// Citations scroll to their reference without touching the URL hash, which
// the course uses for page routing.
function showReference(event: React.MouseEvent, id: number) {
  event.preventDefault();
  const target = document.getElementById(refId(id));
  if (target) scrollToElement(target, -160);
}

export function CubesatSection({ course }: { course: Course }) {
  return (
    <section
      id="cubesat"
      tabIndex={-1}
      className={`section cubesat-section page-view ${course.activePage === 'cubesat' ? 'active' : ''}`}
    >
      <div className="section-head intro-head">
        <div>
          <h2>
            <RevealText>{CUBESAT_MISSION.title}</RevealText>
          </h2>
          <p className="mission-objective">
            <strong>Objective.</strong> {CUBESAT_MISSION.objective}
          </p>
        </div>
      </div>

      <div className="cubesat-intro">
        <div className="intro-prose">
          {PARAGRAPHS.map((paragraph) => (
            <p key={paragraph.text}>
              {paragraph.text}{' '}
              <span className="cite">
                [
                {paragraph.cites.map((id, index) => (
                  <span key={id}>
                    {index > 0 && ', '}
                    <a
                      href={`#${refId(id)}`}
                      onClick={(event) => showReference(event, id)}
                    >
                      {id}
                    </a>
                  </span>
                ))}
                ]
              </span>
            </p>
          ))}
        </div>
        <aside className="key-terms" aria-labelledby="cubesat-terms">
          <h3 id="cubesat-terms">Key terms</h3>
          <dl>
            {KEY_TERMS.map(([term, meaning]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{meaning}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      <div className="intro-block">
        <MissionFigure onOpenTree={() => course.go('mission-tree')} />
      </div>

      <div className="intro-block cubesat-work">
        <section aria-labelledby="cubesat-tasks">
          <h3 id="cubesat-tasks">Tasks</h3>
          <ol className="cubesat-tasks">
            {TASKS.map((task) => (
              <li key={task}>{task}</li>
            ))}
          </ol>
        </section>
        <section aria-labelledby="cubesat-skills">
          <h3 id="cubesat-skills">Skills</h3>
          <ul className="cubesat-skills">
            {SKILLS.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="cubesat-references" aria-labelledby="cubesat-refs">
        <h3 id="cubesat-refs">References</h3>
        <ol>
          {REFERENCES.map((reference) => (
            <li key={reference.id} id={refId(reference.id)}>
              <span>[{reference.id}]</span>
              <a href={reference.url} target="_blank" rel="noreferrer">
                {reference.title}
              </a>
            </li>
          ))}
        </ol>
      </section>
    </section>
  );
}
