import { AnatomySection } from '@/features/anatomy/components/AnatomySection';
import { CourseContextBar } from '@/features/course/components/CourseContextBar';
import { CourseFooter } from '@/features/course/components/CourseFooter';
import { CourseHeader } from '@/features/course/components/CourseHeader';
import { CoursePager } from '@/features/course/components/CoursePager';
import { ResetDialog } from '@/features/course/components/ResetDialog';
import { QUIZ_ORDER } from '@/features/course/data';
import { useCourse } from '@/features/course/hooks/useCourse';
import { HandoffSection } from '@/features/handoff/components/HandoffSection';
import { HomeSection } from '@/features/home/components/HomeSection';
import { MissionSection } from '@/features/mission/components/MissionSection';
import { ModelSection } from '@/features/model/components/ModelSection';

export function HomePage() {
  const { course, storageError, resetOpen, setResetOpen, resetAll } =
    useCourse();
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
      <MissionSection course={course} />
      <AnatomySection course={course} />
      <ModelSection course={course} />
      <HandoffSection course={course} />
      <CoursePager course={course} />
      <CourseFooter visible={course.activePage === 'handoff'} />
      <ResetDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        onConfirm={resetAll}
      />
    </main>
  );
}
