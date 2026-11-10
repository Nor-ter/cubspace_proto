import { Fragment, useEffect, useRef, useState } from 'react';

const WORD_STAGGER_MS = 60;

export function RevealText({
  children,
  startIndex = 0,
  highlightWord,
}: {
  children: string;
  startIndex?: number;
  highlightWord?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const { top, width } = entry.boundingClientRect;
        if (entry.isIntersecting) setIsShown(true);
        else if (width === 0 || top > 0) setIsShown(false);
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={isShown ? 'reveal-text shown' : 'reveal-text'}>
      {children.split(' ').map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          {index > 0 && ' '}
          <span
            className={
              word === highlightWord
                ? 'reveal-word reveal-highlight'
                : 'reveal-word'
            }
          >
            <span
              className="reveal-inner"
              style={{
                transitionDelay: `${(startIndex + index) * WORD_STAGGER_MS}ms`,
              }}
            >
              {word}
            </span>
          </span>
        </Fragment>
      ))}
    </span>
  );
}
