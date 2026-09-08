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
    <section className="bdot-guide" aria-label="B-dot 단계별 학습">
      <h3>
        <Activity /> B-dot, 왜 필요하고 어떻게 작동하나요?
      </h3>
      <p>아래 단계를 선택해 원인부터 피드백까지 따라가세요.</p>
      <fieldset className="bdot-navigation" aria-label="학습 단계">
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
          <strong>엔지니어의 확인 포인트</strong>
          <p>
            <MathText text={current.check} />
          </p>
        </div>
      </article>
      <div className="bdot-pager">
        <button disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          <ChevronLeft />
          이전
        </button>
        <span>
          {step + 1} / {bdotSteps.length}
        </span>
        <button
          disabled={step === bdotSteps.length - 1}
          onClick={() => setStep((s) => s + 1)}
        >
          다음
          <ChevronRight />
        </button>
      </div>
      <p className="source-note">
        교육용 단계 설명 ·{' '}
        <a
          href="https://ntrs.nasa.gov/api/citations/19970017186/downloads/19970017186.pdf"
          target="_blank"
          rel="noreferrer"
        >
          NASA 자기 제어 자료
        </a>{' '}
        · 실제 제어 파라미터는 검증된 설계를 따릅니다.
      </p>
    </section>
  );
}
