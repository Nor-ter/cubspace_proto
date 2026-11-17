import { TypewriterText } from '@/components/TypewriterText';
import { CUBESAT_MISSION, STATS, TOPICS } from '../data';
import './CubesatMission.css';

/**
 * The CubeSat mission, shown inside the ACRUX-II page: objective, the format
 * in four numbers and the guide's sentences as labelled rows in two topics.
 */
export function CubesatMission() {
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
              <h4>{topic.title}</h4>
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
    </>
  );
}
