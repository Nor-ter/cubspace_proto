import { MiniQuiz } from '@/components/MiniQuiz';
import { PageHero } from '@/components/PageHero';
import type { Course } from '@/types/course';
import { references } from '@/features/subsystems/data';
import { MISSION_QUIZ } from '../data';
import { CertificateForm } from './CertificateForm';
import '@/styles/intro-pages.css';

export function QuizSection({ course }: { course: Course }) {
  return (
    <section
      id="quiz"
      tabIndex={-1}
      className={`section quiz-section page-view ${course.activePage === 'quiz' ? 'active' : ''}`}
    >
      <PageHero active={course.activePage === 'quiz'} title="Quiz" />

      <MiniQuiz
        key={course.quizGeneration}
        title={MISSION_QUIZ.title}
        questions={MISSION_QUIZ.questions}
        passed={course.quizPassed}
        onPass={course.passQuiz}
        onReset={course.resetQuiz}
        reward={<CertificateForm />}
        // The quiz cites the guide's reference list, shared with Subsystems.
        sourceUrl={(id) => references(id)[0]?.url}
      />
    </section>
  );
}
