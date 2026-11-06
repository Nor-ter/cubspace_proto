import { MiniQuiz } from '@/components/MiniQuiz';
import { RoleIcon } from '@/components/RoleIcon';
import { SectionHead } from '@/components/SectionHead';
import type { Course } from '@/types/course';
import { LEARNING_PATH, MISSION_QUIZ } from '../data';

export function MissionSection({ course }: { course: Course }) {
  const { activePage, completed, resetGeneration } = course;
  return (
    <section
      id="mission"
      tabIndex={-1}
      className={`section mission-section page-view ${activePage === 'mission' ? 'active' : ''}`}
    >
      <SectionHead
        index="01"
        eyebrow="MISSION CONTEXT"
        title="Why CubSpace?"
        desc="Even if team members change, design intent and verification records must be maintained."
      />
      <div className="thesis-grid">
        <article className="statement-card">
          <p className="eyebrow">THE CONTINUITY PROBLEM</p>
          <h3>
            People carry mission knowledge.{' '}
            <span>But people are temporary.</span>
          </h3>
          <p>
            Team members change from semester to semester and as students
            graduate. If the rationale behind design decisions lives only in
            individual memories, the next team must solve the same problems
            again.
          </p>
        </article>
        <article className="statement-card accent">
          <p className="eyebrow">THE CUBSPACE PRINCIPLE</p>
          <h3>
            Engineers may leave. <span>The mission carries on.</span>
          </h3>
          <p>
            Connect models, documents, rules, task cards, evidence, and
            sign-offs so the next engineer can trace the basis for each
            decision.
          </p>
        </article>
      </div>
      <p className="note">
        There are 5 reading materials and 4 quizzes. Understanding the Mission
        combines the first two topics.
      </p>
      <div className="learning-rail">
        {LEARNING_PATH.map(([n, en, ko, d]) => (
          <article key={n}>
            <span>{n}</span>
            <div>
              <RoleIcon name={en} />
              <small>{en}</small>
              <strong>{ko}</strong>
              <p>{d}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="mission-brief">
        <div>
          <p className="eyebrow">ACRUX-II / 1U TECHNOLOGY DEMONSTRATION</p>
          <h3>
            <RoleIcon name="Verifying hardware from space with small satellites." />
            Verifying hardware from space with small satellites.
          </h3>
          <p>
            The primary success criteria are completing the deployment sequence
            and establishing ground communication. After separation, the
            spacecraft must survive, reduce its rotation, deploy its antennas,
            and connect to the ground before it can collect Deneb magnetorquer
            and solar-panel data.
          </p>
        </div>
        <ol>
          <li>
            <span>01</span>
            <div>
              <strong>Initial Operations</strong>
              <p>
                Separation detection → thermal management → attitude
                determination and detumbling → antenna deployment (see the
                low-power exception below)
              </p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <strong>Operational Phase</strong>
              <p>
                Ground communication, power-positive operation, technology
                verification data collection
              </p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <strong>Extended Operations</strong>
              <p>Accumulation of long-term data and mission knowledge</p>
            </div>
          </li>
        </ol>
      </div>
      <MiniQuiz
        key={`mission-${resetGeneration}`}
        title={MISSION_QUIZ.title}
        questions={MISSION_QUIZ.questions}
        passed={completed.includes('mission')}
        onPass={() => course.passQuiz('mission')}
        onReset={() => course.resetFrom('mission')}
        nextLabel="Next · Satellite Structure"
        onNext={() => course.go('anatomy')}
      />
    </section>
  );
}
