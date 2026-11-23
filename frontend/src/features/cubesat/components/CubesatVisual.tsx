import { useEffect, useId, useRef, useState } from 'react';
import { ORBIT_PRESETS, type OrbitReadout } from '../viewer/orbit';
import { VISUAL_ITEMS } from '../viewer/visuals';
import type { createVisual } from '../viewer/createVisual';
import './CubesatVisual.css';

export function CubesatVisual({
  kind,
  preview = false,
}: {
  kind: string;
  preview?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const instance = useRef<ReturnType<typeof createVisual> | null>(null);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(0);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(
    () => !matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const playingRef = useRef(playing);
  const [orbitReadout, setOrbitReadout] = useState<OrbitReadout | null>(null);
  const isOrbit = kind === 'earth-orbits';
  const id = useId();
  const items = VISUAL_ITEMS[kind] ?? [];
  useEffect(() => {
    playingRef.current = playing;
    instance.current?.setPlaying(playing);
  }, [playing]);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let scheduled = 0;
    const checkViewport = () => {
      const rect = element.getBoundingClientRect();
      setVisible(
        element.getClientRects().length > 0 &&
          rect.bottom >= 0 &&
          rect.top <= innerHeight,
      );
    };
    const schedule = () => {
      cancelAnimationFrame(scheduled);
      scheduled = requestAnimationFrame(checkViewport);
    };
    const observer = new IntersectionObserver(schedule);
    observer.observe(element);
    addEventListener('scroll', schedule, { passive: true, capture: true });
    addEventListener('resize', schedule);
    schedule();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(scheduled);
      removeEventListener('scroll', schedule, true);
      removeEventListener('resize', schedule);
    };
  }, []);
  useEffect(() => {
    if (!visible || !host.current || failed) return;
    let cancelled = false;
    void import('../viewer/createVisual')
      .then(({ createVisual }) => {
        if (cancelled || !host.current) return;
        try {
          instance.current = createVisual(
            host.current,
            kind,
            selected,
            preview,
            setSelected,
            setOrbitReadout,
          );
          instance.current.setPlaying(playingRef.current);
          setReady(true);
        } catch {
          host.current.replaceChildren();
          setFailed(true);
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      instance.current?.dispose();
      instance.current = null;
    };
  }, [kind, selected, preview, visible, failed]);
  return (
    <div className={`cubesat-visual ${preview ? 'is-preview' : ''}`}>
      <div
        ref={host}
        className="cubesat-visual-canvas"
        role={preview ? 'img' : 'group'}
        aria-label={`Educational 3D diagram: ${kind.replaceAll('-', ' ')}. ${preview ? '' : 'Drag to rotate; use the controls below to zoom or select an item.'}`}
      >
        {!ready && !failed && (
          <span className="cubesat-visual-status">Loading 3D view…</span>
        )}
        {failed && (
          <span className="cubesat-visual-status">
            3D is unavailable. Explore the items below.
          </span>
        )}
      </div>
      {!preview && (
        <>
          {isOrbit && (
            <div
              className="cubesat-orbit-readout"
              aria-label="Simulated CubeSat altitude"
            >
              <div className="cubesat-orbit-definition">
                <span>{ORBIT_PRESETS[selected].definitionLabel}</span>
                <strong>
                  {ORBIT_PRESETS[selected].definitionValue}{' '}
                  <small>{ORBIT_PRESETS[selected].definitionUnit}</small>
                </strong>
                <span>{ORBIT_PRESETS[selected].definitionNote}</span>
                <a
                  className="cubesat-orbit-source"
                  href={ORBIT_PRESETS[selected].source}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read NASA reference &#8599;
                </a>
              </div>
              <div>
                <span>Simulated 1U altitude (example)</span>
                <strong>
                  {(
                    orbitReadout?.altitudeKm ??
                    ORBIT_PRESETS[selected].altitudeKm
                  ).toLocaleString('en-US', { maximumFractionDigits: 1 })}{' '}
                  <small>km</small>
                </strong>
                <span>
                  Above Earth surface - Model inclination:{' '}
                  {ORBIT_PRESETS[selected].inclinationDeg}&deg;
                </span>
              </div>
              <div>
                <span>Orbit position</span>
                <strong>
                  {Math.floor(orbitReadout?.angleDeg ?? 0)}
                  <small>&deg;</small>
                </strong>
                <span>{playing ? 'Moving' : 'Paused'}</span>
              </div>
            </div>
          )}
          <div
            className="cubesat-visual-controls"
            aria-label="3D view controls"
          >
            {isOrbit && (
              <button
                type="button"
                aria-pressed={playing}
                onClick={() => setPlaying((value) => !value)}
              >
                {playing ? 'Pause orbit' : 'Play orbit'}
              </button>
            )}
            <button type="button" onClick={() => instance.current?.zoom(0.8)}>
              Zoom +
            </button>
            <button type="button" onClick={() => instance.current?.zoom(1.25)}>
              Zoom −
            </button>
            <button type="button" onClick={() => instance.current?.reset()}>
              Reset view
            </button>
          </div>
          <fieldset className="cubesat-visual-items" aria-label="Diagram items">
            {items.map((item, index) => (
              <button
                type="button"
                key={item.label}
                aria-pressed={index === selected}
                aria-controls={id}
                onClick={() => setSelected(index)}
              >
                {item.label}
              </button>
            ))}
          </fieldset>
          <p id={id} className="cubesat-visual-description" aria-live="polite">
            {items[selected]?.detail}
          </p>
          <p className="cubesat-visual-note">
            {isOrbit
              ? 'The orbit definition is separate from the simulated satellite altitude. Circular examples keep constant altitude. GEO matches Earth rotation; the Sun-sync plane precesses. One model orbit takes 24 seconds; spacecraft size and orbit spacing are exaggerated. Green line: altitude above the surface. This is not live tracking.'
              : 'Educational schematic. Dimensions are illustrative. Drag to rotate; select an item to explore.'}
          </p>
        </>
      )}
    </div>
  );
}
