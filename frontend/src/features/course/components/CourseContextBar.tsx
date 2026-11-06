import { ChevronRight } from 'lucide-react';
import type { Course, QuizSection } from '@/types/course';
import { NAV, QUIZ_ORDER } from '../data';

export function CourseContextBar({ course }: { course: Course }) {
  const { activePage, adminMode } = course;
  if (activePage === 'home') return null;
  return (
    <div className="course-context">
      <span>
        <strong>
          {String(QUIZ_ORDER.indexOf(activePage as QuizSection) + 1).padStart(
            2,
            '0',
          )}{' '}
          / {String(QUIZ_ORDER.length).padStart(2, '0')}
        </strong>
        {NAV.find(([id]) => id === activePage)?.[1]}
      </span>
      {adminMode && (
        <span className="review-mode">
          Review mode · Browse without locking
        </span>
      )}
      <button
        onClick={() =>
          document
            .querySelector(`#${activePage} .mini-quiz`)
            ?.scrollIntoView({ behavior: 'auto', block: 'start' })
        }
      >
        Check understanding
        <ChevronRight />
      </button>
    </div>
  );
}
