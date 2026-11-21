import { TypewriterText } from '@/components/TypewriterText';
import { CUBESAT_MISSION } from '@/features/cubesat/data';
import { ACRUX_INTRO, ACRUX_TIMELINE } from '../data';
import './AcruxMission.css';

/**
 * The ACRUX-II mission on About (.ax-key layout): the heading on the
 * left; on the right the objective and the lede as "LABEL :" rows; under
 * both, the rest of the introduction as a timeline. The lede types only
 * while `isActive`.
 */
export function AcruxMission({ isActive }: { isActive: boolean }) {
  const [lede] = ACRUX_INTRO.paragraphs;
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
            <dd>
              {/* The CubeSat objective, on its two lines. */}
              {CUBESAT_MISSION.objective.map((line) => (
                <span key={line} className="ax-key-line">
                  {line}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt>What is ACRUX-II :</dt>
            <dd className="acrux-mission-lede">
              {/* One sentence per line, typed as one sequence. */}
              {isActive &&
                ledeSentences.map((sentence, index) => (
                  <span key={sentence} className="acrux-mission-line">
                    <TypewriterText
                      text={sentence}
                      when="view"
                      start={ledeSentences
                        .slice(0, index)
                        .reduce((sum, s) => sum + s.length, 0)}
                    />
                  </span>
                ))}
            </dd>
          </div>
        </dl>
      </div>

      {/* The rest of the introduction as a line across the block: ACRUX-I
          behind, ACRUX-II now, and what it opens up ahead. */}
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
    </div>
  );
}
