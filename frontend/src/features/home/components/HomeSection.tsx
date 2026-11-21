import { useEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { RevealText } from '@/components/RevealText';
import { cameFromIntro } from '@/lib/navigate';
import { COPYRIGHT } from '@/features/course/data';
import type { Course } from '@/types/course';
import { FILM_START, createMissionFilm } from '../film';
import { createSway } from '../sway';
import './HomeSection.css';

// Start: the title over the Earth. The mission film is on About.
export function HomeSection({ course }: { course: Course }) {
  const isActive = course.activePage === 'home';
  return (
    <section
      id="home"
      tabIndex={-1}
      className={`start-section page-view ${isActive ? 'active' : ''}`}
    >
      {/* The scene exists only while Start is open. */}
      {isActive && <StartOpening onContinue={() => course.go('about')} />}
    </section>
  );
}

function StartOpening({ onContinue }: { onContinue: () => void }) {
  const openingRef = useRef<HTMLDivElement>(null);
  const openingHostRef = useRef<HTMLDivElement>(null);
  // From the intro's Start, the scene fades up out of the intro's dissolve.
  const [arriving] = useState(cameFromIntro);
  const [reducedMotion] = useState(
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  // An Earth-only view, drawn while on screen.
  useEffect(() => {
    const panel = openingRef.current;
    const host = openingHostRef.current;
    if (!panel || !host) return;
    let film: ReturnType<typeof createMissionFilm> | null = null;
    try {
      film = createMissionFilm(host);
    } catch {
      // Without WebGL the title stays on the plain ground.
    }
    let visible = true;
    let frame = 0;
    let previous = performance.now();
    const sway = createSway(reducedMotion);
    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      const dt = Math.min((now - previous) / 1000, 0.1);
      previous = now;
      if (visible)
        film?.render(FILM_START, {
          ...sway.step(now, dt, true),
          earthOnly: true,
        });
    };
    frame = requestAnimationFrame(draw);
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: '-76px 0px 0px 0px' },
    );
    observer.observe(panel);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      sway.dispose();
      film?.dispose();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={openingRef}
      className={arriving ? 'start-opening is-arriving' : 'start-opening'}
    >
      <div ref={openingHostRef} className="start-canvas" />
      <div className="start-title">
        <h1>
          <RevealText>MSP</RevealText>
          <br />
          <RevealText startIndex={1}>ACRUX-II</RevealText>
          <br />
          <em>
            <RevealText startIndex={2}>Onboarding</RevealText>
          </em>
        </h1>
        <div className="start-actions">
          <button className="primary" onClick={onContinue}>
            Explore <ChevronRight />
          </button>
        </div>
      </div>
      <p className="start-copyright">{COPYRIGHT}</p>
    </div>
  );
}
