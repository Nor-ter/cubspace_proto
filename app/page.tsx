'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  Activity,
  BookOpen,
  Box,
  ChevronRight,
  Database,
  FileCheck2,
  GitBranch,
  LockKeyhole,
  Menu,
  Network,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { CubeSatScene } from '@/components/cubesat-scene';
import { AdcsLoopDiagram } from '@/components/adcs-loop-diagram';
import { AdcsAnatomyFlow } from '@/components/adcs-anatomy-flow';
import { RoleIcon } from '@/components/role-icon';
import { PromptManual } from '@/components/prompt-manual';
import { PrologViewer } from '@/components/prolog-viewer';
import { EngineeringNotes } from '@/components/engineering-note';
import { MiniQuiz } from '@/components/mini-quiz';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import {
  adcsNodes,
  learningPath,
  sourceCards,
  subsystems,
  quizOrder,
  quizzes,
  type QuizSection,
  type SubsystemKey,
} from '@/src/data/onboarding';

const nav = [
  ['home', 'Start'],
  ['mission', 'Mission Context'],
  ['anatomy', 'Spacecraft Structure'],
  ['model', 'System Model'],
  ['made', 'Explore MADE'],
  ['prolog', 'Prolog'],
  ['handoff', 'First Task'],
] as const;

const missionStates = [
  {
    code: '01',
    name: 'RELEASE',
    detail: 'Launch → orbit insertion → spacecraft deployment',
  },
  {
    code: '02',
    name: 'DETUMBLE',
    detail: 'Fast body rotation → B-dot damping',
  },
  {
    code: '03',
    name: 'CONTACT',
    detail: 'Antenna deployment → communication with ground station',
  },
] as const;

function Status({
  children,
  tone = 'cyan',
}: {
  children: React.ReactNode;
  tone?: 'cyan' | 'lime' | 'amber';
}) {
  return <span className={`status status-${tone}`}>{children}</span>;
}
function SectionHead({
  index,
  eyebrow,
  title,
  desc,
}: {
  index: string;
  eyebrow: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="section-head">
      <div>
        <p className="eyebrow">
          {index} / {eyebrow}
        </p>
        <h2>
          <RoleIcon name={eyebrow} />
          {title}
        </h2>
        <p>{desc}</p>
      </div>
      <span className="section-index">{index}</span>
    </div>
  );
}
function FlowBadge({ type }: { type: string }) {
  return (
    <span className={`flow-badge flow-${type.toLowerCase()}`}>{type}</span>
  );
}
function LockedPanel({ previous }: { previous: string }) {
  return (
    <div className="locked-panel">
      <LockKeyhole />
      <div>
        <p className="eyebrow">LESSON LOCKED</p>
        <h3>
          <RoleIcon name="Complete the confirmation quiz from the previous lesson first." />
          Complete the confirmation quiz from the previous lesson first.
        </h3>
        <p>Complete the {previous} quiz to unlock this page.</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [activePage, setActivePage] = useState('home');
  const [selected, setSelected] = useState<SubsystemKey>('adcs');
  const [exploded, setExploded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [missionState, setMissionState] = useState(0);
  const [missionReplay, setMissionReplay] = useState(0);
  const [simTime, setSimTime] = useState(0);
  const [activeNode, setActiveNode] = useState(1);
  const [query, setQuery] = useState('contains(acrux2, X).');
  const [queryRun, setQueryRun] = useState(false);
  const [menu, setMenu] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetGeneration, setResetGeneration] = useState(0);
  const [storageError, setStorageError] = useState(false);
  const detail = useMemo(
    () => subsystems.find((s) => s.id === selected) ?? subsystems[0],
    [selected],
  );
  const simClock = `${String(Math.floor(simTime / 60)).padStart(2, '0')}:${String(simTime % 60).padStart(2, '0')}`;
  useEffect(() => {
    queueMicrotask(() =>
      setAdminMode(new URLSearchParams(location.search).get('admin') === '1'),
    );
  }, []);
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const saved = JSON.parse(
          localStorage.getItem('cubspace-quiz-progress-v1') || '[]',
        );
        if (Array.isArray(saved))
          setCompleted(saved.filter((id) => quizOrder.includes(id)));
      } catch {}
      setProgressLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!progressLoaded) return;
    try {
      localStorage.setItem(
        'cubspace-quiz-progress-v1',
        JSON.stringify(completed),
      );
    } catch {
      queueMicrotask(() => setStorageError(true));
    }
  }, [completed, progressLoaded]);
  useEffect(() => {
    const syncFromHash = () => {
      const requested = location.hash.slice(1) || 'home';
      const quizIndex = quizOrder.indexOf(requested as QuizSection);
      const unlocked =
        requested === 'home' ||
        requested === 'mission' ||
        adminMode ||
        (quizIndex > 0 && completed.includes(quizOrder[quizIndex - 1]));
      if (nav.some(([id]) => id === requested) && unlocked)
        setActivePage(requested);
    };
    syncFromHash();
    addEventListener('popstate', syncFromHash);
    return () => removeEventListener('popstate', syncFromHash);
  }, [completed, adminMode]);
  useEffect(() => {
    if (paused || activePage !== 'home') return;
    const timer = setInterval(() => setSimTime((t) => (t + 1) % 5400), 1000);
    return () => clearInterval(timer);
  }, [paused, activePage]);
  function isUnlocked(id: string) {
    if (adminMode) return true;
    if (id === 'home' || id === 'mission') return true;
    const index = quizOrder.indexOf(id as QuizSection);
    return index > 0 && completed.includes(quizOrder[index - 1]);
  }
  function go(id: string) {
    if (!isUnlocked(id)) return;
    history.pushState(
      null,
      '',
      id === 'home'
        ? location.pathname + location.search
        : `${location.search}#${id}`,
    );
    setActivePage(id);
    window.scrollTo({ top: 0, behavior: 'instant' });
    setMenu(false);
  }
  function passQuiz(id: QuizSection) {
    setCompleted((v) => (v.includes(id) ? v : [...v, id]));
  }
  function resetFrom(id: QuizSection) {
    const index = quizOrder.indexOf(id);
    setCompleted((v) =>
      v.filter((item) => quizOrder.indexOf(item as QuizSection) < index),
    );
  }
  function resetAll() {
    setCompleted([]);
    try {
      localStorage.removeItem('cubspace-quiz-progress-v1');
    } catch {
      setStorageError(true);
    }
    setResetGeneration((v) => v + 1);
    setResetOpen(false);
    go('mission');
  }

  return (
    <main>
      <a className="skip-link" href={`#${activePage}`}>
        Jump to learning content
      </a>
      <header className="topbar">
        <button
          className="brand"
          onClick={() => go('home')}
          aria-label="CubSpace startup screen"
        >
          <span className="brand-cube">
            <Box />
          </span>
          <strong>CubSpace</strong>
          <small>ACRUX-II / ENGINEER ONBOARDING</small>
        </button>
        <nav
          id="course-menu"
          className={menu ? 'open' : ''}
          aria-label="Main Study Section"
        >
          {nav.map(([id, label]) => (
            <button
              key={id}
              className={activePage === id ? 'active' : ''}
              onClick={() => go(id)}
              disabled={!isUnlocked(id)}
              aria-current={activePage === id ? 'page' : undefined}
              title={
                !isUnlocked(id)
                  ? 'Opens when you complete a quiz from the previous session'
                  : label
              }
            >
              {!isUnlocked(id) && <LockKeyhole />}
              {label}
            </button>
          ))}
        </nav>
        <div className="top-status">
          <span>{completed.length}/6 completed</span>
          <button
            className="reset-progress"
            onClick={() => setResetOpen(true)}
            title="Reset all learning progress"
          >
            <RotateCcw /> <span>Reset</span>
          </button>
          <button
            className="menu-button"
            onClick={() => setMenu(!menu)}
            aria-label={menu ? 'Close menu' : 'Open menu'}
            aria-expanded={menu}
            aria-controls="course-menu"
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {activePage !== 'home' && (
        <div className="course-context">
          <span>
            <strong>
              {String(
                quizOrder.indexOf(activePage as QuizSection) + 1,
              ).padStart(2, '0')}{' '}
              / 06
            </strong>
            {nav.find(([id]) => id === activePage)?.[1]}
          </span>
          {adminMode && (
            <span className="review-mode">
              Review mode · Browse without locking
            </span>
          )}
          <button
            onClick={() =>
              document
                .querySelector(`#${activePage} .mini-quiz`)
                ?.scrollIntoView({ behavior: 'auto', block: 'start' })
            }
          >
            Check understanding
            <ChevronRight />
          </button>
        </div>
      )}
      {storageError && (
        <p className="storage-notice" role="alert">
          Browser storage is unavailable. Your progress will be kept only for
          this session.
        </p>
      )}

      <section
        id="home"
        tabIndex={-1}
        className={`hero page-view ${activePage === 'home' ? 'active' : ''}`}
      >
        <div className="starfield" aria-hidden="true" />
        <div className="hero-model">
          {activePage === 'home' && (
            <CubeSatScene
              mode="orbit"
              paused={paused}
              missionPhase={missionState}
              replayKey={missionReplay}
            />
          )}
        </div>
        <div className="hero-copy">
          <div className="kicker">
            <span className="live-dot" /> CUBSPACE / ENGINEERING ONBOARDING
          </div>
          <h1>
            Understand ACRUX-II. <em>Start your first assignment.</em>
          </h1>
          <p>
            Explore the ACRUX-II 1U CubeSat and its ADCS, then practise system
            modelling and documenting design reviews.
          </p>
          <div className="hero-actions">
            <button
              className="primary"
              onClick={() =>
                go(quizOrder.find((id) => !completed.includes(id)) ?? 'handoff')
              }
            >
              {completed.length ? 'Continue learning' : 'Start onboarding'}{' '}
              <ChevronRight />
            </button>
            <button className="secondary" onClick={() => setPaused(!paused)}>
              {paused ? <Play /> : <Pause />}
              {paused ? 'Play mission' : 'Pause mission'}
            </button>
          </div>
        </div>
        <aside
          className="mission-console"
          aria-label="Conceptual mission state simulator"
        >
          <div className="mission-console-head">
            <div>
              <small>ACRUX-II / CONCEPTUAL SEQUENCE</small>
              <strong>Initial Mission Sequence</strong>
            </div>
            <span>
              <Activity /> For educational use
            </span>
          </div>
          <div className="mission-readouts">
            <div>
              <small>PLAYBACK TIME</small>
              <strong>T+ {simClock}</strong>
            </div>
            <div>
              <small>ORBIT</small>
              <strong>Circular orbit concept diagram · Not to scale</strong>
            </div>
          </div>
          <div className="state-track">
            {missionStates.map((state, index) => (
              <button
                key={state.code}
                aria-pressed={missionState === index}
                className={missionState === index ? 'active' : ''}
                onClick={() => {
                  setMissionState(index);
                  setMissionReplay((n) => n + 1);
                  setSimTime(0);
                  setPaused(false);
                }}
              >
                <span>{state.code}</span>
                <div>
                  <strong>{state.name}</strong>
                  <small>{state.detail}</small>
                </div>
              </button>
            ))}
          </div>
          <p>
            Select the same stage again to replay it from the beginning. The
            launch path, deployment geometry, timing, Earth and spacecraft
            sizes, and orbital altitude are conceptual and not to scale. B-dot
            reduces body rotation; it does not reduce orbital speed.
          </p>
        </aside>
        <button className="scroll-cue" onClick={() => go('mission')}>
          OPEN MISSION BRIEF <ChevronRight />
        </button>
      </section>

      <section
        id="mission"
        tabIndex={-1}
        className={`section mission-section page-view ${activePage === 'mission' ? 'active' : ''}`}
      >
        <SectionHead
          index="01"
          eyebrow="MISSION CONTEXT"
          title="Why CubSpace?"
          desc="Even if team members change, design intent and verification records must be maintained."
        />
        <div className="thesis-grid">
          <article className="statement-card">
            <p className="eyebrow">THE CONTINUITY PROBLEM</p>
            <h3>
              People carry mission knowledge.{' '}
              <span>But people are temporary.</span>
            </h3>
            <p>
              Team members change from semester to semester and as students
              graduate. If the rationale behind design decisions lives only in
              individual memories, the next team must solve the same problems
              again.
            </p>
          </article>
          <article className="statement-card accent">
            <p className="eyebrow">THE CUBSPACE PRINCIPLE</p>
            <h3>
              Engineers may leave. <span>The mission carries on.</span>
            </h3>
            <p>
              Connect models, documents, rules, task cards, evidence, and
              sign-offs so the next engineer can trace the basis for each
              decision.
            </p>
          </article>
        </div>
        <p className="note">
          There are 7 reading materials and 6 quizzes. Understanding the Mission
          combines the first two topics.
        </p>
        <div className="learning-rail">
          {learningPath.map(([n, en, ko, d]) => (
            <button
              key={n}
              onClick={() => {
                location.href = `/learn/${n}`;
              }}
            >
              <span>{n}</span>
              <div>
                <RoleIcon name={en} />
                <small>{en}</small>
                <strong>{ko}</strong>
                <p>{d}</p>
              </div>
              <ChevronRight />
            </button>
          ))}
        </div>
        <div className="mission-brief">
          <div>
            <p className="eyebrow">ACRUX-II / 1U TECHNOLOGY DEMONSTRATION</p>
            <h3>
              <RoleIcon name="Verifying hardware from space with small satellites." />
              Verifying hardware from space with small satellites.
            </h3>
            <p>
              The primary success criteria are completing the deployment
              sequence and establishing ground communication. After separation,
              the spacecraft must survive, reduce its rotation, deploy its
              antennas, and connect to the ground before it can collect Deneb
              magnetorquer and solar-panel data.
            </p>
          </div>
          <ol>
            <li>
              <span>01</span>
              <div>
                <strong>Initial Operations</strong>
                <p>
                  Separation detection → thermal management → attitude
                  determination and detumbling → antenna deployment (see the
                  low-power exception below)
                </p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Operational Phase</strong>
                <p>
                  Ground communication, power-positive operation, technology
                  verification data collection
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Extended Operations</strong>
                <p>Accumulation of long-term data and mission knowledge</p>
              </div>
            </li>
          </ol>
        </div>
        <EngineeringNotes section="mission" />
        <MiniQuiz
          key={`mission-${resetGeneration}`}
          title={quizzes.mission.title}
          questions={quizzes.mission.questions}
          passed={completed.includes('mission')}
          onPass={() => passQuiz('mission')}
          onReset={() => resetFrom('mission')}
          nextLabel="Next · Satellite Structure"
          onNext={() => go('anatomy')}
        />
      </section>

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
              {subsystems.map((s) => (
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
                    Immediately after deployment, the spacecraft may be
                    tumbling. ADCS reads the magnetic field and uses the
                    magnetorquer to create torque, reducing angular velocity so
                    stable communication and experiments are possible.
                  </p>
                </div>
              )}
              <p className="disclaimer">
                This educational configuration is based on the supplied GLB. It
                is not the approved ACRUX-II CAD or a final design; its scale
                and included parts require SME review.
              </p>
            </div>
          </aside>
        </div>
        <EngineeringNotes section="anatomy" />
        <MiniQuiz
          key={`anatomy-${resetGeneration}`}
          title={quizzes.anatomy.title}
          questions={quizzes.anatomy.questions}
          passed={completed.includes('anatomy')}
          onPass={() => passQuiz('anatomy')}
          onReset={() => resetFrom('anatomy')}
          nextLabel="Next · System Model"
          onNext={() => go('model')}
        />
      </section>

      <section
        id="model"
        tabIndex={-1}
        className={`section page-view ${activePage === 'model' ? 'active' : ''} ${isUnlocked('model') ? '' : 'locked'}`}
      >
        <SectionHead
          index="03"
          eyebrow="SYSTEM MODELING 101"
          title="System modeling basics before starting MADE"
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
              Traceability: Functions, parts, tests, and approvals across
              mission objectives. This means that you can follow the connection
              all the way to the evidence.
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
            These links help you find the functions, tests, and documents
            affected by a design change. Confirm exact requirement IDs and
            values in the approved model.
          </p>
        </div>
        <div className="hierarchy">
          <div>
            <p className="eyebrow">PHYSICAL HIERARCHY</p>
            <h3>
              Configuration hierarchy used in the document: Part-pair →
              Component → Subsystem → System
            </h3>
          </div>
          {[
            [
              'Part-pair',
              'Bolt ↔ Nut',
              'Interaction of two physical components',
            ],
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
        <EngineeringNotes section="model" />
        <MiniQuiz
          key={`model-${resetGeneration}`}
          title={quizzes.model.title}
          questions={quizzes.model.questions}
          passed={completed.includes('model')}
          onPass={() => passQuiz('model')}
          onReset={() => resetFrom('model')}
          nextLabel="Next · Explore MADE"
          onNext={() => go('made')}
        />
      </section>

      <section
        id="made"
        tabIndex={-1}
        className={`section made-section page-view ${activePage === 'made' ? 'active' : ''} ${isUnlocked('made') ? '' : 'locked'}`}
      >
        <SectionHead
          index="04"
          eyebrow="MADE MODEL EXPLORER"
          title="Read your system at a glance with MADE"
          desc="MADE is a model-based tool that analyzes reliability, availability, maintainability, and safety (RAMS) by linking functionality and failure dependencies."
        />
        {!isUnlocked('made') && <LockedPanel previous="system model" />}
        <div className="made-intro">
          <article>
            <RoleIcon name="model" />
            <small>01 · MODEL</small>
            <h3>One system picture</h3>
            <p>
              SysML, CAD, the BOM, and engineering knowledge are brought into a
              common model so structure and function can be viewed in context.
            </p>
          </article>
          <article>
            <RoleIcon name="trace" />
            <small>02 · CONNECT</small>
            <h3>Connecting functions and failures</h3>
            <p>
              Relationships show what enables each function and how a failure
              can propagate to downstream functions.
            </p>
          </article>
          <article>
            <RoleIcon name="evidence" />
            <small>03 · ANALYSE</small>
            <h3>RAMS analysis is repeatable</h3>
            <p>
              The connected model makes analyses such as FMEA and FTA repeatable
              and helps teams reassess the impact of design changes.
            </p>
          </article>
        </div>
        <div className="made-window">
          <div className="made-menubar">
            <div className="made-logo">
              MADE <span>MODEL VIEW</span>
            </div>
            <span>Functional model for education</span>
            <Status tone="lime">ADCS / Training Examples</Status>
          </div>
          <div className="made-grid">
            <aside className="model-tree">
              <p className="panel-title">MODEL TREE</p>
              <ul>
                <li className="open">
                  ▾ ACRUX-II CubeSat
                  <ul>
                    <li>□ OBC</li>
                    <li className="active">
                      ▾ ADCS
                      <ul>
                        <li>□ Magnetometer A</li>
                        <li>□ Magnetometer B</li>
                        <li>◇ B-dot software</li>
                        <li>□ Deneb magnetorquer</li>
                      </ul>
                    </li>
                    <li>□ EPS</li>
                    <li>□ COMMS</li>
                    <li>□ BOX / Structure</li>
                  </ul>
                </li>
              </ul>
            </aside>
            <div
              className="diagram-canvas"
              aria-label="ADCS functional model · Navigate entire flow with horizontal scrolling"
            >
              <p className="canvas-hint">
                Clicking on a block opens its description. Zoom in/out with the
                wheel, then drag the empty canvas to pan.
              </p>
              <div className="canvas-meta">
                <span>ACTUATION SYSTEM / FUNCTIONAL MODEL</span>
                <span>FLOW LABELS ON</span>
              </div>
              <AdcsLoopDiagram
                nodes={adcsNodes}
                active={activeNode}
                onSelect={setActiveNode}
              />
            </div>
            <aside className="property-panel">
              <p className="panel-title">ITEM PROPERTIES</p>
              <small>{adcsNodes[activeNode].type.toUpperCase()}</small>
              <h3>{adcsNodes[activeNode].name}</h3>
              <p>{adcsNodes[activeNode].fn}</p>
              <h4>FUNCTIONAL FLOW</h4>
              <FlowBadge type={adcsNodes[activeNode].flow} />
              <h4>FLOW PROPERTIES</h4>
              <ul>
                {adcsNodes[activeNode].props.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <div className="legend">
                <span>
                  <i className="blue" />
                  Data
                </span>
                <span>
                  <i className="red" />
                  Energy
                </span>
                <span>
                  <i className="green" />
                  Material
                </span>
              </div>
            </aside>
          </div>
        </div>
        <div className="grammar">
          <article>
            <span>01</span>
            <div>
              <RoleIcon name="function" />
              <small>FUNCTION</small>
              <h3>What to convert?</h3>
              <p>
                Magnetometer converts magnetic fields into measurable digital
                values.
              </p>
            </div>
          </article>
          <ChevronRight />
          <article>
            <span>02</span>
            <div>
              <RoleIcon name="flow" />
              <small>FUNCTIONAL FLOW</small>
              <h3>What moves?</h3>
              <p>
                In the document, magnetic and mechanical interactions are
                classified as Energy, while measurements and commands are
                classified as Data. A magnetometer is not a generator powered by
                the external magnetic field.
              </p>
            </div>
          </article>
          <ChevronRight />
          <article>
            <span>03</span>
            <div>
              <RoleIcon name="property" />
              <small>FLOW PROPERTY</small>
              <h3>What to measure?</h3>
              <p>
                Define the value, unit, range, and measurement conditions of
                physical quantities. For status flags, define their meaning and
                allowed values rather than assigning units.
              </p>
            </div>
          </article>
        </div>
        <div className="reference-strip">
          <Image
            src="/reference/made-actuation-system-model.png"
            width={1490}
            height={813}
            alt="MADE Actuation System functional flow reference"
          />
          <Image
            src="/reference/made-chassis-system-model.png"
            width={1490}
            height={813}
            alt="MADE 3U CubeSat chassis system model reference"
          />
          <div>
            <p className="eyebrow">REFERENCE VIEWS</p>
            <h3>
              <RoleIcon name="Reading blocks and arrows on MADE screens" />
              Reading blocks and arrows on MADE screens
            </h3>
            <p>
              Blocks are model items, arrows are Functional Flow, and colors and
              labels are Flow. Indicates type and measurement properties. The
              image above is the reference screen provided, The ADCS model on
              the web has been simplified for educational purposes.
            </p>
          </div>
        </div>
        <EngineeringNotes section="made" />
        <MiniQuiz
          key={`made-${resetGeneration}`}
          title={quizzes.made.title}
          questions={quizzes.made.questions}
          passed={completed.includes('made')}
          onPass={() => passQuiz('made')}
          onReset={() => resetFrom('made')}
          nextLabel="Next · Prolog Guide"
          onNext={() => go('prolog')}
        />
      </section>

      <section
        id="prolog"
        tabIndex={-1}
        className={`section prolog-section page-view ${activePage === 'prolog' ? 'active' : ''} ${isUnlocked('prolog') ? '' : 'locked'}`}
      >
        <SectionHead
          index="05"
          eyebrow="KNOWLEDGE REASONING"
          title="Prolog finds the answer by following relationships"
          desc="Before memorizing code, understand Prolog's way of thinking by following the satellite-subsystem-part relationships like a tree."
        />
        {!isUnlocked('prolog') && <LockedPanel previous="Explore MADE" />}
        <div className="prolog-lab">
          <PrologViewer />
          <div className="query-pane">
            <p className="eyebrow">Educational query examples</p>
            <p className="note">
              Only the three queries below are supported. This is an educational
              example, not a Prolog runtime or a flight-readiness assessment.
            </p>
            <div className="query-buttons">
              {[
                'contains(acrux2, X).',
                'component(adcs, X).',
                'ready(detumble).',
              ].map((x) => (
                <button
                  key={x}
                  onClick={() => {
                    setQuery(x);
                    setQueryRun(false);
                  }}
                >
                  {x}
                </button>
              ))}
            </div>
            <div className="terminal">
              <label htmlFor="query">?-</label>
              <input
                id="query"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setQueryRun(false);
                }}
              />
              <button onClick={() => setQueryRun(true)}>View results</button>
            </div>
            {queryRun && (
              <div className="result">
                {query.replace(/\s/g, '') === 'component(adcs,X).' ? (
                  <>
                    X = magnetometer;
                    <br />X = deneb_magnetorquer.
                  </>
                ) : query.replace(/\s/g, '') === 'ready(detumble).' ? (
                  <>
                    false.
                    <br />
                    <small>
                      evidence(adcs_test) or human_signed(adcs_test) has not yet
                      been confirmed.
                    </small>
                  </>
                ) : query.replace(/\s/g, '') === 'contains(acrux2,X).' ? (
                  <>
                    X = adcs;
                    <br />X = magnetometer;
                    <br />X = deneb_magnetorquer.
                  </>
                ) : (
                  <p>
                    This query is not supported. Choose one of the three
                    examples above. It did not produce any inference results for
                    the input.
                  </p>
                )}
              </div>
            )}
            <div className="prolog-steps">
              <p>
                <b>Fact</b> State a relationship. Source and approval status are
                separate. Manage it.
              </p>
              <p>
                <b>Rule</b> Derive a new state from several facts.
              </p>
              <p>
                <b>Query</b> Ask the system “What’s blocked?”
              </p>
            </div>
          </div>
        </div>
        <div className="warning-band">
          <ShieldCheck />
          <div>
            <strong>Important: “Unproven” is different from “false.”</strong>
            <p>
              Negation as failure in Prolog means not finding a basis. CubSpace
              also distinguishes unverified evidence from failed verification.
              AI output alone never approves mission state.
            </p>
          </div>
        </div>
        <EngineeringNotes section="prolog" />
        <MiniQuiz
          key={`prolog-${resetGeneration}`}
          title={quizzes.prolog.title}
          questions={quizzes.prolog.questions}
          passed={completed.includes('prolog')}
          onPass={() => passQuiz('prolog')}
          onReset={() => resetFrom('prolog')}
          nextLabel="Next · First task"
          onNext={() => go('handoff')}
        />
      </section>

      <section
        id="handoff"
        tabIndex={-1}
        className={`section handoff-section page-view ${activePage === 'handoff' ? 'active' : ''} ${isUnlocked('handoff') ? '' : 'locked'}`}
      >
        <SectionHead
          index="06"
          eyebrow="MISSION KNOWLEDGE NETWORK"
          title="A design record that can be continued by the next team"
          desc="Link model changes, business records and validation evidence and track the latest geometry."
        />
        {!isUnlocked('handoff') && <LockedPanel previous="Prolog inference" />}
        <div className="knowledge-loop">
          {[
            [Box, 'MADE Model', 'Satellite composition and function'],
            [BookOpen, 'Live Technical Manual', 'What do you know now?'],
            [Database, 'Prolog Reasoning', "What's blocked"],
            [FileCheck2, 'Task Card', 'what to do next'],
            [
              Activity,
              'Human + AI Cell',
              'Records of work performed and evidence provided',
            ],
            [
              ShieldCheck,
              'Human Sign-off',
              'Update baseline document after review',
            ],
          ].map(([Icon, title, desc], i) => {
            const C = Icon as typeof Box;
            return (
              <article key={title as string}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <C />
                <strong>{title as string}</strong>
                <p>{desc as string}</p>
                {i < 5 && <ChevronRight />}
              </article>
            );
          })}
        </div>
        <div className="partners">
          <div>
            <p className="eyebrow">WHY MSP + PHMT MADE MATTER</p>
            <h3>
              The design issues of ACRUX-II are examined using the MADE model.
            </h3>
          </div>
          <article>
            <strong>MSP</strong>
            <p>
              Provides ACRUX-II, a student-led mission, together with its design
              questions, decision rationale, and verification process.
            </p>
          </article>
          <article>
            <strong>PHMT / MADE</strong>
            <p>
              Provides the model-based information system that links functions,
              interfaces, failures, RAMS, and verification.
            </p>
          </article>
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
            {[
              'The function of each item was explained in one sentence.',
              'Input and output were classified into Material / Energy / Data.',
              'Flow properties and measurement conditions defined',
              'Assumptions and unconfirmed items (TBD) are indicated.',
              'Links to reviewers and evidence were recorded',
            ].map((x) => (
              <label key={x}>
                <input type="checkbox" />
                <span>{x}</span>
              </label>
            ))}
          </aside>
        </div>
        <div className="sources">
          <p className="eyebrow">SOURCE DESK / THIS ONBOARDING</p>
          {sourceCards.map(([name, use]) => (
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
        <EngineeringNotes section="handoff" />
        <MiniQuiz
          key={`handoff-${resetGeneration}`}
          title={quizzes.handoff.title}
          questions={quizzes.handoff.questions}
          passed={completed.includes('handoff')}
          onPass={() => passQuiz('handoff')}
          onReset={() => resetFrom('handoff')}
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
              Review the ADCS model with the responsible engineer. This course
              is not a certification; real work still requires appropriate
              guidance and review.
            </p>
            <button className="primary" onClick={() => setResetOpen(true)}>
              <RotateCcw /> Start the whole process again
            </button>
          </div>
        )}
      </section>
      <footer className={activePage === 'handoff' ? '' : 'page-hidden'}>
        <div className="brand">
          <span className="brand-cube">
            <Box />
          </span>
          <strong>CubSpace</strong>
        </div>
        <p>Engineers may leave. The mission carries on.</p>
        <span>Educational model · Human engineering review required</span>
      </footer>
      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent className="reset-dialog">
          <AlertDialogTitle>
            Would you like to reset your learning history?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Quiz answers and completion markers for all six sessions will be
            reset. Use this when you want to restart the course.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className="secondary">Cancel</AlertDialogCancel>
            <AlertDialogAction className="primary" onClick={resetAll}>
              Full reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
