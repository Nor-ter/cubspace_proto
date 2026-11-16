import { RevealText } from '@/components/RevealText';
import { StationTrack } from '@/components/StationTrack';
import { Status } from '@/components/Status';
import {
  CubesatMission,
  CubesatReferences,
} from '@/features/cubesat/components/CubesatMission';
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
      <div className="section-head intro-head">
        <div>
          <h2>
            <RevealText>ACRUX-II</RevealText>
          </h2>
        </div>
      </div>

      {/* What a CubeSat is comes first, then this mission. */}
      <CubesatMission onOpenTree={() => course.go('mission-tree')} />

      <section className="intro-block" aria-labelledby="acrux-intro">
        <div className="intro-block-head">
          <h3 id="acrux-intro">{ACRUX_INTRO.headline}</h3>
        </div>
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
      </section>

      <section className="intro-block" aria-labelledby="acrux-success">
        <div className="intro-block-head">
          <h3 id="acrux-success">{SUCCESS.title}</h3>
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
          <h3 id="acrux-operations">{OPERATIONS_TITLE}</h3>
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
          <h3 id="acrux-experiments">{EXPERIMENTS_TITLE}</h3>
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

      <CubesatReferences />
    </section>
  );
}
