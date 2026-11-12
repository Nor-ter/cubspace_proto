import type { PageId } from '@/types/course';

/** Page order follows Standup-NOV-WK2 §C.2 (pages 1–6). */
export const NAV: readonly (readonly [PageId, string])[] = [
  ['start', 'Start'],
  ['about', 'About'],
  ['acrux', 'ACRUX-II'],
  ['theory', 'Theory'],
  ['mission-tree', 'Mission Tree'],
  ['launch', 'Launch'],
];

export const PROGRESS_STORAGE_KEY = 'cubspace-onboarding-progress-v2_1';
