import { useEffect, useState } from 'react';
import cubspaceLogo from '@/assets/cubspace-logo.png';
import mspMark from '@/assets/msp-original.png';
import { TypewriterText } from '@/components/TypewriterText';
import { Starfield } from '@/features/intro/components/Starfield';
import { navigate } from '@/lib/navigate';
import { loadHomePage } from '@/pages/loadHomePage';
import '@/features/intro/Intro.css';

/** Start → course: the stars go to warp, then the screen fades out. */
const HANDOFF_MS = 1100;

// One screen in deep space: the two marks at the top, "ACRUX-II" and
// "Ready?" either side of a round engine-start button, a glow breathing
// behind it. Pressing it sends the stars to warp and opens the course.
export function IntroPage() {
  const [leaving, setLeaving] = useState(false);
  // Fetch the course while the intro is on screen, so it opens with no gap.
  useEffect(() => {
    void loadHomePage();
  }, []);

  function start() {
    if (leaving) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      navigate('/app');
      return;
    }
    setLeaving(true);
    setTimeout(() => navigate('/app', { fromIntro: true }), HANDOFF_MS);
  }

  return (
    <main className={leaving ? 'intro is-leaving' : 'intro'}>
      <Starfield warp={leaving} />
      <div className="intro-glow" aria-hidden="true">
        <span />
        <span />
      </div>

      <header className="intro-marks">
        <img
          className="intro-mark-cubspace"
          src={cubspaceLogo}
          alt="CubSpace"
        />
        <span className="intro-mark-msp">
          <img src={mspMark} alt="Melbourne Space Program" />
        </span>
      </header>

      <h1 className="intro-stage">
        <span className="intro-word intro-word-left">
          <TypewriterText text="ACRUX-II" />
        </span>
        <span className="intro-word intro-word-right">
          <TypewriterText text="Ready?" start={8} />
        </span>
      </h1>

      {/* Engine-start style: metal rim, red face, neon halo. */}
      <button
        className="intro-start"
        onClick={start}
        aria-label="Start onboarding"
      >
        <span className="intro-start-halo" aria-hidden="true" />
        <span className="intro-start-rim" aria-hidden="true">
          <span className="intro-start-face">
            <strong>Start</strong>
            <small>Onboarding</small>
          </span>
        </span>
      </button>

      <p className="intro-note">[ACRUX-II ENGINEER ONBOARDING]</p>
    </main>
  );
}
