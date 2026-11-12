import { useId, useState } from 'react';
import { Check, RotateCcw, X } from 'lucide-react';
import type { QuizQuestion } from '@/types/course';

export function Quiz({
  title,
  questions,
  passed,
  onPass,
}: {
  title: string;
  questions: readonly QuizQuestion[];
  passed: boolean;
  onPass: () => void;
}) {
  const name = useId();
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    questions.map(() => null),
  );
  const [checked, setChecked] = useState(false);
  const score = answers.filter(
    (answer, index) => answer === questions[index].correct,
  ).length;
  const complete = answers.every((answer) => answer !== null);

  function check() {
    setChecked(true);
    if (score === questions.length) onPass();
  }
  function retry() {
    setAnswers(questions.map(() => null));
    setChecked(false);
  }

  return (
    <section className="quiz" aria-label={title}>
      <header className="quiz-head">
        <h3>{title}</h3>
        {passed && (
          <span className="tag tag-done">
            <Check /> Passed
          </span>
        )}
      </header>
      <ol className="quiz-list">
        {questions.map((question, index) => {
          const answer = answers[index];
          return (
            <li key={question.prompt}>
              <fieldset disabled={checked}>
                <legend>{question.prompt}</legend>
                {question.options.map((option, optionIndex) => {
                  const state = !checked
                    ? ''
                    : optionIndex === question.correct
                      ? ' is-correct'
                      : optionIndex === answer
                        ? ' is-wrong'
                        : '';
                  return (
                    <label key={option} className={`quiz-option${state}`}>
                      <input
                        type="radio"
                        name={`${name}-${index}`}
                        checked={answer === optionIndex}
                        onChange={() =>
                          setAnswers((current) =>
                            current.map((value, i) =>
                              i === index ? optionIndex : value,
                            ),
                          )
                        }
                      />
                      <span>{option}</span>
                      {state === ' is-correct' && <Check />}
                      {state === ' is-wrong' && <X />}
                    </label>
                  );
                })}
              </fieldset>
              {checked && question.explanation && (
                <p className="quiz-explanation">{question.explanation}</p>
              )}
            </li>
          );
        })}
      </ol>
      <footer className="quiz-foot" aria-live="polite">
        {checked ? (
          <>
            <p>
              {score} of {questions.length} correct.
              {score === questions.length
                ? ' Well done.'
                : ' Review the highlighted answers and try again.'}
            </p>
            <button className="button" onClick={retry}>
              <RotateCcw /> Try again
            </button>
          </>
        ) : (
          <button
            className="button button-primary"
            onClick={check}
            disabled={!complete}
          >
            Check answers
          </button>
        )}
      </footer>
    </section>
  );
}
