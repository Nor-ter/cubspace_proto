import { TypewriterText } from '@/components/TypewriterText';
import { AcruxMission } from '@/features/acrux/components/AcruxMission';
import { MissionVideo } from '@/features/acrux/components/MissionVideo';
import { MissionFilm } from '@/features/home/components/MissionFilm';
import type { Course } from '@/types/course';
import {
  JOURNEY,
  JOURNEY_TITLE,
  MSP_STATEMENT,
  PROJECTS,
  PROJECTS_TITLE,
} from '../data';
import './AboutSection.css';

// About, laid out like a technology spec sheet: a full-bleed hero under a
// hairline grid, the ACRUX-II mission video, a "LABEL :" purpose list, a
// ruled history table, a project grid, the ACRUX-II mission and the mission
// film. Headings type themselves on as they scroll into view.

// MSP's own vision and mission, quoted from melbournespace.com.au/who-we-are.
const PURPOSE = [
  { label: 'MSP vision', text: MSP_STATEMENT.vision },
  { label: 'MSP mission', text: MSP_STATEMENT.mission },
];

// A project card leans towards the pointer: its position over the card, -1
// to 1 on each axis, goes to CSS, which turns it into a small 3D tilt.
function tilt(event: React.PointerEvent<HTMLElement>) {
  if (event.pointerType === 'touch') return;
  const card = event.currentTarget;
  const box = card.getBoundingClientRect();
  const x = ((event.clientX - box.left) / box.width) * 2 - 1;
  const y = ((event.clientY - box.top) / box.height) * 2 - 1;
  card.style.setProperty('--tilt-x', x.toFixed(3));
  card.style.setProperty('--tilt-y', y.toFixed(3));
}
function untilt(event: React.PointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty('--tilt-x', '0');
  event.currentTarget.style.setProperty('--tilt-y', '0');
}

const photo = (id: string) =>
  PROJECTS.find((project) => project.id === id)?.image;

export function AboutSection({ course }: { course: Course }) {
  const isActive = course.activePage === 'about';
  const hero = photo('acrux-2');

  return (
    <section
      id="about"
      tabIndex={-1}
      className={`about-x page-view ${isActive ? 'active' : ''}`}
    >
      {/* Hero: photograph under a hairline grid, headline bottom left. */}
      <header className="ax-hero">
        {hero && <img className="ax-hero-media" src={hero.src} alt="" />}
        <div className="ax-hero-grid" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="ax-hero-copy">
          <p className="ax-label">Melbourne Space Program</p>
          <h2 className="ax-hero-title">
            {isActive && (
              <TypewriterText text={MSP_STATEMENT.headline} when="view" />
            )}
          </h2>
        </div>
        <div className="ax-hero-loader" aria-hidden="true">
          <span />
        </div>
      </header>

      {/* The ACRUX-II mission video, centred. Remounting on leave stops
          a playing video. */}
      <div className="ax-statement">
        <MissionVideo key={isActive ? 'open' : 'closed'} />
      </div>

      {/* Who MSP is, laid out like Purpose: name left, "VERB :" list right.
          Set off from the video by a green rule with one station. */}
      <div className="ax-key ax-rule-station">
        <div className="ax-key-sticky">
          <h3 className="ax-heading mark-green">
            {isActive && (
              <TypewriterText text={MSP_STATEMENT.name} when="view" />
            )}
          </h3>
        </div>
        <dl className="ax-key-list">
          {MSP_STATEMENT.points.map((item) => (
            <div key={item.label}>
              <dt>{item.label} :</dt>
              <dd>{item.text}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Purpose: heading left, "LABEL :" list right. */}
      <div className="ax-key">
        <div className="ax-key-sticky">
          <h3 className="ax-heading">
            {isActive && <TypewriterText text="Purpose" when="view" />}
          </h3>
        </div>
        <dl className="ax-key-list">
          {PURPOSE.map((item) => (
            <div key={item.label}>
              <dt>{item.label} :</dt>
              <dd>{item.text}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* History: a ruled table, one row per chapter. */}
      <div className="ax-table">
        <h3 className="ax-heading">
          {isActive && <TypewriterText text={JOURNEY_TITLE} when="view" />}
        </h3>
        <ol className="ax-table-rows">
          {JOURNEY.map((entry) => (
            <li
              key={entry.year}
              className={entry.pending ? 'is-pending' : undefined}
            >
              <span className="ax-table-year">{entry.year}</span>
              <strong>{entry.title}</strong>
              <p>
                {entry.text}
                {entry.pending && <em>In progress</em>}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Projects: four columns, photograph, name and one line each. */}
      <div className="ax-projects">
        <h3 className="ax-heading">
          {isActive && <TypewriterText text={PROJECTS_TITLE} when="view" />}
        </h3>
        <div className="ax-project-grid">
          {PROJECTS.map((project) => (
            <article
              key={project.id}
              className={project.isOurs ? 'ax-project is-ours' : 'ax-project'}
              onPointerMove={tilt}
              onPointerLeave={untilt}
            >
              {/* Not a control: the card only leans towards the pointer. */}
              <div className="ax-project-hit">
                <span className="ax-project-media">
                  <img
                    src={project.image.src}
                    alt=""
                    loading="lazy"
                    style={{ objectPosition: project.image.focus }}
                  />
                </span>
                <span className="ax-label">
                  {project.isOurs ? 'Your project' : project.tagline}
                </span>
                <span className="ax-project-name">{project.name}</span>
              </div>
              <p>{project.summary}</p>
            </article>
          ))}
        </div>
      </div>

      {/* The ACRUX-II mission, under the projects. */}
      <AcruxMission isActive={isActive} />

      {/* The mission film under its heading: hover a step to see it, or
          watch it all. It exists only while About is open. */}
      <div className="ax-film">
        <div className="ax-film-head">
          <p className="ax-label">Each step unlocks the next</p>
          <h3 className="ax-heading">
            {isActive && (
              <TypewriterText
                text="ACRUX-II: from launch to first contact"
                when="view"
              />
            )}
          </h3>
        </div>
        {isActive && <MissionFilm />}
      </div>
    </section>
  );
}
