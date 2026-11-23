import { useEffect, useState } from 'react';
import cubspaceLogo from '@/assets/cubspace-logo.png';
import mspLogo from '@/assets/msp-logo-wordmark-light.png';
import { TypewriterText } from '@/components/TypewriterText';
import { Starfield } from '@/features/intro/components/Starfield';
import { navigate } from '@/lib/navigate';
import { loadHomePage } from '@/pages/loadHomePage';
import '@/features/intro/Intro.css';

/** Start → course: the stars go to warp, then the screen fades out. */
const HANDOFF_MS = 1100;
const TITLE = 'ACRUX-II';

// One screen in deep space: the two marks at the top, "ACRUX-II" in the
// middle with a glow breathing behind it, and a round engine-start button
// below. Pressing it sends the stars to warp and opens the course.
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

      {/* Melbourne Space Program × CubSpace, the × on the centre line. */}
      <header className="intro-marks">
        <img
          className="intro-mark-msp"
          src={mspLogo}
          alt="Melbourne Space Program"
        />
        <span className="intro-mark-x" aria-hidden="true">
          ×
        </span>
        <span className="intro-mark-cubspace">
          <img src={cubspaceLogo} alt="" />
          <strong>CubSpace</strong>
        </span>
      </header>

      <h1 className="intro-stage">
        {/* Floats as one piece: the typed title and a light sweeping over it. */}
        <span className="intro-title">
          <TypewriterText text={TITLE} />
          <span className="intro-title-shine" aria-hidden="true">
            {TITLE}
          </span>
        </span>
      </h1>

      {/* Engine-start style: metal rim, silver face, halo; green when pressed. */}
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
    </main>
  );
}
