'use client';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import {
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Check,
  Box,
  Orbit,
  Layers,
  Route,
  ShieldCheck,
  ClipboardCheck,
  Sun,
  Moon,
  Download,
} from 'lucide-react';
import {
  subsystems,
  components,
  phases,
  modes,
  stages,
  chains,
  failures,
  rams,
  analyses,
  hierarchy,
  uncertainties,
  questions,
  assignmentFields,
  moduleTitles,
  moduleEnglish,
  conops,
  model,
  spec,
  type Entity,
  type SourceReference,
  type Status,
} from '../src/data/content';
import {
  freshState,
  restoreState,
  grade,
  moveItem,
  type LearningState,
} from '../src/learning';
const KEY = 'cubspace-phase1-v1';
const icons = [Orbit, Box, Route, Layers, ShieldCheck, ClipboardCheck];
const leads = [
  '실험보다 먼저, 안전한 전개와 첫 통신이 필요합니다.',
  '위성의 각 부분은 어떤 임무 기능을 담당할까요?',
  '발사체에서 나온 위성이 첫 통신에 이르는 경로를 따라가세요.',
  '물리적 하드웨어를 Function → Functional Flow → Flow Property로 표현합니다.',
  '하나의 고장이 어떻게 임무 전체로 이어지는지 추적하세요.',
  '배운 내용을 확인하고 첫 번째 기능 모델 초안을 작성하세요.',
];
function Sources({ refs }: { refs: SourceReference[] }) {
  return (
    <details className="sources">
      <summary>출처 및 적용 범위</summary>
      {refs.map((r, i) => (
        <p key={i}>
          {r.document} · {r.section}
          {r.page ? ` · p.${r.page}` : ''}
          {r.note ? ` — ${r.note}` : ''}
        </p>
      ))}
    </details>
  );
}
function Badge({ status }: { status: Status }) {
  return (
    <span className={`badge status-${status.toLowerCase()}`}>{status}</span>
  );
}
function Choices({
  items,
  value,
  onChange,
  label,
}: {
  items: string[];
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  return (
    <fieldset className="choices" aria-label={label}>
      {items.map((x, i) => (
        <Button
          variant={value === i ? 'default' : 'outline'}
          aria-pressed={value === i}
          key={x}
          onClick={() => onChange(i)}
        >
          {x}
        </Button>
      ))}
    </fieldset>
  );
}
function Active({ ids }: { ids: string[] }) {
  return (
    <div className="active-subsystems">
      {subsystems.map((s) => (
        <span key={s.id} className={ids.includes(s.id) ? 'on' : ''}>
          {s.id.toUpperCase()}
        </span>
      ))}
    </div>
  );
}
function SourceLedger() {
  return (
    <details className="panel ledger">
      <summary>
        출처 상태와 아직 확인할 사항 <span>6개 항목</span>
      </summary>
      <p>
        Confirmed = 제공 문서에 명시. 비행 검증 완료 또는 최신 승인 설계를
        의미하지 않습니다. Historical = 과거 자료로 현재 설계에 자동 적용하지
        않습니다.
      </p>
      <div className="grid two">
        {uncertainties.map((u) => (
          <article key={u.title} className="note">
            <Badge status={u.status} />
            <h3>{u.title}</h3>
            <p>{u.text}</p>
            <Sources refs={u.sourceRefs} />
          </article>
        ))}
      </div>
    </details>
  );
}
function Mission() {
  const [phase, setPhase] = useState(0);
  const [mode, setMode] = useState(0);
  const p = phases[phase];
  return (
    <>
      <div className="section-label">
        <span>ACRUX-2 · 1U TECHNOLOGY DEMONSTRATION</span>
        <Badge status="Confirmed" />
      </div>
      <div className="mission-layout">
        <section className="panel mission">
          <p className="eyebrow">MISSION PHASE 0{phase + 1}</p>
          <h2>{p.ko}</h2>
          <p>{p.description}</p>
          <h3>활성 Subsystems</h3>
          <Active ids={p.active} />
          <div className="success">
            <Check size={19} />
            {p.success}
          </div>
          <Sources refs={p.sourceRefs} />
        </section>
        <aside className="panel objective">
          <p className="eyebrow">WHY THIS MISSION?</p>
          <h2>
            작은 위성으로
            <br />
            하드웨어를 검증하다
          </h2>
          <dl>
            <dt>ETP solar panels</dt>
            <dd>태양전지판 성능 데이터</dd>
            <dt>Deneb magnetorquer</dt>
            <dd>회전 감소와 소비 전력 데이터</dd>
          </dl>
          <small>이 앱은 실제 궤도·전력 해석 결과를 계산하지 않습니다.</small>
        </aside>
      </div>
      <fieldset
        className="mission-timeline"

        aria-label="임무 단계 선택"
      >
        {phases.map((x, i) => (
          <button
            className={phase === i ? 'selected' : ''}
            key={x.title}
            onClick={() => setPhase(i)}
            aria-pressed={phase === i}
          >
            <span className="number">0{i + 1}</span>
            <span>
              {x.title}
              <small>
                {['전개와 첫 통신', '실험과 성능 데이터', '장기 운용'][i]}
              </small>
            </span>
            <ArrowRight size={18} />
          </button>
        ))}
      </fieldset>
      <section className="panel">
        <h2>전력이 달라지면, 임무도 달라집니다</h2>
        <p>Power mode를 선택해 운용 개념을 비교하세요.</p>
        <Choices
          label="Power mode"
          items={modes.map((x) => x.name)}
          value={mode}
          onChange={setMode}
        />
        <div className="mode-result" aria-live="polite">
          <strong>{modes[mode].range}</strong>
          <div>
            <Badge status="Assumption" />
            <p>{modes[mode].text}</p>
          </div>
        </div>
        <p className="muted">
          Current ConOps assumption. 40% 경계 중복과 방전 깊이 목표는 아래 확인
          사항에 남겨두었습니다. 이 선택기는 실제 충전 상태를 계산하지 않습니다.
        </p>
        <Sources refs={[conops('§4.2', 4), conops('§4.2 continued', 5)]} />
      </section>
      <SourceLedger />
    </>
  );
}
function EntityPanel({
  entity,
  onModel,
}: {
  entity: Entity;
  onModel?: () => void;
}) {
  return (
    <article className="panel entity-detail">
      <div className="section-label">
        <span>
          {entity.level.toUpperCase()} / {entity.parentId?.toUpperCase()}
        </span>
        <Badge status={entity.status} />
      </div>
      <h2>{entity.name}</h2>
      <p>{entity.purpose}</p>
      <div className="function">
        <h3>Function</h3>
        <p>{entity.function}</p>
      </div>
      {entity.components.length > 0 && (
        <>
          <h3>구성 요소 · 문서상의 개념</h3>
          <ul>
            {entity.components.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </>
      )}
      <div className="grid two">
        {(['inputs', 'outputs'] as const).map((direction) => (
          <div key={direction}>
            <h3>{direction === 'inputs' ? '↘ Inputs' : '↗ Outputs'}</h3>
            {entity[direction].map((f) => (
              <div className="interface" key={f.name}>
                <span className={`flow-type ${f.type.toLowerCase()}`}>
                  {f.type}
                </span>
                <p>{f.name}</p>
                <small>{f.properties.join(' · ')}</small>
              </div>
            ))}
          </div>
        ))}
      </div>
      <h3>연결된 엔티티</h3>
      <p>
        {entity.connections
          .map(
            (id) =>
              [...subsystems, ...components]
                .find((x) => x.id === id)
                ?.name.split(' · ')[0] || id,
          )
          .join(' ↔ ')}
      </p>
      <div className="warning">
        <strong>예시 고장</strong>
        <p>{entity.failure}</p>
        <small>교육용 영향 설명이며 완성된 FMECA가 아닙니다.</small>
      </div>
      <Sources refs={entity.sourceRefs} />
      {onModel && (
        <Button variant="outline" onClick={onModel}>
          기능 모델에서 살펴보기 <ArrowRight />
        </Button>
      )}
    </article>
  );
}
function Anatomy({ onModel }: { onModel: (id: string) => void }) {
  const [selected, setSelected] = useState(0);
  const s = subsystems[selected];
  return (
    <>
      <div className="anatomy-layout">
        <section className="panel schematic">
          <div className="section-label">
            <span>1U / CONCEPTUAL SECTION</span>
            <Box size={18} />
          </div>
          <fieldset
            className="cube-diagram"

            aria-label="개념적 1U 위성의 Subsystem 선택"
          >
            <div className="solar-edge">SOLAR PANEL SURFACES · EPS</div>
            <div className="cube-inner">
              <p className="cube-caption">PCB STACK / BATTERY REGION</p>
              {[0, 1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  aria-pressed={selected === i}
                  className={selected === i ? 'selected' : ''}
                >
                  <span>{subsystems[i].id.toUpperCase()}</span>
                  <small>
                    {
                      [
                        'Processing & memory',
                        'Magnetic sensing & control',
                        'Power & thermal management',
                        'Radio & antenna',
                        'Chassis & deployment interface',
                      ][i]
                    }
                  </small>
                </button>
              ))}
            </div>
            <div className="solar-edge">ANTENNA / DEPLOYER INTERFACE</div>
          </fieldset>
          <p className="diagram-disclaimer">
            Conceptual educational configuration — not actual ACRUX-2 CAD, not
            to scale.
          </p>
          <p className="muted">
            논리적 단면 도식입니다. 버튼으로 Subsystem을 선택할 수 있으며 실제
            적층 순서·치수를 나타내지 않습니다.
          </p>
          <Sources refs={[model('§1.2–1.3')]} />
        </section>
        <EntityPanel entity={s} onModel={() => onModel(s.id)} />
      </div>
      <SourceLedger />
    </>
  );
}
function Sequence() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const s = stages[step];
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(
      () =>
        setStep((n) => {
          if (n >= stages.length - 2) setPlaying(false);
          return Math.min(n + 1, stages.length - 1);
        }),
      6000,
    );
    return () => clearInterval(timer);
  }, [playing]);
  useEffect(() => {
    const handler = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);
  function go(n: number) {
    setPlaying(false);
    setStep(n);
  }
  return (
    <>
      <fieldset className="sequence-list" aria-label="전개 단계">
        {stages.map((x, i) => (
          <button
            key={x.title}
            className={step === i ? 'selected' : i < step ? 'visited' : ''}
            aria-pressed={step === i}
            onClick={() => go(i)}
          >
            <span>{String(i + 1).padStart(2, '0')}</span>
            {x.title}
          </button>
        ))}
      </fieldset>
      <Progress
        value={((step + 1) / stages.length) * 100}
        aria-label="전개 시퀀스 진행"
      />
      <section className="panel stage">
        <div className="section-label">
          <span>STAGE {String(step + 1).padStart(2, '0')} / 07</span>
          <span>{s.en}</span>
        </div>
        <h2>{s.title}</h2>
        <p>{s.text}</p>
        <Active ids={s.active} />
        <div className="grid two">
          <div className="interface">
            <h3>Input</h3>
            <p>{s.input}</p>
          </div>
          <div className="interface">
            <h3>Output</h3>
            <p>{s.output}</p>
          </div>
        </div>
        <div className="warning">
          <p>{s.gate}</p>
          <small>
            교육용 순서 탐색입니다. 실제 경과 시간, 에너지 또는 Flight software
            상태를 시뮬레이션하지 않습니다.
          </small>
        </div>
        <details className="failure-reveal">
          <summary>What could go wrong?</summary>
          <p>{s.risk}</p>
        </details>
        <Sources refs={s.sourceRefs} />
      </section>
      <div className="controls">
        <Button
          variant="outline"
          disabled={step === 0}
          onClick={() => go(step - 1)}
        >
          <ArrowLeft />
          이전
        </Button>
        <Button
          onClick={() => {
            if (step === 6) setStep(0);
            setPlaying(!playing);
          }}
        >
          {playing ? <Pause /> : <Play />}
          {playing ? '일시정지' : '자동 진행'}
        </Button>
        <Button variant="outline" onClick={() => go(0)}>
          <RotateCcw />
          처음으로
        </Button>
        <Button
          variant="outline"
          disabled={step === 6}
          onClick={() => go(step + 1)}
        >
          다음
          <ArrowRight />
        </Button>
      </div>
      <p className="muted">
        자동 진행은 단계당 6초입니다. 처음에는 정지 상태이며, 다른 모듈로
        이동하면 재생이 멈춥니다.
      </p>
    </>
  );
}
function Modeling({ initial }: { initial: string }) {
  const [entity, setEntity] = useState(
    Math.max(
      0,
      components.findIndex((c) => c.parentId === initial),
    ),
  );
  const [level, setLevel] = useState(2);
  const [chain, setChain] = useState(
    initial === 'adcs' ? 1 : initial === 'comms' ? 2 : 0,
  );
  const [edge, setEdge] = useState(0);
  const c = chains[chain];
  return (
    <>
      <section className="panel">
        <p className="eyebrow">MODEL HIERARCHY</p>
        <h2>Part-pair &lt; Component &lt; Subsystem &lt; System</h2>
        <Choices
          label="계층 선택"
          items={hierarchy.map((h) => h.level)}
          value={level}
          onChange={setLevel}
        />
        <div className="hierarchy-result">
          <strong>{hierarchy[level].name}</strong>
          <p>{hierarchy[level].text}</p>
        </div>
        <p className="muted">
          Part는 개별 물리 항목입니다. 이 프로젝트의 기능 계층은 Part-pair부터
          시작하며, 내부 정보가 없으면 Component 수준에서 멈춥니다.
        </p>
        <Sources refs={[model('§1.1')]} />
      </section>
      <section>
        <h2>입력과 출력으로 기능 읽기</h2>
        <Choices
          label="Component 선택"
          items={components.map((c) => c.name)}
          value={entity}
          onChange={setEntity}
        />
        <EntityPanel entity={components[entity]} />
      </section>
      <section className="panel">
        <p className="eyebrow">FUNCTION → FUNCTIONAL FLOW → FLOW PROPERTY</p>
        <h2>기능 사이에서 무엇이 흐를까요?</h2>
        <p>
          <span className="flow-type material">Material</span> 물질·하드웨어{' '}
          <span className="flow-type energy">Energy</span> 전기·열·기계 에너지{' '}
          <span className="flow-type data">Data</span> 측정·명령 정보
        </p>
        <Choices
          label="기능 체인 선택"
          items={chains.map((c) => c.name)}
          value={chain}
          onChange={(n) => {
            setChain(n);
            setEdge(0);
          }}
        />
        <ol className="flow-chain">
          {c.nodes.map((n, i) => (
            <li key={n}>
              <div className="flow-node">
                <small>{String(i + 1).padStart(2, '0')}</small>
                <strong>{n}</strong>
              </div>
              {i < c.edges.length && (
                <button
                  aria-label={`${n}에서 ${c.nodes[i + 1]}로 흐름 확인`}
                  className={edge === i ? 'selected' : ''}
                  onClick={() => setEdge(i)}
                >
                  <ArrowRight />
                  <span>Flow {i + 1}</span>
                </button>
              )}
            </li>
          ))}
        </ol>
        <div className="flow-reading" aria-live="polite">
          <strong>
            {c.nodes[edge]} → {c.nodes[edge + 1]}
          </strong>
          <p>{c.edges[edge]}</p>
          <small>
            기능을 수행하는 엔티티와 인터페이스의 측정 가능한 속성을 구분하세요.
          </small>
        </div>
        <Sources refs={c.sourceRefs} />
      </section>
      <section className="panel">
        <h2>요구사항을 검증 활동까지 연결하기</h2>
        <div className="traceability">
          {[
            'Mission requirement',
            '안전한 배터리 온도 유지',
            'Thermal-control function',
            'Sensor / Heater',
            '센서 값 고정 Failure mode',
            'Thermal-control verification',
          ].map((x, i) => (
            <div key={x}>
              <small>{i + 1}</small>
              <span>{x}</span>
            </div>
          ))}
        </div>
        <p className="muted">
          교육용 Traceability 예시입니다. 실제 MADE Requirement ID나 승인된 시험
          절차가 존재한다는 의미가 아닙니다.
        </p>
        <Sources refs={[spec('§7 Module 4'), model('§2.1')]} />
      </section>
    </>
  );
}
function Rams() {
  const [failure, setFailure] = useState(0);
  const [analysis, setAnalysis] = useState(0);
  const f = failures[failure];
  return (
    <>
      <div className="grid four">
        {rams.map((r) => (
          <article className="panel compact" key={r.name}>
            <p className="eyebrow">{r.name}</p>
            <h3>{r.ko}</h3>
            <p>{r.text}</p>
          </article>
        ))}
      </div>
      <Sources refs={[spec('§7 Module 5 RAMS definitions')]} />
      <section className="panel">
        <h2>고장 하나에서 임무 영향까지</h2>
        <Choices
          label="고장 시나리오"
          items={failures.map((f) => f.title)}
          value={failure}
          onChange={setFailure}
        />
        <div className="failure-chain">
          {f.chain.map((x, i) => (
            <div key={x}>
              <span>
                0{i + 1} /{' '}
                {['LOCAL EFFECT', 'SUBSYSTEM EFFECT', 'MISSION EFFECT'][i]}
              </span>
              <h3>{x}</h3>
            </div>
          ))}
        </div>
        <div className="grid two">
          <article className="interface">
            <h3>04 / Detection</h3>
            <ul>
              {f.detection.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </article>
          <article className="interface">
            <h3>05 / Mitigation & Recovery</h3>
            <ul>
              {f.mitigation.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </article>
        </div>
        <p className="muted">
          출처 기반 정성적 교육 시나리오. 고장률·발생 확률·복구 성공률은
          계산하거나 가정하지 않습니다.
        </p>
        <Sources refs={f.sourceRefs} />
      </section>
      <section className="panel">
        <h2>분석 방법에 따라 질문이 달라집니다</h2>
        <Choices
          label="RAMS 분석 방법"
          items={analyses.map((a) => a.name)}
          value={analysis}
          onChange={setAnalysis}
        />
        <h3>{analyses[analysis].name}</h3>
        <p>{analyses[analysis].text}</p>
        <Sources refs={[spec('§7 Module 5 Engineering analysis concepts')]} />
      </section>
    </>
  );
}
function Readiness({
  state,
  update,
}: {
  state: LearningState;
  update: (s: LearningState) => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const result = grade(state);
  function patch(p: Partial<LearningState>) {
    update({ ...state, ...p });
  }
  function download() {
    const text = [
      '# CubSpace Phase 1 모델링 과제',
      '교육 초안 / SME 검토 필요',
      `퀴즈: ${result.score}/${result.total}`,
      '## Subsystem 설명',
      state.explanation,
      ...state.drafts.flatMap((d, i) => [
        `## ${i === 0 ? 'Battery temperature sensor' : 'Heater'}`,
        ...assignmentFields.map(
          ([key, label]) => `### ${label}\n${d[key] || '(미작성)'}`,
        ),
      ]),
    ].join('\n\n');
    const url = URL.createObjectURL(
      new Blob([text], { type: 'text/markdown;charset=utf-8' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CubSpace-modeling-assignment.md';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <>
      <div className="readiness-intro">
        <p>
          틀린 답은 다시 선택할 수 있습니다. 모든 문제와 체인 순서를 맞힌 뒤
          설명과 모델 초안을 작성하세요.
        </p>
        <span className="badge">9 QUESTIONS + 1 CHAIN</span>
      </div>
      {questions.map((q, i) => (
        <section className="panel quiz" key={q.id}>
          <p className="eyebrow">
            {String(i + 1).padStart(2, '0')} / {q.type}
          </p>
          <h2 id={`q-${q.id}`}>{q.question}</h2>
          <RadioGroup
            aria-labelledby={`q-${q.id}`}
            value={state.answers[q.id] ?? ''}
            onValueChange={(v) =>
              patch({ answers: { ...state.answers, [q.id]: String(v) } })
            }
          >
            {q.options.map((o, j) => (
              <label className="radio-option" key={o}>
                <RadioGroupItem value={String(j)} />
                <span>{o}</span>
              </label>
            ))}
          </RadioGroup>
          {submitted && (
            <div
              className={
                state.answers[q.id] === String(q.answer)
                  ? 'feedback correct'
                  : 'feedback incorrect'
              }
              aria-live="polite"
            >
              <strong>
                {state.answers[q.id] === String(q.answer)
                  ? '정답입니다'
                  : state.answers[q.id] === undefined
                    ? '답을 선택하세요'
                    : '다시 생각해 보세요'}
              </strong>
              <p>{q.feedback}</p>
              <Sources refs={q.sourceRefs} />
            </div>
          )}
        </section>
      ))}
      <section className="panel">
        <p className="eyebrow">10 / ARRANGE A FUNCTIONAL CHAIN</p>
        <h2>EPS 기능 체인을 올바른 순서로 배열하세요</h2>
        <p>위·아래 버튼으로 순서를 변경하세요. 마우스로 끌 필요가 없습니다.</p>
        <ol className="sort-list">
          {state.order.map((item, i) => (
            <li key={item}>
              <span>{i + 1}</span>
              <strong>{item}</strong>
              <Button
                variant="outline"
                disabled={i === 0}
                aria-label={`${item} 위로`}
                onClick={() => patch({ order: moveItem(state.order, i, -1) })}
              >
                ↑
              </Button>
              <Button
                variant="outline"
                disabled={i === state.order.length - 1}
                aria-label={`${item} 아래로`}
                onClick={() => patch({ order: moveItem(state.order, i, 1) })}
              >
                ↓
              </Button>
            </li>
          ))}
        </ol>
        {submitted && (
          <p
            className={`feedback ${result.chainCorrect ? 'correct' : 'incorrect'}`}
          >
            {result.chainCorrect
              ? '순서가 맞습니다.'
              : '태양광은 Panel에서 전기로 바뀌고, MPPT를 거쳐 Battery / Bus, Regulator, Loads로 이동합니다.'}
          </p>
        )}
        <Button onClick={() => setSubmitted(true)}>답안 확인</Button>
        {submitted && (
          <p aria-live="polite">
            현재 결과:{' '}
            <strong>
              {result.score} / {result.total}
            </strong>{' '}
            · 오답을 수정하면 결과가 갱신됩니다.
          </p>
        )}
        <Sources refs={[model('§2.1')]} />
      </section>
      <section className="panel">
        <p className="eyebrow">EXPLAIN IN YOUR OWN WORDS</p>
        <h2>한 Subsystem을 설명해 보세요</h2>
        <label htmlFor="explanation">
          목적, 입출력, 의존 관계, 불확실성을 포함해 40자 이상 작성하세요.
        </label>
        <textarea
          id="explanation"
          maxLength={4000}
          rows={5}
          value={state.explanation}
          onChange={(e) =>
            patch({ explanation: e.target.value, reviewed: false })
          }
        />
        <small>
          {state.explanation.trim().length} / 최소 40자 · 내용의 정확성은
          지도자가 검토합니다.
        </small>
      </section>
      <section className="panel">
        <p className="eyebrow">MINI ASSIGNMENT</p>
        <h2>배터리 온도 센서와 히터 모델 만들기</h2>
        <p>
          두 Component를 각각 기술하고 Controller를 통해 연결하세요.
          임계값·전력·센서 사양을 모르면 Assumption 또는 TBD로 기록합니다.
        </p>
        <div className="grid two">
          {state.drafts.map((draft, i) => (
            <fieldset className="draft" key={i}>
              <legend>
                {i === 0 ? '01 / Battery temperature sensor' : '02 / Heater'}
              </legend>
              {assignmentFields.map(([key, label]) => (
                <div className="field" key={key}>
                  <label htmlFor={`draft-${i}-${key}`}>{label}</label>
                  <textarea
                    rows={key === 'function' || key === 'assumptions' ? 3 : 2}
                    id={`draft-${i}-${key}`}
                    maxLength={4000}
                    value={draft[key] || ''}
                    onChange={(e) =>
                      patch({
                        drafts: state.drafts.map((d, j) =>
                          j === i ? { ...d, [key]: e.target.value } : d,
                        ),
                        reviewed: false,
                      })
                    }
                  />
                </div>
              ))}
            </fieldset>
          ))}
        </div>
        <details className="hint">
          <summary>작성 가이드와 검토 기준 보기</summary>
          <p>
            Hierarchy는 Component, Parent는 EPS입니다. 센서는 물리적 온도를
            Data로 출력하고 히터는 전력을 열로 변환합니다. 측정값과 열에너지,
            제어 명령을 구분하세요. 입력·출력마다 Material / Energy / Data와
            단위를 적으세요.
          </p>
          <p>
            예: Sensor → Controller → Heater. 온도 센서의 정확도와 히터 소비
            전력은 임의의 수치 대신 TBD로 두세요. 센서 값 고정 또는 히터 고착의
            영향을 설명하세요.
          </p>
        </details>
        <label className="review-check" htmlFor="self-review">
          <Checkbox
            id="self-review"
            checked={state.reviewed}
            onCheckedChange={(v) => patch({ reviewed: v === true })}
          />
          <span>
            두 모델의 기능·입출력·연결·단위를 검토했고, 불확실한 내용에 상태를
            표시했습니다.
          </span>
        </label>
        <div className="controls">
          <Button variant="outline" onClick={download}>
            <Download />
            과제 Markdown 저장
          </Button>
          <span className="muted">학습 초안만 내려받습니다.</span>
        </div>
        <div
          className={result.ready ? 'feedback correct' : 'feedback'}
          aria-live="polite"
        >
          <h3>
            {result.ready
              ? 'Ready for supervised modeling'
              : '모델링 준비 체크리스트'}
          </h3>
          <p>
            {result.ready
              ? '자동 형식 점검과 자기 검토를 완료했습니다. 지도자와 기술 내용을 검토하며 MADE 작업을 시작하세요.'
              : '퀴즈 10/10, 40자 이상 설명, 두 Component의 필수 필드 22개, 자기 검토가 필요합니다.'}
          </p>
          {result.missing.length > 0 && (
            <details>
              <summary>미작성 필드 {result.missing.length}개</summary>
              <ul>
                {result.missing.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </details>
          )}
          <small>
            서술형 답안의 기술적 정확성은 자동 평가하지 않습니다. 공식
            엔지니어링 자격 또는 모델 승인이 아닙니다.
          </small>
        </div>
        <Sources
          refs={[spec('§7 Module 6'), model('§2 Temperature sensor / Heater')]}
        />
      </section>
    </>
  );
}
export default function Home() {
  const [module, setModule] = useState('0');
  const [state, setState] = useState<LearningState>(freshState);
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [light, setLight] = useState(false);
  const [reset, setReset] = useState(false);
  const [modelInitial, setModelInitial] = useState('eps');
  const [generation, setGeneration] = useState(0);
  const result = grade(state);
  const completed = [...state.completed, ...(result.ready ? [5] : [])];
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        setState(restoreState(localStorage.getItem(KEY)));
      } catch {
        setStorageError(true);
      }
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!loaded) return;
    let active = true;
    let failed = false;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      failed = true;
    }
    queueMicrotask(() => {
      if (active) setStorageError(failed);
    });
    return () => {
      active = false;
    };
  }, [state, loaded]);
  useEffect(() => {
    const context = (
      document as Document & {
        modelContext?: {
          registerTool: (
            tool: unknown,
            options: { signal: AbortSignal },
          ) => void | Promise<void>;
        };
      }
    ).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      Promise.resolve(
        context.registerTool(
          {
            name: 'navigate_learning_module',
            description:
              'Open one of the six CubSpace learning modules; does not mark completion.',
            inputSchema: {
              type: 'object',
              properties: {
                module: { type: 'integer', minimum: 1, maximum: 6 },
              },
              required: ['module'],
              additionalProperties: false,
            },
            annotations: { readOnlyHint: false, untrustedContentHint: false },
            execute: (input: unknown) => {
              const n = (input as { module?: unknown })?.module;
              if (
                typeof n !== 'number' ||
                !Number.isInteger(n) ||
                n < 1 ||
                n > 6
              )
                throw new Error('module must be an integer from 1 to 6');
              flushSync(() => setModule(String(n - 1)));
              return { module: n, title: moduleTitles[n - 1] };
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {});
    } catch {}
    return () => lifecycle.abort();
  }, []);
  function resetAll() {
    setState(freshState());
    setModule('0');
    setGeneration((n) => n + 1);
    setReset(false);
  }
  return (
    <div className={`workspace ${light ? 'light' : 'dark'}`}>
      <a className="skip" href="#lesson">
        학습 내용으로 이동
      </a>
      <header className="topbar">
        <strong>
          <Box /> CubSpace
        </strong>
        <span>ACRUX-2 / ENGINEERING ONBOARDING</span>
        <div className="top-actions">
          <span className="badge">PHASE 1</span>
          <Button
            variant="ghost"
            aria-label={light ? '어두운 테마' : '밝은 테마'}
            onClick={() => setLight(!light)}
          >
            {light ? <Moon /> : <Sun />}
          </Button>
        </div>
      </header>
      <div className="course-bar">
        <span>MISSION → MODEL</span>
        <div>
          <small>{completed.length} / 6 모듈 완료</small>
          <Progress
            value={(completed.length / 6) * 100}
            aria-label="전체 학습 진행률"
          />
        </div>
        <Button variant="ghost" onClick={() => setReset(true)}>
          <RotateCcw />
          학습 초기화
        </Button>
      </div>
      <Tabs
        value={module}
        onValueChange={(v) => setModule(String(v))}
        className="course-tabs"
      >
        <TabsList className="module-nav" aria-label="학습 모듈">
          {moduleTitles.map((title, i) => {
            const Icon = icons[i];
            return (
              <TabsTrigger value={String(i)} key={title}>
                <span className="nav-index">
                  {completed.includes(i) ? (
                    <Check size={16} />
                  ) : (
                    String(i + 1).padStart(2, '0')
                  )}
                </span>
                <Icon size={19} />
                <span>{title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        {moduleTitles.map((title, i) => (
          <TabsContent key={title} value={String(i)}>
            <main
              id={module === String(i) ? 'lesson' : undefined}
              className="main"
              tabIndex={-1}
            >
              <div className="lesson-head">
                <div>
                  <p className="eyebrow">
                    {String(i + 1).padStart(2, '0')} / {moduleEnglish[i]}
                  </p>
                  <h1>{title}</h1>
                  <p className="lead">{leads[i]}</p>
                </div>
                <span className="lesson-number" aria-hidden="true">
                  0{i + 1}
                </span>
              </div>
              {storageError && (
                <p aria-live="polite" className="warning">
                  브라우저 저장소를 사용할 수 없어 현재 세션에서만 학습 상태가
                  유지됩니다. 과제는 Markdown으로 저장하세요.
                </p>
              )}
              {loaded && module === String(i) && (
                <div key={generation}>
                  {i === 0 ? (
                    <Mission />
                  ) : i === 1 ? (
                    <Anatomy
                      onModel={(id) => {
                        setModelInitial(id);
                        setModule('3');
                      }}
                    />
                  ) : i === 2 ? (
                    <Sequence />
                  ) : i === 3 ? (
                    <Modeling initial={modelInitial} />
                  ) : i === 4 ? (
                    <Rams />
                  ) : (
                    <Readiness state={state} update={setState} />
                  )}
                </div>
              )}
              <footer className="lesson-footer">
                <div>
                  <small>학습 목표</small>
                  <p>
                    {
                      [
                        '전개와 통신이 Payload 실험보다 먼저인 이유를 설명할 수 있습니다.',
                        '각 Subsystem의 목적과 입출력, 연결 관계를 설명할 수 있습니다.',
                        '분리부터 첫 지상 접촉까지의 경로를 설명할 수 있습니다.',
                        '엔티티, 기능, Flow, 측정 가능한 Property를 구분할 수 있습니다.',
                        '국소 고장에서 임무 영향과 검출·복구까지 추적할 수 있습니다.',
                        '초안을 지도자와 검토하며 첫 MADE 작업을 시작합니다.',
                      ][i]
                    }
                  </p>
                </div>
                <div className="controls">
                  {i < 5 && (
                    <Button
                      variant={completed.includes(i) ? 'outline' : 'default'}
                      onClick={() =>
                        setState({
                          ...state,
                          completed: completed.includes(i)
                            ? state.completed.filter((n) => n !== i)
                            : [...state.completed, i],
                        })
                      }
                    >
                      {completed.includes(i) ? <Check /> : null}
                      {completed.includes(i)
                        ? '학습 완료 · 취소 가능'
                        : '이해했어요 · 완료 표시'}
                    </Button>
                  )}
                  {i < 5 && (
                    <Button
                      variant="outline"
                      onClick={() => setModule(String(i + 1))}
                    >
                      다음 모듈
                      <ArrowRight />
                    </Button>
                  )}
                </div>
              </footer>
            </main>
          </TabsContent>
        ))}
      </Tabs>
      <footer className="site-footer">
        <strong>CubSpace / ACRUX-2</strong>
        <span>교육용 모델 · 기술 기준선은 SME 검토 필요</span>
        <span>로그인 없는 학습 · 진행·초안은 이 브라우저에 저장</span>
      </footer>
      <AlertDialog open={reset} onOpenChange={setReset}>
        <AlertDialogContent>
          <AlertDialogTitle>학습 상태를 초기화할까요?</AlertDialogTitle>
          <AlertDialogDescription>
            이 브라우저의 완료 표시, 퀴즈 답안과 과제 초안을 지웁니다. 필요한
            과제는 먼저 Markdown으로 저장하세요.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={resetAll}>초기화</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
