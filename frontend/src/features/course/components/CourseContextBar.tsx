import { ChevronRight } from 'lucide-react';
import type { Course, QuizSection } from '@/types/course';
import { scrollToElement } from '@/lib/smoothScroll';
import { NAV, QUIZ_ORDER } from '../data';

// Clears the fixed top bar and course context bar.
const QUIZ_SCROLL_OFFSET = 140;

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
        onClick={() => {
          const quiz = document.querySelector(`#${activePage} .mini-quiz`);
          if (quiz) scrollToElement(quiz, -QUIZ_SCROLL_OFFSET);
        }}
      >
        Check understanding
        <ChevronRight />
      </button>
    </div>
  );
}
