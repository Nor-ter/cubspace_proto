'use client';

import { useMemo, useState } from 'react';
import { Check, ChevronRight, LockKeyhole, RotateCcw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { QuizQuestion } from '@/src/data/onboarding';

export function MiniQuiz({
  title,
  questions,
  passed,
  onPass,
  onReset,
  nextLabel,
  onNext,
}: {
  title: string;
  questions: QuizQuestion[];
  passed: boolean;
  onPass: () => void;
  onReset: () => void;
  nextLabel?: string;
  onNext?: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = useMemo(
    () => questions.filter((q) => answers[q.id] === q.correct).length,
    [answers, questions],
  );
  function submit() {
    setSubmitted(true);
    if (score === questions.length) onPass();
  }
  function reset() {
    setAnswers({});
    setSubmitted(false);
    onReset();
  }
  return (
    <section
      className={`mini-quiz ${passed ? 'quiz-passed' : ''}`}
      aria-labelledby={`${questions[0].id}-title`}
    >
      <div className="quiz-heading">
        <div>
          <p className="eyebrow">SESSION GATE / 5 QUESTIONS</p>
          <h3 id={`${questions[0].id}-title`}>{title}</h3>
          <p>
            5문제를 모두 맞혀야 다음 섹션이 열립니다. 오답은 설명을 확인하고
            다시 제출하세요.
          </p>
        </div>
        {passed ? (
          <span className="quiz-score">
            <Check /> 5 / 5 PASSED
          </span>
        ) : (
          <span className="quiz-score">
            <LockKeyhole /> NEXT LOCKED
          </span>
        )}
      </div>
      <div className="question-list">
        {questions.map((q, i) => {
          const answer = answers[q.id];
          const correct = answer === q.correct;
          return (
            <div
              key={q.id}
              className={
                submitted
                  ? correct
                    ? 'question correct'
                    : 'question wrong'
                  : 'question'
              }
            >
              <div className="question-row">
                <div className="question-copy">
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <p id={`${q.id}-label`}>{q.prompt}</p>
                </div>
                <Select
                  value={answer === undefined ? null : String(answer)}
                  onValueChange={(v) => {
                    if (v === null) return;
                    setAnswers((a) => ({ ...a, [q.id]: Number(v) }));
                    setSubmitted(false);
                  }}
                >
                  <SelectTrigger
                    className="quiz-select-trigger"
                    aria-labelledby={`${q.id}-label`}
                  >
                    <SelectValue placeholder="답을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent className="quiz-select-content" align="end">
                    {q.options.map((option, j) => (
                      <SelectItem
                        className="quiz-select-item"
                        key={option}
                        value={String(j)}
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {submitted && (
                <p className="answer-note">
                  {correct ? '정답입니다. ' : `정답: ${q.options[q.correct]}. `}
                  {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="quiz-actions">
        <span>{Object.keys(answers).length} / 5 answered</span>
        <button className="secondary" onClick={reset}>
          <RotateCcw /> Reset quiz
        </button>
        <button
          className="primary"
          disabled={Object.keys(answers).length !== questions.length}
          onClick={submit}
        >
          Check answers <Check />
        </button>
        {passed && onNext && (
          <button className="primary" onClick={onNext}>
            {nextLabel ?? 'Next session'} <ChevronRight />
          </button>
        )}
      </div>
    </section>
  );
}
