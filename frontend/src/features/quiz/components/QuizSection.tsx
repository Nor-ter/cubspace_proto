import { MiniQuiz } from '@/components/MiniQuiz';
import { PageHero } from '@/components/PageHero';
import type { Course } from '@/types/course';
import { MISSION_QUIZ, QUIZ_INTRO } from '../data';
import '@/styles/intro-pages.css';
import './QuizSection.css';

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
    </section>
  );
}
