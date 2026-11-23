import { useEffect, useState } from 'react';
import { CUBESAT_PAGES } from '@/features/cubesat/data';
import { scrollToY } from '@/lib/smoothScroll';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Course } from '@/types/course';
import { COPYRIGHT, NAV } from '../data';

export function CoursePager({ course }: { course: Course }) {
  const { activePage, go } = course;
  const readSubpage = () => new URLSearchParams(location.search).get('cubesat');
  const [subpage, setSubpage] = useState(readSubpage);
  useEffect(() => {
    const sync = () => setSubpage(readSubpage());
    addEventListener('popstate', sync);
    return () => removeEventListener('popstate', sync);
  }, []);
  const subpageIndex =
    activePage === 'acrux'
      ? CUBESAT_PAGES.findIndex(
          (page) => page.id === (subpage === 'mass' ? 'formats' : subpage),
        )
      : -1;
  const nextSubpage = CUBESAT_PAGES[subpageIndex + 1];
  function openSubpage(id?: string) {
    const url = new URL(location.href);
    if (id) url.searchParams.set('cubesat', id);
    else url.searchParams.delete('cubesat');
    url.hash = 'acrux';
    history.pushState(null, '', url);
    dispatchEvent(new PopStateEvent('popstate'));
    scrollToY(0, true);
  }
  const index = NAV.findIndex(([id]) => id === activePage);
  const previous = NAV[index - 1];
  const next = NAV[index + 1];
  // Start is one screen with its own Explore button and copyright.
  if (activePage === 'home') return null;
  // Previous and Next at the ends, the copyright centred between them.
  return (
    <footer className="course-pager">
      <nav className="pager-nav" aria-label="Lesson navigation">
        {subpageIndex >= 0 ? (
          <button className="pager-link" onClick={() => openSubpage()}>
            <ChevronLeft />
            <span>
              <small>Back to</small>
              <strong>CubeSat gallery</strong>
            </span>
          </button>
        ) : (
          previous && (
            <button className="pager-link" onClick={() => go(previous[0])}>
              <ChevronLeft />
              <span>
                <small>Previous</small>
                <strong>{previous[1]}</strong>
              </span>
            </button>
          )
        )}
        {subpageIndex >= 0 ? (
          <button
            className="pager-link pager-next"
            onClick={() => openSubpage(nextSubpage?.id)}
          >
            <span>
              <small>{nextSubpage ? 'Next' : 'Back to'}</small>
              <strong>{nextSubpage?.title ?? 'CubeSat gallery'}</strong>
            </span>
            <ChevronRight />
          </button>
        ) : (
          next && (
            <button
              className="pager-link pager-next"
              onClick={() => go(next[0])}
            >
              <span>
                <small>Next</small>
                <strong>{next[1]}</strong>
              </span>
              <ChevronRight />
            </button>
          )
        )}
      </nav>
      <p className="pager-copyright">{COPYRIGHT}</p>
    </footer>
  );
}
