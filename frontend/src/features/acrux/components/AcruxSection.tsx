import { MarkedTypewriter } from '@/components/MarkedTypewriter';
import { PageHero } from '@/components/PageHero';
import { TypewriterText } from '@/components/TypewriterText';
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

// Phrases of the lede under the green highlighter, in reading order.
const LEDE_MARKS = [
  'ACRUX-II',
  'Melbourne Space Program’s satellite capabilities',
  'to improve the reliability',
  'performance of small-scale space systems',
];

export function AcruxSection({ course }: { course: Course }) {
  const isActive = course.activePage === 'acrux';
  const [lede, ...rest] = ACRUX_INTRO.paragraphs;
  const ledeSentences = lede.split(/(?<=\.)\s+/);
  return (
    <section
      id="acrux"
      tabIndex={-1}
      className={`section acrux-section page-view ${isActive ? 'active' : ''}`}
    >
      <PageHero active={course.activePage === 'acrux'} title="ACRUX-II" />

      {/* What a CubeSat is comes first, then this mission. */}
      <CubesatMission onOpenTree={() => course.go('mission-tree')} />

      {/* Second step, headed like "CubeSat mission" above it so the page
          reads as two parts: the CubeSat in general, then ACRUX-II. */}
      <section className="intro-block" aria-labelledby="acrux-mission">
        <div className="intro-block-head">
          <h3 id="acrux-mission" className="mark-green">
            <TypewriterText text="ACRUX-II mission" when="view" />
          </h3>
          <p className="mission-objective">
            <strong>Objective.</strong> {ACRUX_INTRO.headline}
          </p>
        </div>

        {/* Lede: a small label beside one large statement. */}
        <div className="acrux-lede">
          <p className="acrux-lede-label">What is ACRUX-II</p>
          <p className="acrux-lede-text">
            {/* One sentence per line, typed as one sequence. */}
            {isActive &&
              ledeSentences.map((sentence, index) => (
                <span key={sentence} className="acrux-lede-line">
                  <MarkedTypewriter
                    text={sentence}
                    marks={LEDE_MARKS}
                    start={ledeSentences
                      .slice(0, index)
                      .reduce((sum, s) => sum + s.length, 0)}
                  />
                </span>
              ))}
          </p>
        </div>

        <div className="acrux-intro">
          <div className="intro-prose">
            {rest.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {/* Remounting on leave stops a playing video. */}
          <MissionVideo key={isActive ? 'open' : 'closed'} />
        </div>

        <dl className="fact-sheet grip-frame">
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

      <CubesatReferences />
    </section>
  );
}
