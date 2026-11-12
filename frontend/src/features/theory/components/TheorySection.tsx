import { scrollToY } from '@/lib/smoothScroll';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowUpRight, Check, Minimize2, RotateCcw, Scan } from 'lucide-react';
import type { Course } from '@/types/course';
import { FAQ, MISSION, MISSION_QUIZ, REFERENCES, SUBSYSTEMS } from '../data';
import type { SubsystemId } from '../viewer/types';
import { AnatomyViewer } from './AnatomyViewer';
import { Quiz } from './Quiz';
import { SubsystemDrawer } from './SubsystemDrawer';

const MISSION_QUIZ_ID = 'theory-mission';

export function TheorySection({ course }: { course: Course }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<SubsystemId | null>(null);
  const [exploded, setExploded] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const selected = SUBSYSTEMS.find((item) => item.id === selectedId) ?? null;
  const { quizzesPassed } = course.progress;

  useEffect(() => {
    if (!selectedId || !stageRef.current) return;
    const bar =
      document.querySelector('.topbar')?.getBoundingClientRect().height ?? 76;
    scrollToY(
      stageRef.current.getBoundingClientRect().top + window.scrollY - bar - 16,
    );
  }, [selectedId]);

  function select(id: SubsystemId | null) {
    setSelectedId(id);
  }

  return (
    <section id="theory" className="page page-wide">
      <header className="page-hero">
        <p className="eyebrow">04 / THEORY · CUBESAT ANATOMY</p>
        <h1>Six subsystems, one spacecraft.</h1>
        <p className="lead">
          Pick a subsystem to see what its team does, the tools and skills it
          needs, a short video and a quick quiz.
        </p>
      </header>

      <div className={selected ? 'anatomy has-drawer' : 'anatomy'}>
        <div className="anatomy-stage" ref={stageRef}>
          <p className="anatomy-label">CubeSat Anatomy</p>
          <AnatomyViewer
            selected={selectedId ?? 'all'}
            exploded={exploded}
            resetKey={resetKey}
            onSelect={select}
          />
          <ul className="anatomy-orbit" aria-label="Subsystems">
            {SUBSYSTEMS.map((item, index) => (
              <li
                key={item.id}
                style={
                  { '--team': item.colour, '--slot': index } as CSSProperties
                }
                data-slot={index}
              >
                <button
                  className={item.id === selectedId ? 'oval active' : 'oval'}
                  aria-pressed={item.id === selectedId}
                  onClick={() =>
                    select(item.id === selectedId ? null : item.id)
                  }
                >
                  {item.code} Subsystem
                  {quizzesPassed.includes(`theory-${item.id}`) && <Check />}
                </button>
              </li>
            ))}
          </ul>
          <div className="anatomy-tools">
            <button
              className="button"
              onClick={() => setExploded(!exploded)}
              aria-pressed={exploded}
            >
              {exploded ? <Minimize2 /> : <Scan />}
              {exploded ? 'Assemble' : 'Explode'}
            </button>
            <button
              className="button"
              onClick={() => setResetKey((n) => n + 1)}
            >
              <RotateCcw /> Reset view
            </button>
            <span>Drag to rotate · scroll to zoom</span>
          </div>
        </div>
        {selected && (
          <SubsystemDrawer
            subsystem={selected}
            course={course}
            onClose={() => select(null)}
          />
        )}
      </div>

      <section className="block mission-brief" aria-labelledby="mission-title">
        <div className="block-head">
          <p className="eyebrow">START HERE · {MISSION.title.toUpperCase()}</p>
          <h2 id="mission-title">{MISSION.objective}</h2>
        </div>
        <div className="split">
          <div className="prose">
            {MISSION.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <ul className="pass-sources">
              {MISSION.references.map((id) => (
                <li key={id}>
                  <a href={REFERENCES[id].url} target="_blank" rel="noreferrer">
                    [{id}] {REFERENCES[id].title} <ArrowUpRight />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <Quiz
            title="Mission check"
            questions={MISSION_QUIZ}
            passed={quizzesPassed.includes(MISSION_QUIZ_ID)}
            onPass={() => course.passQuiz(MISSION_QUIZ_ID)}
          />
        </div>
      </section>

      <section className="block" aria-labelledby="faq-title">
        <div className="block-head">
          <p className="eyebrow">READING THE MODEL</p>
          <h2 id="faq-title">Got questions? Answered.</h2>
        </div>
        <div className="faq">
          {FAQ.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </section>
  );
}
