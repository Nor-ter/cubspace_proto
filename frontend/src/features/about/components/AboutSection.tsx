import { useState } from 'react';
import { ProjectGallery } from './ProjectGallery';
import { PROJECT_IMAGES } from '../gallery';
import type { Project } from '../data';
import { ArrowRight } from 'lucide-react';
import type { Course } from '@/types/course';
import { JOURNEY, MSP_STATEMENT, PROJECTS } from '../data';

export function AboutSection({ course }: { course: Course }) {
  const [gallery, setGallery] = useState<Project | null>(null);
  return (
    <section id="about" className="page">
      <header className="page-hero">
        <p className="eyebrow">02 / ABOUT · MELBOURNE SPACE PROGRAM</p>
        <h1>{MSP_STATEMENT.headline}</h1>
        <p className="lead">{MSP_STATEMENT.body}</p>
      </header>

      <div className="statement-pair" aria-label="MSP vision and mission">
        <article>
          <p className="eyebrow">OUR VISION / MSP</p>
          <p>{MSP_STATEMENT.vision}</p>
        </article>
        <article>
          <p className="eyebrow">OUR MISSION / MSP</p>
          <p>{MSP_STATEMENT.mission}</p>
        </article>
      </div>

      <section
        className="block cubspace-intro"
        aria-labelledby="cubspace-title"
      >
        <div className="block-head">
          <p className="eyebrow">THE CUBSPACE PROJECT</p>
          <h2 id="cubspace-title">
            From learning the mission to building it together.
          </h2>
          <p>
            CubSpace connects ACRUX-II onboarding, subsystem knowledge and the
            Mission Tree workspace. It helps MSP members find their first task,
            practise engineering skills and pass what they learn to the next
            team.
          </p>
        </div>
        <div
          className="statement-pair"
          aria-label="CubSpace project vision and mission"
        >
          <article>
            <p className="eyebrow">OUR VISION / CUBSPACE</p>
            <p>
              A shared engineering journey that every new team can build on.
            </p>
          </article>
          <article>
            <p className="eyebrow">OUR MISSION / CUBSPACE</p>
            <p>
              Connect mission knowledge, practical learning and project tasks so
              MSP members can contribute with confidence.
            </p>
          </article>
        </div>
      </section>

      <section className="block" aria-labelledby="journey-title">
        <div className="block-head">
          <p className="eyebrow">OUR JOURNEY</p>
          <h2 id="journey-title">Twelve years, started by students.</h2>
        </div>
        <ol className="journey">
          {JOURNEY.map((entry) => (
            <li key={entry.year} className={entry.pending ? 'is-pending' : ''}>
              <span className="journey-year">{entry.year}</span>
              <div>
                <h3>{entry.title}</h3>
                <p>{entry.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="block" aria-labelledby="projects-title">
        <div className="block-head">
          <p className="eyebrow">PROJECTS</p>
          <h2 id="projects-title">
            Four projects, one shared learning journey.
          </h2>
        </div>
        <div className="project-grid">
          {PROJECTS.map((project) => (
            <article
              key={project.name}
              className={project.isOurs ? 'project is-ours' : 'project'}
            >
              <img
                className="project-cover"
                src={PROJECT_IMAGES[project.index][0].src}
                alt=""
                loading="lazy"
              />
              <span className="project-index">{project.index}</span>
              <p className="eyebrow">{project.tagline}</p>
              <h3>{project.name}</h3>
              <p>{project.text}</p>
              <ul className="chips">
                {project.focus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <button
                className="project-gallery-button text-link"
                onClick={() => setGallery(project)}
                aria-label={`View ${project.name} gallery`}
              >
                View gallery <ArrowRight />
              </button>
              {project.isOurs && (
                <button
                  className="text-link"
                  onClick={() => course.go('acrux')}
                >
                  You are joining this one <ArrowRight />
                </button>
              )}
            </article>
          ))}
        </div>
      </section>

      {gallery && (
        <ProjectGallery
          key={gallery.index}
          project={gallery}
          onClose={() => setGallery(null)}
        />
      )}

      <p className="source-note">
        MSP text and project photographs: Melbourne Space Program (Who we are,
        Projects). CubSpace images show this project.
      </p>
    </section>
  );
}
