import { useState } from 'react';
import { Check, Clapperboard, Menu, X } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import type { Course, PageId } from '@/types/course';
import { NAV } from '../data';

// Every step is open and numbered. The open step carries the dot; the quiz
// step shows a tick once the quiz is passed.
export function CourseHeader({ course }: { course: Course }) {
  const [menu, setMenu] = useState(false);
  const { activePage, quizPassed } = course;
  function go(id: PageId) {
    course.go(id);
    setMenu(false);
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
            const isActive = activePage === id;
            const isDone = id === 'quiz' && quizPassed;
            return (
              <li key={id} className="course-step linked">
                <button
                  className={isActive ? 'active' : ''}
                  onClick={() => go(id)}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={isDone ? `${label}, passed` : label}
                  title={label}
                >
                  {(isActive || isDone) && (
                    <span className="step-marker" aria-hidden="true">
                      {isActive ? <span className="step-origin" /> : <Check />}
                    </span>
                  )}
                  <span className="step-number" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {label}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
      <div className="top-status">
        <a
          className="story-link"
          href="/story"
          aria-label="Storytelling"
          title="Storytelling"
        >
          <Clapperboard />
          <b>Storytelling</b>
        </a>
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
