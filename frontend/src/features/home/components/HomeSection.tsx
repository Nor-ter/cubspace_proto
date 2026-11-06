import { useEffect, useState } from 'react';
import { Activity, ChevronRight, Pause, Play } from 'lucide-react';
import { CubeSatScene } from '@/components/CubeSatScene';
import type { Course, QuizSection } from '@/types/course';
import { MISSION_STATES } from '../data';

export function HomeSection({
  course,
  quizOrder,
}: {
  course: Course;
  quizOrder: readonly QuizSection[];
}) {
  const { activePage, completed, go } = course;
  const [paused, setPaused] = useState(false);
  const [missionState, setMissionState] = useState(0);
  const [missionReplay, setMissionReplay] = useState(0);
  const [simTime, setSimTime] = useState(0);
  const simClock = `${String(Math.floor(simTime / 60)).padStart(2, '0')}:${String(simTime % 60).padStart(2, '0')}`;

  useEffect(() => {
    if (paused || activePage !== 'home') return;
    const timer = setInterval(() => setSimTime((t) => (t + 1) % 5400), 1000);
    return () => clearInterval(timer);
  }, [paused, activePage]);

  return (
    <section
      id="home"
      tabIndex={-1}
      className={`hero page-view ${activePage === 'home' ? 'active' : ''}`}
    >
      <div className="starfield" aria-hidden="true" />
      <div className="hero-model">
        {activePage === 'home' && (
          <CubeSatScene
            mode="orbit"
            paused={paused}
            missionPhase={missionState}
            replayKey={missionReplay}
          />
        )}
      </div>
      <div className="hero-copy">
        <div className="kicker">
          <span className="live-dot" /> CUBSPACE / ENGINEERING ONBOARDING
        </div>
        <h1>
          Understand ACRUX-II. <em>Start your first assignment.</em>
        </h1>
        <p>
          Explore the ACRUX-II 1U CubeSat and its ADCS, then practise system
          modelling and documenting design reviews.
        </p>
        <div className="hero-actions">
          <button
            className="primary"
            onClick={() =>
              go(quizOrder.find((id) => !completed.includes(id)) ?? 'handoff')
            }
          >
            {completed.length ? 'Continue learning' : 'Start onboarding'}{' '}
            <ChevronRight />
          </button>
          <button className="secondary" onClick={() => setPaused(!paused)}>
            {paused ? <Play /> : <Pause />}
            {paused ? 'Play mission' : 'Pause mission'}
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
            <strong>Initial Mission Sequence</strong>
          </div>
          <span>
            <Activity /> For educational use
          </span>
        </div>
        <div className="mission-readouts">
          <div>
            <small>PLAYBACK TIME</small>
            <strong>T+ {simClock}</strong>
          </div>
          <div>
            <small>ORBIT</small>
            <strong>Circular orbit concept diagram · Not to scale</strong>
          </div>
        </div>
        <div className="state-track">
          {MISSION_STATES.map((state, index) => (
            <button
              key={state.code}
              aria-pressed={missionState === index}
              className={missionState === index ? 'active' : ''}
              onClick={() => {
                setMissionState(index);
                setMissionReplay((n) => n + 1);
                setSimTime(0);
                setPaused(false);
              }}
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
          Select the same stage again to replay it from the beginning. The
          launch path, deployment geometry, timing, Earth and spacecraft sizes,
          and orbital altitude are conceptual and not to scale. B-dot reduces
          body rotation; it does not reduce orbital speed.
        </p>
      </aside>
      <button className="scroll-cue" onClick={() => go('mission')}>
        OPEN MISSION BRIEF <ChevronRight />
      </button>
    </section>
  );
}
