'use client';
import { useState } from 'react';
import {
  Target,
  Radio,
  Activity,
  Code2,
  Magnet,
  TrendingDown,
  Repeat2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { MathFormula, MathText } from './math-text';
import { bdotSteps } from '@/src/data/bdot-steps';
const icons = [Target, Radio, Activity, Code2, Magnet, TrendingDown, Repeat2];
export function BdotGuide() {
  const [step, setStep] = useState(0);
  const current = bdotSteps[step];
  const Icon = icons[step];
  return (
    <section className="bdot-guide" aria-label="B-dot step-by-step learning">
      <h3>
        <Activity /> B-dot: why is it needed and how does it work?
      </h3>
      <p>Select the steps below to follow from cause through to feedback.</p>
      <fieldset className="bdot-navigation" aria-label="Learning steps">
        {bdotSteps.map((s, i) => {
          const I = icons[i];
          return (
            <button
              key={s.label}
              aria-pressed={i === step}
              onClick={() => setStep(i)}
            >
              <I />
              <span>
                {i + 1}. {s.label}
              </span>
            </button>
          );
        })}
      </fieldset>
      <article className="bdot-step">
        <h4>
          <Icon />
          {step + 1}. {current.title}
        </h4>
        <p>
          <MathText text={current.body} />
        </p>
        {current.tex && <MathFormula tex={current.tex} display />}
        <div className="bdot-check">
          <strong>Design checks</strong>
          <p>
            <MathText text={current.check} />
          </p>
        </div>
      </article>
      <div className="bdot-pager">
        <button disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          <ChevronLeft />
          Previous
        </button>
        <span>
          {step + 1} / {bdotSteps.length}
        </span>
        <button
          disabled={step === bdotSteps.length - 1}
          onClick={() => setStep((s) => s + 1)}
        >
          Next
          <ChevronRight />
        </button>
      </div>
      <p className="source-note">
        Teaching step description ·{' '}
        <a
          href="https://ntrs.nasa.gov/api/citations/19970017186/downloads/19970017186.pdf"
          target="_blank"
          rel="noreferrer"
        >
          NASA magnetic control reference
        </a>{' '}
        · Actual control parameters follow the verified design.
      </p>
    </section>
  );
}
