import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Check, ChevronRight, X } from 'lucide-react';
import type { QuizQuestion } from '@/types/quiz';
import { MathText } from './MathText';

const OPTION_KEYS = ['A', 'B', 'C', 'D', 'E', 'F'];
const LEAVE_MS = 450;

type Phase = 'question' | 'flipped' | 'leaving';

// One card at a time: answering flips the card to its explanation, a correct card
// leaves to the right, a missed card leaves to the left and returns at the back of the deck.
export function QuizDeck({
  questions,
  onPass,
  onSolvedChange,
}: {
  questions: QuizQuestion[];
  onPass: () => void;
  onSolvedChange: (solved: number) => void;
}) {
  const [queue, setQueue] = useState(() => questions.map((_, index) => index));
  const [missed, setMissed] = useState<ReadonlySet<number>>(() => new Set());
  const [solved, setSolved] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>('question');
  const [turn, setTurn] = useState(0);
  const nextRef = useRef<HTMLButtonElement>(null);
  const firstOptionRef = useRef<HTMLButtonElement>(null);

  const current = queue[0];
  const question = questions[current];
  const isCorrect = selected === question.correct;
  const promptId = `${question.id}-deck-prompt`;

  useEffect(() => {
    if (phase === 'flipped') nextRef.current?.focus({ preventScroll: true });
  }, [phase]);
  useEffect(() => {
    if (turn > 0) firstOptionRef.current?.focus({ preventScroll: true });
  }, [turn]);

  function choose(option: number) {
    if (phase !== 'question') return;
    setSelected(option);
    setPhase('flipped');
  }

  function advance() {
    if (phase !== 'flipped') return;
    setPhase('leaving');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(() => {
      const rest = queue.slice(1);
      if (isCorrect) {
        const nextMissed = new Set(missed);
        nextMissed.delete(current);
        setMissed(nextMissed);
        setSolved(solved + 1);
        onSolvedChange(solved + 1);
        if (rest.length === 0) {
          onPass();
          return;
        }
        setQueue(rest);
      } else {
        setMissed(new Set(missed).add(current));
        setQueue([...rest, current]);
      }
      setSelected(null);
      setPhase('question');
      setTurn(turn + 1);
    }, still ? 0 : LEAVE_MS);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const option = Number(event.key) - 1;
    if (phase === 'question' && option >= 0 && option < question.options.length) {
      event.preventDefault();
      choose(option);
    }
  }

  const leaving = phase === 'leaving' ? (isCorrect ? ' to-right' : ' to-left') : '';
  return (
    <div className="quiz-deck">
      <div className="deck-pile deck-pile-missed" aria-label={`${missed.size} to retry`}>
        <X aria-hidden="true" />
        <span>{missed.size}</span>
      </div>
      <div className={queue.length > 1 ? 'deck-stage has-more' : 'deck-stage'}>
        <article key={turn} className={`quiz-card ${phase}${leaving}`}>
          <div className="quiz-card-inner">
            <div className="quiz-card-face quiz-card-front" aria-hidden={phase !== 'question'}>
              <header>
                <span>{String(current + 1).padStart(2, '0')}</span>
                <span>
                  {solved} / {questions.length}
                </span>
              </header>
              <p className="quiz-card-prompt" id={promptId}>
                <MathText text={question.prompt} />
              </p>
              <fieldset className="quiz-card-options" aria-labelledby={promptId}>
                {question.options.map((option, index) => (
                  <button
                    key={option}
                    ref={index === 0 ? firstOptionRef : undefined}
                    disabled={phase !== 'question'}
                    onClick={() => choose(index)}
                    onKeyDown={onKeyDown}
                  >
                    <kbd>{OPTION_KEYS[index]}</kbd>
                    <span>
                      <MathText text={option} />
                    </span>
                  </button>
                ))}
              </fieldset>
              <p className="quiz-card-hint">Choose an answer</p>
            </div>
            <div
              className="quiz-card-face quiz-card-back"
              aria-hidden={phase === 'question'}
              aria-live="polite"
            >
              {selected !== null && (
                <>
                  <p className={isCorrect ? 'quiz-verdict is-correct' : 'quiz-verdict is-wrong'}>
                    <i aria-hidden="true">{isCorrect ? <Check /> : <X />}</i>
                    {isCorrect ? 'Correct.' : 'Try again'}
                  </p>
                  <p className="quiz-card-note">
                    {isCorrect ? '' : `Answer: ${question.options[question.correct]}. `}
                    <MathText text={question.explanation} />
                  </p>
                  <button
                    ref={nextRef}
                    className="quiz-card-next"
                    tabIndex={phase === 'flipped' ? 0 : -1}
                    onClick={advance}
                  >
                    Next
                    <ChevronRight />
                  </button>
                </>
              )}
            </div>
          </div>
        </article>
      </div>
      <div className="deck-pile deck-pile-solved" aria-label={`${solved} correct`}>
        <Check aria-hidden="true" />
        <span>{solved}</span>
      </div>
    </div>
  );
}
