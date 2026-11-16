import { TypewriterText } from '@/components/TypewriterText';
import { scrollToElement } from '@/lib/smoothScroll';
import {
  CUBESAT_MISSION,
  REFERENCES,
  SKILLS,
  STATS,
  TASKS,
  TOPICS,
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

/**
 * The CubeSat mission, shown inside the ACRUX-II page: objective, the format
 * in four numbers, the guide's sentences as labelled rows in two topics, the
 * mission figure, tasks and skills.
 */
export function CubesatMission({ onOpenTree }: { onOpenTree: () => void }) {
  return (
    <>
      <section
        className="intro-block cubesat-mission"
        aria-labelledby="cubesat-mission"
      >
        <div className="intro-block-head">
          <h3 id="cubesat-mission" className="mark-green">
            <TypewriterText text={CUBESAT_MISSION.title} when="view" />
          </h3>
          <p className="mission-objective">
            <strong>Objective.</strong> {CUBESAT_MISSION.objective}
          </p>
        </div>
        <dl className="cubesat-stats grip-frame">
          {STATS.map(([value, label]) => (
            <div key={value}>
              <dt>{value}</dt>
              <dd>{label}</dd>
            </div>
          ))}
        </dl>
        <div className="cubesat-topics">
          {TOPICS.map((topic) => (
            <section key={topic.title} aria-label={topic.title}>
              <h4>
                {topic.title}{' '}
                <span className="cite">
                  [
                  {topic.cites.map((id, index) => (
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
              </h4>
              <dl>
                {topic.points.map(([label, text]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{text}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </section>

      <div className="intro-block">
        <MissionFigure onOpenTree={onOpenTree} />
      </div>

      <div className="intro-block cubesat-work">
        <section aria-labelledby="cubesat-tasks">
          <h3 id="cubesat-tasks">
            <TypewriterText text="Tasks" when="view" />
          </h3>
          <ol className="cubesat-tasks">
            {TASKS.map((task) => (
              <li key={task}>{task}</li>
            ))}
          </ol>
        </section>
        <section aria-labelledby="cubesat-skills">
          <h3 id="cubesat-skills">
            <TypewriterText text="Skills" when="view" />
          </h3>
          <ul className="cubesat-skills">
            {SKILLS.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

/** References the CubeSat mission paragraphs cite, at the foot of ACRUX-II. */
export function CubesatReferences() {
  return (
    <section className="cubesat-references" aria-labelledby="cubesat-refs">
      <h3 id="cubesat-refs">
        <TypewriterText text="References" when="view" />
      </h3>
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
  );
}
