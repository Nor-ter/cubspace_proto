import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Course } from '@/types/course';
import { COPYRIGHT, NAV } from '../data';

export function CoursePager({ course }: { course: Course }) {
  const { activePage, go } = course;
  const index = NAV.findIndex(([id]) => id === activePage);
  const previous = NAV[index - 1];
  const next = NAV[index + 1];
  // Start is one screen with its own Explore button and copyright.
  if (activePage === 'home') return null;
  // Previous and Next at the ends, the copyright centred between them.
  return (
    <footer className="course-pager">
      <nav className="pager-nav" aria-label="Lesson navigation">
        {previous && (
          <button className="pager-link" onClick={() => go(previous[0])}>
            <ChevronLeft />
            <span>
              <small>Previous</small>
              <strong>{previous[1]}</strong>
            </span>
          </button>
        )}
        {next && (
          <button className="pager-link pager-next" onClick={() => go(next[0])}>
            <span>
              <small>Next</small>
              <strong>{next[1]}</strong>
            </span>
            <ChevronRight />
          </button>
        )}
      </nav>
      <p className="pager-copyright">{COPYRIGHT}</p>
    </footer>
  );
}
