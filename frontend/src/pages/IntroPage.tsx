import { useEffect, useRef, useState } from 'react';
import { BrandLogo } from '@/components/BrandLogo';
import { TypewriterText } from '@/components/TypewriterText';
import { useIntroStage } from '@/features/intro/hooks/useIntroStage';
import { HANDOFF_STAGE, INTRO_STAGES } from '@/features/intro/stages';
import { StoryStage } from '@/features/story/components/StoryStage';
import { navigate } from '@/lib/navigate';
import { loadHomePage } from '@/pages/loadHomePage';
import '@/features/intro/Intro.css';

/** Start → course: camera move, then dissolve. */
const HANDOFF_MS = 1100;

export function IntroPage() {
  const { frameRef, active, holdAt } = useIntroStage();
  const [leaving, setLeaving] = useState(false);
  const captionRef = useRef<HTMLParagraphElement>(null);
  // Fetch the course while the intro is on screen, so it opens with no blank gap.
  useEffect(() => {
    void loadHomePage();
  }, []);

  // Start: the words clear, the camera drops to Earth's limb and the scene
  // dissolves into the course's launch pad, which fades in from the same dark.
  function start() {
    if (leaving) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      navigate('/app');
      return;
    }
    setLeaving(true);
    holdAt(HANDOFF_STAGE);
    setTimeout(() => navigate('/app', { fromIntro: true }), HANDOFF_MS);
  }

  return (
    <main className={leaving ? 'intro is-leaving' : 'intro'}>
      <StoryStage
        scenes={INTRO_STAGES}
        frameRef={frameRef}
        activeIndex={active}
        missionPhase={0}
        missionReplay={0}
        captionRef={captionRef}
      />
      <div className="intro-veil" aria-hidden="true" />
      <header className="intro-top">
        <span className="intro-brand">
          <BrandLogo />
          <strong>CubSpace</strong>
        </span>
      </header>

      <section className="intro-hero" data-intro-section>
        <div className="intro-hero-copy">
          <p className="intro-kicker">
            <TypewriterText text="CUBSPACE" />
          </p>
          <h1>
            <span className="intro-line-1">
              <TypewriterText text="ACRUX-II" />
            </span>
            <span className="intro-line-2">
              <TypewriterText text="Engineer" start={8} />
              <br />
              <TypewriterText text="Onboarding" start={16} />
            </span>
          </h1>
        </div>
      </section>

      {/* Engine-start style: metal rim, red face, neon halo. */}
      <button
        className="intro-start"
        onClick={start}
        aria-label="Start onboarding"
      >
        <span className="intro-start-halo" aria-hidden="true" />
        <span className="intro-start-rim" aria-hidden="true">
          <span className="intro-start-face">
            <small>Engine</small>
            <strong>Start</strong>
            <small>Onboarding</small>
          </span>
        </span>
      </button>
    </main>
  );
}
