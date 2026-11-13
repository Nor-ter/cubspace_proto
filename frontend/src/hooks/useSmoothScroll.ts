import { useEffect } from 'react';
import { startSmoothScroll, stopSmoothScroll } from '@/lib/smoothScroll';

export function useSmoothScroll() {
  useEffect(() => {
    startSmoothScroll();
    return stopSmoothScroll;
  }, []);
}
