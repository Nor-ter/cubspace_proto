import { useEffect, useRef, useState } from 'react';
import { ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import { RevealText } from '@/components/RevealText';
import { cameFromIntro } from '@/lib/navigate';
import type { Course } from '@/types/course';
import {
  FILM_CHAPTERS,
  FILM_SECONDS,
  FILM_START,
  chapterIndexAt,
  createMissionFilm,
} from '../film';
import './HomeSection.css';

// The opening holds on the launch pad under the title until the learner
// presses "Watch the launch". A short countdown then closes in on the rocket;
// at lift-off it pushes the title away and the film takes over the page.
type Phase = 'ready' | 'countdown' | 'launching' | 'film' | 'ended';

// The title starts to leave just before the rocket clears the pad.
const LIFT_OFF_CUE = -0.4;

const TITLE_EXIT_MS = 2400;

// While Start waits on the pad, the camera drifts slowly from side to side,
// so Earth and the rocket rock gently. It settles before the countdown.
const SWAY_WORLD = 0.16;
const SWAY_PERIOD_S = 9;

// Mission clock: T− counts down on the pad, T+ runs from lift-off.
const clock = (time: number) => {
  const seconds = Math.floor(Math.abs(time));
  const sign = time < 0 ? 'T−' : 'T+';
  return `${sign} ${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
};

export function HomeSection({ course }: { course: Course }) {
  const isActive = course.activePage === 'home';
  return (
    <section
      id="home"
      tabIndex={-1}
      className={`start-section page-view ${isActive ? 'active' : ''}`}
    >
      {/* The film exists only while Start is open; leaving resets it. */}
      {isActive && <StartFilm onContinue={() => course.go('about')} />}
    </section>
  );
}

function StartFilm({ onContinue }: { onContinue: () => void }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef(FILM_START);
  const playingRef = useRef(false);
  const [phase, setPhase] = useState<Phase>('ready');
  const phaseRef = useRef<Phase>('ready');
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  const [playing, setPlaying] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [failed, setFailed] = useState(false);
  // From the intro's Start, the scene fades up out of the intro's dissolve.
  const [arriving] = useState(cameFromIntro);
  const [reducedMotion] = useState(
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  function play(value: boolean) {
    playingRef.current = value;
    setPlaying(value);
  }
  function launch() {
    timeRef.current = FILM_START;
    play(true);
    setPhase('countdown');
  }

  // Render loop: the film draws the frame for the current time every frame.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let film: ReturnType<typeof createMissionFilm>;
    try {
      film = createMissionFilm(host);
    } catch {
      queueMicrotask(() => setFailed(true));
      return;
    }
    let frame = 0;
    let previous = performance.now();
    let shownChapter = 0;
    let swayAmount = reducedMotion ? 0 : 1;
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min((now - previous) / 1000, 0.1);
      previous = now;
      if (playingRef.current) {
        timeRef.current = Math.min(timeRef.current + dt, FILM_SECONDS);
        if (timeRef.current >= FILM_SECONDS) {
          playingRef.current = false;
          setPlaying(false);
          setPhase('ended');
        }
      }
      const time = timeRef.current;
      if (phaseRef.current === 'countdown' && time >= LIFT_OFF_CUE) {
        phaseRef.current = 'launching';
        setPhase('launching');
      }
      const swayTarget = phaseRef.current === 'ready' && !reducedMotion ? 1 : 0;
      swayAmount += (swayTarget - swayAmount) * Math.min(dt * 2, 1);
      const sway =
        swayAmount *
        SWAY_WORLD *
        Math.sin(((now / 1000) * Math.PI * 2) / SWAY_PERIOD_S);
      const telemetry = film.render(time, sway);
      // The timeline spaces chapters evenly, so progress runs station to
      // station: whole chapters passed plus the share of the current one.
      const at = chapterIndexAt(time);
      const start = FILM_CHAPTERS[at].at;
      const end = FILM_CHAPTERS[at + 1]?.at ?? FILM_SECONDS;
      const progress = Math.min(
        Math.max(
          (at + (time - start) / (end - start)) / (FILM_CHAPTERS.length - 1),
          0,
        ),
        1,
      );
      progressRef.current?.style.setProperty('--progress', String(progress));
      if (clockRef.current) clockRef.current.textContent = clock(time);
      if (readoutRef.current) {
        const text = telemetry.linked
          ? 'LINK · Command ↑ / Telemetry ↓'
          : telemetry.bodyRate === null
            ? 'ACRUX-II stowed in deployer'
            : `BODY RATE · ${telemetry.bodyRate.toFixed(1)} °/s (illustrative)`;
        if (readoutRef.current.textContent !== text)
          readoutRef.current.textContent = text;
      }
      if (at !== shownChapter) {
        shownChapter = at;
        setChapter(at);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      film.dispose();
    };
  }, [reducedMotion]);

  // Once the title has gone, the film controls come in.
  useEffect(() => {
    if (phase !== 'launching') return;
    const timer = setTimeout(
      () => setPhase('film'),
      reducedMotion ? 0 : TITLE_EXIT_MS,
    );
    return () => clearTimeout(timer);
  }, [phase, reducedMotion]);

  function replay() {
    timeRef.current = 0;
    setPhase('film');
    play(true);
  }
  function seek(time: number) {
    timeRef.current = time;
    setPhase('film');
  }

  const current = FILM_CHAPTERS[chapter];
  return (
    <div
      className={arriving ? 'start-film is-arriving' : 'start-film'}
      data-phase={phase}
    >
      <div ref={hostRef} className="start-canvas" />

      <div
        className="start-title"
        aria-hidden={phase !== 'ready' && phase !== 'countdown'}
      >
        <h1>
          <RevealText>MSP Onboarding:</RevealText>{' '}
          <em>
            <RevealText startIndex={2}>Start your first assignment.</RevealText>
          </em>
        </h1>
        <div className="start-actions">
          <button className="primary" onClick={onContinue}>
            Explore <ChevronRight />
          </button>
          {!failed && (
            <button className="secondary" onClick={launch}>
              <Play /> Watch the launch
            </button>
          )}
        </div>
      </div>

      {failed && (
        <ol className="start-fallback" aria-label="Mission film chapters">
          {FILM_CHAPTERS.map((item) => (
            <li key={item.name}>
              <strong>{item.name}</strong> {item.caption}
            </li>
          ))}
        </ol>
      )}

      {!failed && (
        <div
          className="start-deck"
          aria-hidden={phase === 'ready' || phase === 'countdown'}
        >
          <div className="start-caption" aria-live="polite">
            <p className="start-chapter">
              <span>{current.name}</span>
              <span ref={readoutRef} className="start-readout" />
            </p>
            <p>{current.caption}</p>
          </div>
          <div className="start-controls">
            <button
              className="start-tool"
              onClick={() => (phase === 'ended' ? replay() : play(!playing))}
              aria-label={playing ? 'Pause the film' : 'Play the film'}
            >
              {playing ? <Pause /> : <Play />}
            </button>
            <button
              className="start-tool"
              onClick={replay}
              aria-label="Replay from the launch"
            >
              <RotateCcw />
            </button>
            <span className="start-clock" ref={clockRef}>
              T− 00:03
            </span>
            <div className="start-timeline" ref={progressRef}>
              <ol>
                {FILM_CHAPTERS.map((item, index) => (
                  <li
                    key={item.name}
                    className={
                      index === chapter
                        ? 'is-current'
                        : index < chapter
                          ? 'is-past'
                          : undefined
                    }
                  >
                    <button
                      onClick={() => seek(item.at)}
                      aria-current={index === chapter ? 'step' : undefined}
                    >
                      <span className="start-station" aria-hidden="true" />
                      {item.name}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
            <button className="start-next" onClick={onContinue}>
              <span>
                <small>Next</small>
                <strong>About</strong>
              </span>
              <ChevronRight />
            </button>
          </div>
          <p className="start-note">
            Conceptual sequence, not to scale. B-dot reduces body rotation, not
            orbital speed.
          </p>
        </div>
      )}

      {phase === 'ended' && (
        <div className="start-end">
          <p>First contact made. Your onboarding starts here.</p>
          <div className="start-actions">
            <button className="primary" onClick={onContinue}>
              Continue to About <ChevronRight />
            </button>
            <button className="secondary" onClick={replay}>
              <RotateCcw /> Watch again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
