import type { Course } from '@/types/course';
import { MissionFilm } from './MissionFilm';

export function StartSection({ course }: { course: Course }) {
  return (
    <section id="start" className="start-page">
      <MissionFilm
        onEnded={course.markFilmWatched}
        onContinue={() => course.go('about')}
      />
    </section>
  );
}
