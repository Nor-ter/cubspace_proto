import { Fragment, useEffect, useRef, useState } from 'react';
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
  type FilmView,
} from '../film';
import './HomeSection.css';

// The opening shows the title over the Earth. Once it has scrolled fully out
// of view, a short countdown closes in on the rocket in the film below and the
// launch plays.
type Phase = 'ready' | 'countdown' | 'launching' | 'film' | 'ended';

// Lift-off is cued just before the rocket clears the pad.
const LIFT_OFF_CUE = -0.4;

const TITLE_EXIT_MS = 2400;

const FILM_TITLE = 'ACRUX-II: from launch to first contact';
// The rocket reaches the film title about this long after lift-off is cued;
// the letters nearest its path break first.
const SHATTER_DELAY_S = 0.5;

// A repeatable 0..1 value per letter, so the burst looks random but is the
// same on every launch.
const jitter = (n: number) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

// While Start waits, the camera drifts slowly from side to side and leans
// towards the pointer, so Earth moves with it while the stars turn the other
// way. All of it settles before the countdown.
const SWAY_WORLD = 0.16;
const SWAY_PERIOD_S = 9;
/** Camera reach towards the pointer at the screen edge, world units. */
const POINTER_SIDE = 0.34;
const POINTER_LIFT = 0.14;
/** Star-field turn at the screen edge, radians. */
const POINTER_STARS = 0.06;
/** How quickly the view catches up with the pointer, per second. */
const POINTER_EASE = 3;

// Pointer parallax for one scene. `step` eases towards the pointer and returns
// the camera nudge; `active` false fades the sway out.
function createSway(reducedMotion: boolean) {
  let amount = reducedMotion ? 0 : 1;
  const target = { x: 0, y: 0 };
  const eased = { x: 0, y: 0 };
  const onMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    target.x = (event.clientX / innerWidth) * 2 - 1;
    target.y = (event.clientY / innerHeight) * 2 - 1;
  };
  const onLeave = () => {
    target.x = 0;
    target.y = 0;
  };
  if (!reducedMotion) {
    addEventListener('pointermove', onMove);
    document.documentElement.addEventListener('pointerleave', onLeave);
  }
  return {
    step(now: number, dt: number, active: boolean): FilmView {
      amount +=
        ((active && !reducedMotion ? 1 : 0) - amount) * Math.min(dt * 2, 1);
      const follow = Math.min(dt * POINTER_EASE, 1);
      eased.x += (target.x - eased.x) * follow;
      eased.y += (target.y - eased.y) * follow;
      const drift =
        SWAY_WORLD * Math.sin(((now / 1000) * Math.PI * 2) / SWAY_PERIOD_S);
      return {
        side: amount * (drift + eased.x * POINTER_SIDE),
        lift: amount * -eased.y * POINTER_LIFT,
        stars: [
          amount * eased.x * POINTER_STARS,
          amount * eased.y * POINTER_STARS * 0.6,
        ],
      };
    },
    dispose() {
      removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    },
  };
}

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
  const openingRef = useRef<HTMLDivElement>(null);
  const openingHostRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
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
  const filmTitleRef = useRef<HTMLHeadingElement>(null);
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
    const sway = createSway(reducedMotion);
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
      const ready = phaseRef.current === 'ready';
      const telemetry = film.render(time, {
        ...sway.step(now, dt, ready),
        earthOnly: ready,
      });
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
      sway.dispose();
      film.dispose();
    };
  }, [reducedMotion]);

  // Opening: its own Earth-only view, drawn while on screen. The launch starts
  // once the whole opening has scrolled up past the fixed 76px header.
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
    // Start ends with the film, so at the bottom of the page the opening only
    // just touches the header line and still counts as intersecting; launch
    // once less than 1% of it is left on screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.intersectionRatio > 0;
        const scrolledPast =
          entry.intersectionRatio < 0.01 && entry.boundingClientRect.top < 0;
        if (scrolledPast && phaseRef.current === 'ready') launch();
      },
      { rootMargin: '-76px 0px 0px 0px', threshold: [0, 0.01] },
    );
    observer.observe(panel);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      sway.dispose();
      film?.dispose();
    };
  }, [reducedMotion]);

  // At lift-off the rocket punches up through the film title: each letter is
  // flung away from the rocket's path (the title's centre line) and upward,
  // spinning and fading, the nearest letters first.
  useEffect(() => {
    const title = filmTitleRef.current;
    if (phase !== 'launching' || !title || reducedMotion) return;
    const box = title.getBoundingClientRect();
    const middle = box.left + box.width / 2;
    title.querySelectorAll<HTMLElement>('.shard').forEach((shard, i) => {
      const rect = shard.getBoundingClientRect();
      const side = (rect.left + rect.width / 2 - middle) / (box.width / 2);
      const away = Math.sign(side) || (jitter(i) < 0.5 ? -1 : 1);
      const reach = Math.abs(side);
      shard.style.setProperty(
        '--dx',
        `${away * (40 + reach * 180 + jitter(i) * 80)}px`,
      );
      shard.style.setProperty('--dy', `${-(50 + jitter(i + 7) * 170)}px`);
      shard.style.setProperty('--rot', `${(jitter(i + 13) - 0.5) * 300}deg`);
      shard.style.setProperty('--delay', `${SHATTER_DELAY_S + reach * 0.3}s`);
    });
    title.classList.add('is-shattering');
  }, [phase, reducedMotion]);

  // Scrolled back up until the film has left the screen: put the rocket back
  // on the pad and the title back together, so the next scroll down launches
  // it again from the start.
  useEffect(() => {
    const film = filmRef.current;
    if (!film) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const gone = !entry.isIntersecting && entry.boundingClientRect.top > 0;
        if (!gone || phaseRef.current === 'ready') return;
        timeRef.current = FILM_START;
        play(false);
        phaseRef.current = 'ready';
        setPhase('ready');
        filmTitleRef.current?.classList.remove('is-shattering');
      },
      { rootMargin: '-76px 0px 0px 0px' },
    );
    observer.observe(film);
    return () => observer.disconnect();
  }, []);

  // A moment after lift-off, the film controls come in.
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
    <>
      <div
        ref={openingRef}
        className={arriving ? 'start-opening is-arriving' : 'start-opening'}
      >
        <div ref={openingHostRef} className="start-canvas" />
        <div className="start-title">
          <h1>
            <RevealText>MSP</RevealText>
            <br />
            <span className="start-title-mission">
              <RevealText startIndex={1}>ACRUX-II</RevealText>
            </span>
            <br />
            <em>
              <RevealText startIndex={2}>Onboarding:</RevealText>
            </em>
          </h1>
          <div className="start-actions">
            <button className="primary" onClick={onContinue}>
              Explore <ChevronRight />
            </button>
          </div>
        </div>
      </div>

      <div ref={filmRef} className="start-film" data-phase={phase}>
        <div ref={hostRef} className="start-canvas" />

        {/* Names the film while the rocket waits; it shatters at lift-off. */}
        <div
          className="start-film-title"
          aria-hidden={phase !== 'ready' && phase !== 'countdown'}
        >
          <p>MISSION SEQUENCE</p>
          {/* One span per letter, kept in words so lines still wrap whole
              words; the letters are what shatters at lift-off. */}
          <h2 ref={filmTitleRef} aria-label={FILM_TITLE}>
            {FILM_TITLE.split(' ').map((word, w, words) => (
              <Fragment key={w}>
                <span className="shard-word" aria-hidden="true">
                  {word.split('').map((char, c) => (
                    <span key={c} className="shard">
                      {char}
                    </span>
                  ))}
                </span>
                {/* A new line after "ACRUX-II:". */}
                {word.endsWith(':') ? <br /> : w < words.length - 1 && ' '}
              </Fragment>
            ))}
          </h2>
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
              Conceptual sequence, not to scale. B-dot reduces body rotation,
              not orbital speed.
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
    </>
  );
}
