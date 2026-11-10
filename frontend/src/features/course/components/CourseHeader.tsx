import { useState } from 'react';
import { LockKeyhole, Menu, RotateCcw, X } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import type { Course, PageId } from '@/types/course';
import { NAV, QUIZ_ORDER } from '../data';

export function CourseHeader({ course }: { course: Course }) {
  const [menu, setMenu] = useState(false);
  const { activePage, isUnlocked } = course;
  function go(id: PageId) {
    course.go(id);
    if (isUnlocked(id)) setMenu(false);
  }
  return (
    <header className="topbar">
      <button
        className="brand"
        onClick={() => go('home')}
        aria-label="CubSpace startup screen"
      >
        <span className="brand-cube">
          <BrandLogo />
        </span>
        <strong>CubSpace</strong>
        <small>ACRUX-II / ENGINEER ONBOARDING</small>
      </button>
      <nav
        id="course-menu"
        className={menu ? 'open' : ''}
        aria-label="Main Study Section"
      >
        {NAV.map(([id, label]) => (
          <button
            key={id}
            className={activePage === id ? 'active' : ''}
            onClick={() => go(id)}
            disabled={!isUnlocked(id)}
            aria-current={activePage === id ? 'page' : undefined}
            title={
              !isUnlocked(id)
                ? 'Opens when you complete a quiz from the previous session'
                : label
            }
          >
            {!isUnlocked(id) && <LockKeyhole />}
            {label}
          </button>
        ))}
      </nav>
      <div className="top-status">
        <span>
          {course.completed.length}/{QUIZ_ORDER.length} completed
        </span>
        <button
          className="reset-progress"
          onClick={course.requestReset}
          title="Reset all learning progress"
        >
          <RotateCcw /> <span>Reset</span>
        </button>
        <button
          className="menu-button"
          onClick={() => setMenu(!menu)}
          aria-label={menu ? 'Close menu' : 'Open menu'}
          aria-expanded={menu}
          aria-controls="course-menu"
        >
          {menu ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
