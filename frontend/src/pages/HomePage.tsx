import { AboutSection } from '@/features/about/components/AboutSection';
import { AcruxSection } from '@/features/acrux/components/AcruxSection';
import { CourseContextBar } from '@/features/course/components/CourseContextBar';
import { CourseFooter } from '@/features/course/components/CourseFooter';
import { CourseHeader } from '@/features/course/components/CourseHeader';
import { CoursePager } from '@/features/course/components/CoursePager';
import { useCourse } from '@/features/course/hooks/useCourse';
import { CubesatSection } from '@/features/cubesat/components/CubesatSection';
import { HomeSection } from '@/features/home/components/HomeSection';
import { MissionTreeSection } from '@/features/mission-tree/components/MissionTreeSection';
import { QuizSection } from '@/features/quiz/components/QuizSection';
import { SubsystemsSection } from '@/features/subsystems/components/SubsystemsSection';
import { useDrawOnScroll } from '@/hooks/useDrawOnScroll';
import { consumeEnterTransition } from '@/lib/navigate';
import { useState } from 'react';

const DRAW_TARGETS = '.station-track';

export function HomePage() {
  const { course, storageError } = useCourse();
  useDrawOnScroll(DRAW_TARGETS, course.activePage);
  // Coming from the intro's launch button, the course plays its entrance.
  const [entering] = useState(consumeEnterTransition);
  return (
    <main className={entering ? 'app-enter' : undefined}>
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
      <CubesatSection course={course} />
      <AcruxSection course={course} />
      <SubsystemsSection course={course} />
      <QuizSection course={course} />
      <MissionTreeSection course={course} />
      <CoursePager course={course} />
      <CourseFooter visible={course.activePage === 'mission-tree'} />
    </main>
  );
}
