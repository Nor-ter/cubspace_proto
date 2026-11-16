import { RevealText } from '@/components/RevealText';
import { StationTrack } from '@/components/StationTrack';
import type { Course } from '@/types/course';
import {
  JOURNEY,
  JOURNEY_TITLE,
  MSP_STATEMENT,
  PROJECTS,
  PROJECTS_TITLE,
} from '../data';
import { PurposePair } from './PurposePair';
import '@/styles/intro-pages.css';
import './AboutSection.css';

export function AboutSection({ course }: { course: Course }) {
  const { activePage } = course;
  return (
    <section
      id="about"
      tabIndex={-1}
      className={`section about-section page-view ${activePage === 'about' ? 'active' : ''}`}
    >
      <div className="section-head intro-head">
        <div>
          <h2>
            <RevealText>{MSP_STATEMENT.headline}</RevealText>
          </h2>
          <p>{MSP_STATEMENT.body}</p>
        </div>
      </div>
      <PurposePair owner="MSP" purpose={MSP_STATEMENT} />

      <section className="intro-block" aria-labelledby="about-journey">
        <div className="intro-block-head">
          <h3 id="about-journey">{JOURNEY_TITLE}</h3>
        </div>
        <StationTrack
          stations={JOURNEY.map((entry) => ({
            key: entry.year,
            label: entry.year,
            title: entry.title,
            text: entry.text,
            pending: entry.pending,
          }))}
        />
      </section>

      <section className="intro-block" aria-labelledby="about-projects">
        <div className="intro-block-head">
          <h3 id="about-projects">{PROJECTS_TITLE}</h3>
        </div>
        <div className="project-grid">
          {PROJECTS.map((project) => (
            <article
              key={project.id}
              className={
                project.isOurs ? 'project-card is-ours' : 'project-card'
              }
            >
              <img
                className="project-cover"
                src={project.cover}
                alt=""
                loading="lazy"
              />
              <div className="project-body">
                <h4>{project.name}</h4>
                <p className="project-tagline">
                  {project.tagline}
                  {project.isOurs && (
                    <span className="project-ours">Your project</span>
                  )}
                </p>
                <p>{project.text}</p>
                <ul className="project-focus" aria-label="Focus">
                  {project.focus.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
