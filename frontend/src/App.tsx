import type { ComponentType } from 'react';
import { AdminPage } from '@/pages/AdminPage';
import { HomePage } from '@/pages/HomePage';
import { StoryPage } from '@/pages/StoryPage';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

const ROUTES: Record<string, ComponentType> = {
  '/': HomePage,
  '/admin': AdminPage,
  '/story': StoryPage,
};

export function App() {
  useSmoothScroll();
  const path = location.pathname.replace(/\/+$/, '') || '/';
  const Page = ROUTES[path] ?? HomePage;
  return <Page />;
}
