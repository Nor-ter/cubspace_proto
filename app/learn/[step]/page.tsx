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
          원본 크기로 보기 <ExternalLink size={16} />
        </a>
      </div>
    );
  if (type === 'prolog') return <PrologViewer />;
  const flows =
    type === 'continuity'
      ? ['문제 정의', '판단 기록', '모델 반영', '근거 연결', '다음 팀 인계']
      : type === 'trace'
        ? ['임무 목적', '요구사항', '기능 할당', '구현 연결', '검증 근거']
        : ['과제 정의', '모델 변경', '근거 작성', '검토·승인', '인계'];
  const details =
    type === 'continuity'
      ? [
          '목적과 경계 확인',
          '출처·가정 보존',
          '변경 대상과 버전 지정',
          '검증 조건과 결과 연결',
          '미확정 항목과 담당자 전달',
        ]
      : type === 'trace'
        ? [
            '필요한 임무 성과',
            '측정 가능한 수용 기준',
            '필요한 행동과 변환',
            '하드웨어·소프트웨어 지정',
            '요구 충족 여부 확인',
          ]
        : [
            '범위·완료 기준 합의',
            '영향받는 항목 갱신',
            '재현 절차와 결과 기록',
            '담당 검토자의 판단 기록',
            '다음 행동과 책임자 명시',
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
          <ArrowLeft /> 학습 자료 목록
        </Link>
        <span>읽기 자료 {lesson.id} / 07</span>
      </header>
      <nav className="lesson-progress" aria-label="읽기 자료 7개">
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
        <LessonVisual type={lesson.visual} />
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
        <aside className="lesson-source">
          <div>
            <small>추가 읽기 자료</small>
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
            <Link href="/#mission">
              온보딩으로 돌아가기 <ArrowRight />
            </Link>
          )}
        </nav>
      </article>
    </main>
  );
}
