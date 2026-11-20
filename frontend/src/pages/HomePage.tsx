import { AboutSection } from '@/features/about/components/AboutSection';
import { AcruxSection } from '@/features/acrux/components/AcruxSection';
import { CourseContextBar } from '@/features/course/components/CourseContextBar';
import { CourseHeader } from '@/features/course/components/CourseHeader';
import { CoursePager } from '@/features/course/components/CoursePager';
import { useCourse } from '@/features/course/hooks/useCourse';
import { HomeSection } from '@/features/home/components/HomeSection';
import { MissionTreeSection } from '@/features/mission-tree/components/MissionTreeSection';
import { QuizSection } from '@/features/quiz/components/QuizSection';
import { SubsystemsSection } from '@/features/subsystems/components/SubsystemsSection';
import { useDrawOnScroll } from '@/hooks/useDrawOnScroll';

const DRAW_TARGETS = '.station-track, .acrux-timeline';

export function HomePage() {
  const { course, storageError } = useCourse();
  useDrawOnScroll(DRAW_TARGETS, course.activePage);
  return (
    <main>
      <a className="skip-link" href={`#${course.activePage}`}>
        Jump to learning content
      </a>
      <CourseHeader course={course} />
      <CourseContextBar course={course} />
      {storageError && (
        <p className="storage-notice" role="alert">
          Browser storage is unavailable. Your quiz result will be kept only for
          this session.
        </p>
      )}
      <HomeSection course={course} />
      <AboutSection course={course} />
      <AcruxSection course={course} />
      <SubsystemsSection course={course} />
      <QuizSection course={course} />
      <MissionTreeSection course={course} />
      <CoursePager course={course} />
    </main>
  );
}
