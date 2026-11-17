import { useState } from 'react';
import { PageHero } from '@/components/PageHero';
import type { Course } from '@/types/course';
import type { Selection } from '../viewer/types';
import { AnatomyViewer } from './AnatomyViewer';
import { SubsystemHeading, SubsystemPanel } from './SubsystemPanel';
import '@/styles/intro-pages.css';
import './SubsystemsSection.css';

export function SubsystemsSection({ course }: { course: Course }) {
  const isActive = course.activePage === 'subsystems';
  const [selected, setSelected] = useState<Selection>('all');
  return (
    <section
      id="subsystems"
      tabIndex={-1}
      className={`section subsystems-section page-view ${isActive ? 'active' : ''}`}
    >
      <PageHero active={course.activePage === 'subsystems'} title="Subsystems">
        <p>
          Select a subsystem in the model or in the list to read its role,
          objective, tasks, skills and learning outcome.
        </p>
      </PageHero>

      <div className="subsystems-workspace">
        <div className="subsystems-model">
          <AnatomyViewer
            active={isActive}
            selected={selected}
            onSelect={setSelected}
          />
        </div>
        {/* The title is the first line of the column, level with the model's
            top edge. */}
        <div className="subsystems-reading" aria-live="polite">
          <SubsystemHeading selected={selected} />
          <SubsystemPanel
            key={selected}
            selected={selected}
            onSelect={setSelected}
          />
        </div>
      </div>
    </section>
  );
}
