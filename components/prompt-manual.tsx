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
    detail: 'Purpose, context, and review guidelines for human reading',
  },
  {
    id: 'ai' as const,
    label: 'AI View',
    icon: BrainCircuit,
    detail: 'Knowledge tree to be delivered to AI·Skill MD·Prolog',
  },
  {
    id: 'robot' as const,
    label: 'Robot View',
    icon: Bot,
    detail: 'Action Task Card for Human and Physical AI',
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
    <section
      className="manual-frame"
      aria-label="Prompt Manual Three Perspectives"
    >
      <div className="manual-caption">
        <ClipboardList />
        One task, three expressions
      </div>
      <fieldset
        className="manual-views"
        aria-label="Select document perspective"
      >
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
        They share the same assignment ID, version, stage, basis, and completion
        criteria. Even if you change your perspective, Purpose and constraints
        remain.
      </p>
      <aside
        className="manual-explainer"
        aria-label="Guide to using the three views"
      >
        <h3>View the same task in Human, AI, and Robot View</h3>
        <p>
          <strong>Human View</strong>A person understands the purpose,
          background, and scope This is a judgment document.{' '}
          <strong>AI View</strong>is the context It is divided into the
          relationships of purpose, constraints, basis, and procedure and
          expressed so that AI can refer to it. <strong>Robot View</strong>
          combines human intention and structured knowledge It is displayed as a
          Task Card with conditions, performance details, completion standards,
          and record items. Here, Robot will be used not only as Physical AI in
          the future but also as people who perform procedures. Includes.
        </p>
        <details>
          <summary>
            What are Core Knowledge Tree / Tower, Skill, Markdown, and Prolog?
            Is it a relationship?
          </summary>
          <p>
            <strong>Core Knowledge Tree / Tower</strong>mission → system →
            function → Skill → refers to a knowledge storage structure that
            connects evidence. not here yet It shows an example of a structure
            that has not been implemented. <strong>Skill</strong>silver It is
            reusable working knowledge that bundles objectives, inputs,
            constraints, procedures, and verification criteria.
          </p>
          <p>
            <strong>Markdown</strong>to read and manage this skill as a file. It
            is a format, <strong>Prolog</strong>The relationship between task,
            stage, basis, and approval is It is a way of expressing it in facts
            and rules. Just the fact that we moved to Prolog The accuracy or
            viability of the knowledge is not verified.
          </p>
        </details>
        <details open>
          <summary>
            How do the same items change? · Check S02 physical properties
          </summary>
          <ol>
            <li>
              <strong>Human:</strong> reads the context and rationale in the
              request, “Please review the units, coordinate system, and
              directional limits of magnetic torque.”
            </li>
            <li>
              <strong>AI:</strong> separates the instructions, deliverables, and
              completion criteria for S02. In Prolog, instruction(s02, …),
              output(s02, …), acceptance(s02, … ) expressed as a relationship.
            </li>
            <li>
              <strong>Robot:</strong> After checking the S01 results, create an
              attribute table, For each figure, check if there is a source or
              assumption, then provide a link to the evidence and a contact
              person. Record it.
            </li>
          </ol>
        </details>
        <details>
          <summary>
            What is preserved between views, and what else is needed?
          </summary>
          <p>
            The three screens use the same knowledge source, so ID, version,
            purpose, scope, stage, source, and completion criteria are
            preserved. The buttons immediately present the same task in
            different representations; they do not automatically interpret
            arbitrary documents or write changes back to files.
          </p>
          <p>
            The recommended order is{' '}
            <strong>
              Check human context → Review AI knowledge structure → Review robot
              performance conditions → Contact person approval
            </strong>
            . Any missing evidence or contradictions in either view remain as
            questions for review. This example is read-only and can be reviewed
            by downloading the Markdown or Prolog output.
          </p>
          <p>
            This screen does not link to actual Tower/Skill storage, execute
            Prolog, or control physical equipment. When connecting to Physical
            AI, the coordinate system, units, allowable range, interlock, stop
            condition, and execution authority must be verified. Switching
            documents does not automatically create a task completion or
            approval status.
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
            {task.id} · v{task.version} · Instructional example · Draft before
            review
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
                02 Input and context
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
                You are an engineer assisting with ADCS model reviews. With the
                materials provided Please do the following:
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
                04 Results, completion criteria, handover
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
                Written by: __________　Reviewed by: __________
                <br />
                Approval record/support link: ____________________
              </p>
            </section>
          </MathRich>
        )}
        {view === 'ai' && (
          <section className="manual-ai">
            <h3>
              <BrainCircuit />
              Structured knowledge read by AI
            </h3>
            <p>
              Human context is expressed in terms of purpose, constraint, stage,
              and evidence. The content below is an example generated from the
              same data; it does not save to Tower or execute Prolog.
            </p>
            <fieldset
              className="manual-formats"
              aria-label="AI expression selection"
            >
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
                      <strong>Sources / Basis</strong>
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
                      <strong>Skill/Procedure</strong>
                      {task.steps.map((s) => (
                        <details key={s.id}>
                          <summary>
                            {s.id} · {s.title}
                          </summary>
                          <p>{s.instruction}</p>
                          <p>Result: {s.output}</p>
                          <p>Completion criteria: {s.check}</p>
                        </details>
                      ))}
                    </li>
                    <li>
                      <strong>Approval</strong>
                      <p>
                        Not approved · Requires records from reviewer in charge
                      </p>
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
              Context + Knowledge → Execution Task Card
            </h3>
            <p>{task.purpose}</p>
            <blockquote>
              Implementation subject: Human / Future Physical AI · Current
              status: Draft before review
              <br />
              {task.scope} Physical AI execution involves equipment mapping and
              verification. Additional operation/interlock/approval is required.
            </blockquote>
            <h3>
              <BookOpen />
              start condition
            </h3>
            <p>
              {task.inputs.join(', ')}Check the version and whether it is
              accessible. If you encounter an omission, conflict, or
              out-of-scope request, suspend the step and notify the person in
              charge. I ask a question.
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
                    <strong>Prerequisites:</strong>{' '}
                    {i === 0
                      ? 'Check input data and scope'
                      : `${task.steps[i - 1].id}Check the results and unresolved items`}
                  </p>
                  <p>
                    <strong>Do:</strong> {s.instruction}
                  </p>
                  <p>
                    <strong>Reasons to leave:</strong> {s.output}
                  </p>
                  <p>
                    <strong>Completion criteria:</strong> {s.check}
                  </p>
                  <p className="robot-signoff">
                    Status: Not Performed Responsible for: TBD Supporting Link:
                    __________
                  </p>
                </section>
              ))}
            </div>
            <h3>
              <ShieldCheck />
              Termination and Handover
            </h3>
            <p>
              Submit to reviewers whether completion criteria are met. Automatic
              conversion is performed It does not imply completion or approval.
            </p>
            <p>
              Reviewer: ______ Decision: □ Revision requested □ Additional
              evidence required □ Approved
            </p>
          </section>
        )}
        <footer>
          Created from the same knowledge source, not a record of actual
          execution or approval
        </footer>
      </article>
    </section>
  );
}
