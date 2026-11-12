import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import '@/styles/global.css';
import '@/styles/pages.css';
import '@/styles/start.css';
import '@/styles/theory.css';
import '@/styles/brand.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
