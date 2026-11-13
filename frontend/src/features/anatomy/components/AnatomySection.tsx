import { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { CubeSatScene } from '@/components/CubeSatScene';
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
  const [exploded, setExploded] = useState(false);
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
        <div className="model-panel">
          {activePage === 'anatomy' && (
            <CubeSatScene
              mode="explore"
              selected={selected}
              exploded={exploded}
            />
          )}
          <div className="viewer-toolbar">
            <button
              onClick={() => setExploded(!exploded)}
              aria-pressed={exploded}
              className={exploded ? 'active' : ''}
            >
              <Sparkles />{' '}
              {exploded ? 'View assembly status' : 'View disassembly status'}
            </button>
            <span>Rotate by dragging and zoom in/out by scrolling</span>
          </div>
        </div>
        <aside className="inspector">
          <div className="inspector-tabs">
            {SUBSYSTEMS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelected(s.id)}
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
