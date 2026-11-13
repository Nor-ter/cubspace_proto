import { AboutSection } from '@/features/about/components/AboutSection';
import { AcruxSection } from '@/features/acrux/components/AcruxSection';
import { CubesatSection } from '@/features/cubesat/components/CubesatSection';
import { AnatomySection } from '@/features/anatomy/components/AnatomySection';
import { CourseContextBar } from '@/features/course/components/CourseContextBar';
import { CourseFooter } from '@/features/course/components/CourseFooter';
import { CourseHeader } from '@/features/course/components/CourseHeader';
import { CoursePager } from '@/features/course/components/CoursePager';
import { ResetDialog } from '@/features/course/components/ResetDialog';
import { QUIZ_ORDER } from '@/features/course/data';
import { useCourse } from '@/features/course/hooks/useCourse';
import { useDrawOnScroll } from '@/hooks/useDrawOnScroll';
import { HandoffSection } from '@/features/handoff/components/HandoffSection';
import { HomeSection } from '@/features/home/components/HomeSection';
import { MissionSection } from '@/features/mission/components/MissionSection';
import { MissionTreeSection } from '@/features/mission-tree/components/MissionTreeSection';
import { ModelSection } from '@/features/model/components/ModelSection';

const DRAW_TARGETS =
  '.trace-chain, .hierarchy, .knowledge-loop, .state-track, .three-explore, .station-track';

export function HomePage() {
  const { course, storageError, resetOpen, setResetOpen, resetAll } =
    useCourse();
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
          Browser storage is unavailable. Your progress will be kept only for
          this session.
        </p>
      )}
      <HomeSection course={course} quizOrder={QUIZ_ORDER} />
      <AboutSection course={course} />
      <CubesatSection course={course} />
      <AcruxSection course={course} />
      <MissionSection course={course} />
      <AnatomySection course={course} />
      <ModelSection course={course} />
      <HandoffSection course={course} />
      <MissionTreeSection course={course} />
      <CoursePager course={course} />
      <CourseFooter
        visible={
          course.activePage === 'handoff' ||
          course.activePage === 'mission-tree'
        }
      />
      <ResetDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        onConfirm={resetAll}
      />
    </main>
  );
}
