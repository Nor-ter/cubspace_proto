import type { Course } from '@/types/course';
import { NAV } from '../data';

export function CourseContextBar({ course }: { course: Course }) {
  if (course.activePage === 'home') return null;
  return (
    <div className="course-context">
      <span>{NAV.find(([id]) => id === course.activePage)?.[1]}</span>
    </div>
  );
}
