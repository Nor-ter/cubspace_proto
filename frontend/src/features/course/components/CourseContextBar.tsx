import type { Course } from '@/types/course';
import { NAV } from '../data';

export function CourseContextBar({ course }: { course: Course }) {
  if (course.activePage === 'home') return null;
  const index = NAV.findIndex(([id]) => id === course.activePage);
  return (
    <div className="course-context">
      <span>
        <b>{String(index + 1).padStart(2, '0')}</b> · {NAV[index]?.[1]}
      </span>
    </div>
  );
}
