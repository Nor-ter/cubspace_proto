import { AboutSection } from '@/features/about/components/AboutSection';
import { AcruxSection } from '@/features/acrux/components/AcruxSection';
import { CourseFooter } from '@/features/course/components/CourseFooter';
import { CourseHeader } from '@/features/course/components/CourseHeader';
import { CoursePager } from '@/features/course/components/CoursePager';
import { useCourse } from '@/features/course/hooks/useCourse';
import { LaunchSection } from '@/features/mission-tree/components/LaunchSection';
import { MissionTreeSection } from '@/features/mission-tree/components/MissionTreeSection';
import { StartSection } from '@/features/start/components/StartSection';
import { TheorySection } from '@/features/theory/components/TheorySection';

export function OnboardingPage() {
  const course = useCourse();
  const { activePage } = course;
  return (
    <>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <CourseHeader course={course} />
      <main id="content" tabIndex={-1}>
        {activePage === 'start' && <StartSection course={course} />}
        {activePage === 'about' && <AboutSection course={course} />}
        {activePage === 'acrux' && <AcruxSection course={course} />}
        {activePage === 'theory' && <TheorySection course={course} />}
        {activePage === 'mission-tree' && <MissionTreeSection course={course} />}
        {activePage === 'launch' && <LaunchSection course={course} />}
      </main>
      <CoursePager course={course} />
      <CourseFooter />
    </>
  );
}
