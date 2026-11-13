import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { scrollToElement } from '@/lib/smoothScroll';
import { STORY_CHAPTERS, type StoryChapter, type StoryScene } from '../data';

export type StoryFrame = { index: number; blend: number };
export type StoryFrameRef = RefObject<StoryFrame>;

const TRANSITION_START = 0.5;
const ACTIVE_AT = 0.8;

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);

function smoothstep(value: number) {
  const t = clamp((value - TRANSITION_START) / (1 - TRANSITION_START));
  return t * t * (3 - 2 * t);
}

export function useStoryScroll(scenes: readonly StoryScene[]) {
  const sectionsRef = useRef<HTMLElement[]>([]);
  const chaptersRef = useRef<HTMLElement>(null);
  const frameRef = useRef<StoryFrame>({ index: 0, blend: 0 });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let tops: number[] = [];
    let maxScroll = 1;

    function measure() {
      tops = sectionsRef.current.map(
        (section) => section.getBoundingClientRect().top + window.scrollY,
      );
      maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    }

    function update() {
      const y = window.scrollY;
      let index = tops.length - 1;
      while (index > 0 && y < tops[index]) index -= 1;
      const next = tops[index + 1] ?? maxScroll;
      const progress =
        next > tops[index]
          ? clamp((y - tops[index]) / (next - tops[index]))
          : 0;
      const isLast = index === tops.length - 1;
      frameRef.current = { index, blend: isLast ? 0 : smoothstep(progress) };
      setActiveIndex(!isLast && progress > ACTIVE_AT ? index + 1 : index);

      const fills =
        chaptersRef.current?.querySelectorAll<HTMLElement>('[data-chapter]');
      fills?.forEach((fill, chapterIndex) => {
        const first = scenes.findIndex(
          (scene) => scene.chapter === STORY_CHAPTERS[chapterIndex][0],
        );
        const nextChapter = STORY_CHAPTERS[chapterIndex + 1]?.[0];
        const nextFirst = scenes.findIndex(
          (scene) => scene.chapter === nextChapter,
        );
        const end = nextFirst >= 0 ? tops[nextFirst] : maxScroll;
        fill.style.setProperty(
          '--fill',
          String(clamp((y - tops[first]) / (end - tops[first]))),
        );
      });
    }

    function remeasure() {
      measure();
      update();
    }

    remeasure();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', remeasure);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', remeasure);
    };
  }, [scenes]);

  function registerSection(index: number, element: HTMLElement | null) {
    if (element) sectionsRef.current[index] = element;
  }

  function goToChapter(chapter: StoryChapter) {
    const section =
      sectionsRef.current[
        scenes.findIndex((scene) => scene.chapter === chapter)
      ];
    if (section) scrollToElement(section);
  }

  return { activeIndex, chaptersRef, frameRef, goToChapter, registerSection };
}
