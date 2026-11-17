import { useEffect, useRef, useState, type CSSProperties } from 'react';

/**
 * Types the text on, one character every 20ms, each character switching on
 * rather than fading. Words never break across lines. `start` continues the
 * count from earlier text, so several lines type as one sequence.
 * `when="view"` waits until the text scrolls into view; the default types on
 * as soon as it renders.
 */
export function TypewriterText({
  text,
  start = 0,
  when = 'load',
}: {
  text: string;
  start?: number;
  when?: 'load' | 'view';
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [typing, setTyping] = useState(when === 'load');

  useEffect(() => {
    const element = ref.current;
    if (typing || !element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setTyping(true);
        observer.disconnect();
      },
      { rootMargin: '0px 0px -20% 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [typing]);

  let index = start;
  return (
    <>
      <span
        ref={ref}
        className={typing ? 'tw is-typing' : 'tw'}
        aria-hidden="true"
      >
        {text.split(' ').map((word, w) => (
          <span key={w}>
            {w > 0 && ' '}
            <span className="tw-word">
              {word.split('').map((char) => (
                <span
                  key={index}
                  className="tw-char"
                  style={{ '--i': index++ } as CSSProperties}
                >
                  {char}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
      <span className="tw-label">{text}</span>
    </>
  );
}
