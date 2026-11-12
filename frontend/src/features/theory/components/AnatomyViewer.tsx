import { useEffect, useRef, useState } from 'react';
import { ASSEMBLIES, PARTS } from '../viewer/model';
import { createScene, type ModelScene } from '../viewer/scene';
import type { Selection, SubsystemId } from '../viewer/types';

export function AnatomyViewer({
  selected,
  exploded,
  resetKey,
  onSelect,
}: {
  selected: Selection;
  exploded: boolean;
  /** Change this value to return the camera to its starting view. */
  resetKey: number;
  onSelect: (id: SubsystemId) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ModelScene | null>(null);
  const hoverRef = useRef<HTMLParagraphElement>(null);
  const selectRef = useRef(onSelect);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    selectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let scene: ModelScene;
    try {
      scene = createScene(host, PARTS, ASSEMBLIES, {
        onSelect: (id) => selectRef.current(id),
        onHover: (text) => {
          if (hoverRef.current) hoverRef.current.textContent = text ?? '';
        },
        onFrame: () => {},
        onFailure: () => setFailed(true),
      });
    } catch {
      queueMicrotask(() => setFailed(true));
      return;
    }
    scene.setRotate(true);
    sceneRef.current = scene;
    return () => {
      sceneRef.current = null;
      scene.dispose();
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.setSelection(selected);
  }, [selected]);
  useEffect(() => {
    sceneRef.current?.setExplode(exploded ? 1 : 0);
  }, [exploded]);
  useEffect(() => {
    if (resetKey) sceneRef.current?.reset();
  }, [resetKey]);

  return (
    <figure
      className="anatomy-viewer"
      aria-label="Educational 1U CubeSat 3D model. Drag to rotate, scroll to zoom, select a part to open its subsystem."
    >
      <div className="anatomy-canvas" ref={hostRef} />
      <p className="anatomy-hover" ref={hoverRef} aria-hidden="true" />
      {failed && (
        <p className="anatomy-failed">
          The 3D model cannot be displayed in this browser. Use the subsystem
          buttons to read each team’s brief.
        </p>
      )}
    </figure>
  );
}
