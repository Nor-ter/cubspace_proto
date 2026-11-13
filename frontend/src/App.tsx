import { lazy, Suspense, useEffect, useState, type ComponentType } from 'react';
import { AdminPage } from '@/pages/AdminPage';
import { IntroPage } from '@/pages/IntroPage';

// three.js and KaTeX stay out of the intro bundle
const HomePage = lazy(() =>
  import('@/pages/HomePage').then((m) => ({ default: m.HomePage })),
);
const StoryPage = lazy(() =>
  import('@/pages/StoryPage').then((m) => ({ default: m.StoryPage })),
);
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { ROUTE_CHANGE } from '@/lib/navigate';

const ROUTES: Record<string, ComponentType> = {
  '/': IntroPage,
  '/app': HomePage,
  '/admin': AdminPage,
  '/story': StoryPage,
};

const currentPath = () => location.pathname.replace(/\/+$/, '') || '/';

export function App() {
  useSmoothScroll();
  const [path, setPath] = useState(currentPath);
  useEffect(() => {
    const sync = () => setPath(currentPath());
    addEventListener(ROUTE_CHANGE, sync);
    addEventListener('popstate', sync);
    return () => {
      removeEventListener(ROUTE_CHANGE, sync);
      removeEventListener('popstate', sync);
    };
  }, []);
  const Page = ROUTES[path] ?? IntroPage;
  return (
    <Suspense fallback={null}>
      <Page key={path} />
    </Suspense>
  );
}
