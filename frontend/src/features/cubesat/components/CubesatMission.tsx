import { STATS, TOPICS } from '../data';
import './CubesatMission.css';

/**
 * The CubeSat page body, under its hero: the format in four numbers and the guide's sentences as labelled rows in two topics.
 */
export function CubesatMission() {
  return (
    <>
      <section className="intro-block cubesat-mission" aria-label="CubeSat">
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
