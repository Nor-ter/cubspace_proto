import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { CubeSatScene } from '@/components/cubesat-scene';
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
          fill
          sizes="(max-width: 900px) 100vw, 55vw"
        />
      </div>
    );
  if (type === 'prolog')
    return (
      <div className="lesson-code">
        <span>knowledge.pl</span>
        <pre>{`component(adcs, magnetometer).\ncomponent(adcs, magnetorquer).\n\nready(detumble) :-\n  powered(magnetometer),\n  verified(b_dot_control).\n\n?- component(adcs, X).`}</pre>
      </div>
    );
  const flows =
    type === 'continuity'
      ? ['Engineer', 'Decision', 'Model', 'Evidence', 'Next team']
      : type === 'trace'
        ? [
            'Mission need',
            'Requirement',
            'Function',
            'Component',
            'Test evidence',
          ]
        : ['Task', 'Model update', 'Evidence', 'Review', 'Handoff'];
  return (
    <div className="lesson-flow">
      {flows.map((item, i) => (
        <div key={item}>
          <span>{String(i + 1).padStart(2, '0')}</span>
          <strong>{item}</strong>
          {i < flows.length - 1 && <ArrowRight />}
        </div>
      ))}
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
        <p>해당 세션을 찾을 수 없습니다.</p>
        <Link href="/">홈으로 돌아가기</Link>
      </main>
    );
  const index = lessons.findIndex((item) => item.id === lesson.id);
  const previous = lessons[index - 1];
  const next = lessons[index + 1];
  return (
    <main className="lesson-shell">
      <header className="lesson-nav">
        <Link href="/#mission">
          <ArrowLeft /> Learning path
        </Link>
        <span>{lesson.id} / 07</span>
      </header>
      <article className="lesson-article">
        <div className="lesson-title">
          <p>{lesson.label}</p>
          <h1>{lesson.title}</h1>
          <div>{lesson.lead}</div>
        </div>
        <LessonVisual type={lesson.visual} />
        <div className="lesson-chapters">
          {lesson.chapters.map((chapter, i) => (
            <section key={chapter.title}>
              <span>0{i + 1}</span>
              <div>
                <h2>{chapter.title}</h2>
                <p>{chapter.body}</p>
                <ul>
                  {chapter.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>
        <aside className="lesson-source">
          <div>
            <small>RESEARCH SOURCE</small>
            <strong>{lesson.source.label}</strong>
          </div>
          <a href={lesson.source.href} target="_blank" rel="noreferrer">
            원문 보기 <ExternalLink />
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
            <Link href="/?admin=1#handoff">
              온보딩으로 돌아가기 <ArrowRight />
            </Link>
          )}
        </nav>
      </article>
    </main>
  );
}
