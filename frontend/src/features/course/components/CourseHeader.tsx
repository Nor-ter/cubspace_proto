import { useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { BrandLogo } from '@/components/BrandLogo';
import type { Course, PageId } from '@/types/course';
import { NAV } from '../data';

export function CourseHeader({ course }: { course: Course }) {
  const [menu, setMenu] = useState(false);
  const { dark, toggle } = useTheme();
  const { activePage } = course;
  const activeIndex = NAV.findIndex(([id]) => id === activePage);

  function go(id: PageId) {
    course.go(id);
    setMenu(false);
  }

  return (
    <header className="topbar">
      <button
        className="brand"
        onClick={() => go('start')}
        aria-label="CubSpace onboarding, back to Start"
      >
        <BrandLogo />
        <strong>CubSpace</strong>
        <small>ACRUX-II ONBOARDING</small>
      </button>
      <nav
        id="course-menu"
        className={menu ? 'open' : ''}
        aria-label="Onboarding pages"
      >
        <ol className="course-steps">
          {NAV.map(([id, label], index) => (
            <li
              key={id}
              className={
                index <= activeIndex ? 'course-step linked' : 'course-step'
              }
            >
              <button
                className={id === activePage ? 'active' : ''}
                onClick={() => go(id)}
                aria-current={id === activePage ? 'step' : undefined}
              >
                <span className="step-marker">{index + 1}</span>
                {label}
              </button>
            </li>
          ))}
        </ol>
      </nav>
      <button
        className="theme-toggle"
        onClick={toggle}
        aria-label="Dark mode"
        aria-pressed={dark}
        title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {dark ? <Sun /> : <Moon />}
        <span>{dark ? 'On' : 'Off'}</span>
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
    </header>
  );
}
