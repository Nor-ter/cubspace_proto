'use client';
import { useState } from 'react';
import { MathFormula, MathRich } from './math-text';
import {
  UserRound,
  BrainCircuit,
  Bot,
  Download,
  FolderTree,
  FileCode2,
  Code2,
  ClipboardList,
  Target,
  BookOpen,
  ListChecks,
  ShieldCheck,
} from 'lucide-react';
import {
  taskKnowledge as task,
  taskMarkdown,
  taskProlog,
} from '@/src/data/task-knowledge';
type View = 'human' | 'ai' | 'robot';
const views = [
  {
    id: 'human' as const,
    label: 'Human View',
    icon: UserRound,
    detail: '사람이 읽는 목적·맥락·검토 지침',
  },
  {
    id: 'ai' as const,
    label: 'AI View',
    icon: BrainCircuit,
    detail: 'AI에 전달할 지식 트리·Skill MD·Prolog',
  },
  {
    id: 'robot' as const,
    label: 'Robot View',
    icon: Bot,
    detail: '사람·Physical AI를 위한 실행 Task Card',
  },
];
export function PromptManual() {
  const [view, setView] = useState<View>('human');
  const [format, setFormat] = useState<'tree' | 'md' | 'prolog'>('tree');
  const current = views.find((v) => v.id === view)!;
  function download() {
    const prolog = view === 'ai' && format === 'prolog';
    const blob = new Blob([prolog ? taskProlog() : taskMarkdown(view)], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${task.id}-${view}.${prolog ? 'pl' : 'md'}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section className="manual-frame" aria-label="Prompt Manual 세 가지 관점">
      <div className="manual-caption">
        <ClipboardList />
        하나의 과제 · 세 가지 표현
      </div>
      <fieldset className="manual-views" aria-label="문서 관점 선택">
        {views.map((v) => {
          const Icon = v.icon;
          return (
            <button
              key={v.id}
              aria-pressed={view === v.id}
              onClick={() => setView(v.id)}
            >
              <Icon />
              <strong>{v.label}</strong>
              <span>{v.detail}</span>
            </button>
          );
        })}
      </fieldset>
      <p className="manual-sync">
        Human Context ↔ Core Knowledge / Skill ↔ Execution Task Card
        <br />
        같은 과제 ID·버전·단계·근거·수용 기준을 공유합니다. 관점을 바꿔도 원래
        목적과 제약은 유지됩니다.
      </p>
      <aside className="manual-explainer" aria-label="세 가지 View 사용 안내">
        <h3>하나의 지식을 읽고, 지시하고, 수행하는 세 가지 방법</h3>
        <p>
          <strong>Human View</strong>는 사람이 목적·배경·범위를 이해하고
          판단하는 문서입니다. <strong>AI View</strong>는 그 맥락을
          목적·제약·근거·절차의 관계로 나누어 AI가 참조할 수 있게 표현합니다.{' '}
          <strong>Robot View</strong>는 사람의 의도와 구조화된 지식을 합쳐 선행
          조건·수행 내용·완료 기준·기록 항목이 있는 Task Card로 보여줍니다.
          여기서 Robot은 향후 Physical AI뿐 아니라 절차를 수행하는 사람도
          포함합니다.
        </p>
        <details>
          <summary>
            Core Knowledge Tree / Tower, Skill, Markdown, Prolog는 어떤
            관계인가요?
          </summary>
          <p>
            <strong>Core Knowledge Tree / Tower</strong>는 임무 → 시스템 → 기능
            → Skill → 근거를 연결하는 지식 저장 구조를 뜻합니다. 여기서는 실제
            연결된 제품이 아닌 제안 구조입니다. <strong>Skill</strong>은
            목적·입력·제약·절차·검증 기준을 묶은 재사용 가능한 작업 지식입니다.
          </p>
          <p>
            <strong>Markdown</strong>은 이 Skill을 파일로 읽고 관리하기 위한
            형식이고, <strong>Prolog</strong>는 과제·단계·근거·승인 관계를
            사실과 규칙으로 표현하는 방식입니다. Prolog로 옮겼다는 사실만으로
            지식의 정확성이나 실행 가능성이 검증되지는 않습니다.
          </p>
        </details>
        <details open>
          <summary>같은 항목이 어떻게 바뀌나요? · S02 물리 속성 확인</summary>
          <ol>
            <li>
              <strong>Human:</strong> “단위·좌표계와 자기 토크의 방향 제한을
              검토하세요.”라는 맥락과 이유를 읽습니다.
            </li>
            <li>
              <strong>AI:</strong> S02의 지시, 산출물, 수용 기준을 분리합니다.
              Prolog에서는 instruction(s02, …), output(s02, …), acceptance(s02,
              …) 관계로 표현합니다.
            </li>
            <li>
              <strong>Robot:</strong> S01 결과를 확인한 뒤 속성 표를 작성하고,
              수치마다 출처 또는 가정이 있는지 확인한 후 근거 링크와 담당자를
              기록합니다.
            </li>
          </ol>
        </details>
        <details>
          <summary>전환 시 유지되는 것과 추가로 필요한 것</summary>
          <p>
            세 화면은 같은 지식 원본을 사용하므로 과제
            ID·버전·목적·범위·단계·출처·수용 기준이 유지됩니다. 버튼은 저장된
            과제를 서로 다른 표현으로 즉시 보여줍니다. 임의 문서를 자동으로
            해석하거나 파일의 수정 내용을 역으로 가져오는 변환기는 아닙니다.
          </p>
          <p>
            사용 순서는{' '}
            <strong>
              Human 맥락 확인 → AI 지식 구조 검토 → Robot 수행 조건 검토 →
              담당자 승인
            </strong>
            입니다. 어느 View에서든 빠진 근거와 모순은 확인 질문으로 남깁니다.
            현재 예제는 읽기 전용이며, Markdown 또는 Prolog를 내려받아 검토할 수
            있습니다.
          </p>
          <p>
            실제 Tower/Skill 저장소 연동, Prolog 실행, 물리 장비 제어는 이
            화면에서 수행하지 않습니다. Physical AI에 연결할 때는 장비별
            좌표계·단위·허용 범위·인터록·중단 조건·실행 권한을 검증해야 합니다.
            문서 전환은 작업 완료나 승인 상태를 자동으로 만들지 않습니다.
          </p>
        </details>
      </aside>
      <div className="manual-toolbar">
        <span>
          {task.id} · v{task.version} · {current.label}
        </span>
        <button onClick={download}>
          <Download />{' '}
          {view === 'ai' && format === 'prolog'
            ? 'Prolog 다운로드'
            : 'Markdown 다운로드'}
        </button>
      </div>
      <article className="prompt-paper">
        <header>
          <small>CUBSPACE / {current.label.toUpperCase()}</small>
          <h2>{task.title}</h2>
          <p>
            {task.id} · v{task.version} · 교육용 예시 · 검토 전 초안
          </p>
        </header>
        {view === 'human' && (
          <MathRich>
            <section>
              <h3>
                <Target />
                01 목적과 범위
              </h3>
              <p>
                {task.purpose} {task.scope}
              </p>
            </section>
            <section>
              <h3>
                <BookOpen />
                02 입력과 맥락
              </h3>
              <p>{task.inputs.join(', ')}.</p>
              <ul>
                {task.constraints.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3>
                <ListChecks />
                03 사용할 프롬프트
              </h3>
              <blockquote>
                당신은 ADCS 모델 검토를 지원하는 엔지니어입니다. 제공된 자료로
                다음을 수행하세요.
              </blockquote>
              <ol>
                {task.steps.map((s) => (
                  <li key={s.id}>
                    <strong>{s.title}</strong> — {s.instruction}
                  </li>
                ))}
              </ol>
              <MathFormula
                tex={String.raw`\boldsymbol\tau=\boldsymbol m\times\boldsymbol B`}
              />
            </section>
            <section>
              <h3>
                <ShieldCheck />
                04 산출물·수용 기준·인계
              </h3>
              {task.steps.map((s) => (
                <p key={s.id}>
                  <strong>
                    {s.id} · {s.output}
                  </strong>
                  <br />
                  {s.check}
                </p>
              ))}
              <p>
                작성자: __________　검토자: __________
                <br />
                승인 기록·근거 링크: ____________________
              </p>
            </section>
          </MathRich>
        )}
        {view === 'ai' && (
          <section className="manual-ai">
            <h3>
              <BrainCircuit />
              AI가 읽는 구조화된 지식
            </h3>
            <p>
              Human Context를 목적·제약·단계·근거 관계로 표현합니다. 아래는 같은
              데이터로 생성한 저장용 예시이며, 실제 Tower 저장이나 Prolog 실행을
              수행하지 않습니다.
            </p>
            <fieldset className="manual-formats" aria-label="AI 표현 선택">
              {(
                [
                  { id: 'tree', label: 'Knowledge Tree', icon: FolderTree },
                  { id: 'md', label: 'Skill Markdown', icon: FileCode2 },
                  { id: 'prolog', label: 'Prolog', icon: Code2 },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  aria-pressed={format === f.id}
                  onClick={() => setFormat(f.id)}
                >
                  <f.icon />
                  {f.label}
                </button>
              ))}
            </fieldset>
            {format === 'tree' ? (
              <div className="manual-knowledge">
                <p>Mission / ACRUX-II / ADCS / Skills</p>
                <details open>
                  <summary>
                    {task.id} · {task.title}
                  </summary>
                  <ul>
                    <li>
                      <strong>Context / 목적</strong>
                      <p>{task.purpose}</p>
                    </li>
                    <li>
                      <strong>Scope / 범위</strong>
                      <p>{task.scope}</p>
                    </li>
                    <li>
                      <strong>Sources / 근거</strong>
                      <ul>
                        {task.inputs.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    </li>
                    <li>
                      <strong>Constraints / 제약</strong>
                      <ul>
                        {task.constraints.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    </li>
                    <li>
                      <strong>Skill / 절차</strong>
                      {task.steps.map((s) => (
                        <details key={s.id}>
                          <summary>
                            {s.id} · {s.title}
                          </summary>
                          <p>{s.instruction}</p>
                          <p>산출물: {s.output}</p>
                          <p>수용 기준: {s.check}</p>
                        </details>
                      ))}
                    </li>
                    <li>
                      <strong>Approval / 승인</strong>
                      <p>미승인 · 담당 검토자의 기록 필요</p>
                    </li>
                  </ul>
                </details>
              </div>
            ) : (
              <pre className="manual-code">
                <code>
                  {format === 'md' ? taskMarkdown('ai') : taskProlog()}
                </code>
              </pre>
            )}
          </section>
        )}
        {view === 'robot' && (
          <section>
            <h3>
              <Bot />
              맥락 + 지식 → 실행 Task Card
            </h3>
            <p>{task.purpose}</p>
            <blockquote>
              실행 주체: 사람 / 향후 Physical AI · 현재 상태: 검토 전 초안
              <br />
              {task.scope} Physical AI 실행에는 장비 매핑·검증된
              동작·인터록·승인이 추가로 필요합니다.
            </blockquote>
            <h3>
              <BookOpen />
              시작 조건
            </h3>
            <p>
              {task.inputs.join(', ')}의 버전과 접근 가능 여부를 확인합니다.
              누락·충돌·범위 밖 요청을 만나면 해당 단계를 보류하고 담당자에게
              질문합니다.
            </p>
            <ul>
              {task.constraints.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <div className="robot-task-list">
              {task.steps.map((s, i) => (
                <section key={s.id} className="robot-task">
                  <h3>
                    {s.id} · {s.title}
                  </h3>
                  <p>
                    <strong>선행 조건:</strong>{' '}
                    {i === 0
                      ? '입력 자료와 범위 확인'
                      : `${task.steps[i - 1].id}의 산출물과 미해결 항목 확인`}
                  </p>
                  <p>
                    <strong>수행:</strong> {s.instruction}
                  </p>
                  <p>
                    <strong>남길 근거:</strong> {s.output}
                  </p>
                  <p>
                    <strong>완료 기준:</strong> {s.check}
                  </p>
                  <p className="robot-signoff">
                    상태: 미수행　담당: TBD　근거 링크: __________
                  </p>
                </section>
              ))}
            </div>
            <h3>
              <ShieldCheck />
              종료와 인계
            </h3>
            <p>
              수용 기준 충족 여부를 검토자에게 제출합니다. 자동 변환은 수행
              완료나 승인을 뜻하지 않습니다.
            </p>
            <p>검토자: ______　판정: □ 수정 요청 □ 추가 근거 필요 □ 승인</p>
          </section>
        )}
        <footer>같은 지식 원본에서 생성 · 실제 실행·승인 기록이 아님</footer>
      </article>
    </section>
  );
}
