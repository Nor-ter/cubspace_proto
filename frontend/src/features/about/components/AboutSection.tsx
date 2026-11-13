import { useState } from 'react';
import { ArrowRight, Images } from 'lucide-react';
import { RevealText } from '@/components/RevealText';
import { StationTrack } from '@/components/StationTrack';
import type { Course } from '@/types/course';
import {
  CUBSPACE_STATEMENT,
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
import { PurposePair } from './PurposePair';
import '@/styles/intro-pages.css';
import './AboutSection.css';

export function AboutSection({ course }: { course: Course }) {
  const { activePage } = course;
  const [gallery, setGallery] = useState<Project | null>(null);
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

      <section className="intro-block" aria-labelledby="about-cubspace">
        <div className="intro-block-head">
          <h3 id="about-cubspace">{CUBSPACE_STATEMENT.headline}</h3>
          <p>{CUBSPACE_STATEMENT.body}</p>
        </div>
        <PurposePair owner="CubSpace" purpose={CUBSPACE_STATEMENT} />
      </section>

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
                src={project.images[0].src}
                alt=""
                loading="lazy"
              />
              <div className="project-body">
                <h4>
                  {/* The whole card opens the photos (DESIGN.md: the card is the click target). */}
                  <button
                    className="project-hit"
                    onClick={() => setGallery(project)}
                    aria-haspopup="dialog"
                  >
                    {project.name}
                  </button>
                </h4>
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
                <div className="project-actions">
                  <span className="project-photos">
                    <Images aria-hidden="true" />
                    {project.images.length === 1
                      ? '1 photo'
                      : `${project.images.length} photos`}
                  </span>
                  {project.isOurs && (
                    <button
                      className="project-link"
                      onClick={() => course.go('acrux')}
                    >
                      About ACRUX-II <ArrowRight aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <p className="intro-source">
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
