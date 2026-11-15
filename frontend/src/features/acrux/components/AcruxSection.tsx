import { PageHero } from '@/components/PageHero';
import { TypewriterText } from '@/components/TypewriterText';
import { StationTrack } from '@/components/StationTrack';
import { Status } from '@/components/Status';
import type { Course } from '@/types/course';
import {
  ACRUX_FACTS,
  ACRUX_INTRO,
  EXPERIMENTS,
  EXPERIMENTS_TITLE,
  OPERATIONS,
  OPERATIONS_TITLE,
  SUCCESS,
  SUCCESS_STEPS,
} from '../data';
import { MissionVideo } from './MissionVideo';
import '@/styles/intro-pages.css';
import './AcruxSection.css';

export function AcruxSection({ course }: { course: Course }) {
  const isActive = course.activePage === 'acrux';
  return (
    <section
      id="acrux"
      tabIndex={-1}
      className={`section acrux-section page-view ${isActive ? 'active' : ''}`}
    >
      <PageHero
        page="acrux"
        active={course.activePage === 'acrux'}
        title={ACRUX_INTRO.headline}
      />

      <div className="acrux-intro">
        <div className="intro-prose">
          {ACRUX_INTRO.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {/* Remounting on leave stops a playing video. */}
        <MissionVideo key={isActive ? 'open' : 'closed'} />
      </div>

      <dl className="fact-sheet">
        {ACRUX_FACTS.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <section className="intro-block" aria-labelledby="acrux-success">
        <div className="intro-block-head">
          <h3 id="acrux-success">
            <TypewriterText text={SUCCESS.title} when="view" />
          </h3>
          <p>{SUCCESS.body}</p>
        </div>
        <StationTrack
          stations={SUCCESS_STEPS.map(([title, text], index) => ({
            key: title,
            mark: String(index + 1),
            title,
            text,
          }))}
        />
      </section>

      <section className="intro-block" aria-labelledby="acrux-operations">
        <div className="intro-block-head">
          <h3 id="acrux-operations">
            <TypewriterText text={OPERATIONS_TITLE} when="view" />
          </h3>
        </div>
        <ol className="operation-rows">
          {OPERATIONS.map(([name, text]) => (
            <li key={name}>
              <h4>{name}</h4>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="intro-block" aria-labelledby="acrux-experiments">
        <div className="intro-block-head">
          <h3 id="acrux-experiments">
            <TypewriterText text={EXPERIMENTS_TITLE} when="view" />
          </h3>
        </div>
        <ul className="experiment-list">
          {EXPERIMENTS.map((experiment) => (
            <li key={experiment.name}>
              <h4>
                {experiment.name}
                {experiment.status && <Status>{experiment.status}</Status>}
              </h4>
              <p>{experiment.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
