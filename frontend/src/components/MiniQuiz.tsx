import { MathText } from './MathText';
import { QuizDeck } from './QuizDeck';
import { useState } from 'react';
import { Check, ChevronRight, RotateCcw } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import type { QuizQuestion } from '@/types/quiz';

// Every question is answered once; after the last one the result shows, with
// each answer reviewed, and Retry starts again. QuizSection remounts this
// component (key) when onReset runs, which clears local state.
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
  // This attempt's answers, once all questions are answered.
  const [answers, setAnswers] = useState<number[] | null>(null);
  const [reviewing, setReviewing] = useState(false);
  // The deck waits behind a cover until Start is pressed.
  const [started, setStarted] = useState(false);
  const score = answers
    ? answers.filter((answer, i) => answer === questions[i].correct).length
    : 0;

  function finish(given: number[]) {
    setAnswers(given);
    // Passed means every answer right; stored for the course.
    if (given.every((answer, i) => answer === questions[i].correct)) onPass();
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
            {answers
              ? 'Here is your result. Check each answer below, or retry the quiz.'
              : passed
                ? 'You have completed this quiz. Review the explanations or retry it.'
                : `Compare the options and choose an answer. After all ${questions.length} questions you will see your result.`}
          </p>
        </div>
        {passed && (
          <span className="quiz-score">
            <Check />
            Passed
          </span>
        )}
      </div>

      {answers ? (
        <>
          <p className="quiz-result" aria-live="polite">
            <strong>
              {score} / {questions.length}
            </strong>{' '}
            correct
          </p>
          <QuestionReview questions={questions} answers={answers} />
        </>
      ) : !passed && !started ? (
        <div className="quiz-cover">
          <p className="quiz-cover-count">
            {questions.length} questions · one answer each
          </p>
          <p className="quiz-cover-title">{title}</p>
          <p className="quiz-cover-note">
            Your result shows after the last question.
          </p>
          <button className="quiz-cover-start" onClick={() => setStarted(true)}>
            Start <ChevronRight />
          </button>
        </div>
      ) : !passed ? (
        <QuizDeck questions={questions} onFinish={finish} />
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
        <QuestionReview questions={questions} />
      )}

      {(answers || passed) && (
        <div className="quiz-actions">
          <span />
          <button className="secondary" onClick={onReset}>
            <RotateCcw />
            Retry
          </button>
        </div>
      )}
    </section>
  );
}

// Each question with its correct option marked. With `answers`, each one
// also tags the option chosen and the correct option.
function QuestionReview({
  questions,
  answers,
}: {
  questions: QuizQuestion[];
  answers?: number[];
}) {
  return (
    <div className="question-list">
      {questions.map((q, i) => {
        const given = answers?.[i];
        const right = given === undefined || given === q.correct;
        return (
          <div
            key={q.id}
            className={right ? 'question correct' : 'question wrong'}
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
              value={String(q.correct)}
              disabled
            >
              {q.options.map((option, j) => (
                <label
                  className={
                    answers && j === given && !right
                      ? 'question-option is-wrong-pick'
                      : 'question-option'
                  }
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
                  {answers && j === given && (
                    <em
                      className={
                        right ? 'option-tag is-right' : 'option-tag is-wrong'
                      }
                    >
                      Your answer
                    </em>
                  )}
                  {answers && j === q.correct && (
                    <em className="option-tag is-right">Correct answer</em>
                  )}
                </label>
              ))}
            </RadioGroup>
            <p className="answer-note">
              {right ? 'Correct. ' : 'Incorrect. '}
              <MathText text={q.explanation} />
            </p>
          </div>
        );
      })}
    </div>
  );
}
