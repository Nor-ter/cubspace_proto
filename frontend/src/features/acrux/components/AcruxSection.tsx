import { MissionVideo } from './MissionVideo';
import { ArrowRight } from 'lucide-react';
import type { Course } from '@/types/course';
import {
  ACRUX_FACTS,
  ACRUX_INTRO,
  EXPERIMENTS,
  OPERATIONS,
  SUCCESS_STEPS,
} from '../data';

export function AcruxSection({ course }: { course: Course }) {
  return (
    <section id="acrux" className="page">
      <header className="page-hero">
        <p className="eyebrow">03 / ACRUX-II · {ACRUX_INTRO.tagline}</p>
        <h1>{ACRUX_INTRO.headline}</h1>
      </header>

      <div className="split acrux-intro">
        <div className="prose">
          {ACRUX_INTRO.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <MissionVideo />
      </div>

      <div className="acrux-facts">
        <dl className="fact-sheet">
          {ACRUX_FACTS.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <section className="block" aria-labelledby="success-title">
        <div className="block-head">
          <p className="eyebrow">WHAT SUCCESS LOOKS LIKE</p>
          <h2 id="success-title">Each step unlocks the next.</h2>
          <p>
            The primary success criteria are completing the deployment sequence
            and establishing ground communication. Only then can the spacecraft
            collect its demonstration data.
          </p>
        </div>
        <ol className="ladder">
          {SUCCESS_STEPS.map(([name, text], index) => (
            <li key={name}>
              <span>{index + 1}</span>
              <h3>{name}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="block" aria-labelledby="operations-title">
        <div className="block-head">
          <p className="eyebrow">CONCEPT OF OPERATIONS</p>
          <h2 id="operations-title">Three phases in orbit.</h2>
        </div>
        <ol className="phase-rows">
          {OPERATIONS.map(([code, name, text]) => (
            <li key={code}>
              <span>{code}</span>
              <h3>{name}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="block" aria-labelledby="experiments-title">
        <div className="block-head">
          <p className="eyebrow">TECHNOLOGY DEMONSTRATION</p>
          <h2 id="experiments-title">What ACRUX-II tests in space.</h2>
        </div>
        <div className="card-grid">
          {EXPERIMENTS.map((experiment) => (
            <article key={experiment.name} className="card">
              <h3>
                {experiment.name}
                {experiment.status && (
                  <span className="tag tag-tbd">{experiment.status}</span>
                )}
              </h3>
              <p>{experiment.text}</p>
            </article>
          ))}
        </div>
      </section>

      <aside className="callout">
        <div>
          <p className="eyebrow">NEXT</p>
          <h2>Six subsystems make this work.</h2>
          <p>
            See what each team builds, and which tools and skills it uses, on
            the exploded 1U model.
          </p>
        </div>
        <button
          className="button button-primary"
          onClick={() => course.go('theory')}
        >
          Open Theory <ArrowRight />
        </button>
      </aside>
    </section>
  );
}
