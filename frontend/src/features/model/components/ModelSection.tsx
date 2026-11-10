import { ChevronRight, GitBranch, Network } from 'lucide-react';
import { EngineeringNotes } from '@/components/EngineeringNotes';
import { LockedPanel } from '@/components/LockedPanel';
import { MiniQuiz } from '@/components/MiniQuiz';
import { RoleIcon } from '@/components/RoleIcon';
import { SectionHead } from '@/components/SectionHead';
import type { Course } from '@/types/course';
import { MODEL_NOTES, MODEL_QUIZ } from '../data';

export function ModelSection({ course }: { course: Course }) {
  const { activePage, completed, resetGeneration, isUnlocked } = course;
  return (
    <section
      id="model"
      tabIndex={-1}
      className={`section page-view ${activePage === 'model' ? 'active' : ''} ${isUnlocked('model') ? '' : 'locked'}`}
    >
      <SectionHead
        index="03"
        eyebrow="SYSTEM MODELING 101"
        title="System modeling basics"
        desc="Models answer engineering questions by linking requirements, functionality, implementation, and verification evidence."
      />
      {!isUnlocked('model') && <LockedPanel previous="satellite structure" />}
      <div className="definition">
        <Network />
        <div>
          <p className="eyebrow">ONE SENTENCE DEFINITION</p>
          <h3>
            System modelling represents why components are needed, what they
            connect to, and how they are verified.
          </h3>
        </div>
      </div>
      <div className="four-lenses">
        {[
          [
            '01',
            'REQUIREMENT',
            'What should I be satisfied with?',
            'Mission objectives and success criteria',
          ],
          [
            '02',
            'FUNCTION',
            'What should I do?',
            'Input → Conversion → Output',
          ],
          [
            '03',
            'PHYSICAL',
            'What part or code does it?',
            'System → Subsystem → Component',
          ],
          [
            '04',
            'EVIDENCE',
            'How do you ensure requirements are met?',
            'Test · Analysis · Review · Sign-off',
          ],
        ].map(([n, en, q, a]) => (
          <article key={n}>
            <span>{n}</span>
            <RoleIcon name={en} />
            <small>{en}</small>
            <h3>{q}</h3>
            <p>{a}</p>
          </article>
        ))}
      </div>
      <div className="trace-demo">
        <div className="trace-title">
          <GitBranch />
          <div>
            <p className="eyebrow">TRACEABILITY / ONE CLAIM, MANY LINKS</p>
            <h3>
              If we connect “reduce the rotation of the satellite” as a model,
            </h3>
          </div>
        </div>
        <div className="trace-intro">
          <p>
            Traceability: Functions, parts, tests, and approvals across mission
            objectives. This means that you can follow the connection all the
            way to the evidence.
          </p>
          <p className="trace-intro-note">
            It does not represent a physical layer or chronological execution
            order.
          </p>
        </div>
        <div className="trace-chain">
          {[
            'Mission objective',
            'Detumble function',
            'Magnetometer data',
            'B-dot software',
            'Deneb magnetorquer',
            'Test evidence',
            'Human sign-off',
          ].map((x, i) => (
            <div key={x}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <RoleIcon name={x} />
              <strong>{x}</strong>
              {i < 6 && <ChevronRight />}
            </div>
          ))}
        </div>
        <p className="note">
          These links help you find the functions, tests, and documents affected
          by a design change. Confirm exact requirement IDs and values in the
          approved model.
        </p>
      </div>
      <div className="hierarchy">
        <div>
          <p className="eyebrow">PHYSICAL HIERARCHY</p>
          <h3>
            Configuration hierarchy used in the document: Part-pair → Component
            → Subsystem → System
          </h3>
        </div>
        {[
          ['Part-pair', 'Bolt ↔ Nut', 'Interaction of two physical components'],
          [
            'Component',
            'Magnetometer',
            'Independent input/output and functions',
          ],
          ['Subsystem', 'ADCS', 'Key Satellite Capabilities'],
          ['System', 'ACRUX-II', 'complete mission system'],
        ].map(([a, b, c]) => (
          <article key={a}>
            <RoleIcon name={a} />
            <small>{a}</small>
            <strong>{b}</strong>
            <p>{c}</p>
          </article>
        ))}
      </div>
      <EngineeringNotes notes={MODEL_NOTES} />
      <MiniQuiz
        key={`model-${resetGeneration}`}
        title={MODEL_QUIZ.title}
        questions={MODEL_QUIZ.questions}
        passed={completed.includes('model')}
        onPass={() => course.passQuiz('model')}
        onReset={() => course.resetFrom('model')}
      />
    </section>
  );
}
