import { useEffect, useState } from 'react';
import type { Course, PageId } from '@/types/course';
import { scrollToY } from '@/lib/smoothScroll';
import { NAV, QUIZ_STORAGE_KEY, readQuizPassed } from '../data';

const pageFromHash = (): PageId | undefined => {
  const requested = location.hash.slice(1) || 'home';
  return NAV.find(([id]) => id === requested)?.[0];
};

// The open page follows the URL hash, so Back and Forward work. Every page is
// open; the only saved progress is whether the quiz was passed.
export function useCourse() {
  const [activePage, setActivePage] = useState<PageId>('home');
  // Client-only SPA (createRoot, no hydration), so reading storage on first render is safe.
  const [quizPassed, setQuizPassed] = useState(readQuizPassed);
  const [quizGeneration, setQuizGeneration] = useState(0);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    const syncFromHash = () => {
      const page = pageFromHash();
      if (page) setActivePage(page);
    };
    syncFromHash();
    addEventListener('popstate', syncFromHash);
    return () => removeEventListener('popstate', syncFromHash);
  }, []);

  function saveQuiz(passed: boolean) {
    setQuizPassed(passed);
    try {
      if (passed) localStorage.setItem(QUIZ_STORAGE_KEY, 'passed');
      else localStorage.removeItem(QUIZ_STORAGE_KEY);
    } catch {
      setStorageError(true);
    }
  }

  function go(id: PageId) {
    history.pushState(
      null,
      '',
      id === 'home'
        ? location.pathname + location.search
        : `${location.search}#${id}`,
    );
    setActivePage(id);
    scrollToY(0, true);
  }

  const course: Course = {
    activePage,
    go,
    quizPassed,
    quizGeneration,
    passQuiz: () => saveQuiz(true),
    resetQuiz: () => {
      saveQuiz(false);
      setQuizGeneration((value) => value + 1);
    },
  };
  return { course, storageError };
}
