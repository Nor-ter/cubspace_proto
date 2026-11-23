import { TypewriterText } from '@/components/TypewriterText';
import { CUBESAT_MISSION } from '@/features/cubesat/data';
import { ACRUX_INTRO, ACRUX_TIMELINE } from '../data';
import './AcruxMission.css';

const HEADING = 'ACRUX-II mission';

/** Characters across `lines`, used to continue a typing sequence. */
const countChars = (lines: readonly string[]) =>
  lines.reduce((sum, line) => sum + line.length, 0);

/**
 * The ACRUX-II mission on About (.ax-key layout): the heading on the
 * left; on the right the objective and the lede as "LABEL :" rows; under
 * both, the rest of the introduction as a timeline. While `isActive`, the
 * heading, then the objective, then the lede type on as one sequence.
 */
export function AcruxMission({ isActive }: { isActive: boolean }) {
  const [lede] = ACRUX_INTRO.paragraphs;
  const ledeSentences = lede.split(/(?<=\.)\s+/);
  const objectiveLines = CUBESAT_MISSION.objective;
  // Where each part's typing starts, counted on from the parts before it.
  const objectiveStart = HEADING.length;
  const ledeStart = objectiveStart + countChars(objectiveLines);
  return (
    <div className="ax-key acrux-mission">
      <div className="ax-key-sticky">
        <h3 className="ax-heading mark-green">
          {isActive && <TypewriterText text={HEADING} when="view" />}
        </h3>
      </div>
      <div className="acrux-mission-body">
        <dl className="ax-key-list">
          <div>
            <dt>Objective :</dt>
            <dd>
              {/* The CubeSat objective, on its two lines, typed after the heading. */}
              {isActive &&
                objectiveLines.map((line, index) => (
                  <span key={line} className="ax-key-line">
                    <TypewriterText
                      text={line}
                      when="view"
                      start={
                        objectiveStart +
                        countChars(objectiveLines.slice(0, index))
                      }
                    />
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
                      start={
                        ledeStart + countChars(ledeSentences.slice(0, index))
                      }
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
