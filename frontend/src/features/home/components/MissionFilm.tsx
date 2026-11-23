import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import {
  FILM_CHAPTERS,
  FILM_SECONDS,
  FILM_START,
  chapterIndexAt,
  createMissionFilm,
} from '../film';
import { createSway } from '../sway';
import './HomeSection.css';

// The mission animation, on About. The timeline's stations are the
// mission's steps: clicking one loops that step's part of the animation.
// "Watch full" launches the rocket and plays it all through.
type Phase = 'ready' | 'countdown' | 'launching' | 'film' | 'ended';

// Lift-off is cued just before the rocket clears the pad.
const LIFT_OFF_CUE = -0.4;

const TITLE_EXIT_MS = 2400;

export function MissionFilm() {
  const hostRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef(FILM_START);
  const playingRef = useRef(false);
  // The step being previewed, looped; null while the whole film plays.
  const segmentRef = useRef<{ start: number; end: number } | null>(null);
  const [phase, setPhase] = useState<Phase>('ready');
  const phaseRef = useRef<Phase>('ready');
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  const [playing, setPlaying] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [failed, setFailed] = useState(false);
  const [reducedMotion] = useState(
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  function play(value: boolean) {
    playingRef.current = value;
    setPlaying(value);
  }
  function launch() {
    segmentRef.current = null;
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
      const segment = segmentRef.current;
      if (playingRef.current && segment) {
        timeRef.current += dt;
        if (timeRef.current >= segment.end) timeRef.current = segment.start;
      } else if (playingRef.current) {
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
      film.render(time, {
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

  // Scrolled back up until the film has left the screen: put the rocket back
  // on the pad.
  useEffect(() => {
    const film = filmRef.current;
    if (!film) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const gone = !entry.isIntersecting && entry.boundingClientRect.top > 0;
        if (!gone || phaseRef.current === 'ready') return;
        segmentRef.current = null;
        timeRef.current = FILM_START;
        play(false);
        phaseRef.current = 'ready';
        setPhase('ready');
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
    segmentRef.current = null;
    timeRef.current = 0;
    setPhase('film');
    play(true);
  }
  // Loop one step: from its station to the next one.
  function preview(index: number) {
    const start = FILM_CHAPTERS[index].at;
    const end = FILM_CHAPTERS[index + 1]?.at ?? FILM_SECONDS;
    if (segmentRef.current?.start === start) return;
    segmentRef.current = { start, end };
    timeRef.current = start;
    setPhase('film');
    play(true);
  }

  return (
    <div ref={filmRef} className="start-film" data-phase={phase}>
      <div ref={hostRef} className="start-canvas" />

      {/* On the empty title screen: what to do. Fades once anything plays. */}
      {!failed && (
        <p className="start-hint" aria-hidden={phase !== 'ready'}>
          Click a step below to see it,
          <br />
          or watch the full animation.
        </p>
      )}

      {failed && (
        <ol className="start-fallback" aria-label="Mission animation chapters">
          {FILM_CHAPTERS.map((item) => (
            <li key={item.name}>
              <strong>{item.name}</strong> {item.caption}
            </li>
          ))}
        </ol>
      )}

      {!failed && (
        <div className="start-deck" aria-hidden={phase === 'countdown'}>
          <div className="start-caption" aria-live="polite">
            <p>{FILM_CHAPTERS[chapter].caption}</p>
          </div>
          <div className="start-controls">
            <button
              className="start-tool"
              // On the title screen there is nothing to resume: launch.
              onClick={() =>
                phase === 'ended'
                  ? replay()
                  : phase === 'ready'
                    ? launch()
                    : play(!playing)
              }
              aria-label={
                playing ? 'Pause the animation' : 'Play the animation'
              }
            >
              {playing ? <Pause /> : <Play />}
            </button>
            <button className="start-full" onClick={launch}>
              <Play /> Watch full
            </button>
          </div>
          <div className="start-timeline" ref={progressRef}>
            <ol
              style={
                {
                  '--count': FILM_CHAPTERS.length,
                } as React.CSSProperties
              }
            >
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
                    onClick={() => preview(index)}
                    aria-current={index === chapter ? 'step' : undefined}
                  >
                    <span className="start-station" aria-hidden="true">
                      {index + 1}
                    </span>
                    <span className="start-step-name">{item.name}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {phase === 'ended' && (
        <div className="start-end">
          <p>First contact made. Your onboarding starts here.</p>
          <div className="start-actions">
            <button className="secondary" onClick={replay}>
              <RotateCcw /> Watch again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
