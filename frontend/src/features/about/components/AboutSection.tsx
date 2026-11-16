import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { TypewriterText } from '@/components/TypewriterText';
import type { Course } from '@/types/course';
import {
  JOURNEY,
  JOURNEY_TITLE,
  MSP_SOURCE_URL,
  MSP_STATEMENT,
  PROJECTS,
  PROJECTS_TITLE,
  SOURCE_NOTE,
  type Project,
} from '../data';
import { ProjectGallery } from './ProjectGallery';
import './AboutSection.css';

// About, laid out like a technology spec sheet: a full-bleed hero under a
// hairline grid, a statement over two photographs, a "LABEL :" purpose list,
// a ruled history table and a project grid. Headings type themselves on as
// they scroll into view.

// MSP's own vision and mission, quoted from melbournespace.com.au/who-we-are.
const PURPOSE = [
  { label: 'MSP vision', text: MSP_STATEMENT.vision },
  { label: 'MSP mission', text: MSP_STATEMENT.mission },
];

const photo = (id: string) =>
  PROJECTS.find((project) => project.id === id)?.images[0];

export function AboutSection({ course }: { course: Course }) {
  const isActive = course.activePage === 'about';
  const [gallery, setGallery] = useState<Project | null>(null);
  const hero = photo('acrux-2');
  const statementPhotos = [photo('humanoid'), photo('animatronics')];

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
          <p className="ax-label">About · Melbourne Space Program</p>
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

      {/* Statement over two photographs. */}
      <div className="ax-statement">
        <div className="ax-statement-photos">
          {statementPhotos.map(
            (image) =>
              image && <img key={image.src} src={image.src} alt={image.alt} />,
          )}
        </div>
        <p className="ax-statement-text">
          {isActive && <TypewriterText text={MSP_STATEMENT.body} when="view" />}
        </p>
      </div>

      {/* Purpose: sticky heading, "LABEL :" list. */}
      <div className="ax-key">
        <div className="ax-key-sticky">
          <h3 className="ax-heading mark-green">
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
            >
              <button
                className="ax-project-hit"
                onClick={() => setGallery(project)}
                aria-haspopup="dialog"
              >
                <img src={project.images[0].src} alt="" loading="lazy" />
                <span className="ax-label">
                  {project.isOurs ? 'Your project' : project.tagline}
                </span>
                <span className="ax-project-name">{project.name}</span>
              </button>
              <p>{project.summary}</p>
              {project.isOurs && (
                <div className="ax-project-foot">
                  <button onClick={() => course.go('acrux')}>
                    About ACRUX-II <ArrowRight aria-hidden="true" />
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>

      <p className="ax-source">
        {SOURCE_NOTE}{' '}
        <a href={MSP_SOURCE_URL} target="_blank" rel="noreferrer">
          melbournespace.com.au
        </a>
      </p>

      {gallery && (
        <ProjectGallery project={gallery} onClose={() => setGallery(null)} />
      )}
    </section>
  );
}
