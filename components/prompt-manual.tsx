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
    detail: 'Purpose, context and review guidance for people to read',
  },
  {
    id: 'ai' as const,
    label: 'AI View',
    icon: BrainCircuit,
    detail: 'Knowledge tree, Skill MD and Prolog to pass to AI',
  },
  {
    id: 'robot' as const,
    label: 'Robot View',
    icon: Bot,
    detail: 'Execution Task Card for people and Physical AI',
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
    <section className="manual-frame" aria-label="Three views of the Prompt Manual">
      <div className="manual-caption">
        <ClipboardList />
        One task · three representations
      </div>
      <fieldset className="manual-views" aria-label="Select document view">
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
        They share the same task ID, version, steps, evidence and acceptance
        criteria. Switching views keeps the original purpose and constraints.
      </p>
      <aside className="manual-explainer" aria-label="Guide to the three views">
        <h3>Viewing the same task as Human · AI · Robot View</h3>
        <p>
          <strong>Human View</strong> is a document for people to understand the
          purpose, background and scope and make decisions.{' '}
          <strong>AI View</strong> breaks that context into relationships among
          purpose, constraints, evidence and procedure so that AI can refer to
          it.{' '}
          <strong>Robot View</strong> combines human intent and structured
          knowledge into a Task Card with preconditions, actions, acceptance
          criteria and items to record. Here, Robot includes not only future
          Physical AI but also people who carry out the procedure.
        </p>
        <details>
          <summary>
            How are the Core Knowledge Tree / Tower, Skill, Markdown and Prolog
            related?
          </summary>
          <p>
            The <strong>Core Knowledge Tree / Tower</strong> is a knowledge
            storage structure linking mission → system → function → Skill →
            evidence. This page shows an example of a structure that is not yet
            implemented. A <strong>Skill</strong> is reusable task knowledge that
            bundles purpose, inputs, constraints, procedure and verification
            criteria.
          </p>
          <p>
            <strong>Markdown</strong> is the format for reading and managing this
            Skill as a file, and <strong>Prolog</strong> is a way of expressing
            the relationships among task, steps, evidence and approval as facts
            and rules. Translating knowledge into Prolog does not by itself
            verify its accuracy or executability.
          </p>
        </details>
        <details open>
          <summary>How does the same item change? · S02 Confirm physical properties</summary>
          <ol>
            <li>
              <strong>Human:</strong> reads the context and reason behind
              “Review the units, coordinate frames and the directional limitation
              of magnetic torque.”
            </li>
            <li>
              <strong>AI:</strong> separates the instruction, deliverable and
              acceptance criterion of S02. In Prolog they are expressed as the
              relations instruction(s02, …), output(s02, …) and acceptance(s02,
              …).
            </li>
            <li>
              <strong>Robot:</strong> after checking the S01 result, fills in the
              property table, confirms that every value has a source or
              assumption, and then records the evidence link and owner.
            </li>
          </ol>
        </details>
        <details>
          <summary>What is kept when switching, and what else is needed</summary>
          <p>
            The three views use the same knowledge source, so the task ID,
            version, purpose, scope, steps, sources and acceptance criteria are
            kept. The buttons immediately show the stored task in different
            representations. This is not a converter that automatically
            interprets arbitrary documents or imports file edits back.
          </p>
          <p>
            The order of use is{' '}
            <strong>
              check the Human context → review the AI knowledge structure →
              review the Robot execution conditions → owner approval
            </strong>
            . In any view, missing evidence and contradictions are left as
            confirmation questions. The current example is read-only, and the
            Markdown or Prolog can be downloaded for review.
          </p>
          <p>
            This screen does not integrate with an actual Tower/Skill repository,
            run Prolog or control physical equipment. When connecting to
            Physical AI, each device’s coordinate frames, units, allowable
            ranges, interlocks, abort conditions and execution authority must be
            verified. Switching documents does not automatically create a task
            completion or approval state.
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
            ? 'Download Prolog'
            : 'Download Markdown'}
        </button>
      </div>
      <article className="prompt-paper">
        <header>
          <small>CUBSPACE / {current.label.toUpperCase()}</small>
          <h2>{task.title}</h2>
          <p>
            {task.id} · v{task.version} · teaching example · draft before review
          </p>
        </header>
        {view === 'human' && (
          <MathRich>
            <section>
              <h3>
                <Target />
                01 Purpose and scope
              </h3>
              <p>
                {task.purpose} {task.scope}
              </p>
            </section>
            <section>
              <h3>
                <BookOpen />
                02 Inputs and context
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
                03 Prompt to use
              </h3>
              <blockquote>
                You are an engineer supporting an ADCS model review. Using the
                provided material, do the following.
              </blockquote>
              <ol>
                {task.steps.map((s) => (
                  <li key={s.id}>
                    <strong>{s.title}</strong> · {s.instruction}
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
                04 Deliverables, acceptance criteria and handoff
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
                Author: __________　Reviewer: __________
                <br />
                Approval record and evidence link: ____________________
              </p>
            </section>
          </MathRich>
        )}
        {view === 'ai' && (
          <section className="manual-ai">
            <h3>
              <BrainCircuit />
              Structured knowledge for AI to read
            </h3>
            <p>
              Expresses the Human Context as relationships among purpose,
              constraints, steps and evidence. Below is a storage example
              generated from the same data; it does not store to the actual
              Tower or run Prolog.
            </p>
            <fieldset className="manual-formats" aria-label="Select AI representation">
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
                      <strong>Context / Purpose</strong>
                      <p>{task.purpose}</p>
                    </li>
                    <li>
                      <strong>Scope</strong>
                      <p>{task.scope}</p>
                    </li>
                    <li>
                      <strong>Sources / Evidence</strong>
                      <ul>
                        {task.inputs.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    </li>
                    <li>
                      <strong>Constraints</strong>
                      <ul>
                        {task.constraints.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    </li>
                    <li>
                      <strong>Skill / Procedure</strong>
                      {task.steps.map((s) => (
                        <details key={s.id}>
                          <summary>
                            {s.id} · {s.title}
                          </summary>
                          <p>{s.instruction}</p>
                          <p>Deliverable: {s.output}</p>
                          <p>Acceptance criterion: {s.check}</p>
                        </details>
                      ))}
                    </li>
                    <li>
                      <strong>Approval</strong>
                      <p>Not approved · record by the responsible reviewer required</p>
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
              Context + knowledge → execution Task Card
            </h3>
            <p>{task.purpose}</p>
            <blockquote>
              Executor: person / future Physical AI · current status: draft before review
              <br />
              {task.scope} Execution by Physical AI additionally requires
              equipment mapping, verified actions, interlocks and approval.
            </blockquote>
            <h3>
              <BookOpen />
              Start conditions
            </h3>
            <p>
              Confirm the version and accessibility of {task.inputs.join(', ')}.
              On encountering omissions, conflicts or out-of-scope requests, hold
              that step and ask the owner.
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
                    <strong>Precondition:</strong>{' '}
                    {i === 0
                      ? 'Confirm input materials and scope'
                      : `Confirm the deliverable and open items from ${task.steps[i - 1].id}`}
                  </p>
                  <p>
                    <strong>Action:</strong> {s.instruction}
                  </p>
                  <p>
                    <strong>Evidence to leave:</strong> {s.output}
                  </p>
                  <p>
                    <strong>Acceptance criterion:</strong> {s.check}
                  </p>
                  <p className="robot-signoff">
                    Status: not started　Owner: TBD　Evidence link: __________
                  </p>
                </section>
              ))}
            </div>
            <h3>
              <ShieldCheck />
              Close-out and handoff
            </h3>
            <p>
              Submit whether the acceptance criteria are met to the reviewer.
              Automatic conversion does not mean the work is complete or
              approved.
            </p>
            <p>Reviewer: ______　Decision: □ Changes requested □ More evidence needed □ Approved</p>
          </section>
        )}
        <footer>Generated from the same knowledge source · not an actual execution or approval record</footer>
      </article>
    </section>
  );
}
