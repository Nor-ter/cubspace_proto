import { ArrowUpRight } from 'lucide-react';
import { MiniQuiz } from '@/components/MiniQuiz';
import { PageHero } from '@/components/PageHero';
import { TypewriterText } from '@/components/TypewriterText';
import type { Course } from '@/types/course';
import { references } from '@/features/subsystems/data';
import { MISSION_QUIZ, QUIZ_INTRO } from '../data';
import '@/styles/intro-pages.css';
import './QuizSection.css';

const QUIZ_REFERENCES = references(1, 4, 8, 10, 15);

export function QuizSection({ course }: { course: Course }) {
  return (
    <section
      id="quiz"
      tabIndex={-1}
      className={`section quiz-section page-view ${course.activePage === 'quiz' ? 'active' : ''}`}
    >
      <PageHero page="quiz" active={course.activePage === 'quiz'} title="Quiz">
        <p>{QUIZ_INTRO}</p>
      </PageHero>

      <MiniQuiz
        key={course.quizGeneration}
        title={MISSION_QUIZ.title}
        questions={MISSION_QUIZ.questions}
        passed={course.quizPassed}
        onPass={course.passQuiz}
        onReset={course.resetQuiz}
      />

      <section className="quiz-references" aria-labelledby="quiz-refs">
        <h3 id="quiz-refs">
          <TypewriterText text="References" when="view" />
        </h3>
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
