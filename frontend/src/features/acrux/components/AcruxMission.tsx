import { MarkedTypewriter } from '@/components/MarkedTypewriter';
import { TypewriterText } from '@/components/TypewriterText';
import { ACRUX_INTRO } from '../data';
import './AcruxMission.css';

// Phrases of the lede under the green highlighter, in reading order.
const LEDE_MARKS = [
  'ACRUX-II',
  'Melbourne Space Program’s satellite capabilities',
  'to improve the reliability',
  'performance of small-scale space systems',
];

/**
 * The ACRUX-II mission on About, laid out like Purpose: the heading on the
 * left; on the right the objective and the lede as "LABEL :" rows, then the
 * rest of the introduction. The lede types only while `isActive`.
 */
export function AcruxMission({ isActive }: { isActive: boolean }) {
  const [lede, ...rest] = ACRUX_INTRO.paragraphs;
  const ledeSentences = lede.split(/(?<=\.)\s+/);
  return (
    <div className="ax-key acrux-mission">
      <div className="ax-key-sticky">
        <h3 className="ax-heading mark-green">
          {isActive && <TypewriterText text="ACRUX-II mission" when="view" />}
        </h3>
      </div>
      <div className="acrux-mission-body">
        <dl className="ax-key-list">
          <div>
            <dt>Objective :</dt>
            <dd>{ACRUX_INTRO.headline}</dd>
          </div>
          <div>
            <dt>What is ACRUX-II :</dt>
            <dd className="acrux-mission-lede">
              {/* One sentence per line, typed as one sequence. */}
              {isActive &&
                ledeSentences.map((sentence, index) => (
                  <span key={sentence} className="acrux-mission-line">
                    <MarkedTypewriter
                      text={sentence}
                      marks={LEDE_MARKS}
                      start={ledeSentences
                        .slice(0, index)
                        .reduce((sum, s) => sum + s.length, 0)}
                    />
                  </span>
                ))}
            </dd>
          </div>
        </dl>
        <div className="acrux-mission-prose">
          {rest.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
