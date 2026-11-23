import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { lockScroll } from '@/lib/smoothScroll';
import './FigureDialog.css';

export type DialogFigure = {
  /** Shown over the picture, e.g. "3U". */
  label?: string;
  /** A picture file, or `content` drawn in the page (a drawing, a table). */
  src?: string;
  alt?: string;
  content?: ReactNode;
  /** Author and licence; with `sourceUrl`, shown as the picture's source. */
  credit?: string;
  sourceUrl?: string;
  licenceUrl?: string;
};

/**
 * Pictures in a modal dialog, one at a time, turned with previous and next
 * or the arrow keys. Mount it to open it; Esc, the close button or a click
 * on the backdrop calls `onClose`, and the page does not scroll behind it.
 */
export function FigureDialog({
  title,
  figures,
  start = 0,
  onClose,
}: {
  title: string;
  figures: readonly DialogFigure[];
  start?: number;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    lockScroll(true);
    // A click on the dialog itself, not its content, lands on the backdrop.
    const onClick = (event: MouseEvent) => {
      if (event.target === dialog) dialog.close();
    };
    dialog.addEventListener('click', onClick);
    return () => {
      dialog.removeEventListener('click', onClick);
      lockScroll(false);
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="figure-dialog"
      aria-label={title}
      // A tall dialog scrolls itself, not the smooth-scrolled page.
      data-lenis-prevent
      onClose={onClose}
    >
      <div className="figure-dialog-body">
        <div className="figure-dialog-head">
          <p>{title}</p>
          <button
            className="figure-dialog-close"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close"
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <Slides figures={figures} start={start} />
      </div>
    </dialog>
  );
}

function Slides({
  figures,
  start,
}: {
  figures: readonly DialogFigure[];
  start: number;
}) {
  const [slide, setSlide] = useState(start);
  const count = figures.length;
  // Left and right wrap round at the ends.
  const step = (by: number) => setSlide((at) => (at + by + count) % count);

  useEffect(() => {
    if (count < 2) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') setSlide((at) => (at - 1 + count) % count);
      if (event.key === 'ArrowRight') setSlide((at) => (at + 1) % count);
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [count]);

  const figure = figures[slide];
  return (
    <div className="figure-dialog-group">
      {figure.label && <p className="figure-dialog-label">{figure.label}</p>}
      <Figure key={figure.src ?? figure.label ?? slide} figure={figure} />
      {count > 1 && (
        <div className="figure-dialog-nav">
          <button onClick={() => step(-1)} aria-label="Previous image">
            <ChevronLeft aria-hidden="true" />
          </button>
          <span aria-live="polite">
            {slide + 1} / {count}
          </span>
          <button onClick={() => step(1)} aria-label="Next image">
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

function Figure({ figure }: { figure: DialogFigure }) {
  return (
    <figure>
      {figure.content ? (
        <div className="figure-dialog-content">{figure.content}</div>
      ) : (
        <img src={figure.src} alt={figure.alt} />
      )}
      {figure.credit && figure.sourceUrl && (
        <figcaption>
          <span className="figure-dialog-credit">
            Source:{' '}
            <a href={figure.sourceUrl} target="_blank" rel="noreferrer">
              {figure.credit}
              <ArrowUpRight aria-hidden="true" />
            </a>
            {figure.licenceUrl && (
              <>
                {' '}
                (
                <a href={figure.licenceUrl} target="_blank" rel="noreferrer">
                  licence
                </a>
                )
              </>
            )}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
