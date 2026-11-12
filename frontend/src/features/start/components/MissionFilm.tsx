import { useEffect, useRef, useState } from 'react';
import { ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import {
  FILM_CHAPTERS,
  FILM_SECONDS,
  chapterIndexAt,
  createMissionFilm,
} from '../film';

const clock = (time: number) =>
  `T+ ${String(Math.floor(time / 60)).padStart(2, '0')}:${String(Math.floor(time % 60)).padStart(2, '0')}`;

export function MissionFilm({
  onEnded,
  onContinue,
}: {
  onEnded: () => void;
  onContinue: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const seekRef = useRef<HTMLInputElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef(0);
  const playingRef = useRef(false);
  const endedRef = useRef(onEnded);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    endedRef.current = onEnded;
  }, [onEnded]);

  function play(value: boolean) {
    playingRef.current = value;
    setPlaying(value);
  }

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
    // The film starts by itself; reduced-motion visitors start it themselves.
    const autoplay = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    playingRef.current = autoplay;
    queueMicrotask(() => setPlaying(autoplay));

    let frame = 0;
    let previous = performance.now();
    let shownChapter = 0;
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min((now - previous) / 1000, 0.1);
      previous = now;
      if (playingRef.current) {
        timeRef.current = Math.min(timeRef.current + dt, FILM_SECONDS);
        if (timeRef.current >= FILM_SECONDS) {
          playingRef.current = false;
          setPlaying(false);
          setEnded(true);
          endedRef.current();
        }
      }
      const time = timeRef.current;
      const telemetry = film.render(time);
      const seek = seekRef.current;
      if (seek) {
        seek.value = String(time);
        seek.style.setProperty('--progress', `${(time / FILM_SECONDS) * 100}%`);
        seek.setAttribute('aria-valuetext', clock(time));
      }
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
      const index = chapterIndexAt(time);
      if (index !== shownChapter) {
        shownChapter = index;
        setChapter(index);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      film.dispose();
    };
  }, []);

  function replay() {
    timeRef.current = 0;
    setEnded(false);
    play(true);
  }
  function toggle() {
    if (ended) replay();
    else play(!playing);
  }
  function seek(value: number) {
    timeRef.current = value;
    if (value < FILM_SECONDS) setEnded(false);
  }

  const current = FILM_CHAPTERS[chapter];
  return (
    <div className={ended ? 'film is-ended' : 'film'}>
      <div
        className="film-canvas"
        ref={hostRef}
        onClick={toggle}
        role="presentation"
      />
      <div className={chapter === 0 ? 'film-title' : 'film-title is-quiet'}>
        <p className="eyebrow">CUBSPACE / ACRUX-II ONBOARDING</p>
        <h1>From launch to first contact.</h1>
        <p>
          One continuous look at the first hours of a 1U CubeSat mission. This
          is what your team is building towards.
        </p>
      </div>
      {failed && (
        <ol className="film-fallback">
          {FILM_CHAPTERS.map((item) => (
            <li key={item.name}>
              <strong>{item.name}</strong>
              {item.caption}
            </li>
          ))}
        </ol>
      )}
      {ended && (
        <div className="film-end">
          <button className="button button-primary" onClick={onContinue}>
            Continue to About <ChevronRight />
          </button>
          <button className="button" onClick={replay}>
            <RotateCcw /> Replay
          </button>
        </div>
      )}
      <div className="film-deck">
        <div className="film-caption" aria-live="polite">
          <p className="film-chapter">
            <span>
              {String(chapter + 1).padStart(2, '0')} /{' '}
              {String(FILM_CHAPTERS.length).padStart(2, '0')}
            </span>
            {current.name}
          </p>
          <p>{current.caption}</p>
        </div>
        <div className="film-controls">
          <button
            className="film-button"
            onClick={toggle}
            aria-label={
              ended ? 'Replay film' : playing ? 'Pause film' : 'Play film'
            }
          >
            {ended ? <RotateCcw /> : playing ? <Pause /> : <Play />}
          </button>
          <button
            className="film-button"
            onClick={replay}
            aria-label="Replay from the start"
          >
            <RotateCcw />
          </button>
          <span className="film-clock" ref={clockRef}>
            {clock(0)}
          </span>
          <div className="film-timeline">
            <input
              ref={seekRef}
              type="range"
              min={0}
              max={FILM_SECONDS}
              step={0.01}
              defaultValue={0}
              aria-label="Film position"
              onInput={(event) => seek(Number(event.currentTarget.value))}
            />
            <ol aria-hidden="true">
              {FILM_CHAPTERS.map((item, index) => (
                <li
                  key={item.name}
                  className={index === chapter ? 'active' : ''}
                  style={{ left: `${(item.at / FILM_SECONDS) * 100}%` }}
                >
                  {item.name}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <p className="film-note">
          <span ref={readoutRef} />
          <span>Conceptual sequence · not to scale · timing compressed</span>
        </p>
      </div>
    </div>
  );
}
