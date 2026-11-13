import { useEffect, useState } from 'react';
import type { Course, PageId, QuizSection } from '@/types/course';
import { scrollToY } from '@/lib/smoothScroll';
import { NAV, PROGRESS_STORAGE_KEY, QUIZ_ORDER } from '../data';

const isQuizSection = (id: unknown): id is QuizSection =>
  QUIZ_ORDER.includes(id as QuizSection);

export function useCourse() {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [completed, setCompleted] = useState<QuizSection[]>([]);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetGeneration, setResetGeneration] = useState(0);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    queueMicrotask(() =>
      setAdminMode(new URLSearchParams(location.search).get('admin') === '1'),
    );
  }, []);
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const saved = JSON.parse(
          localStorage.getItem(PROGRESS_STORAGE_KEY) || '[]',
        );
        if (Array.isArray(saved)) setCompleted(saved.filter(isQuizSection));
      } catch {}
      setProgressLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!progressLoaded) return;
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(completed));
    } catch {
      queueMicrotask(() => setStorageError(true));
    }
  }, [completed, progressLoaded]);
  useEffect(() => {
    const syncFromHash = () => {
      const requested = location.hash.slice(1) || 'home';
      const quizIndex = QUIZ_ORDER.indexOf(requested as QuizSection);
      const unlocked =
        requested === 'home' ||
        requested === 'mission' ||
        adminMode ||
        (quizIndex > 0 && completed.includes(QUIZ_ORDER[quizIndex - 1]));
      const page = NAV.find(([id]) => id === requested)?.[0];
      if (page && unlocked) setActivePage(page);
    };
    syncFromHash();
    addEventListener('popstate', syncFromHash);
    return () => removeEventListener('popstate', syncFromHash);
  }, [completed, adminMode]);

  function isUnlocked(id: PageId) {
    if (adminMode) return true;
    if (id === 'home' || id === 'mission') return true;
    const index = QUIZ_ORDER.indexOf(id);
    return index > 0 && completed.includes(QUIZ_ORDER[index - 1]);
  }
  function go(id: PageId) {
    if (!isUnlocked(id)) return;
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
  function passQuiz(id: QuizSection) {
    setCompleted((v) => (v.includes(id) ? v : [...v, id]));
  }
  function resetFrom(id: QuizSection) {
    const index = QUIZ_ORDER.indexOf(id);
    setCompleted((v) => v.filter((item) => QUIZ_ORDER.indexOf(item) < index));
  }
  function resetAll() {
    setCompleted([]);
    try {
      localStorage.removeItem(PROGRESS_STORAGE_KEY);
    } catch {
      setStorageError(true);
    }
    setResetGeneration((v) => v + 1);
    setResetOpen(false);
    go('mission');
  }

  const course: Course = {
    activePage,
    completed,
    adminMode,
    resetGeneration,
    isUnlocked,
    go,
    passQuiz,
    resetFrom,
    requestReset: () => setResetOpen(true),
  };
  return { course, storageError, resetOpen, setResetOpen, resetAll };
}
