import {
  Activity,
  BookOpen,
  ChevronRight,
  FileCheck2,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { EngineeringNotes } from '@/components/EngineeringNotes';
import { LockedPanel } from '@/components/LockedPanel';
import { MiniQuiz } from '@/components/MiniQuiz';
import { RoleIcon } from '@/components/RoleIcon';
import { SectionHead } from '@/components/SectionHead';
import { Status } from '@/components/Status';
import type { Course } from '@/types/course';
import { HANDOFF_NOTES, HANDOFF_QUIZ, SOURCE_CARDS } from '../data';
import { PromptManual } from './PromptManual';

const KNOWLEDGE_LOOP = [
  [BookOpen, 'Live Technical Manual', 'What do you know now?'],
  [FileCheck2, 'Task Card', 'what to do next'],
  [
    Activity,
    'Human + AI Cell',
    'Records of work performed and evidence provided',
  ],
  [ShieldCheck, 'Human Sign-off', 'Update baseline document after review'],
] as const;

const SELF_CHECKS = [
  'The function of each item was explained in one sentence.',
  'Input and output were classified into Material / Energy / Data.',
  'Flow properties and measurement conditions defined',
  'Assumptions and unconfirmed items (TBD) are indicated.',
  'Links to reviewers and evidence were recorded',
];

export function HandoffSection({ course }: { course: Course }) {
  const { activePage, completed, resetGeneration, isUnlocked } = course;
  return (
    <section
      id="handoff"
      tabIndex={-1}
      className={`section handoff-section page-view ${activePage === 'handoff' ? 'active' : ''} ${isUnlocked('handoff') ? '' : 'locked'}`}
    >
      <SectionHead
        index="04"
        eyebrow="MISSION KNOWLEDGE NETWORK"
        title="A design record that can be continued by the next team"
        desc="Link model changes, business records and validation evidence and track the latest geometry."
      />
      {!isUnlocked('handoff') && <LockedPanel previous="System Model" />}
      <div className="knowledge-loop">
        {KNOWLEDGE_LOOP.map(([Icon, title, desc], i) => (
          <article key={title}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            <Icon />
            <strong>{title}</strong>
            <p>{desc}</p>
            {i < KNOWLEDGE_LOOP.length - 1 && <ChevronRight />}
          </article>
        ))}
      </div>
      <PromptManual />
      <div className="first-task">
        <div className="task-main">
          <div className="task-id">
            TASK-ADCS-001 <Status tone="amber">SUPERVISED</Status>
          </div>
          <h3>
            <RoleIcon name="ADCS Functional Model Draft Review" />
            ADCS Functional Model Draft Review
          </h3>
          <p>
            The detumbling process of reducing the rotation of the satellite
            with B-dot is accompanied by documentary evidence. Explain and
            indicate any inconclusive items.
          </p>
          <div className="task-fields">
            <span>Source</span>
            <strong>MADE Modeling §2 / ConOps</strong>
            <span>Output</span>
            <strong>Function · Flow · Property table</strong>
            <span>Evidence</span>
            <strong>Source excerpt + reviewer note</strong>
            <span>Authority</span>
            <strong>Human reviewer sign-off required</strong>
          </div>
        </div>
        <aside>
          <p className="eyebrow">Completion criteria · Self-inspection</p>
          <p className="note">
            This check is not saved as an actual approval record.
          </p>
          {SELF_CHECKS.map((x) => (
            <label key={x}>
              <input type="checkbox" />
              <span>{x}</span>
            </label>
          ))}
        </aside>
      </div>
      <div className="sources">
        <p className="eyebrow">SOURCE DESK / THIS ONBOARDING</p>
        {SOURCE_CARDS.map(([name, use]) => (
          <article key={name}>
            <FileCheck2 />
            <div>
              <strong>{name}</strong>
              <p>{use}</p>
            </div>
            <Status>REFERENCE</Status>
          </article>
        ))}
      </div>
      <EngineeringNotes notes={HANDOFF_NOTES} />
      <MiniQuiz
        key={`handoff-${resetGeneration}`}
        title={HANDOFF_QUIZ.title}
        questions={HANDOFF_QUIZ.questions}
        passed={completed.includes('handoff')}
        onPass={() => course.passQuiz('handoff')}
        onReset={() => course.resetFrom('handoff')}
      />
      {completed.includes('handoff') && (
        <div className="finish">
          <p className="eyebrow">YOU ARE READY TO BEGIN</p>
          <h2>
            You have completed onboarding.
            <br />
            Start your first ADCS assignment.
          </h2>
          <p>
            Review the ADCS model with the responsible engineer. This course is
            not a certification; real work still requires appropriate guidance
            and review.
          </p>
          <button className="primary" onClick={course.requestReset}>
            <RotateCcw /> Start the whole process again
          </button>
        </div>
      )}
    </section>
  );
}
