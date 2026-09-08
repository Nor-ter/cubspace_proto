'use client';
import { MathText } from './math-text';
import { useMemo, useState } from 'react';
import { Check, ChevronRight, RotateCcw } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
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
  const [reviewing, setReviewing] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const score = useMemo(
    () => questions.filter((q) => answers[q.id] === q.correct).length,
    [answers, questions],
  );
  const count = Object.keys(answers).length;
  function submit() {
    setSubmitted(true);
    if (score === questions.length) {
      onPass();
      setReviewing(false);
    }
  }
  function reset() {
    setAnswers({});
    setSubmitted(false);
    setReviewing(false);
    setConfirmReset(false);
    onReset();
  }
  return (
    <section
      className={`mini-quiz ${passed ? 'quiz-passed' : ''}`}
      aria-labelledby={`${questions[0].id}-title`}
    >
      <div className="quiz-heading">
        <div>
          <p className="eyebrow">
            KNOWLEDGE CHECK / {questions.length} QUESTIONS
          </p>
          <h3 id={`${questions[0].id}-title`}>{title}</h3>
          <p>
            {passed
              ? '이 세션을 완료했습니다. 다음 학습으로 이동하거나 답안을 복습하세요.'
              : '선택지를 비교해 답을 고르세요. 모든 문제를 맞히면 다음 세션이 열립니다.'}
          </p>
        </div>
        <span className="quiz-score">
          {passed ? (
            <>
              <Check />
              학습 완료
            </>
          ) : (
            `${count} / ${questions.length} 응답`
          )}
        </span>
      </div>
      {passed && !reviewing ? (
        <div className="quiz-complete-summary">
          <Check />
          <span>{questions.length}문제를 모두 통과했습니다.</span>
          <button
            className="quiz-review-toggle"
            onClick={() => setReviewing(true)}
          >
            해설 복습
          </button>
        </div>
      ) : (
        <div className="question-list">
          {questions.map((q, i) => {
            const correct = answers[q.id] === q.correct;
            const showFeedback = submitted || (passed && reviewing);
            return (
              <div
                key={q.id}
                className={`question ${showFeedback ? (correct || passed ? 'correct' : 'wrong') : ''}`}
              >
                <div className="question-copy">
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <p id={`${q.id}-label`}>
                    <MathText text={q.prompt} />
                  </p>
                </div>
                <RadioGroup
                  className="question-options"
                  aria-labelledby={`${q.id}-label`}
                  value={
                    passed
                      ? String(q.correct)
                      : answers[q.id] === undefined
                        ? ''
                        : String(answers[q.id])
                  }
                  disabled={passed}
                  onValueChange={(v) => {
                    if (v === null) return;
                    setAnswers((a) => ({ ...a, [q.id]: Number(v) }));
                    setSubmitted(false);
                  }}
                >
                  {q.options.map((option, j) => (
                    <label
                      className="question-option"
                      key={option}
                      htmlFor={`${q.id}-option-${j}`}
                    >
                      <RadioGroupItem
                        id={`${q.id}-option-${j}`}
                        value={String(j)}
                      />
                      <span>
                        <MathText text={option} />
                      </span>
                    </label>
                  ))}
                </RadioGroup>
                {showFeedback && (
                  <p className="answer-note">
                    {correct || passed
                      ? '정답입니다. '
                      : `정답: ${q.options[q.correct]}. `}
                    <MathText text={q.explanation} />
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
      {submitted && !passed && (
        <p className="quiz-feedback" role="alert">
          {score} / {questions.length} 정답 · 해설을 확인한 뒤 답안을 수정하고
          다시 확인하세요.
        </p>
      )}
      <div className="quiz-actions">
        <span>
          {passed
            ? '다음 단계로 이어가세요'
            : `${count} / ${questions.length} 응답 완료`}
        </span>
        <button
          className="secondary"
          onClick={() => setConfirmReset(true)}
          disabled={!passed && count === 0}
        >
          <RotateCcw />
          {passed ? '다시 풀기' : '답안 초기화'}
        </button>
        {!passed && (
          <button
            className="primary"
            disabled={count !== questions.length}
            onClick={submit}
          >
            답안 확인
            <Check />
          </button>
        )}
        {passed && onNext && (
          <button className="primary" onClick={onNext}>
            {nextLabel ?? '다음 세션'}
            <ChevronRight />
          </button>
        )}
      </div>
      <AlertDialog open={confirmReset} onOpenChange={setConfirmReset}>
        <AlertDialogContent className="reset-dialog">
          <AlertDialogTitle>이 퀴즈를 다시 시작할까요?</AlertDialogTitle>
          <AlertDialogDescription>
            이 퀴즈의 답안과 이 세션 이후의 완료 표시가 초기화됩니다. 앞서
            완료한 세션은 유지됩니다.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className="secondary">취소</AlertDialogCancel>
            <AlertDialogAction className="primary" onClick={reset}>
              다시 시작
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
