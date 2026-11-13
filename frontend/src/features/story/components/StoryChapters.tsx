import type { RefObject } from 'react';
import { STORY_CHAPTERS, type StoryChapter } from '../data';

export function StoryChapters({
  activeChapter,
  chaptersRef,
  onSelect,
}: {
  activeChapter: StoryChapter;
  chaptersRef: RefObject<HTMLElement | null>;
  onSelect: (chapter: StoryChapter) => void;
}) {
  return (
    <nav
      ref={chaptersRef}
      className="story-chapters"
      aria-label="Story chapters"
    >
      {STORY_CHAPTERS.map(([id, label]) => (
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
