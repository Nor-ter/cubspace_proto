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
              ? 'You have completed this session. Move on to the next lesson or review your answers.'
              : 'Compare the options and choose an answer. Answer every question correctly to unlock the next session.'}
          </p>
        </div>
        <span className="quiz-score">
          {passed ? (
            <>
              <Check />
              Lesson complete
            </>
          ) : (
            `${count} / ${questions.length} answered`
          )}
        </span>
      </div>
      {passed && !reviewing ? (
        <div className="quiz-complete-summary">
          <Check />
          <span>All {questions.length} questions passed.</span>
          <button
            className="quiz-review-toggle"
            onClick={() => setReviewing(true)}
          >
            Review explanations
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
                      ? 'Correct. '
                      : `Answer: ${q.options[q.correct]}. `}
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
          {score} / {questions.length} correct · Read the explanations, revise
          your answers and check again.
        </p>
      )}
      <div className="quiz-actions">
        <span>
          {passed
            ? 'Continue to the next step'
            : `${count} / ${questions.length} answered`}
        </span>
        <button
          className="secondary"
          onClick={() => setConfirmReset(true)}
          disabled={!passed && count === 0}
        >
          <RotateCcw />
          {passed ? 'Retake' : 'Reset answers'}
        </button>
        {!passed && (
          <button
            className="primary"
            disabled={count !== questions.length}
            onClick={submit}
          >
            Check answers
            <Check />
          </button>
        )}
        {passed && onNext && (
          <button className="primary" onClick={onNext}>
            {nextLabel ?? 'Next session'}
            <ChevronRight />
          </button>
        )}
      </div>
      <AlertDialog open={confirmReset} onOpenChange={setConfirmReset}>
        <AlertDialogContent className="reset-dialog">
          <AlertDialogTitle>Restart this quiz?</AlertDialogTitle>
          <AlertDialogDescription>
            This quiz’s answers and the completion marks for this and later
            sessions will be reset. Earlier completed sessions are kept.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className="secondary">Cancel</AlertDialogCancel>
            <AlertDialogAction className="primary" onClick={reset}>
              Restart
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
