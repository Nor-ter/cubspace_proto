import { MathText } from './MathText';
import { QuizDeck } from './QuizDeck';
import { useState, type ReactNode } from 'react';
import { Check, ChevronRight, PartyPopper, RotateCcw } from 'lucide-react';
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
  reward,
  sourceUrl,
}: {
  /** Shown on the start card only. */
  title: string;
  questions: QuizQuestion[];
  passed: boolean;
  onPass: () => void;
  onReset: () => void;
  /** Shown once every answer is right, such as a certificate download. */
  reward?: ReactNode;
  /** Link for a reference number cited as [n] at the end of an explanation. */
  sourceUrl?: (id: number) => string | undefined;
}) {
  // This attempt's answers, once all questions are answered.
  const [answers, setAnswers] = useState<number[] | null>(null);
  const [reviewing, setReviewing] = useState(false);
  // The deck waits behind a cover until Start is pressed.
  const [started, setStarted] = useState(false);
  const score = answers
    ? answers.filter((answer, i) => answer === questions[i].correct).length
    : 0;
  const perfect = answers !== null && score === questions.length;

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
          {/* The quiz is named by its format; the topic is on the card. */}
          <h3 id={`${questions[0].id}-title`} className="quiz-check-title">
            KNOWLEDGE CHECK
          </h3>
          <p>
            {answers
              ? 'Here is your result. Check each answer below, or retry the quiz.'
              : passed
                ? 'You have completed this quiz. Review the explanations or retry it.'
                : `Answer each question. After ${questions.length === 1 ? 'this question' : `all ${questions.length} questions`} you will see your result.`}
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
          {perfect && <Celebration />}
          <p
            className={perfect ? 'quiz-result is-perfect' : 'quiz-result'}
            aria-live="polite"
          >
            <strong>
              {score} / {questions.length}
            </strong>
          </p>
          <QuestionReview
            questions={questions}
            answers={answers}
            sourceUrl={sourceUrl}
          />
        </>
      ) : !passed && !started ? (
        <div className="quiz-cover">
          <p className="quiz-cover-count">
            {questions.length}{' '}
            {questions.length === 1 ? 'question' : 'questions'}
          </p>
          <p className="quiz-cover-title">{title}</p>
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
        <QuestionReview questions={questions} sourceUrl={sourceUrl} />
      )}

      {(answers ? perfect : passed) && reward}

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

const CONFETTI = 28;

// A perfect score gets its own moment: a burst of confetti in the site's
// colours behind a congratulation line.
function Celebration() {
  return (
    <output className="quiz-celebrate">
      <span className="quiz-confetti" aria-hidden="true">
        {Array.from({ length: CONFETTI }, (_, i) => (
          <i
            key={i}
            style={
              {
                '--turn': `${(i / CONFETTI) * 360}deg`,
                '--reach': `${110 + ((i * 37) % 90)}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </span>
      <PartyPopper aria-hidden="true" />
      <span className="quiz-celebrate-text">
        <strong>Perfect score. Congratulations!</strong>
        <span>
          Every answer is right. You are ready for your first assignment.
        </span>
      </span>
    </output>
  );
}

// Each question with its correct option marked. With `answers`, only the
// option chosen is marked and tagged instead.
function QuestionReview({
  questions,
  answers,
  sourceUrl,
}: {
  questions: QuizQuestion[];
  answers?: number[];
  sourceUrl?: (id: number) => string | undefined;
}) {
  return (
    <div className={answers ? 'question-list is-graded' : 'question-list'}>
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
            {q.numericAnswers ? (
              <p className="answer-note">
                Correct answer: {q.options[q.correct]}
              </p>
            ) : (
              <RadioGroup
                className="question-options"
                aria-labelledby={`${q.id}-label`}
                // Graded: only the person's own pick is marked; the review
                // without answers marks the correct option.
                value={String(answers ? given : q.correct)}
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
                  </label>
                ))}
              </RadioGroup>
            )}
            <p className="answer-note">
              <Explanation text={q.explanation} sourceUrl={sourceUrl} />
            </p>
          </div>
        );
      })}
    </div>
  );
}

// An explanation ending in a reference number, "… [4]": the number links to
// the reference when its address is known.
function Explanation({
  text,
  sourceUrl,
}: {
  text: string;
  sourceUrl?: (id: number) => string | undefined;
}) {
  const match = /^(.*?)\s*\[(\d+)\]$/s.exec(text);
  const url = match && sourceUrl?.(Number(match[2]));
  if (!match || !url) return <MathText text={text} />;
  return (
    <>
      <MathText text={match[1]} />{' '}
      <a className="answer-cite" href={url} target="_blank" rel="noreferrer">
        [{match[2]}]
      </a>
    </>
  );
}
