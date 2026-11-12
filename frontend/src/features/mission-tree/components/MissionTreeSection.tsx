import { InteractiveMissionTree } from './InteractiveMissionTree';
import { ArrowRight, ChevronRight } from 'lucide-react';
import type { Course } from '@/types/course';
import { INTRO_PARAGRAPHS, LEARNING_FLOW, LIMITS, STRUCTURE } from '../data';

export function MissionTreeSection({ course }: { course: Course }) {
  return (
    <section id="mission-tree" className="page">
      <header className="page-hero">
        <p className="eyebrow">05 / MISSION TREE · INTRODUCTION</p>
        <h1>Learn through small tasks. Build a 1U satellite.</h1>
        <p className="lead">And pass the knowledge on to the next cohort.</p>
      </header>

      <div className="split">
        <div className="prose prose-large">
          {INTRO_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <ol className="tree-path" aria-label="How Mission Tree is organised">
          {STRUCTURE.map(([level, example]) => (
            <li key={level}>
              <span>{level}</span>
              <strong>{example}</strong>
            </li>
          ))}
        </ol>
      </div>

      <section className="block" aria-labelledby="flow-title">
        <div className="block-head">
          <p className="eyebrow">HOW YOU LEARN THERE</p>
          <h2 id="flow-title">Manual, then Workshop, then Tasks.</h2>
        </div>
        <ol className="flow">
          {LEARNING_FLOW.map(([name, text], index) => (
            <li key={name}>
              <span>{index + 1}</span>
              <h3>{name}</h3>
              <p>{text}</p>
              {index < LEARNING_FLOW.length - 1 && <ChevronRight />}
            </li>
          ))}
        </ol>
      </section>

      <InteractiveMissionTree />

      <section className="block" aria-labelledby="limits-title">
        <div className="block-head">
          <p className="eyebrow">GOOD TO KNOW</p>
          <h2 id="limits-title">It is a prototype.</h2>
        </div>
        <ul className="plain-list">
          {LIMITS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <aside className="callout">
        <div>
          <p className="eyebrow">NEXT</p>
          <h2>Choose your team and go.</h2>
          <p>The last page takes you from onboarding into Mission Tree.</p>
        </div>
        <button
          className="button button-primary"
          onClick={() => course.go('launch')}
        >
          Go to Launch <ArrowRight />
        </button>
      </aside>
    </section>
  );
}
