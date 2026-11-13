import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Maximize,
  Minimize,
  Minus,
  Plus,
  Repeat2,
  RotateCcw,
  X,
} from 'lucide-react';
import {
  CubeSatScene,
  type PickedPart,
  type SceneControls,
} from '@/components/CubeSatScene';
import { EngineeringNotes } from '@/components/EngineeringNotes';
import { LockedPanel } from '@/components/LockedPanel';
import { MiniQuiz } from '@/components/MiniQuiz';
import { RoleIcon } from '@/components/RoleIcon';
import { SectionHead } from '@/components/SectionHead';
import { Status } from '@/components/Status';
import type { Course } from '@/types/course';
import type { SubsystemKey } from '@/types/subsystem';
import { ANATOMY_NOTES, ANATOMY_QUIZ, SUBSYSTEMS } from '../data';
import { AdcsAnatomyFlow } from './AdcsAnatomyFlow';
import { AdcsVectorVisual } from './AdcsVectorVisual';

function FlowBadge({ type }: { type: string }) {
  return (
    <span className={`flow-badge flow-${type.toLowerCase()}`}>{type}</span>
  );
}

export function AnatomySection({ course }: { course: Course }) {
  const { activePage, completed, resetGeneration, isUnlocked } = course;
  const [selected, setSelected] = useState<SubsystemKey>('adcs');
  const [separation, setSeparation] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const [picked, setPicked] = useState<PickedPart | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [notice, setNotice] = useState('');
  const sceneControls = useRef<SceneControls>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useMemo(
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );
  useEffect(() => {
    const sync = () =>
      setFullscreen(document.fullscreenElement === panelRef.current);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await panelRef.current?.requestFullscreen();
    } catch {
      setNotice('Full screen is unavailable in this browser.');
    }
  }
  function pick(part: PickedPart | null) {
    setPicked(part);
    setNotice('');
    const tab = part?.subsystem;
    if (tab && SUBSYSTEMS.some((s) => s.id === tab)) setSelected(tab);
  }
  function selectSubsystem(id: SubsystemKey) {
    setSelected(id);
    setPicked(null);
  }
  const exploded = separation > 0;
  const detail = useMemo(
    () => SUBSYSTEMS.find((s) => s.id === selected) ?? SUBSYSTEMS[0],
    [selected],
  );
  return (
    <section
      id="anatomy"
      tabIndex={-1}
      className={`section dark-section page-view ${activePage === 'anatomy' ? 'active' : ''} ${isUnlocked('anatomy') ? '' : 'locked'}`}
    >
      <SectionHead
        index="02"
        eyebrow="Satellite structure and components"
        title="1U CubeSat Structure Exploration"
        desc="Rotate/zoom the model and select items. Only selected systems are highlighted."
      />
      {!isUnlocked('anatomy') && <LockedPanel previous="mission context" />}
      <div className="anatomy-workspace">
        <div className="model-panel" ref={panelRef}>
          <div className="viewer-stage">
            {activePage === 'anatomy' && (
              <CubeSatScene
                mode="explore"
                selected={selected}
                separation={separation}
                autoRotate={autoRotate && !reducedMotion}
                pickedPart={picked?.name ?? null}
                onPick={pick}
                controlsRef={sceneControls}
              />
            )}
            <div className="viewer-overlay">
              <span className="viewer-hint">
                Drag to rotate · Scroll to zoom · Click a part
              </span>
              <div className="viewer-tools" role="toolbar" aria-label="3D view">
                <button
                  onClick={() => sceneControls.current?.reset()}
                  title="Reset view"
                  aria-label="Reset view"
                >
                  <RotateCcw />
                </button>
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  aria-pressed={autoRotate}
                  disabled={reducedMotion}
                  title={
                    reducedMotion
                      ? 'Auto-rotation is off while reduced motion is preferred'
                      : 'Rotate automatically'
                  }
                  aria-label="Rotate automatically"
                >
                  <Repeat2 />
                </button>
                <span className="viewer-tools-divider" />
                <button
                  onClick={() => sceneControls.current?.zoom(0.8)}
                  title="Zoom in"
                  aria-label="Zoom in"
                >
                  <Plus />
                </button>
                <button
                  onClick={() => sceneControls.current?.zoom(1.25)}
                  title="Zoom out"
                  aria-label="Zoom out"
                >
                  <Minus />
                </button>
                <span className="viewer-tools-divider" />
                <button
                  onClick={toggleFullscreen}
                  title={fullscreen ? 'Exit full screen' : 'Full screen'}
                  aria-label={fullscreen ? 'Exit full screen' : 'Full screen'}
                >
                  {fullscreen ? <Minimize /> : <Maximize />}
                </button>
              </div>
            </div>
          </div>
          <div className="viewer-controls">
            <div className="viewer-row">
              <fieldset className="viewer-segment" aria-label="Assembly state">
                <button
                  aria-pressed={!exploded}
                  className={exploded ? '' : 'active'}
                  onClick={() => setSeparation(0)}
                >
                  Assembled
                </button>
                <button
                  aria-pressed={exploded}
                  className={exploded ? 'active' : ''}
                  onClick={() => setSeparation(1)}
                >
                  Exploded
                </button>
              </fieldset>
              <label className="viewer-slider">
                <span>Separation</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(separation * 100)}
                  onChange={(e) => setSeparation(Number(e.target.value) / 100)}
                />
                <output>{Math.round(separation * 100)}%</output>
              </label>
            </div>
            <p className="viewer-status" aria-live="polite">
              {notice ||
                (picked ? (
                  <>
                    <strong>{picked.label}</strong>
                    {picked.subsystem && (
                      <span className="viewer-status-tag">
                        {picked.subsystem.toUpperCase()}
                      </span>
                    )}
                    <button
                      className="viewer-status-clear"
                      onClick={() => setPicked(null)}
                      aria-label="Clear selected part"
                    >
                      <X />
                    </button>
                  </>
                ) : selected === 'all' ? (
                  'Select a part or choose a subsystem.'
                ) : (
                  `${detail.label} highlighted · other subsystems are greyed out.`
                ))}
            </p>
          </div>
        </div>
        <aside className="inspector">
          <div className="inspector-tabs">
            {SUBSYSTEMS.map((s) => (
              <button
                key={s.id}
                onClick={() => selectSubsystem(s.id)}
                aria-pressed={selected === s.id}
                className={selected === s.id ? 'active' : ''}
              >
                <RoleIcon name={s.id} />
                {s.label}
              </button>
            ))}
          </div>
          <div className="inspector-body">
            <div className="inspector-top">
              <p className="eyebrow">selected model element</p>
              <Status tone={selected === 'adcs' ? 'lime' : 'cyan'}>
                {detail.status}
              </Status>
            </div>
            <h3>{detail.title}</h3>
            <p className="purpose">{detail.purpose}</p>
            <h4>Components and Functions</h4>
            {selected === 'adcs' ? (
              <AdcsAnatomyFlow />
            ) : (
              <div className="chip-row">
                {detail.components.map((x) => (
                  <span key={x}>{x}</span>
                ))}
              </div>
            )}
            <div className="io-grid">
              <div>
                <FlowBadge type="INPUT" />
                <p>{detail.input}</p>
              </div>
              <div>
                <FlowBadge type="OUTPUT" />
                <p>{detail.output}</p>
              </div>
            </div>
            {selected === 'adcs' && (
              <div className="callout">
                <strong>Why learn ADCS first?</strong>
                <p>
                  Immediately after deployment, the spacecraft may be tumbling.
                  ADCS reads the magnetic field and uses the magnetorquer to
                  create torque, reducing angular velocity so stable
                  communication and experiments are possible.
                </p>
              </div>
            )}
            <p className="disclaimer">
              This educational configuration is based on the supplied GLB. It is
              not the approved ACRUX-II CAD or a final design; its scale and
              included parts require SME review.
            </p>
          </div>
        </aside>
      </div>
      <EngineeringNotes
        notes={ANATOMY_NOTES}
        visuals={{ '03': <AdcsVectorVisual /> }}
      />
      <MiniQuiz
        key={`anatomy-${resetGeneration}`}
        title={ANATOMY_QUIZ.title}
        questions={ANATOMY_QUIZ.questions}
        passed={completed.includes('anatomy')}
        onPass={() => course.passQuiz('anatomy')}
        onReset={() => course.resetFrom('anatomy')}
      />
    </section>
  );
}
