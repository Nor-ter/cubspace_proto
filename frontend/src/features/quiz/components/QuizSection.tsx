import { ArrowUpRight } from 'lucide-react';
import { MiniQuiz } from '@/components/MiniQuiz';
import { RevealText } from '@/components/RevealText';
import type { Course } from '@/types/course';
import { MISSION_QUIZ, QUIZ_INTRO, QUIZ_REFERENCES } from '../data';
import '@/styles/intro-pages.css';
import './QuizSection.css';

export function QuizSection({ course }: { course: Course }) {
  return (
    <section
      id="quiz"
      tabIndex={-1}
      className={`section quiz-section page-view ${course.activePage === 'quiz' ? 'active' : ''}`}
    >
      <div className="section-head intro-head">
        <div>
          <h2>
            <RevealText>Quiz</RevealText>
          </h2>
          <p>{QUIZ_INTRO}</p>
        </div>
      </div>

      <MiniQuiz
        key={course.quizGeneration}
        title={MISSION_QUIZ.title}
        questions={MISSION_QUIZ.questions}
        passed={course.quizPassed}
        onPass={course.passQuiz}
        onReset={course.resetQuiz}
      />

      <section className="quiz-references" aria-labelledby="quiz-refs">
        <h3 id="quiz-refs">References</h3>
        <ol>
          {QUIZ_REFERENCES.map((reference) => (
            <li key={reference.id}>
              <span>[{reference.id}]</span>
              <a href={reference.url} target="_blank" rel="noreferrer">
                {reference.title}
                <ArrowUpRight aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
      </section>
    </section>
  );
}
