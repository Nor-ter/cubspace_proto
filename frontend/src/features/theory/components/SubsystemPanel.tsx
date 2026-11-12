import type { CSSProperties } from 'react';
import { ArrowRight, ArrowUpRight, ChevronDown, X } from 'lucide-react';
import type { Course } from '@/types/course';
import { REFERENCES, type TheorySubsystem } from '../data';
import { ClipPlayer } from './ClipPlayer';
import { Quiz } from './Quiz';

export function SubsystemPanel({
  subsystem,
  course,
  onClose,
}: {
  subsystem: TheorySubsystem;
  course: Course;
  onClose: () => void;
}) {
  const quizId = `theory-${subsystem.id}`;
  return (
    <article
      className="pass"
      aria-labelledby="pass-title"
      style={{ '--team': subsystem.colour } as CSSProperties}
    >
      <header className="pass-head">
        <div>
          <p className="pass-code">
            {subsystem.code}
            {subsystem.status === 'draft' && (
              <span className="tag tag-tbd">Draft · placeholder</span>
            )}
          </p>
          <h2 id="pass-title">{subsystem.name} Subsystem</h2>
          <p>{subsystem.role}</p>
        </div>
        <button className="icon-button" onClick={onClose} aria-label="Close">
          <X />
        </button>
      </header>

      <section className="pass-block">
        <h3>Objective Statement</h3>
        <div className="pass-box">
          <p className="pass-objective">{subsystem.objective}</p>
          <p>{subsystem.description}</p>
        </div>
      </section>

      <div className="pass-columns">
        <section className="pass-block">
          <h3>Tasks</h3>
          <ul className="pass-box pass-list">
            {subsystem.tasks.map((task) => (
              <li key={task}>{task}</li>
            ))}
          </ul>
        </section>
        <section className="pass-block">
          <h3>Required Skills</h3>
          <ul className="pass-box pass-list">
            {subsystem.skills.map((skill) => (
              <li key={skill.name}>
                {skill.name}
                {skill.tools && <small>{skill.tools}</small>}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="pass-block">
        <h3>Video Showcase</h3>
        <ClipPlayer key={subsystem.id} video={subsystem.video} />
      </section>

      <section className="pass-block">
        <h3>On ACRUX-II</h3>
        <div className="pass-box">
          <ul className="chips">
            {subsystem.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="pass-note">{subsystem.modelNote}</p>
          <p>
            <strong>Connects to.</strong> {subsystem.connects}
          </p>
        </div>
      </section>

      <section className="pass-block">
        <details className="subsystem-quiz">
          <summary>
            Quick Quiz <ChevronDown />
          </summary>
          <div className="quiz-drawer">
            {subsystem.quiz.length > 0 ? (
              <Quiz
                key={subsystem.id}
                title={`${subsystem.code} check`}
                questions={subsystem.quiz}
                passed={course.progress.quizzesPassed.includes(quizId)}
                onPass={() => course.passQuiz(quizId)}
              />
            ) : (
              <p className="pass-box pass-empty">
                The {subsystem.code} quiz is added after the team reviews this
                page.
              </p>
            )}
          </div>
        </details>
      </section>

      <footer className="pass-foot">
        <p>
          <strong>After this you can:</strong> {subsystem.outcome}
        </p>
        <button
          className="button button-primary"
          onClick={() => {
            course.setTeam(subsystem.team);
            course.go('mission-tree');
          }}
        >
          Continue with {subsystem.code} in Mission Tree <ArrowRight />
        </button>
        <ul className="pass-sources">
          {subsystem.references.map((id) => (
            <li key={id}>
              <a href={REFERENCES[id].url} target="_blank" rel="noreferrer">
                [{id}] {REFERENCES[id].title} <ArrowUpRight />
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </article>
  );
}
