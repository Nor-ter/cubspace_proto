import { ChevronLeft, ChevronRight, LockKeyhole } from 'lucide-react';
import type { Course, PageId, QuizSection } from '@/types/course';
import { NAV, QUIZ_ORDER } from '../data';

function stepTitle(id: PageId, label: string) {
  const stepNumber = QUIZ_ORDER.indexOf(id as QuizSection) + 1;
  return stepNumber ? `${stepNumber}. ${label}` : label;
}

export function CoursePager({ course }: { course: Course }) {
  const { activePage, go, isUnlocked } = course;
  const index = NAV.findIndex(([id]) => id === activePage);
  const previous = NAV[index - 1];
  const next = NAV[index + 1];
  const isNextOpen = next ? isUnlocked(next[0]) : false;
  return (
    <nav className="course-pager" aria-label="Lesson navigation">
      {previous && (
        <button className="pager-link" onClick={() => go(previous[0])}>
          <ChevronLeft />
          <span>
            <small>Previous</small>
            <strong>{stepTitle(previous[0], previous[1])}</strong>
          </span>
        </button>
      )}
      {next && (
        <button
          className="pager-link pager-next"
          onClick={() => go(next[0])}
          disabled={!isNextOpen}
        >
          <span>
            <small>{isNextOpen ? 'Next' : 'Pass the quiz above to unlock'}</small>
            <strong>{stepTitle(next[0], next[1])}</strong>
          </span>
          {isNextOpen ? <ChevronRight /> : <LockKeyhole />}
        </button>
      )}
    </nav>
  );
}
