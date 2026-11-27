import { PageHero } from '@/components/PageHero';
import { CubesatMission } from '@/features/cubesat/components/CubesatMission';
import type { Course } from '@/types/course';
import '@/styles/intro-pages.css';
import './AcruxSection.css';

export function AcruxSection({ course }: { course: Course }) {
  const isActive = course.activePage === 'acrux';
  return (
    <section
      id="acrux"
      tabIndex={-1}
      className={`section acrux-section page-view ${isActive ? 'active' : ''}`}
    >
      <PageHero active={course.activePage === 'acrux'} title="CubeSat" />

      {/* What a CubeSat is; the ACRUX-II mission itself is on About. */}
      <CubesatMission />
    </section>
  );
}
