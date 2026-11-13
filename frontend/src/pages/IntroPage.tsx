import { useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { ArrowDown, ArrowRight, Check, LockKeyhole } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { RevealText } from '@/components/RevealText';
import { PROGRESS_STORAGE_KEY, QUIZ_ORDER } from '@/features/course/data';
import { IntroDots } from '@/features/intro/components/IntroDots';
import { LaunchOverlay } from '@/features/intro/components/LaunchOverlay';
import { MODULES, PROBLEMS, TRACE } from '@/features/intro/data';
import { useScrollProgress } from '@/features/intro/hooks/useScrollProgress';
import { useScrubReveal } from '@/features/intro/hooks/useScrubReveal';
import { useIntroStage } from '@/features/intro/hooks/useIntroStage';
import { INTRO_STAGES } from '@/features/intro/stages';
import { StoryStage } from '@/features/story/components/StoryStage';
import { navigate } from '@/lib/navigate';
import type { QuizSection } from '@/types/course';

const LAUNCH_MS = 900;

function readProgress(): QuizSection[] {
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) || '[]');
    return Array.isArray(saved)
      ? saved.filter((id) => QUIZ_ORDER.includes(id))
      : [];
  } catch {
    return [];
  }
}

export function IntroPage() {
  const [completed] = useState(readProgress);
  const [launch, setLaunch] = useState<{ x: number; y: number } | null>(null);
  const heroRef = useScrollProgress<HTMLElement>();
  const traceRef = useScrollProgress<HTMLElement>();
  useScrubReveal();
  const { frameRef, active } = useIntroStage();
  const captionRef = useRef<HTMLParagraphElement>(null);

  const returning = completed.length > 0;
  const nextStep = QUIZ_ORDER.find((id) => !completed.includes(id));
  const resumeTarget = returning ? `/app#${nextStep ?? 'handoff'}` : '/app';
  const isUnlocked = (id: QuizSection) => {
    const index = QUIZ_ORDER.indexOf(id);
    return index === 0 || completed.includes(QUIZ_ORDER[index - 1]);
  };

  function start(target: string, event: MouseEvent<HTMLElement>) {
    if (launch) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      navigate(target);
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    setLaunch({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setTimeout(() => navigate(target, { enter: true }), LAUNCH_MS);
  }

  return (
    <main className="intro">
      <StoryStage
        scenes={INTRO_STAGES}
        frameRef={frameRef}
        activeIndex={active}
        missionPhase={0}
        missionReplay={0}
        captionRef={captionRef}
      />
      <div className="intro-veil" aria-hidden="true" />
      <header className="intro-top">
        <span className="intro-brand">
          <BrandLogo />
          <strong>CubSpace</strong>
        </span>
        <button className="intro-skip" onClick={(e) => start(resumeTarget, e)}>
          {returning ? 'Resume' : 'Skip intro'} <ArrowRight />
        </button>
      </header>

      {/* 1 · Opening */}
      <section className="intro-hero" ref={heroRef} data-intro-section>
        <div className="intro-sticky">
          <div className="intro-hero-copy">
            <p className="intro-kicker">CUBSPACE</p>
            <h1>
              <span className="intro-line-1">
                <span className="intro-squeeze">ACRUX-II</span>
              </span>
              <span className="intro-line-2">
                Engineer
                <br />
                Onboarding
              </span>
            </h1>
          </div>
          <p className="intro-cue">
            SCROLL TO DISCOVER <ArrowDown />
          </p>
        </div>
      </section>

      {/* 2 · Problem */}
      <section className="intro-problem" data-intro-section>
        <p className="intro-eyebrow">THE CONTINUITY PROBLEM</p>
        <h2 data-scrub>
          <RevealText>People carry mission knowledge.</RevealText>{' '}
          <em>
            <RevealText startIndex={4}>But people are temporary.</RevealText>
          </em>
        </h2>
        <ol className="intro-problem-list">
          {PROBLEMS.map(([n, title, desc], i) => (
            <li key={n} data-scrub style={{ '--i': i } as CSSProperties}>
              <span>{n}</span>
              <strong>{title}</strong>
              <p>{desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 3 · Shift */}
      <section className="intro-shift" ref={traceRef} data-intro-section>
        <div className="intro-sticky">
          <p className="intro-eyebrow">THE SHIFT</p>
          <h2>The next engineer can trace every decision.</h2>
          <ol className="intro-trace">
            {TRACE.map((node, i) => (
              <li key={node} style={{ '--i': i } as CSSProperties}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <strong>{node}</strong>
              </li>
            ))}
          </ol>
          <p className="intro-shift-note">
            One claim, followed from the mission objective all the way to the
            evidence and the person who signed it off.
          </p>
        </div>
      </section>

      {/* 4 · Modules */}
      <section className="intro-modules" data-intro-section>
        <p className="intro-eyebrow">WHAT YOU WILL LEARN</p>
        <h2 data-scrub>
          <RevealText>Four steps to your first assignment.</RevealText>
        </h2>
        <div className="intro-module-grid">
          {MODULES.map((m, i) => {
            const done = completed.includes(m.id);
            const open = isUnlocked(m.id);
            return (
              <article
                key={m.id}
                className={open ? '' : 'locked'}
                data-scrub
                style={{ '--i': i } as CSSProperties}
              >
                <span className="intro-module-index">{m.index}</span>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
                {open ? (
                  <button onClick={(e) => start(`/app#${m.id}`, e)}>
                    {done ? (
                      <>
                        <Check /> Completed · Review
                      </>
                    ) : (
                      <>
                        Explore <ArrowRight />
                      </>
                    )}
                  </button>
                ) : (
                  <span className="intro-module-lock">
                    <LockKeyhole /> Opens after {MODULES[i - 1].title}
                  </span>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* 5 · Launch */}
      <section className="intro-launch" data-intro-section>
        <h2>
          <RevealText>Ready for your first mission?</RevealText>
        </h2>
        <button
          className="intro-launch-button"
          onClick={(e) => start(resumeTarget, e)}
        >
          {returning ? 'Continue where you left off' : 'Launch onboarding'}
          <ArrowRight />
        </button>
        <a className="intro-story-link" href="/story">
          Or watch the full story first
        </a>
      </section>

      <IntroDots active={active} />
      {launch && <LaunchOverlay x={launch.x} y={launch.y} />}
    </main>
  );
}
