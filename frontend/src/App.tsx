import { OnboardingPage } from '@/pages/OnboardingPage';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

export function App() {
  useSmoothScroll();
  return <OnboardingPage />;
}
