import { useState } from 'react';
import { RevealText } from '@/components/RevealText';
import type { Course } from '@/types/course';
import type { Selection } from '../viewer/types';
import { AnatomyViewer } from './AnatomyViewer';
import { SubsystemPanel, SubsystemPicker } from './SubsystemPanel';
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
      <div className="section-head intro-head">
        <div>
          <h2>
            <RevealText>Subsystems</RevealText>
          </h2>
          <p>
            Select a subsystem in the model or in the list to read its role,
            objective, tasks, skills and learning outcome.
          </p>
        </div>
      </div>

      <SubsystemPicker selected={selected} onSelect={setSelected} />

      <div className="subsystems-workspace">
        <div className="subsystems-model">
          <AnatomyViewer
            active={isActive}
            selected={selected}
            onSelect={setSelected}
          />
        </div>
        <div className="subsystems-reading" aria-live="polite">
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
