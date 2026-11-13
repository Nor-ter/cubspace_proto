import type { RefObject } from 'react';
import { Play } from 'lucide-react';
import { PhaseProgress } from '@/components/PhaseProgress';
import { RevealText } from '@/components/RevealText';
import type { StoryItem, StoryScene } from '../data';

function ItemText({ item }: { item: StoryItem }) {
  return (
    <>
      {item.code && <span>{item.code}</span>}
      <div>
        <strong>{item.name}</strong>
        {item.detail && <p>{item.detail}</p>}
        {item.note && <small>{item.note}</small>}
      </div>
    </>
  );
}

export function StoryPanel({
  scene,
  isFirst,
  isActive,
  sectionRef,
  missionPhase,
  missionReplay,
  onSelectMissionPhase,
  captionRef,
}: {
  scene: StoryScene;
  isFirst: boolean;
  isActive: boolean;
  sectionRef: (element: HTMLElement | null) => void;
  missionPhase: number;
  missionReplay: number;
  onSelectMissionPhase: (phase: number) => void;
  captionRef: RefObject<HTMLParagraphElement | null>;
}) {
  const Heading = isFirst ? 'h1' : 'h2';
  const titleWords = scene.title.split(' ').length;
  const isMission = scene.stage.mission;
  return (
    <section
      ref={sectionRef}
      className={`story-scene story-${scene.side}${isActive ? ' is-active' : ''}`}
      style={{ height: `${scene.length}vh` }}
    >
      <div className="story-sticky">
        {isMission && (
          <p className="story-caption" ref={captionRef} aria-live="polite" />
        )}
        <div className="story-panel">
          <p className="story-eyebrow">{scene.eyebrow}</p>
          <Heading>
            <RevealText>{scene.title}</RevealText>
            {scene.titleAccent && (
              <>
                {' '}
                <span className="story-accent">
                  <RevealText
                    startIndex={titleWords}
                    highlightWord={scene.highlightWord}
                  >
                    {scene.titleAccent}
                  </RevealText>
                </span>
              </>
            )}
          </Heading>
          <div className="story-copy">
            {scene.body && <p>{scene.body}</p>}
            {scene.items && (
              <ol className="story-items">
                {scene.items.map((item, index) => (
                  <li key={item.name}>
                    {isMission ? (
                      <button
                        className={`story-phase${index === missionPhase ? ' is-selected' : ''}`}
                        aria-pressed={index === missionPhase}
                        onClick={() => onSelectMissionPhase(index)}
                      >
                        <ItemText item={item} />
                        <Play />
                        {index === missionPhase && (
                          <PhaseProgress
                            key={`${missionReplay}-${isActive}`}
                            phase={index}
                          />
                        )}
                      </button>
                    ) : (
                      <ItemText item={item} />
                    )}
                  </li>
                ))}
              </ol>
            )}
            {scene.isFinal && (
              <a className="story-cta" href="/app">
                Start onboarding
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
