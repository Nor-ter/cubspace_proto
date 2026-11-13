import type { RefObject } from 'react';
import { NAV } from '@/features/course/data';
import type { PageId } from '@/types/course';

export function StoryChapters({
  activeChapter,
  chaptersRef,
  onSelect,
}: {
  activeChapter: PageId;
  chaptersRef: RefObject<HTMLElement | null>;
  onSelect: (chapter: PageId) => void;
}) {
  return (
    <nav ref={chaptersRef} className="story-chapters" aria-label="Story chapters">
      {NAV.map(([id, label]) => (
        <button
          key={id}
          className={id === activeChapter ? 'active' : ''}
          aria-current={id === activeChapter ? 'step' : undefined}
          onClick={() => onSelect(id)}
        >
          <i data-chapter={id} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
