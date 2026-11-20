import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Check, ChevronRight, X } from 'lucide-react';
import type { QuizQuestion } from '@/types/quiz';
import { playCorrect, playWrong } from '@/lib/sound';
import { MathText } from './MathText';

const OPTION_KEYS = ['A', 'B', 'C', 'D', 'E', 'F'];
const LEAVE_MS = 450;

type Phase = 'question' | 'flipped' | 'leaving';

// One card at a time, each question once: answering flips the card to its
// explanation, a correct card leaves to the right and a missed one to the
// left. After the last card the answers go to `onFinish`.
export function QuizDeck({
  questions,
  onFinish,
}: {
  questions: QuizQuestion[];
  onFinish: (answers: number[]) => void;
}) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  // Counts also key each pile's icon, so its hit plays on every new card.
  const [solved, setSolved] = useState(0);
  const [misses, setMisses] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>('question');
  const [turn, setTurn] = useState(0);
  const nextRef = useRef<HTMLButtonElement>(null);
  const firstOptionRef = useRef<HTMLButtonElement>(null);

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
    if (option === question.correct) playCorrect();
    else playWrong();
    setSelected(option);
    setPhase('flipped');
  }

  function advance() {
    if (phase !== 'flipped') return;
    setPhase('leaving');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(() => {
      const next = [...answers, selected as number];
      if (isCorrect) setSolved(solved + 1);
      else setMisses(misses + 1);
      if (current === questions.length - 1) {
        onFinish(next);
        return;
      }
      setAnswers(next);
      setCurrent(current + 1);
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
      <div className="deck-pile deck-pile-missed" aria-label={`${misses} wrong`}>
        {/* Remounted on each hit, so the pile's animation plays again. */}
        <X key={misses} className={misses ? 'is-hit' : undefined} aria-hidden="true" />
        <span key={`n${misses}`} className={misses ? 'is-hit' : undefined}>
          {misses}
        </span>
      </div>
      <div
        className={current < questions.length - 1 ? 'deck-stage has-more' : 'deck-stage'}
      >
        <article key={turn} className={`quiz-card ${phase}${leaving}`}>
          <div className="quiz-card-inner">
            <div className="quiz-card-face quiz-card-front" aria-hidden={phase !== 'question'}>
              <header>
                <span>
                  {current + 1} / {questions.length}
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
                    {/* Cards no longer come back, so not "Try again". */}
                    {isCorrect ? 'Correct.' : 'Incorrect.'}
                  </p>
                  <p className="quiz-card-note">
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
        <Check key={solved} className={solved ? 'is-hit' : undefined} aria-hidden="true" />
        <span key={`n${solved}`} className={solved ? 'is-hit' : undefined}>
          {solved}
        </span>
      </div>
    </div>
  );
}
