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
  ['home', '시작'],
  ['mission', '임무 이해'],
  ['anatomy', '위성 구조'],
  ['model', '시스템 모델'],
  ['made', 'MADE 탐색'],
  ['prolog', 'Prolog'],
  ['handoff', '첫 번째 과제'],
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
        <p className="eyebrow">SECTION LOCKED</p>
        <h3>
          <RoleIcon name="이전 세션의 Mini Quiz를 먼저 통과하세요." />
          이전 세션의 Mini Quiz를 먼저 통과하세요.
        </h3>
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
        학습 내용으로 이동
      </a>
      <header className="topbar">
        <button
          className="brand"
          onClick={() => go('home')}
          aria-label="CubSpace 시작 화면"
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
          aria-label="주요 학습 섹션"
        >
          {nav.map(([id, label]) => (
            <button
              key={id}
              className={activePage === id ? 'active' : ''}
              onClick={() => go(id)}
              disabled={!isUnlocked(id)}
              aria-current={activePage === id ? 'page' : undefined}
              title={
                !isUnlocked(id) ? '이전 세션의 퀴즈를 완료하면 열립니다' : label
              }
            >
              {!isUnlocked(id) && <LockKeyhole />}
              {label}
            </button>
          ))}
        </nav>
        <div className="top-status">
          <span>{completed.length}/6 완료</span>
          <button
            className="reset-progress"
            onClick={() => setResetOpen(true)}
            title="모든 Quiz 진행 초기화"
          >
            <RotateCcw /> <span>초기화</span>
          </button>
          <button
            className="menu-button"
            onClick={() => setMenu(!menu)}
            aria-label={menu ? '메뉴 닫기' : '메뉴 열기'}
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
            <span className="review-mode">검토 모드 · 잠금 없이 탐색</span>
          )}
          <button
            onClick={() =>
              document
                .querySelector(`#${activePage} .mini-quiz`)
                ?.scrollIntoView({ behavior: 'auto', block: 'start' })
            }
          >
            이해도 확인
            <ChevronRight />
          </button>
        </div>
      )}
      {storageError && (
        <p className="storage-notice" role="alert">
          브라우저 저장소를 사용할 수 없어 이번 세션에서만 학습 기록이
          유지됩니다.
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
            <CubeSatScene mode="orbit" paused={paused} />
          )}
        </div>
        <div className="hero-copy">
          <div className="kicker">
            <span className="live-dot" /> CUBSPACE / ENGINEERING ONBOARDING
          </div>
          <h1>
            임무를 이해하고, <em>지식을 연결하세요.</em>
          </h1>
          <p>
            ACRUX-II 1U CubeSat을 따라가며 시스템을 보고, 기능을 모델링하고,
            다음 엔지니어에게 근거를 남기는 온보딩입니다.
          </p>
          <div className="hero-actions">
            <button
              className="primary"
              onClick={() =>
                go(quizOrder.find((id) => !completed.includes(id)) ?? 'handoff')
              }
            >
              {completed.length ? '학습 이어가기' : '온보딩 시작'}{' '}
              <ChevronRight />
            </button>
            <button className="secondary" onClick={() => setPaused(!paused)}>
              {paused ? <Play /> : <Pause />}
              {paused ? '궤도 재생' : '궤도 일시정지'}
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
              <strong>초기 임무 순서</strong>
            </div>
            <span>
              <Activity /> 교육용
            </span>
          </div>
          <div className="mission-readouts">
            <div>
              <small>재생 시간</small>
              <strong>T+ {simClock}</strong>
            </div>
            <div>
              <small>ORBIT</small>
              <strong>개념 원궤도 / 축척 아님</strong>
            </div>
          </div>
          <div className="state-track">
            {missionStates.map((state, index) => (
              <button
                key={state.code}
                aria-pressed={missionState === index}
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
            교육용 원궤도입니다. 지구·위성 크기, 궤도 고도와 재생 속도는 실제
            축척이 아닙니다. 회전 감소 제어와 공전은 별개입니다.
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
          title="먼저, 왜 이 프로젝트가 필요한가"
          desc="CubeSat보다 먼저 알아야 할 것은 CubSpace가 해결하려는 문제입니다."
        />
        <div className="thesis-grid">
          <article className="statement-card">
            <p className="eyebrow">THE CONTINUITY PROBLEM</p>
            <h3>
              People carry mission knowledge.{' '}
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
              Engineers may leave. <span>The mission carries on.</span>
            </h3>
            <p>
              모델, 문서, 규칙, Task Card, Evidence와 Sign-off를 연결해 다음
              엔지니어가 판단의 근거를 추적할 수 있게 합니다.
            </p>
          </article>
        </div>
        <p className="note">
          학습 자료 7개 · 임무 이해에서 첫 두 주제를 함께 다루며, 이해도 퀴즈는
          총 6개 세션입니다.
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
              <RoleIcon name="작은 위성으로 우주에서 하드웨어를 검증합니다." />
              작은 위성으로 우주에서 하드웨어를 검증합니다.
            </h3>
            <p>
              일차 성공 기준은 전개 절차 완료와 지상 통신 확보입니다. 분리 후
              생존하고, 회전을 줄이고, 안테나를 전개해 지상과 연결되어야 Deneb
              magnetorquer와 태양전지 패널 데이터를 수집할 수 있습니다.
            </p>
          </div>
          <ol>
            <li>
              <span>01</span>
              <div>
                <strong>Initial Operations</strong>
                <p>
                  분리 감지 → 열관리 → 자세 판단·회전 감소 → 안테나 전개 (저전력
                  예외는 아래 참조)
                </p>
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
        <EngineeringNotes section="mission" />
        <MiniQuiz
          key={`mission-${resetGeneration}`}
          title={quizzes.mission.title}
          questions={quizzes.mission.questions}
          passed={completed.includes('mission')}
          onPass={() => passQuiz('mission')}
          onReset={() => resetFrom('mission')}
          nextLabel="다음 · 위성 구조"
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
          eyebrow="INTERACTIVE SPACECRAFT"
          title="1U CubeSat 구조 탐색"
          desc="모델을 회전·확대하고 항목을 선택하세요. 선택한 시스템만 밝게 표시됩니다."
        />
        {!isUnlocked('anatomy') && <LockedPanel previous="Mission Context" />}
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
                <Sparkles /> {exploded ? '조립 상태 보기' : '분해 상태 보기'}
              </button>
              <span>드래그로 회전 · 스크롤로 확대/축소</span>
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
        <EngineeringNotes section="anatomy" />
        <MiniQuiz
          key={`anatomy-${resetGeneration}`}
          title={quizzes.anatomy.title}
          questions={quizzes.anatomy.questions}
          passed={completed.includes('anatomy')}
          onPass={() => passQuiz('anatomy')}
          onReset={() => resetFrom('anatomy')}
          nextLabel="다음 · 시스템 모델"
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
          title="MADE를 열기 전에, System Modeling부터"
          desc="모델은 요구사항, 기능, 구현과 검증 근거를 연결해 공학적 질문에 답합니다."
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
              <RoleIcon name={en} />
              <small>{en}</small>
              <h3>
                <RoleIcon name={en} />
                {q}
              </h3>
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
                <RoleIcon name="“위성의 회전을 줄인다”를 모델로 연결하면" />
                “위성의 회전을 줄인다”를 모델로 연결하면
              </h3>
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
                <RoleIcon name={x} />
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
            <h3>
              문서의 계층 규약: Part-pair → Component → Subsystem → System
            </h3>
          </div>
          {[
            ['Part-pair', 'Bolt ↔ Nut', '두 물리 부품의 상호작용'],
            ['Component', 'Magnetometer', '독립된 입력·출력과 기능'],
            ['Subsystem', 'ADCS', '주요 위성 능력'],
            ['System', 'ACRUX-II', '완전한 임무 시스템'],
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
          nextLabel="다음 · MADE 탐색"
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
          title="MADE로 시스템을 한눈에 읽기"
          desc="MADE는 기능과 고장 의존성을 연결해 신뢰성·가용성·정비성·안전성(RAMS)을 분석하는 모델 기반 도구입니다."
        />
        {!isUnlocked('made') && <LockedPanel previous="System Modeling" />}
        <div className="made-intro">
          <article>
            <RoleIcon name="model" />
            <small>01 · MODEL</small>
            <h3>
              <RoleIcon name="하나의 시스템 그림" />
              하나의 시스템 그림
            </h3>
            <p>
              SysML, CAD, BOM과 엔지니어의 지식을 공통 모델로 모아 구조와 기능을
              같은 맥락에서 봅니다.
            </p>
          </article>
          <article>
            <RoleIcon name="trace" />
            <small>02 · CONNECT</small>
            <h3>
              <RoleIcon name="기능과 고장을 연결" />
              기능과 고장을 연결
            </h3>
            <p>
              무엇이 무엇을 작동시키고, 한 고장이 다음 기능에 어떻게 전파되는지
              관계로 표현합니다.
            </p>
          </article>
          <article>
            <RoleIcon name="evidence" />
            <small>03 · ANALYSE</small>
            <h3>
              <RoleIcon name="RAMS 분석을 반복 가능하게" />
              RAMS 분석을 반복 가능하게
            </h3>
            <p>
              연결된 모델을 바탕으로 FMEA·FTA 같은 분석을 자동화하고 설계 변경의
              영향을 다시 확인합니다.
            </p>
          </article>
        </div>
        <div className="made-window">
          <div className="made-menubar">
            <div className="made-logo">
              MADE <span>MODEL VIEW</span>
            </div>
            <span>교육용 기능 모델</span>
            <Status tone="lime">ADCS / 교육 예제</Status>
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
              aria-label="ADCS 기능 모델 · 가로 스크롤로 전체 흐름 탐색"
            >
              <p className="canvas-hint">
                블록을 클릭하면 설명이 열립니다. 휠로 확대·축소하고 빈 공간을
                드래그해 이동하세요.
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
              <h3>
                <RoleIcon name="무엇을 변환하는가?" />
                무엇을 변환하는가?
              </h3>
              <p>Magnetometer는 자기장을 측정 가능한 디지털 값으로 바꿉니다.</p>
            </div>
          </article>
          <ChevronRight />
          <article>
            <span>02</span>
            <div>
              <RoleIcon name="flow" />
              <small>FUNCTIONAL FLOW</small>
              <h3>
                <RoleIcon name="무엇이 이동하는가?" />
                무엇이 이동하는가?
              </h3>
              <p>
                문서에서는 자기·기계적 상호작용을 Energy, 측정값·명령을 Data로
                분류합니다. 자기장 센서는 외부 자기장으로 구동되는 발전기가
                아닙니다.
              </p>
            </div>
          </article>
          <ChevronRight />
          <article>
            <span>03</span>
            <div>
              <RoleIcon name="property" />
              <small>FLOW PROPERTY</small>
              <h3>
                <RoleIcon name="무엇을 측정할 것인가?" />
                무엇을 측정할 것인가?
              </h3>
              <p>
                물리량의 값·단위·범위·측정 조건을 정의합니다. 상태 플래그는 단위
                대신 의미와 허용값을 명시합니다.
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
              <RoleIcon name="MADE UI에서 가져온 시각 문법" />
              MADE UI에서 가져온 시각 문법
            </h3>
            <p>
              블록은 모델 항목, 화살표는 Functional Flow, 색상과 라벨은 Flow
              Type과 측정 속성을 나타냅니다. 위 이미지는 제공된 참고 화면이며,
              웹의 ADCS 모델은 교육용으로 단순화했습니다.
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
          nextLabel="다음 · Prolog Guide"
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
          title="Prolog는 관계를 따라 답을 찾습니다"
          desc="코드를 외우기 전에, 위성–서브시스템–부품 관계를 나무처럼 따라가며 Prolog의 사고방식을 이해합니다."
        />
        {!isUnlocked('prolog') && <LockedPanel previous="MADE Explorer" />}
        <div className="prolog-lab">
          <PrologViewer />
          <div className="query-pane">
            <p className="eyebrow">교육용 질의 예제</p>
            <p className="note">
              아래 세 가지 질의만 지원합니다. Prolog 실행기나 실제 운용 준비
              판정기가 아닙니다.
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
              <button onClick={() => setQueryRun(true)}>결과 보기</button>
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
                      evidence(adcs_test) 또는 human_signed(adcs_test)가 아직
                      확인되지 않았습니다.
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
                    지원하지 않는 질의입니다. 위의 세 예제 중 하나를 선택하세요.
                    입력에 대한 추론 결과는 생성하지 않았습니다.
                  </p>
                )}
              </div>
            )}
            <div className="prolog-steps">
              <p>
                <b>Fact</b> 관계를 진술합니다. 출처와 승인 상태는 별도로
                관리합니다.
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
        <EngineeringNotes section="prolog" />
        <MiniQuiz
          key={`prolog-${resetGeneration}`}
          title={quizzes.prolog.title}
          questions={quizzes.prolog.questions}
          passed={completed.includes('prolog')}
          onPass={() => passQuiz('prolog')}
          onReset={() => resetFrom('prolog')}
          nextLabel="다음 · 첫 번째 과제"
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
          title="설계 기록과 검증 근거를 다음 팀에 연결합니다"
          desc="모델 변경, 업무 기록과 검증 근거를 서로 연결하고 최신 형상을 추적합니다."
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
              기능·인터페이스·고장·RAMS·검증을 연결하는 모델 기반 정보 체계을
              제공합니다.
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
              <RoleIcon name="ADCS 기능 모델 초안 검토" />
              ADCS 기능 모델 초안 검토
            </h3>
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
            <p className="eyebrow">완료 기준 · 자기점검</p>
            <p className="note">
              이 체크는 실제 승인 기록으로 저장되지 않습니다.
            </p>
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
              모델은 지식을 남기고,
              <br />
              근거는 임무를 앞으로 보냅니다.
            </h2>
            <p>
              이제 첫 ADCS Task를 지도자와 함께 시작하세요. 이 과정은 자격
              인증이 아니라 supervised modeling을 위한 출발점입니다.
            </p>
            <button className="primary" onClick={() => setResetOpen(true)}>
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
      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent className="reset-dialog">
          <AlertDialogTitle>학습 기록을 초기화할까요?</AlertDialogTitle>
          <AlertDialogDescription>
            6개 세션의 퀴즈 답안과 완료 표시가 모두 초기화됩니다. 처음부터 다시
            학습할 때 사용하세요.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className="secondary">취소</AlertDialogCancel>
            <AlertDialogAction className="primary" onClick={resetAll}>
              전체 초기화
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
