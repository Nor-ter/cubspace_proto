import { useState } from 'react';
import {
  Check,
  Clapperboard,
  LockKeyhole,
  Menu,
  RotateCcw,
  X,
} from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import type { Course, PageId, QuizSection } from '@/types/course';
import { NAV, QUIZ_ORDER } from '../data';
import './CourseHeader.css';

export function CourseHeader({ course }: { course: Course }) {
  const [menu, setMenu] = useState(false);
  const { activePage, completed, isUnlocked } = course;
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
        <ol className="course-steps">
          {NAV.map(([id, label], index) => {
            const stepNumber = QUIZ_ORDER.indexOf(id as QuizSection) + 1;
            const isActive = activePage === id;
            const isDone = completed.includes(id as QuizSection);
            const isOpen = isUnlocked(id);
            const previous = NAV[index - 1]?.[0];
            const isLinked =
              !QUIZ_ORDER.includes(previous as QuizSection) ||
              completed.includes(previous as QuizSection);
            const status = `${isDone ? ', completed' : ''}${isOpen ? '' : ', locked'}`;
            return (
              <li
                key={id}
                className={isLinked ? 'course-step linked' : 'course-step'}
              >
                <button
                  className={isActive ? 'active' : ''}
                  onClick={() => go(id)}
                  disabled={!isOpen}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={
                    stepNumber
                      ? `Step ${stepNumber} of ${QUIZ_ORDER.length}: ${label}${status}`
                      : label
                  }
                  title={
                    isOpen
                      ? label
                      : 'Opens when you complete a quiz from the previous session'
                  }
                >
                  {(isDone || stepNumber > 0 || id === 'home') && (
                    <span className="step-marker">
                      {isDone ? (
                        <Check />
                      ) : stepNumber ? (
                        stepNumber
                      ) : (
                        <span className="step-origin" />
                      )}
                    </span>
                  )}
                  {label}
                  {!isOpen && <LockKeyhole />}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
      <div className="top-status">
        <a className="story-link" href="/story" aria-label="Storytelling">
          <Clapperboard />
          <b>Storytelling</b>
        </a>
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
