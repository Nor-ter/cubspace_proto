'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  Activity,
  BookOpen,
  Box,
  ChevronRight,
  Code2,
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
import { MiniQuiz } from '@/components/mini-quiz';
import {
  adcsNodes,
  learningPath,
  prologFacts,
  sourceCards,
  subsystems,
  quizOrder,
  quizzes,
  type QuizSection,
  type SubsystemKey,
} from '@/src/data/onboarding';

const nav = [
  ['home', 'Overview'],
  ['mission', 'Mission'],
  ['anatomy', '3D Anatomy'],
  ['model', 'System Model'],
  ['made', 'MADE Explorer'],
  ['prolog', 'Prolog'],
  ['handoff', 'Your First Task'],
] as const;

const missionStates = [
  {
    code: '01',
    name: 'RELEASE',
    detail: 'Deployment sensed · safe initialisation',
  },
  {
    code: '02',
    name: 'DETUMBLE',
    detail: 'Magnetometer → B-dot → Magnetorquer',
  },
  {
    code: '03',
    name: 'CONTACT',
    detail: 'Antenna deployed · ground link acquisition',
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
        <h2>{title}</h2>
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
        <p className="eyebrow">SECTION LOCKED</p>
        <h3>이전 세션의 Mini Quiz를 먼저 통과하세요.</h3>
        <p>
          {previous} Quiz에서 5/5를 받으면 이 학습 세션이 자동으로 열립니다.
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [activePage, setActivePage] = useState('home');
  const [selected, setSelected] = useState<SubsystemKey>('adcs');
  const [exploded, setExploded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [missionState, setMissionState] = useState(1);
  const [simTime, setSimTime] = useState(0);
  const [activeNode, setActiveNode] = useState(1);
  const [query, setQuery] = useState('contains(acrux2, X).');
  const [queryRun, setQueryRun] = useState(false);
  const [menu, setMenu] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const detail = useMemo(
    () => subsystems.find((s) => s.id === selected) ?? subsystems[0],
    [selected],
  );
  const simClock = `${String(Math.floor(simTime / 60)).padStart(2, '0')}:${String(simTime % 60).padStart(2, '0')}`;
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
    if (progressLoaded)
      localStorage.setItem(
        'cubspace-quiz-progress-v1',
        JSON.stringify(completed),
      );
  }, [completed, progressLoaded]);
  useEffect(() => {
    const syncFromHash = () => {
      const requested = location.hash.slice(1) || 'home';
      const quizIndex = quizOrder.indexOf(requested as QuizSection);
      const unlocked =
        requested === 'home' ||
        requested === 'mission' ||
        (quizIndex > 0 && completed.includes(quizOrder[quizIndex - 1]));
      if (nav.some(([id]) => id === requested) && unlocked)
        setActivePage(requested);
    };
    syncFromHash();
    addEventListener('popstate', syncFromHash);
    return () => removeEventListener('popstate', syncFromHash);
  }, [completed]);
  useEffect(() => {
    if (paused || activePage !== 'home') return;
    const timer = setInterval(() => setSimTime((t) => (t + 1) % 5400), 1000);
    return () => clearInterval(timer);
  }, [paused, activePage]);
  function isUnlocked(id: string) {
    if (id === 'home' || id === 'mission') return true;
    const index = quizOrder.indexOf(id as QuizSection);
    return index > 0 && completed.includes(quizOrder[index - 1]);
  }
  function go(id: string) {
    if (!isUnlocked(id)) return;
    history.pushState(null, '', id === 'home' ? location.pathname : `#${id}`);
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
    localStorage.removeItem('cubspace-quiz-progress-v1');
    go('mission');
  }

  return (
    <main>
      <header className="topbar">
        <button
          className="brand"
          onClick={() => go('home')}
          aria-label="맨 위로 이동"
        >
          <span className="brand-cube">
            <Box />
          </span>
          <strong>CubSpace</strong>
          <small>ACRUX-II / ENGINEER ONBOARDING</small>
        </button>
        <nav className={menu ? 'open' : ''} aria-label="주요 학습 섹션">
          {nav.map(([id, label]) => (
            <button
              key={id}
              className={activePage === id ? 'active' : ''}
              onClick={() => go(id)}
              disabled={!isUnlocked(id)}
            >
              {!isUnlocked(id) && <LockKeyhole />}
              {label}
            </button>
          ))}
        </nav>
        <div className="top-status">
          <span>{completed.length}/6 PASSED</span>
          <button
            className="reset-progress"
            onClick={resetAll}
            title="모든 Quiz 진행 초기화"
          >
            <RotateCcw /> RESET
          </button>
          <button
            className="menu-button"
            onClick={() => setMenu(!menu)}
            aria-label="메뉴 열기"
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <section
        id="home"
        className={`hero page-view ${activePage === 'home' ? 'active' : ''}`}
      >
        <div className="starfield" aria-hidden="true" />
        <div className="earth" aria-hidden="true">
          <div className="earth-glow" />
        </div>
        <div className="orbit-ring" aria-hidden="true" />
        <div className="hero-model">
          <CubeSatScene mode="orbit" paused={paused} />
        </div>
        <div className="hero-copy">
          <div className="kicker">
            <span className="live-dot" /> MISSION KNOWLEDGE // ONLINE
          </div>
          <h1>
            임무를 이해하고,
            <br />
            <em>지식을 연결하세요.</em>
          </h1>
          <p>
            ACRUX-II 1U CubeSat을 따라가며 시스템을 보고, 기능을 모델링하고,
            다음 엔지니어에게 근거를 남기는 온보딩입니다.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={() => go('mission')}>
              Start onboarding <ChevronRight />
            </button>
            <button className="secondary" onClick={() => setPaused(!paused)}>
              {paused ? <Play /> : <Pause />}
              {paused ? 'Resume orbit' : 'Pause orbit'}
            </button>
          </div>
        </div>
        <aside
          className="mission-console"
          aria-label="Conceptual mission state simulator"
        >
          <div className="mission-console-head">
            <div>
              <small>ACRUX-II / LIVE SIMULATION</small>
              <strong>MISSION STATE</strong>
            </div>
            <span>
              <Activity /> ONLINE
            </span>
          </div>
          <div className="mission-readouts">
            <div>
              <small>SIM TIME</small>
              <strong>T+ {simClock}</strong>
            </div>
            <div>
              <small>ORBIT</small>
              <strong>LEO / CONCEPTUAL</strong>
            </div>
          </div>
          <div className="state-track">
            {missionStates.map((state, index) => (
              <button
                key={state.code}
                className={missionState === index ? 'active' : ''}
                onClick={() => setMissionState(index)}
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
            교육용 상태 시각화입니다. 실제 궤도·비행 동역학 계산값이 아닙니다.
          </p>
        </aside>
        <button className="scroll-cue" onClick={() => go('mission')}>
          OPEN MISSION BRIEF <ChevronRight />
        </button>
      </section>

      <section
        id="mission"
        className={`section mission-section page-view ${activePage === 'mission' ? 'active' : ''}`}
      >
        <SectionHead
          index="01"
          eyebrow="MISSION CONTEXT"
          title="먼저, 왜 이 프로젝트가 필요한가"
          desc="CubeSat보다 먼저 알아야 할 것은 CubSpace가 해결하려는 문제입니다."
        />
        <div className="thesis-grid">
          <article className="statement-card">
            <p className="eyebrow">THE CONTINUITY PROBLEM</p>
            <h3>
              People carry mission knowledge.
              <br />
              <span>But people are temporary.</span>
            </h3>
            <p>
              학생 팀은 학기, 시험, 인턴십과 졸업을 거칩니다. 어렵게 쌓은 판단
              근거가 개인에게만 남으면 다음 팀은 같은 문제를 다시 배웁니다.
            </p>
          </article>
          <article className="statement-card accent">
            <p className="eyebrow">THE CUBSPACE PRINCIPLE</p>
            <h3>
              Engineers may leave.
              <br />
              <span>The mission carries on.</span>
            </h3>
            <p>
              모델, 문서, 규칙, Task Card, Evidence와 Sign-off를 연결해 임무가
              자신의 지식을 다음 엔지니어에게 전달하게 만듭니다.
            </p>
          </article>
        </div>
        <div className="learning-rail">
          {learningPath.map(([n, en, ko, d]) => (
            <button
              key={n}
              onClick={() => go(nav[Math.min(Number(n), 6)]?.[0] || 'home')}
            >
              <span>{n}</span>
              <div>
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
            <h3>작은 위성으로 우주에서 하드웨어를 검증합니다.</h3>
            <p>
              첫 성공은 실험 자체가 아닙니다. 배치 후 살아남고, 회전을 줄이고,
              안테나를 전개해 지상과 연결되어야 Deneb magnetorquer와 태양전지
              패널 데이터를 수집할 수 있습니다.
            </p>
          </div>
          <ol>
            <li>
              <span>01</span>
              <div>
                <strong>Initial Operations</strong>
                <p>전개 감지 → 열관리 → 자세 판단 · Detumbling → 안테나 전개</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Operational Phase</strong>
                <p>지상 통신, Power-positive 운용, 기술 실증 데이터 수집</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Extended Operations</strong>
                <p>장기 데이터와 임무 지식의 축적</p>
              </div>
            </li>
          </ol>
        </div>
        <MiniQuiz
          title={quizzes.mission.title}
          questions={quizzes.mission.questions}
          passed={completed.includes('mission')}
          onPass={() => passQuiz('mission')}
          onReset={() => resetFrom('mission')}
          nextLabel="Open 3D Anatomy"
          onNext={() => go('anatomy')}
        />
      </section>

      <section
        id="anatomy"
        className={`section dark-section page-view ${activePage === 'anatomy' ? 'active' : ''} ${isUnlocked('anatomy') ? '' : 'locked'}`}
      >
        <SectionHead
          index="02"
          eyebrow="INTERACTIVE SPACECRAFT"
          title="1U CubeSat 구조 탐색"
          desc="모델을 회전·확대하고 항목을 선택하세요. 선택한 시스템만 밝게 표시됩니다."
        />
        {!isUnlocked('anatomy') && <LockedPanel previous="Mission Context" />}
        <div className="anatomy-workspace">
          <div className="model-panel">
            <CubeSatScene
              mode="explore"
              selected={selected}
              exploded={exploded}
            />
            <div className="viewer-toolbar">
              <button
                onClick={() => setExploded(!exploded)}
                className={exploded ? 'active' : ''}
              >
                <Sparkles /> {exploded ? 'Assembled view' : 'Exploded view'}
              </button>
              <span>DRAG TO ROTATE · SCROLL TO ZOOM</span>
            </div>
          </div>
          <aside className="inspector">
            <div className="inspector-tabs">
              {subsystems.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s.id)}
                  className={selected === s.id ? 'active' : ''}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="inspector-body">
              <div className="inspector-top">
                <p className="eyebrow">SELECTED MODEL ELEMENT</p>
                <Status tone={selected === 'adcs' ? 'lime' : 'cyan'}>
                  {detail.status}
                </Status>
              </div>
              <h3>{detail.title}</h3>
              <p className="purpose">{detail.purpose}</p>
              <h4>MODEL COMPONENTS</h4>
              <div className="chip-row">
                {detail.components.map((x) => (
                  <span key={x}>{x}</span>
                ))}
              </div>
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
                  <strong>왜 ADCS부터 배우나요?</strong>
                  <p>
                    전개 직후 위성은 회전할 수 있습니다. 자기장을 읽고
                    magnetorquer로 토크를 만들어 각속도를 낮춰야 안정적인 통신과
                    실험이 가능합니다.
                  </p>
                </div>
              )}
              <p className="disclaimer">
                첨부 GLB 기반 교육용 구성입니다. 실제 ACRUX-II CAD 또는 확정
                설계가 아니며 축척과 포함 부품은 SME 검토가 필요합니다.
              </p>
            </div>
          </aside>
        </div>
        <MiniQuiz
          title={quizzes.anatomy.title}
          questions={quizzes.anatomy.questions}
          passed={completed.includes('anatomy')}
          onPass={() => passQuiz('anatomy')}
          onReset={() => resetFrom('anatomy')}
          nextLabel="Open System Model"
          onNext={() => go('model')}
        />
      </section>

      <section
        id="model"
        className={`section page-view ${activePage === 'model' ? 'active' : ''} ${isUnlocked('model') ? '' : 'locked'}`}
      >
        <SectionHead
          index="03"
          eyebrow="SYSTEM MODELING 101"
          title="MADE를 열기 전에, System Modeling부터"
          desc="모델은 예쁜 그림이 아니라 질문에 답할 수 있도록 연결한 공학 지식입니다."
        />
        {!isUnlocked('model') && <LockedPanel previous="Spacecraft Anatomy" />}
        <div className="definition">
          <Network />
          <div>
            <p className="eyebrow">ONE SENTENCE DEFINITION</p>
            <h3>
              System Modeling은 “무엇이 있고”를 넘어 “왜 존재하고, 무엇과
              연결되며, 어떻게 검증되는가”를 관계로 표현하는 일입니다.
            </h3>
          </div>
        </div>
        <div className="four-lenses">
          {[
            [
              '01',
              'REQUIREMENT',
              '무엇을 만족해야 하나?',
              '임무 목표와 성공 기준',
            ],
            ['02', 'FUNCTION', '무엇을 해야 하나?', '입력 → 변환 → 출력'],
            [
              '03',
              'PHYSICAL',
              '누가 그 기능을 수행하나?',
              'System → Subsystem → Component',
            ],
            [
              '04',
              'EVIDENCE',
              '어떻게 참임을 아나?',
              'Test · Analysis · Review · Sign-off',
            ],
          ].map(([n, en, q, a]) => (
            <article key={n}>
              <span>{n}</span>
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
              <h3>“위성의 회전을 줄인다”를 모델로 연결하면</h3>
            </div>
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
                <strong>{x}</strong>
                {i < 6 && <ChevronRight />}
              </div>
            ))}
          </div>
          <p className="note">
            이 연결이 있으면 설계가 바뀔 때 영향받는 기능·시험·문서를 찾을 수
            있습니다. 정확한 requirement ID와 수치는 승인된 모델에서 확인해야
            합니다.
          </p>
        </div>
        <div className="hierarchy">
          <div>
            <p className="eyebrow">PHYSICAL HIERARCHY</p>
            <h3>Part-pair &lt; Component &lt; Subsystem &lt; System</h3>
          </div>
          {[
            ['Part-pair', 'Bolt ↔ Nut', '두 물리 부품의 상호작용'],
            ['Component', 'Magnetometer', '독립된 입력·출력과 기능'],
            ['Subsystem', 'ADCS', '주요 위성 능력'],
            ['System', 'ACRUX-II', '완전한 임무 시스템'],
          ].map(([a, b, c]) => (
            <article key={a}>
              <small>{a}</small>
              <strong>{b}</strong>
              <p>{c}</p>
            </article>
          ))}
        </div>
        <MiniQuiz
          title={quizzes.model.title}
          questions={quizzes.model.questions}
          passed={completed.includes('model')}
          onPass={() => passQuiz('model')}
          onReset={() => resetFrom('model')}
          nextLabel="Open MADE Explorer"
          onNext={() => go('made')}
        />
      </section>

      <section
        id="made"
        className={`section made-section page-view ${activePage === 'made' ? 'active' : ''} ${isUnlocked('made') ? '' : 'locked'}`}
      >
        <SectionHead
          index="04"
          eyebrow="MADE MODEL EXPLORER"
          title="ADCS를 Functional Flow로 읽기"
          desc="첨부 MADE 화면의 블록·인터페이스 문법을 초보자가 읽기 쉬운 형태로 재구성했습니다."
        />
        {!isUnlocked('made') && <LockedPanel previous="System Modeling" />}
        <div className="made-window">
          <div className="made-menubar">
            <div className="made-logo">
              MADE <span>MODEL VIEW</span>
            </div>
            <div>
              File&nbsp;&nbsp; Edit&nbsp;&nbsp; View&nbsp;&nbsp; Analysis
            </div>
            <Status tone="lime">ADCS / ACTIVE</Status>
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
            <div className="diagram-canvas">
              <div className="canvas-meta">
                <span>ACTUATION SYSTEM / FUNCTIONAL MODEL</span>
                <span>FLOW LABELS ON</span>
              </div>
              <div className="node-flow">
                {adcsNodes.map((node, i) => (
                  <button
                    key={node.id}
                    onClick={() => setActiveNode(i)}
                    className={activeNode === i ? 'active' : ''}
                  >
                    <small>{node.type.toUpperCase()}</small>
                    <strong>{node.name}</strong>
                    <span>{node.fn}</span>
                    {i < adcsNodes.length - 1 && (
                      <i>
                        <b>{node.flow}</b> →
                      </i>
                    )}
                  </button>
                ))}
              </div>
              <div className="axis-flows">
                <span>X-AXIS · electrical current → magnetic torque</span>
                <span>Y-AXIS · electrical current → magnetic torque</span>
                <span>Z-AXIS · electrical current → magnetic torque</span>
              </div>
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
              <small>FUNCTION</small>
              <h3>무엇을 변환하는가?</h3>
              <p>Magnetometer는 자기장을 측정 가능한 디지털 값으로 바꿉니다.</p>
            </div>
          </article>
          <ChevronRight />
          <article>
            <span>02</span>
            <div>
              <small>FUNCTIONAL FLOW</small>
              <h3>무엇이 이동하는가?</h3>
              <p>
                자기장은 Energy, 측정값과 명령은 Data, 토크는 Energy flow입니다.
              </p>
            </div>
          </article>
          <ChevronRight />
          <article>
            <span>03</span>
            <div>
              <small>FLOW PROPERTY</small>
              <h3>무엇을 측정할 것인가?</h3>
              <p>µT, Hz, V, A, A·m², N·m, °/s처럼 단위가 있는 특성입니다.</p>
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
            <h3>MADE UI에서 가져온 시각 문법</h3>
            <p>
              블록은 모델 항목, 화살표는 Functional Flow, 색상과 라벨은 Flow
              Type과 측정 속성을 나타냅니다. 위 이미지는 제공된 참고 화면이며,
              웹의 ADCS 모델은 교육용으로 단순화했습니다.
            </p>
          </div>
        </div>
        <MiniQuiz
          title={quizzes.made.title}
          questions={quizzes.made.questions}
          passed={completed.includes('made')}
          onPass={() => passQuiz('made')}
          onReset={() => resetFrom('made')}
          nextLabel="Open Prolog Guide"
          onNext={() => go('prolog')}
        />
      </section>

      <section
        id="prolog"
        className={`section prolog-section page-view ${activePage === 'prolog' ? 'active' : ''} ${isUnlocked('prolog') ? '' : 'locked'}`}
      >
        <SectionHead
          index="05"
          eyebrow="KNOWLEDGE REASONING"
          title="왜 Prolog가 CubSpace의 핵심 언어인가"
          desc="MADE가 시스템의 구조와 거동을 담는다면, Prolog는 무엇이 연결되고 준비되었는지 질의합니다."
        />
        {!isUnlocked('prolog') && <LockedPanel previous="MADE Explorer" />}
        <div className="two-roles">
          <article>
            <Box />
            <small>MADE</small>
            <h3>What is the spacecraft?</h3>
            <p>
              구성, 기능, 인터페이스, 고장과 검증 관계를 시스템 모델로
              표현합니다.
            </p>
          </article>
          <div className="bridge">
            <Network />
            <span>MODEL FACTS</span>
          </div>
          <article>
            <Code2 />
            <small>PROLOG</small>
            <h3>What follows from what we know?</h3>
            <p>
              의존성, 누락 근거, 차단된 Task와 readiness를 사실·규칙·질의로
              추론합니다.
            </p>
          </article>
        </div>
        <div className="prolog-lab">
          <div className="code-pane">
            <div className="code-head">
              <span>knowledge/adcs.pl</span>
              <span>FACTS + RULES</span>
            </div>
            <pre>{prologFacts}</pre>
          </div>
          <div className="query-pane">
            <p className="eyebrow">TRY A QUERY</p>
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
              <button onClick={() => setQueryRun(true)}>RUN</button>
            </div>
            {queryRun && (
              <div className="result">
                {query.startsWith('component') ? (
                  <>
                    X = magnetometer;
                    <br />X = deneb_magnetorquer.
                  </>
                ) : query.startsWith('ready') ? (
                  <>
                    false.
                    <br />
                    <small>
                      evidence(adcs_test) 또는 human_signed(adcs_test)가 아직
                      확인되지 않았습니다.
                    </small>
                  </>
                ) : (
                  <>
                    X = adcs;
                    <br />X = magnetometer;
                    <br />X = deneb_magnetorquer.
                  </>
                )}
              </div>
            )}
            <div className="prolog-steps">
              <p>
                <b>Fact</b> 승인된 관계를 기록합니다.
              </p>
              <p>
                <b>Rule</b> 여러 사실에서 새 상태를 도출합니다.
              </p>
              <p>
                <b>Query</b> “무엇이 막혔나?”를 시스템에 묻습니다.
              </p>
            </div>
          </div>
        </div>
        <div className="warning-band">
          <ShieldCheck />
          <div>
            <strong>중요: “증명되지 않음”은 “거짓”과 다릅니다.</strong>
            <p>
              Prolog의 negation as failure는 근거를 찾지 못했다는 뜻입니다.
              CubSpace에서도 미검증과 검증 실패를 분리하고, AI 결과만으로
              mission state를 승인하지 않습니다.
            </p>
          </div>
        </div>
        <MiniQuiz
          title={quizzes.prolog.title}
          questions={quizzes.prolog.questions}
          passed={completed.includes('prolog')}
          onPass={() => passQuiz('prolog')}
          onReset={() => resetFrom('prolog')}
          nextLabel="Open Your First Task"
          onNext={() => go('handoff')}
        />
      </section>

      <section
        id="handoff"
        className={`section handoff-section page-view ${activePage === 'handoff' ? 'active' : ''} ${isUnlocked('handoff') ? '' : 'locked'}`}
      >
        <SectionHead
          index="06"
          eyebrow="MISSION KNOWLEDGE NETWORK"
          title="Engineering Documentation Network가 임무를 이어갑니다"
          desc="문서를 쌓는 것이 아니라 모델과 업무, 근거가 서로를 가리키게 만듭니다."
        />
        {!isUnlocked('handoff') && <LockedPanel previous="Prolog Reasoning" />}
        <div className="knowledge-loop">
          {[
            [Box, 'MADE Model', '우주선은 무엇인가'],
            [BookOpen, 'Live Technical Manual', '현재 무엇을 아는가'],
            [Database, 'Prolog Reasoning', '무엇이 막혔는가'],
            [FileCheck2, 'Task Card', '다음에 무엇을 할까'],
            [Activity, 'Human + AI Cell', '업무와 근거 생산'],
            [ShieldCheck, 'Human Sign-off', '지식 기준선 갱신'],
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
              현실의 임무와 모델링 환경이 연결될 때 온보딩이 실제 업무가 됩니다.
            </h3>
          </div>
          <article>
            <strong>MSP</strong>
            <p>
              ACRUX-II라는 실제 학생 주도 임무, 문제, 엔지니어링 판단과 검증
              맥락을 제공합니다.
            </p>
          </article>
          <article>
            <strong>PHMT / MADE</strong>
            <p>
              기능·인터페이스·고장·RAMS·검증을 연결하는 모델 기반 backbone을
              제공합니다.
            </p>
          </article>
        </div>
        <div className="first-task">
          <div className="task-main">
            <div className="task-id">
              TASK-ADCS-001 <Status tone="amber">SUPERVISED</Status>
            </div>
            <h3>ADCS 기능 모델 초안 검토</h3>
            <p>
              Magnetometer → B-dot → Magnetorquer detumbling chain을 문서 근거와
              함께 설명하고, 확정되지 않은 항목을 표시하세요.
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
            <p className="eyebrow">DEFINITION OF DONE</p>
            {[
              '각 Item의 function이 한 문장이다',
              '입력·출력이 Material / Energy / Data로 분류된다',
              'Flow property가 측정 가능하다',
              'Assumption / TBD가 숨겨지지 않는다',
              '검토자와 근거 링크가 남는다',
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
        <MiniQuiz
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
              모델은 지식을 남기고,
              <br />
              근거는 임무를 앞으로 보냅니다.
            </h2>
            <p>
              이제 첫 ADCS Task를 지도자와 함께 시작하세요. 이 과정은 자격
              인증이 아니라 supervised modeling을 위한 출발점입니다.
            </p>
            <button className="primary" onClick={resetAll}>
              <RotateCcw /> 전체 과정을 다시 시작하기
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
    </main>
  );
}
