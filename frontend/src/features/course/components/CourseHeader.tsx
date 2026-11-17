import { useEffect, useRef, useState } from 'react';
import { Check, Menu, X } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import type { Course, PageId } from '@/types/course';
import { lockScroll } from '@/lib/smoothScroll';
import { NAV } from '../data';

// Every step is open and numbered. The open step is shown by the inverted
// .active background; the quiz step shows a tick once the quiz is passed.
export function CourseHeader({ course }: { course: Course }) {
  const [menu, setMenu] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  // An open menu closes on a press anywhere outside the header, or on Escape.
  useEffect(() => {
    if (!menu) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenu(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenu(false);
    };
    // The page behind the open menu stays put.
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = 'hidden';
    lockScroll(true);
    addEventListener('pointerdown', onPointerDown);
    addEventListener('keydown', onKeyDown);
    return () => {
      removeEventListener('pointerdown', onPointerDown);
      removeEventListener('keydown', onKeyDown);
      root.style.overflow = overflow;
      lockScroll(false);
    };
  }, [menu]);
  const { activePage, quizPassed } = course;
  // A page change by any route (Back, a pager link) closes the menu.
  const [menuPage, setMenuPage] = useState(activePage);
  if (menuPage !== activePage) {
    setMenuPage(activePage);
    setMenu(false);
  }
  function go(id: PageId) {
    course.go(id);
    setMenu(false);
  }
  return (
    <header ref={headerRef} className="topbar">
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
        data-lenis-prevent
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
                  {isDone && (
                    <span className="step-marker" aria-hidden="true">
                      <Check />
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
