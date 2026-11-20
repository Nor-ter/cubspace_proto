import { MarkedTypewriter } from '@/components/MarkedTypewriter';
import { StationTrack } from '@/components/StationTrack';
import { TypewriterText } from '@/components/TypewriterText';
import { ACRUX_INTRO, ACRUX_TIMELINE, SUCCESS, SUCCESS_STEPS } from '../data';
import '@/styles/intro-pages.css';
import './AcruxSection.css';

// Phrases of the lede under the green highlighter, in reading order.
const LEDE_MARKS = [
  'ACRUX-II',
  'Melbourne Space Program’s satellite capabilities',
  'to improve the reliability',
  'performance of small-scale space systems',
];

/**
 * The ACRUX-II mission: objective, the lede typed under the highlighter,
 * the rest of the introduction as a timeline and the success steps. Shown on About, under
 * the project cards. The lede types only while `isActive`.
 */
export function AcruxMission({ isActive }: { isActive: boolean }) {
  const [lede] = ACRUX_INTRO.paragraphs;
  const ledeSentences = lede.split(/(?<=\.)\s+/);
  return (
    <div className="acrux-mission">
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

        {/* The rest of the introduction as a line: ACRUX-I behind, ACRUX-II
            now, and what it opens up ahead. */}
        <ol className="acrux-timeline" aria-label="From ACRUX-I to you">
          {ACRUX_TIMELINE.map((stop) => (
            <li key={stop.name} className={`is-${stop.state}`}>
              <span className="acrux-timeline-when">{stop.when}</span>
              <span className="acrux-timeline-dot" aria-hidden="true" />
              <strong className="acrux-timeline-name">{stop.name}</strong>
              <p>{stop.text}</p>
            </li>
          ))}
        </ol>
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
    </div>
  );
}
