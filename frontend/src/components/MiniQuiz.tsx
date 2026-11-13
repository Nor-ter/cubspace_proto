import { MathText } from './MathText';
import { QuizDeck } from './QuizDeck';
import { useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/AlertDialog';
import type { QuizQuestion } from '@/types/quiz';
// QuizSection remounts this component (key) when onReset runs, which clears local state.
export function MiniQuiz({
  title,
  questions,
  passed,
  onPass,
  onReset,
}: {
  title: string;
  questions: QuizQuestion[];
  passed: boolean;
  onPass: () => void;
  onReset: () => void;
}) {
  const [solved, setSolved] = useState(0);
  const [reviewing, setReviewing] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  function pass() {
    onPass();
    setReviewing(false);
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
              ? 'You have completed this quiz. Review the explanations or retake it.'
              : 'Compare the options and choose an answer. A missed card returns at the end of the deck until every question is answered correctly.'}
          </p>
        </div>
        <span className="quiz-score">
          {passed ? (
            <>
              <Check />
              Passed
            </>
          ) : (
            `${solved} / ${questions.length} answered`
          )}
        </span>
      </div>
      {!passed ? (
        <QuizDeck
          questions={questions}
          onPass={pass}
          onSolvedChange={setSolved}
        />
      ) : !reviewing ? (
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
            return (
              <div key={q.id} className="question correct">
                <div className="question-copy">
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <p id={`${q.id}-label`}>
                    <MathText text={q.prompt} />
                  </p>
                </div>
                <RadioGroup
                  className="question-options"
                  aria-labelledby={`${q.id}-label`}
                  value={String(q.correct)}
                  disabled
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
                <p className="answer-note">
                  {'Correct. '}
                  <MathText text={q.explanation} />
                </p>
              </div>
            );
          })}
        </div>
      )}
      <div className="quiz-actions">
        <span>
          {passed
            ? 'Quiz complete'
            : `${solved} / ${questions.length} Response complete`}
        </span>
        <button
          className="secondary"
          onClick={() => setConfirmReset(true)}
          disabled={!passed && solved === 0}
        >
          <RotateCcw />
          {passed ? 'Retake quiz' : 'Reset answers'}
        </button>
      </div>
      <AlertDialog open={confirmReset} onOpenChange={setConfirmReset}>
        <AlertDialogContent className="reset-dialog">
          <AlertDialogTitle>Should we start this quiz again?</AlertDialogTitle>
          <AlertDialogDescription>
            Your answers and completion marker for this quiz will be reset.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className="secondary">Cancel</AlertDialogCancel>
            <AlertDialogAction className="primary" onClick={onReset}>
              Restart
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
