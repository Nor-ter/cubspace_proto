import { useRef, useState } from 'react';
import { X } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { StoryChapters } from '@/features/story/components/StoryChapters';
import { StoryPanel } from '@/features/story/components/StoryPanel';
import { StoryStage } from '@/features/story/components/StoryStage';
import { STORY_SCENES } from '@/features/story/data';
import { useStoryScroll } from '@/features/story/hooks/useStoryScroll';

export function StoryPage() {
  const { activeIndex, chaptersRef, frameRef, goToChapter, registerSection } =
    useStoryScroll(STORY_SCENES);
  const [missionPhase, setMissionPhase] = useState(0);
  const [missionReplay, setMissionReplay] = useState(0);
  const captionRef = useRef<HTMLParagraphElement>(null);

  function selectMissionPhase(phase: number) {
    setMissionPhase(phase);
    setMissionReplay((count) => count + 1);
  }

  return (
    <main className="story-page">
      <StoryStage
        scenes={STORY_SCENES}
        frameRef={frameRef}
        activeIndex={activeIndex}
        missionPhase={missionPhase}
        missionReplay={missionReplay}
        captionRef={captionRef}
      />
      <header className="story-top">
        <a className="story-brand" href="/app">
          <BrandLogo />
          <strong>CubSpace</strong>
        </a>
        <a className="story-close" href="/app" aria-label="Close storytelling">
          <X />
        </a>
      </header>
      {STORY_SCENES.map((scene, index) => (
        <StoryPanel
          key={scene.id}
          scene={scene}
          isFirst={index === 0}
          isActive={index === activeIndex}
          sectionRef={(element) => registerSection(index, element)}
          missionPhase={missionPhase}
          missionReplay={missionReplay}
          onSelectMissionPhase={selectMissionPhase}
          captionRef={captionRef}
        />
      ))}
      <StoryChapters
        activeChapter={STORY_SCENES[activeIndex].chapter}
        chaptersRef={chaptersRef}
        onSelect={goToChapter}
      />
    </main>
  );
}
