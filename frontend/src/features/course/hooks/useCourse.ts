import { useEffect, useState } from 'react';
import type { Course, PageId, Progress } from '@/types/course';
import { scrollToY } from '@/lib/smoothScroll';
import { NAV, PROGRESS_STORAGE_KEY } from '../data';

const EMPTY_PROGRESS: Progress = {
  filmWatched: false,
  quizzesPassed: [],
  team: null,
};

function pageFromHash(): PageId {
  const requested = location.hash.slice(1);
  return NAV.find(([id]) => id === requested)?.[0] ?? 'start';
}

function loadProgress(): Progress {
  try {
    const saved: unknown = JSON.parse(
      localStorage.getItem(PROGRESS_STORAGE_KEY) ?? 'null',
    );
    if (!saved || typeof saved !== 'object') return EMPTY_PROGRESS;
    const { filmWatched, quizzesPassed, team } = saved as Partial<Progress>;
    return {
      filmWatched: filmWatched === true,
      quizzesPassed: Array.isArray(quizzesPassed)
        ? quizzesPassed.filter((id) => typeof id === 'string')
        : [],
      team: typeof team === 'string' ? team : null,
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function useCourse(): Course {
  const [activePage, setActivePage] = useState<PageId>(pageFromHash);
  const [progress, setProgress] = useState<Progress>(loadProgress);

  useEffect(() => {
    const sync = () => setActivePage(pageFromHash());
    addEventListener('popstate', sync);
    addEventListener('hashchange', sync);
    return () => {
      removeEventListener('popstate', sync);
      removeEventListener('hashchange', sync);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Storage is blocked: progress lasts for this visit only.
    }
  }, [progress]);

  function go(id: PageId) {
    history.pushState(
      null,
      '',
      id === 'start' ? location.pathname + location.search : `#${id}`,
    );
    setActivePage(id);
    scrollToY(0, true);
  }

  return {
    activePage,
    progress,
    go,
    markFilmWatched: () =>
      setProgress((p) => (p.filmWatched ? p : { ...p, filmWatched: true })),
    passQuiz: (id) =>
      setProgress((p) =>
        p.quizzesPassed.includes(id)
          ? p
          : { ...p, quizzesPassed: [...p.quizzesPassed, id] },
      ),
    setTeam: (code) =>
      setProgress((p) => (p.team === code ? p : { ...p, team: code })),
  };
}
