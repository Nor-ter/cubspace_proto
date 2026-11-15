import {
  lazy,
  startTransition,
  Suspense,
  useEffect,
  useState,
  type ComponentType,
} from 'react';
import { AdminPage } from '@/pages/AdminPage';
import { IntroPage } from '@/pages/IntroPage';
import { loadHomePage } from '@/pages/loadHomePage';

// three.js and KaTeX stay out of the intro bundle
const HomePage = lazy(() =>
  loadHomePage().then((m) => ({ default: m.HomePage })),
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
    // A transition keeps the current page on screen until the next one is
    // ready, so a lazy page never flashes the bare background grid.
    const sync = () => startTransition(() => setPath(currentPath()));
    addEventListener(ROUTE_CHANGE, sync);
    addEventListener('popstate', sync);
    return () => {
      removeEventListener(ROUTE_CHANGE, sync);
      removeEventListener('popstate', sync);
    };
  }, []);
  const Page = ROUTES[path] ?? IntroPage;
  return (
    <Suspense fallback={<div className="route-fallback" aria-hidden="true" />}>
      <Page key={path} />
    </Suspense>
  );
}
