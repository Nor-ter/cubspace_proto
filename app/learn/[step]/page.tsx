import { MathText } from '@/components/math-text';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Target,
  ClipboardList,
  Boxes,
  FileCheck2,
  ShieldCheck,
  Users,
  GitBranch,
  Search,
  PencilRuler,
} from 'lucide-react';
import { RoleIcon } from '@/components/role-icon';
import { PromptManual } from '@/components/prompt-manual';
import { EngineeringNotes } from '@/components/engineering-note';
import { PrologViewer } from '@/components/prolog-viewer';
import { CubeSatScene } from '@/components/cubesat-scene';
import { FoundationResources } from '@/components/foundation-resources';
import { lessonById, lessons } from '@/src/data/lessons';

export function generateStaticParams() {
  return lessons.map(({ id }) => ({ step: id }));
}

function LessonVisual({ type }: { type: (typeof lessons)[number]['visual'] }) {
  if (type === 'orbit' || type === 'anatomy')
    return (
      <div className="lesson-3d">
        <CubeSatScene
          mode={type === 'orbit' ? 'orbit' : 'explore'}
          selected={type === 'anatomy' ? 'adcs' : 'all'}
        />
      </div>
    );
  if (type === 'made')
    return (
      <div className="lesson-image">
        <Image
          src="/reference/made-actuation-system-model.png"
          alt="MADE ADCS actuation functional flow model"
          width={1490}
          height={813}
          sizes="(max-width: 900px) 100vw, 55vw"
        />
        <a
          href="/reference/made-actuation-system-model.png"
          target="_blank"
          rel="noreferrer"
        >
          View original size <ExternalLink size={16} />
        </a>
      </div>
    );
  if (type === 'prolog') return <PrologViewer />;
  const flows =
    type === 'continuity'
      ? [
          'problem definition',
          'judgment record',
          'model reflection',
          'basis connection',
          'Handover to next team',
        ]
      : type === 'trace'
        ? [
            'mission purpose',
            'Requirements',
            'Function assignment',
            'implementation connection',
            'Verification basis',
          ]
        : [
            'Define the task',
            'change model',
            'Write a rationale',
            'Review/Approval',
            'handover',
          ];
  const details =
    type === 'continuity'
      ? [
          'Identify your purpose and boundaries',
          'Source/home preservation',
          'Specify what to change and what version to change',
          'Link verification conditions and results',
          'Communicate unconfirmed items and contact person',
        ]
      : type === 'trace'
        ? [
            'Necessary Mission Accomplishments',
            'Measurable criteria for completion',
            'Functions and transformations to perform',
            'Hardware/Software Designation',
            'Check if your needs are met',
          ]
        : [
            'Agree on scope and completion criteria',
            'Update affected items',
            'Reproduction procedures and results recorded',
            "Record of reviewer's judgment",
            'Specify next task and contact person',
          ];
  const icons =
    type === 'continuity'
      ? [Search, ClipboardList, Boxes, FileCheck2, Users]
      : type === 'trace'
        ? [Target, ClipboardList, GitBranch, Boxes, FileCheck2]
        : [ClipboardList, PencilRuler, FileCheck2, ShieldCheck, Users];
  return (
    <div className="lesson-flow">
      {flows.map((item, i) => {
        const Icon = icons[i];
        return (
          <div key={item}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            <Icon className="step-role-icon" aria-hidden="true" />
            <strong>{item}</strong>
            <small>{details[i]}</small>
            {i < flows.length - 1 && <ArrowRight />}
          </div>
        );
      })}
    </div>
  );
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step } = await params;
  const lesson = lessonById[step];
  if (!lesson)
    return (
      <main className="lesson-shell">
        <p>The session cannot be found.</p>
        <Link href="/">return to home</Link>
      </main>
    );
  const index = lessons.findIndex((item) => item.id === lesson.id);
  const previous = lessons[index - 1];
  const next = lessons[index + 1];
  return (
    <main className="lesson-shell">
      <header className="lesson-nav">
        <Link href="/#mission">
          <ArrowLeft /> Study Material List
        </Link>
        <span>reading material {lesson.id} / 07</span>
      </header>
      <nav className="lesson-progress" aria-label="7 reading materials">
        {lessons.map((item) => (
          <Link
            key={item.id}
            href={`/learn/${item.id}`}
            aria-current={item.id === lesson.id ? 'step' : undefined}
          >
            {item.id} · {item.title}
          </Link>
        ))}
      </nav>
      <article className="lesson-article">
        <div className="lesson-title">
          <p>{lesson.label}</p>
          <h1>{lesson.title}</h1>
          <div>{lesson.lead}</div>
        </div>
        <figure className="lesson-figure">
          <LessonVisual type={lesson.visual} />
          <figcaption className="lesson-visual-caption">
            {lesson.lead}{' '}
            {lesson.visual === 'orbit' || lesson.visual === 'anatomy'
              ? 'This is a conceptual model for educational purposes only and does not represent actual flight analysis or definitive CAD geometry.'
              : 'Check the meaning and connection of each step in the explanation below.'}
          </figcaption>
        </figure>
        {lesson.id === '07' && <PromptManual />}
        <div className="lesson-chapters">
          {lesson.chapters.map((chapter, i) => (
            <section key={chapter.title}>
              <span>0{i + 1}</span>
              <div>
                <h2>
                  <RoleIcon name={chapter.title} />
                  {chapter.title}
                </h2>
                <p>
                  <MathText text={chapter.body} />
                </p>
                <ul>
                  {chapter.points.map((point) => (
                    <li key={point}>
                      {point.includes(' — https://') ? (
                        <a
                          href={point.split(' — ')[1]}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {point.split(' — ')[0]}
                        </a>
                      ) : (
                        <MathText text={point} />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>
        <EngineeringNotes lessonId={lesson.id} />
        {lesson.id === '05' && <FoundationResources />}
        <aside className="lesson-source">
          <div>
            <small>Further reading</small>
            <strong>{lesson.source.label}</strong>
          </div>
          <a href={lesson.source.href} target="_blank" rel="noreferrer">
            View original text <ExternalLink />
          </a>
        </aside>
        <nav className="lesson-pager">
          {previous ? (
            <Link href={`/learn/${previous.id}`}>
              <ArrowLeft /> {previous.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/learn/${next.id}`}>
              {next.title} <ArrowRight />
            </Link>
          ) : (
            <Link href="/#mission">
              Back to onboarding <ArrowRight />
            </Link>
          )}
        </nav>
      </article>
    </main>
  );
}
