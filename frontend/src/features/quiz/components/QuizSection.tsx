import { MiniQuiz } from '@/components/MiniQuiz';
import { RevealText } from '@/components/RevealText';
import type { Course } from '@/types/course';
import { MISSION_QUIZ, QUIZ_INTRO } from '../data';
import '@/styles/intro-pages.css';

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
    </section>
  );
}
