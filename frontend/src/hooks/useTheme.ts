import { useLayoutEffect, useState } from 'react';

const THEME_KEY = 'cubspace-theme';

export function useTheme() {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) === 'dark';
    } catch {
      return false;
    }
  });
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    try {
      localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
    } catch {
      // Theme selection still works when browser storage is unavailable.
    }
  }, [dark]);
  return { dark, toggle: () => setDark((value) => !value) };
}
