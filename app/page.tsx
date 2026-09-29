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
  ['mission', 'Mission'],
  ['anatomy', 'Structure'],
  ['model', 'System model'],
  ['made', 'MADE'],
  ['prolog', 'Prolog'],
  ['handoff', 'First task'],
] as const;

const missionStates = [
  {
    code: '01',
    name: 'RELEASE',
    detail: 'Launch → orbit insertion → satellite ejection',
  },
  {
    code: '02',
    name: 'DETUMBLE',
    detail: 'Fast body rotation → B-dot damping',
  },
  {
    code: '03',
    name: 'CONTACT',
    detail: 'Antenna deployment → ground station contact',
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
        <p className="eyebrow">Lesson not yet unlocked</p>
        <h3>
          <RoleIcon name="Complete the previous lesson’s check quiz first." />
          Complete the previous lesson’s check quiz first.
        </h3>
        <p>This page unlocks when every question in the {previous} check quiz is answered correctly.</p>
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
        Skip to lesson content
      </a>
      <header className="topbar">
        <button
          className="brand"
          onClick={() => go('home')}
          aria-label="CubSpace start screen"
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
          aria-label="Main learning sections"
        >
          {nav.map(([id, label]) => (
            <button
              key={id}
              className={activePage === id ? 'active' : ''}
              onClick={() => go(id)}
              disabled={!isUnlocked(id)}
              aria-current={activePage === id ? 'page' : undefined}
              title={
                !isUnlocked(id) ? 'Unlocks when the previous session’s quiz is complete' : label
              }
            >
              {!isUnlocked(id) && <LockKeyhole />}
              {label}
            </button>
          ))}
        </nav>
        <div className="top-status">
          <span>{completed.length}/6 complete</span>
          <button
            className="reset-progress"
            onClick={() => setResetOpen(true)}
            title="Reset all learning records"
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
            <span className="review-mode">Review mode · browsing without locks</span>
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
          Browser storage is unavailable, so learning records are kept for this
          session only.
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
            Understand ACRUX-II, <em>then start your first task.</em>
          </h1>
          <p>
            Explore the structure and ADCS of the ACRUX-II 1U CubeSat, and
            practise system modelling and design review records.
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
              <strong>Early mission sequence</strong>
            </div>
            <span>
              <Activity /> Teaching
            </span>
          </div>
          <div className="mission-readouts">
            <div>
              <small>Playback time</small>
              <strong>T+ {simClock}</strong>
            </div>
            <div>
              <small>ORBIT</small>
              <strong>Circular-orbit concept · not to scale</strong>
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
            Pressing the same button again replays from the start. The launch
            trajectory, deployed geometry and timing are conceptual, and the
            Earth and satellite sizes and orbital altitude are not to scale.
            B-dot reduces body rotation; it does not lower the orbital speed.
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
          title="Why CubSpace is needed"
          desc="Design intent and verification records must carry forward even when team members change."
        />
        <div className="thesis-grid">
          <article className="statement-card">
            <p className="eyebrow">THE CONTINUITY PROBLEM</p>
            <h3>
              People carry mission knowledge.{' '}
              <span>But people are temporary.</span>
            </h3>
            <p>
              Team members change across semesters and graduations. If the basis
              for design decisions stays only with individuals, the next team
              has to solve the same problems again.
            </p>
          </article>
          <article className="statement-card accent">
            <p className="eyebrow">THE CUBSPACE PRINCIPLE</p>
            <h3>
              Engineers may leave. <span>The mission carries on.</span>
            </h3>
            <p>
              Linking models, documents, rules, Task Cards, evidence and sign-off
              lets the next engineer trace the basis for decisions.
            </p>
          </article>
        </div>
        <p className="note">
          There are 7 readings and 6 quizzes. The Mission section covers the
          first two topics together.
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
              <RoleIcon name="Verifying hardware in space with a small satellite." />
              Verifying hardware in space with a small satellite.
            </h3>
            <p>
              The primary success criterion is completing the deployment
              procedure and establishing ground communication. The satellite
              must survive separation, reduce its rotation and deploy its antenna
              to connect with the ground before Deneb magnetorquer and solar
              panel data can be collected.
            </p>
          </div>
          <ol>
            <li>
              <span>01</span>
              <div>
                <strong>Initial Operations</strong>
                <p>
                  Separation detection → thermal management → attitude
                  determination and rotation reduction → antenna deployment (see
                  below for the low-power exception)
                </p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Operational Phase</strong>
                <p>Ground communication, power-positive operation, technology demonstration data collection</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Extended Operations</strong>
                <p>Accumulating long-term data and mission knowledge</p>
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
          nextLabel="Next · Structure"
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
          title="Exploring the 1U CubeSat structure"
          desc="Rotate and zoom the model and select an item. Only the selected system is highlighted."
        />
        {!isUnlocked('anatomy') && <LockedPanel previous="Mission" />}
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
                <Sparkles /> {exploded ? 'Show assembled' : 'Show exploded'}
              </button>
              <span>Drag to rotate · scroll to zoom</span>
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
                <p className="eyebrow">Selected model element</p>
                <Status tone={selected === 'adcs' ? 'lime' : 'cyan'}>
                  {detail.status}
                </Status>
              </div>
              <h3>{detail.title}</h3>
              <p className="purpose">{detail.purpose}</p>
              <h4>Components and functions</h4>
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
                  <strong>Why learn the ADCS first?</strong>
                  <p>
                    Right after deployment the satellite may be rotating. Stable
                    communication and experiments are possible only after it
                    reads the magnetic field and uses the magnetorquer to create
                    torque that lowers the angular rate.
                  </p>
                </div>
              )}
              <p className="disclaimer">
                A teaching configuration based on the attached GLB. It is not the
                actual ACRUX-II CAD or a finalised design, and its scale and
                included components require SME review.
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
          nextLabel="Next · System model"
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
          title="Before MADE: system modelling fundamentals"
          desc="A model answers engineering questions by linking requirements, functions, implementation and verification evidence."
        />
        {!isUnlocked('model') && <LockedPanel previous="Structure" />}
        <div className="definition">
          <Network />
          <div>
            <p className="eyebrow">ONE SENTENCE DEFINITION</p>
            <h3>
              System modelling expresses, as a model, why each element is needed,
              what it connects to and how it is verified.
            </h3>
          </div>
        </div>
        <div className="four-lenses">
          {[
            [
              '01',
              'REQUIREMENT',
              'What must be satisfied?',
              'Mission objectives and success criteria',
            ],
            ['02', 'FUNCTION', 'What must it do?', 'Input → transformation → output'],
            [
              '03',
              'PHYSICAL',
              'Which component or code performs it?',
              'System → Subsystem → Component',
            ],
            [
              '04',
              'EVIDENCE',
              'How is the requirement shown to be met?',
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
              <h3>Linking “reduce the satellite’s rotation” in a model</h3>
            </div>
          </div>
          <div className="trace-intro">
            <p>
              Traceability means being able to follow the links from the mission
              objective to functions, components, tests and approval evidence.
            </p>
            <p className="trace-intro-note">
              It does not represent a physical hierarchy or a chronological
              execution order.
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
            With these links, the functions, tests and documents affected by a
            design change can be found. Exact requirement IDs and values must be
            confirmed in the approved model.
          </p>
        </div>
        <div className="hierarchy">
          <div>
            <p className="eyebrow">PHYSICAL HIERARCHY</p>
            <h3>
              Composition hierarchy used in the documents: Part-pair → Component
              → Subsystem → System
            </h3>
          </div>
          {[
            ['Part-pair', 'Bolt ↔ Nut', 'Interaction of two physical parts'],
            ['Component', 'Magnetometer', 'Distinct inputs, outputs and function'],
            ['Subsystem', 'ADCS', 'Major satellite capability'],
            ['System', 'ACRUX-II', 'Complete mission system'],
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
          nextLabel="Next · MADE"
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
          title="Reading the system at a glance with MADE"
          desc="MADE is a model-based tool that links functions and failure dependencies to analyse reliability, availability, maintainability and safety (RAMS)."
        />
        {!isUnlocked('made') && <LockedPanel previous="System model" />}
        <div className="made-intro">
          <article>
            <RoleIcon name="model" />
            <small>01 · MODEL</small>
            <h3>One system picture</h3>
            <p>
              Brings SysML, CAD, BOM and engineers’ knowledge into a common model
              so that structure and function are seen in the same context.
            </p>
          </article>
          <article>
            <RoleIcon name="trace" />
            <small>02 · CONNECT</small>
            <h3>Linking functions and failures</h3>
            <p>
              Expresses as relationships what drives what, and how one failure
              propagates to the next function.
            </p>
          </article>
          <article>
            <RoleIcon name="evidence" />
            <small>03 · ANALYSE</small>
            <h3>Making RAMS analysis repeatable</h3>
            <p>
              Automates analyses such as FMEA and FTA from the linked model and
              re-checks the impact of design changes.
            </p>
          </article>
        </div>
        <div className="made-window">
          <div className="made-menubar">
            <div className="made-logo">
              MADE <span>MODEL VIEW</span>
            </div>
            <span>Teaching functional model</span>
            <Status tone="lime">ADCS / teaching example</Status>
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
              aria-label="ADCS functional model · scroll horizontally to explore the whole flow"
            >
              <p className="canvas-hint">
                Click a block to open its description. Scroll to zoom and drag
                empty space to pan.
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
              <h3>What is transformed?</h3>
              <p>The magnetometer turns the magnetic field into measurable digital values.</p>
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
                The documents classify magnetic and mechanical interactions as
                Energy, and measurements and commands as Data. A magnetic field
                sensor is not a generator driven by the external field.
              </p>
            </div>
          </article>
          <ChevronRight />
          <article>
            <span>03</span>
            <div>
              <RoleIcon name="property" />
              <small>FLOW PROPERTY</small>
              <h3>What will be measured?</h3>
              <p>
                Define the value, unit, range and measurement conditions of each
                physical quantity. For state flags, state the meaning and allowed
                values instead of a unit.
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
              <RoleIcon name="Reading blocks and arrows in the MADE view" />
              Reading blocks and arrows in the MADE view
            </h3>
            <p>
              Blocks are model items, arrows are Functional Flows, and colours
              and labels show the Flow Type and measured properties. The image
              above is the provided reference view; the ADCS model on this site
              is simplified for teaching.
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
          title="Prolog finds answers by following relationships"
          desc="Before memorising code, understand how Prolog thinks by following the satellite–subsystem–component relationships like a tree."
        />
        {!isUnlocked('prolog') && <LockedPanel previous="MADE" />}
        <div className="prolog-lab">
          <PrologViewer />
          <div className="query-pane">
            <p className="eyebrow">Teaching query examples</p>
            <p className="note">
              Only the three queries below are supported. This is not a Prolog
              executor or an actual operational readiness checker.
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
              <button onClick={() => setQueryRun(true)}>Show result</button>
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
                    Unsupported query. Select one of the three examples above.
                    No inference result was generated for this input.
                  </p>
                )}
              </div>
            )}
            <div className="prolog-steps">
              <p>
                <b>Fact</b> States a relationship. Source and approval status
                are managed separately.
              </p>
              <p>
                <b>Rule</b> Derives a new state from several facts.
              </p>
              <p>
                <b>Query</b> Asks the system “what is blocked?”.
              </p>
            </div>
          </div>
        </div>
        <div className="warning-band">
          <ShieldCheck />
          <div>
            <strong>Important: “not proved” is different from “false”.</strong>
            <p>
              Prolog’s negation as failure means no supporting evidence was
              found. CubSpace likewise separates unverified from failed
              verification, and does not approve mission state on AI results
              alone.
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
          title="Design records the next team can continue"
          desc="Links model changes, work records and verification evidence, and tracks the latest configuration."
        />
        {!isUnlocked('handoff') && <LockedPanel previous="Prolog" />}
        <div className="knowledge-loop">
          {[
            [Box, 'MADE Model', 'Satellite composition and functions'],
            [BookOpen, 'Live Technical Manual', 'What is known now'],
            [Database, 'Prolog Reasoning', 'What is blocked'],
            [FileCheck2, 'Task Card', 'What to do next'],
            [Activity, 'Human + AI Cell', 'Doing the work and recording evidence'],
            [ShieldCheck, 'Human Sign-off', 'Updating baseline documents after review'],
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
            <h3>Reviewing ACRUX-II design problems with a MADE model.</h3>
          </div>
          <article>
            <strong>MSP</strong>
            <p>
              Provides the design problems, decision rationale and verification
              process of ACRUX-II, a student-led mission.
            </p>
          </article>
          <article>
            <strong>PHMT / MADE</strong>
            <p>
              Provides a model-based information framework linking functions,
              interfaces, failures, RAMS and verification.
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
              <RoleIcon name="Review the ADCS functional model draft" />
              Review the ADCS functional model draft
            </h3>
            <p>
              Explain the detumbling process, in which B-dot reduces the
              satellite’s rotation, with supporting document evidence, and mark
              the unconfirmed items.
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
            <p className="eyebrow">Acceptance criteria · self-check</p>
            <p className="note">
              These checks are not saved as actual approval records.
            </p>
            {[
              'Explained the function of each item in one sentence',
              'Classified inputs and outputs as Material / Energy / Data',
              'Defined flow properties and measurement conditions',
              'Marked assumptions and unconfirmed items (TBD)',
              'Recorded the reviewer and evidence links',
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
              Onboarding complete.
              <br />
              Start your first ADCS task.
            </h2>
            <p>
              Review the ADCS model with your supervising engineer. This course
              is not a qualification, and actual work requires the supervisor’s
              guidance and review.
            </p>
            <button className="primary" onClick={() => setResetOpen(true)}>
              <RotateCcw /> Restart the whole course
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
          <AlertDialogTitle>Reset learning records?</AlertDialogTitle>
          <AlertDialogDescription>
            Quiz answers and completion marks for all 6 sessions will be reset.
            Use this to start learning again from the beginning.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className="secondary">Cancel</AlertDialogCancel>
            <AlertDialogAction className="primary" onClick={resetAll}>
              Reset all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
