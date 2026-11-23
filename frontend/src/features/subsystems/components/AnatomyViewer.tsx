import { useEffect, useRef, useState } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { ASSEMBLIES, PARTS } from '../viewer/model';
import { createScene, type ModelScene } from '../viewer/scene';
import type { Selection, SubsystemId } from '../viewer/types';
import { SubsystemPicker } from './SubsystemPanel';
import './AnatomyViewer.css';

// Selecting a subsystem separates a closed assembly so its parts show
// (the standalone explorer's behaviour).
const SELECT_SEPARATION = 0.78;
const HINT_3D = 'Drag to rotate · Scroll to zoom';

// The CubeSat_Anatomy 3D model in a React shell. The scene is built the first
// time the page opens and paused while it is hidden.
export function AnatomyViewer({
  active,
  selected,
  onSelect,
}: {
  active: boolean;
  selected: Selection;
  onSelect: (id: Selection) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<ModelScene | null>(null);
  const onSelectRef = useRef(onSelect);
  const [hasWebgl, setHasWebgl] = useState(true);
  const [separation, setSeparation] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const recoveryAttempts = useRef(0);
  // Keep the original 3D model and recover from temporary renderer failures.
  const showDrawing = !hasWebgl;

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  // Build the scene the first time the page is opened.
  useEffect(() => {
    if (!active || scene.current || !hasWebgl || !host.current) return;
    try {
      scene.current = createScene(host.current, PARTS, ASSEMBLIES, {
        onSelect: (id: SubsystemId) => onSelectRef.current(id),
        onHover: (text) => setHint(text),
        onFailure: () => setHasWebgl(false),
      });
    } catch {
      host.current.replaceChildren();
      queueMicrotask(() => setHasWebgl(false));
    }
  }, [active, hasWebgl]);

  useEffect(
    () => () => {
      scene.current?.dispose();
      scene.current = null;
    },
    [],
  );

  useEffect(() => {
    scene.current?.setActive(active && !showDrawing);
  }, [active, showDrawing]);

  // Recreate a lost context instead of leaving the model in a drawing mode.
  useEffect(() => {
    if (hasWebgl) return;
    scene.current?.dispose();
    scene.current = null;
    if (!active || recoveryAttempts.current >= 2) return;
    const timer = window.setTimeout(() => {
      recoveryAttempts.current += 1;
      setHasWebgl(true);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [active, hasWebgl]);

  useEffect(() => {
    scene.current?.setSelection(selected);
  }, [selected, hasWebgl]);

  useEffect(() => {
    scene.current?.setExplode(separation);
  }, [separation, hasWebgl]);

  // Opening a subsystem pulls the assembly apart so its parts are visible.
  const [lastSelected, setLastSelected] = useState(selected);
  if (lastSelected !== selected) {
    setLastSelected(selected);
    if (selected !== 'all' && separation < 0.7)
      setSeparation(SELECT_SEPARATION);
  }

  function zoom(factor: number) {
    scene.current?.zoom(factor);
  }
  function reset() {
    scene.current?.reset();
  }

  function onKeyDown(event: React.KeyboardEvent) {
    const key = event.key.toLowerCase();
    const handled = [
      'arrowleft',
      'arrowright',
      'arrowup',
      'arrowdown',
      '+',
      '=',
      '-',
      'e',
      'r',
      'escape',
    ];
    if (!handled.includes(key)) return;
    event.preventDefault();
    if (!showDrawing) {
      if (key === 'arrowleft') scene.current?.orbit(-0.12, 0);
      if (key === 'arrowright') scene.current?.orbit(0.12, 0);
      if (key === 'arrowup') scene.current?.orbit(0, -0.12);
      if (key === 'arrowdown') scene.current?.orbit(0, 0.12);
    }
    if (key === '+' || key === '=') zoom(1.18);
    if (key === '-') zoom(1 / 1.18);
    if (key === 'e') setSeparation((value) => (value > 0.5 ? 0 : 1));
    if (key === 'r') reset();
    if (key === 'escape') onSelect('all');
  }

  const percent = Math.round(separation * 100);
  return (
    <div className="anatomy-viewer">
      {/* Subsystem buttons float down the right edge of the stage. */}
      <SubsystemPicker selected={selected} onSelect={onSelect} />

      {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- keyboard surface for the model */}
      <div
        className="viewer-stage"
        // The stage is the keyboard surface for the model: arrows rotate,
        // +/- zoom, E separates, R resets (as in the standalone explorer).
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        role="application"
        aria-label="CubeSat 3D model. Drag to rotate, scroll to zoom. Arrow keys rotate, plus and minus zoom, E separates the assembly, R resets, Escape shows the whole spacecraft."
        onKeyDown={onKeyDown}
      >
        <div ref={host} className="viewer-webgl" hidden={showDrawing} />
        {/* Zoom and reset, bottom right of the stage. */}
        <div className="viewer-tools">
          <button
            className="viewer-tool"
            onClick={() => zoom(1 / 1.18)}
            aria-label="Zoom out"
          >
            <Minus />
          </button>
          <button
            className="viewer-tool"
            onClick={() => zoom(1.18)}
            aria-label="Zoom in"
          >
            <Plus />
          </button>
          <button
            className="viewer-tool"
            onClick={reset}
            aria-label="Reset view"
          >
            <RotateCcw />
          </button>
        </div>
        <p className="viewer-hint" aria-hidden="true">
          {hint ?? HINT_3D}
        </p>
        {!hasWebgl && (
          <p className="viewer-fallback">
            Restoring the CubeSat 3D model.
            <button
              onClick={() => {
                recoveryAttempts.current = 0;
                setHasWebgl(true);
              }}
            >
              Reload 3D model
            </button>
          </p>
        )}
      </div>

      <div className="viewer-pose">
        <fieldset className="viewer-switch">
          <legend className="sr-only">Assembly</legend>
          <button
            aria-pressed={separation === 0}
            onClick={() => setSeparation(0)}
          >
            Assembled
          </button>
          <button
            aria-pressed={separation === 1}
            onClick={() => setSeparation(1)}
          >
            Exploded
          </button>
        </fieldset>
        <label className="viewer-range">
          <span>Separation</span>
          <input
            type="range"
            min={0}
            max={100}
            value={percent}
            aria-valuetext={
              percent === 0 ? 'Fully assembled' : `${percent} percent separated`
            }
            onChange={(event) =>
              setSeparation(Number(event.target.value) / 100)
            }
          />
          <output>{percent}%</output>
        </label>
      </div>
    </div>
  );
}
