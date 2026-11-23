import { useState } from 'react';
import { MiniQuiz } from '@/components/MiniQuiz';
import type { Quiz } from '@/types/quiz';
import { SOURCES } from '../data';
import { ACRUX_QUIZ, MASS_QUIZ, ORBIT_QUIZ } from '../quiz';

function PracticeQuiz({ quiz }: { quiz: Quiz }) {
  const [generation, setGeneration] = useState(0);
  const [passed, setPassed] = useState(false);
  return (
    <MiniQuiz
      key={generation}
      title={quiz.title}
      questions={quiz.questions}
      passed={passed}
      onPass={() => setPassed(true)}
      onReset={() => {
        setPassed(false);
        setGeneration((value) => value + 1);
      }}
    />
  );
}

export function CubesatQuizzes() {
  return (
    <section className="cubesat-practice" aria-label="CubeSat practice quizzes">
      <div className="cubesat-quiz-reference-list">
        <p>Verify the actual spacecraft masses on Gunter&rsquo;s Space Page:</p>
        <ul>
          <li>
            <a href={SOURCES.cp1} target="_blank" rel="noreferrer">
              CP1 (1U) <span aria-hidden="true">&#8599;</span>
            </a>
          </li>
          <li>
            <a href={SOURCES.exocube} target="_blank" rel="noreferrer">
              ExoCube / CP10 (3U) <span aria-hidden="true">&#8599;</span>
            </a>
          </li>
        </ul>
      </div>
      <PracticeQuiz quiz={MASS_QUIZ} />
      <h3>What about ACRUX-1?</h3>
      <div className="cubesat-quiz-links">
        <p>Explore another real mission:</p>
        <a
          className="cubesat-resource-button"
          href={SOURCES.acrux1}
          target="_blank"
          rel="noreferrer"
        >
          Explore ACRUX-1 on Gunter&rsquo;s Space Page{' '}
          <span aria-hidden="true">&#8599;</span>
        </a>
      </div>
      <PracticeQuiz quiz={ACRUX_QUIZ} />
    </section>
  );
}

export function CubesatOrbitQuiz() {
  return (
    <section className="cubesat-practice" aria-label="ACRUX-1 orbit quiz">
      <div className="cubesat-quiz-links">
        <p>Check the mission details:</p>
        <a
          className="cubesat-resource-button"
          href={SOURCES.acrux1}
          target="_blank"
          rel="noreferrer"
        >
          Explore ACRUX-1 on Gunter&rsquo;s Space Page{' '}
          <span aria-hidden="true">&#8599;</span>
        </a>
      </div>
      <PracticeQuiz quiz={ORBIT_QUIZ} />
    </section>
  );
}
