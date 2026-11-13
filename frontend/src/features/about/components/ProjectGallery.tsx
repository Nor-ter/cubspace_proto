import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import type { Project } from '../data';
import './ProjectGallery.css';

// Photo viewer for one project. A modal dialog: it takes focus, closes with
// Escape, the close button or a click on the backdrop.
export function ProjectGallery({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const images = project.images;
  const current = images[index];
  const hasMany = images.length > 1;

  const move = (direction: number) =>
    setIndex((value) => (value + direction + images.length) % images.length);

  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element?.showModal();
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // A click on the backdrop lands on the dialog itself and closes it; the
  // arrow keys step through the photos.
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const onClick = (event: MouseEvent) => {
      if (event.target === element) onClose();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (images.length < 2) return;
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === 'ArrowRight') move(1);
    };
    element.addEventListener('click', onClick);
    element.addEventListener('keydown', onKeyDown);
    return () => {
      element.removeEventListener('click', onClick);
      element.removeEventListener('keydown', onKeyDown);
    };
  });

  return (
    <dialog
      ref={dialog}
      className="project-gallery"
      aria-labelledby="project-gallery-title"
      onClose={() => {
        // React's development remount closes and reopens the dialog; only a
        // close that leaves it shut should unmount the gallery.
        if (!dialog.current?.open) onClose();
      }}
      data-lenis-prevent
    >
      <div className="gallery-sheet">
        <div className="gallery-header">
          <h2 id="project-gallery-title">{project.name}</h2>
          {hasMany && (
            <span className="gallery-count" aria-live="polite">
              {index + 1} / {images.length}
            </span>
          )}
          <button
            className="gallery-tool"
            onClick={onClose}
            aria-label="Close photos"
          >
            <X />
          </button>
        </div>
        <figure className="gallery-figure">
          <img src={current.src} alt={current.alt} />
          <figcaption>
            <p>{current.caption}</p>
            {current.source && (
              <a href={current.source} target="_blank" rel="noreferrer">
                Source: Melbourne Space Program <ArrowUpRight />
              </a>
            )}
          </figcaption>
        </figure>
        {hasMany && (
          <div className="gallery-controls">
            <button
              className="gallery-tool"
              onClick={() => move(-1)}
              aria-label="Previous photo"
            >
              <ArrowLeft />
            </button>
            <div className="gallery-thumbnails">
              {images.map((item, imageIndex) => (
                <button
                  key={item.src}
                  onClick={() => setIndex(imageIndex)}
                  aria-label={`Show photo ${imageIndex + 1}`}
                  aria-pressed={imageIndex === index}
                >
                  <img src={item.src} alt="" />
                </button>
              ))}
            </div>
            <button
              className="gallery-tool"
              onClick={() => move(1)}
              aria-label="Next photo"
            >
              <ArrowRight />
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}
