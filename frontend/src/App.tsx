import { useEffect, useState, type ComponentType } from 'react';
import { AdminPage } from '@/pages/AdminPage';
import { HomePage } from '@/pages/HomePage';
import { IntroPage } from '@/pages/IntroPage';
import { StoryPage } from '@/pages/StoryPage';
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
  return <Page key={path} />;
}
