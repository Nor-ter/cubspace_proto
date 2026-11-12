import { useState } from 'react';
import { ArrowUpRight, Check, Circle } from 'lucide-react';
import type { Course } from '@/types/course';
import { DESTINATIONS, TEAMS } from '../data';
import { isMissionTreeConfigured, missionTreeHref } from '../link';

const SUBSYSTEM_QUIZZES = ['theory-structure', 'theory-eps', 'theory-adcs'];

export function LaunchSection({ course }: { course: Course }) {
  const { progress } = course;
  const [destinationId, setDestinationId] = useState(DESTINATIONS[0].id);
  const destination =
    DESTINATIONS.find((item) => item.id === destinationId) ?? DESTINATIONS[0];
  const href = missionTreeHref(
    destination.target(progress.team),
    progress.team,
  );
  const subsystemsPassed = SUBSYSTEM_QUIZZES.filter((id) =>
    progress.quizzesPassed.includes(id),
  ).length;
  const checklist: readonly (readonly [boolean, string])[] = [
    [progress.filmWatched, 'Watched the mission film'],
    [
      progress.quizzesPassed.includes('theory-mission'),
      'Passed the mission check',
    ],
    [
      subsystemsPassed === SUBSYSTEM_QUIZZES.length,
      `Passed the BOX, EPS and ADCS quizzes (${subsystemsPassed}/${SUBSYSTEM_QUIZZES.length})`,
    ],
  ];

  return (
    <section id="launch" className="page">
      <header className="page-hero">
        <p className="eyebrow">06 / LAUNCH · LINK TO MISSION TREE</p>
        <h1>Take your seat in Mission Tree.</h1>
        <p className="lead">
          Choose your team and where you want to land. Onboarding ends here.
        </p>
      </header>

      <div className="launch">
        <div className="launch-steps">
          <section className="launch-step" aria-labelledby="team-title">
            <h2 id="team-title">
              <span>1</span> Your team
            </h2>
            <div
              className="choice-grid"
              role="radiogroup"
              aria-labelledby="team-title"
            >
              {TEAMS.map(([code, name]) => (
                <label
                  key={code}
                  className={
                    progress.team === code ? 'choice active' : 'choice'
                  }
                >
                  <input
                    type="radio"
                    name="team"
                    value={code}
                    checked={progress.team === code}
                    onChange={() => course.setTeam(code)}
                  />
                  <strong>{code}</strong>
                  {name}
                </label>
              ))}
            </div>
            <p className="source-note">
              Not assigned yet? Skip this and open the whole tree.
            </p>
          </section>

          <section className="launch-step" aria-labelledby="destination-title">
            <h2 id="destination-title">
              <span>2</span> Where to land
            </h2>
            <div
              className="choice-list"
              role="radiogroup"
              aria-labelledby="destination-title"
            >
              {DESTINATIONS.map((item) => (
                <label
                  key={item.id}
                  className={
                    item.id === destination.id ? 'choice active' : 'choice'
                  }
                >
                  <input
                    type="radio"
                    name="destination"
                    value={item.id}
                    checked={item.id === destination.id}
                    onChange={() => setDestinationId(item.id)}
                  />
                  <strong>{item.title}</strong>
                  {item.needsTeam && !progress.team
                    ? 'Choose a team first, or this opens the whole tree.'
                    : item.text}
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="launch-card">
          <p className="eyebrow">READY CHECK</p>
          <ul className="checklist">
            {checklist.map(([done, label]) => (
              <li key={label} className={done ? 'is-done' : ''}>
                {done ? <Check /> : <Circle />}
                {label}
              </li>
            ))}
          </ul>
          <p className="source-note">
            A guide, not a gate. You can open Mission Tree at any time.
          </p>
          {href ? (
            <a className="button button-primary button-large" href={href}>
              Open Mission Tree <ArrowUpRight />
            </a>
          ) : (
            <span
              className="button button-large is-disabled"
              aria-disabled="true"
            >
              Open Mission Tree <ArrowUpRight />
            </span>
          )}
          {isMissionTreeConfigured ? (
            <p className="launch-url">{href}</p>
          ) : (
            <output className="launch-warning">
              Mission Tree is not connected to this build yet. Ask your team
              lead for the link.
            </output>
          )}
          <p className="source-note">
            On your first visit Mission Tree asks you to pick Admin or Junior.
            Pick Junior: it is a demo choice, not an account. That first choice
            opens the top of the tree; after it, this button lands where you
            chose.
          </p>
        </aside>
      </div>
    </section>
  );
}
