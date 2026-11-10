import type { ComponentType } from 'react';
import { AdminPage } from '@/pages/AdminPage';
import { HomePage } from '@/pages/HomePage';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

const ROUTES: Record<string, ComponentType> = {
  '/': HomePage,
  '/admin': AdminPage,
};

export function App() {
  useSmoothScroll();
  const path = location.pathname.replace(/\/+$/, '') || '/';
  const Page = ROUTES[path] ?? HomePage;
  return <Page />;
}
