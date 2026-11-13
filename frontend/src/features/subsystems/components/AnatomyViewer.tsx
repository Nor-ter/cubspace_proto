import { useEffect, useRef, useState } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { renderDrawing } from '../viewer/drawing';
import { ASSEMBLIES, PARTS } from '../viewer/model';
import { createScene, type ModelScene } from '../viewer/scene';
import type { Selection, SubsystemId } from '../viewer/types';
import './AnatomyViewer.css';

type View = '3d' | 'drawing';

// Selecting a subsystem separates a closed assembly so its parts show
// (the standalone explorer's behaviour).
const SELECT_SEPARATION = 0.78;
const HINT_3D = 'Drag to rotate · Scroll to zoom';
const HINT_DRAWING = 'Isometric drawing · Select a part';

// The CubeSat_Anatomy 3D model in a React shell. The scene is built the first
// time the page opens and paused while it is hidden. Without WebGL the same
// geometry is shown as an isometric drawing.
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
  const drawing = useRef<HTMLDivElement>(null);
  const scene = useRef<ModelScene | null>(null);
  const onSelectRef = useRef(onSelect);
  const [hasWebgl, setHasWebgl] = useState(true);
  const [view, setView] = useState<View>('3d');
  const [separation, setSeparation] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [drawingZoom, setDrawingZoom] = useState(1);
  const showDrawing = view === 'drawing' || !hasWebgl;

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

  // Parts in the drawing carry their subsystem; a click selects it.
  useEffect(() => {
    const element = drawing.current;
    if (!element) return;
    const onClick = (event: MouseEvent) => {
      const node = (event.target as Element).closest<SVGElement>(
        '[data-subsystem]',
      );
      if (node?.dataset.subsystem)
        onSelectRef.current(node.dataset.subsystem as SubsystemId);
    };
    element.addEventListener('click', onClick);
    return () => element.removeEventListener('click', onClick);
  }, [showDrawing]);

  useEffect(() => {
    scene.current?.setSelection(selected);
  }, [selected]);

  useEffect(() => {
    scene.current?.setExplode(separation);
  }, [separation]);

  // Opening a subsystem pulls the assembly apart so its parts are visible.
  const [lastSelected, setLastSelected] = useState(selected);
  if (lastSelected !== selected) {
    setLastSelected(selected);
    if (selected !== 'all' && separation < 0.7)
      setSeparation(SELECT_SEPARATION);
  }

  function zoom(factor: number) {
    if (showDrawing)
      setDrawingZoom((value) => Math.max(0.7, Math.min(3, value * factor)));
    else scene.current?.zoom(factor);
  }
  function reset() {
    scene.current?.reset();
    setDrawingZoom(1);
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
      <div className="viewer-bar">
        <fieldset className="viewer-switch">
          <legend className="sr-only">View</legend>
          <button
            aria-pressed={!showDrawing}
            disabled={!hasWebgl}
            onClick={() => setView('3d')}
          >
            3D model
          </button>
          <button aria-pressed={showDrawing} onClick={() => setView('drawing')}>
            Drawing
          </button>
        </fieldset>
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
      </div>

      {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- keyboard surface for the model */}
      <div
        className="viewer-stage"
        // The stage is the keyboard surface for the model: arrows rotate,
        // +/- zoom, E separates, R resets (as in the standalone explorer).
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        role="application"
        aria-label={
          showDrawing
            ? 'Isometric CubeSat drawing. Select a part to open its subsystem. E separates the assembly, R resets.'
            : 'CubeSat 3D model. Drag to rotate, scroll to zoom. Arrow keys rotate, plus and minus zoom, E separates the assembly, R resets, Escape shows the whole spacecraft.'
        }
        onKeyDown={onKeyDown}
      >
        <div ref={host} className="viewer-webgl" hidden={showDrawing} />
        {showDrawing && (
          <div
            ref={drawing}
            className="viewer-drawing"
            style={{ '--drawing-zoom': drawingZoom } as React.CSSProperties}
            // The drawing is an SVG string generated from our own model data.
            dangerouslySetInnerHTML={{
              __html: renderDrawing(PARTS, ASSEMBLIES, separation, selected),
            }}
          />
        )}
        <p className="viewer-hint" aria-hidden="true">
          {hint ?? (showDrawing ? HINT_DRAWING : HINT_3D)}
        </p>
        {!hasWebgl && (
          <p className="viewer-fallback">
            3D is unavailable in this browser. The drawing shows the same parts
            and still responds to selection.
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
