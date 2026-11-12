import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import type { Project } from '../data';
import { PROJECT_IMAGES } from '../gallery';

export function ProjectGallery({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const images = PROJECT_IMAGES[project.index];
  const current = images[index];

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

  function move(direction: number) {
    setIndex((value) => (value + direction + images.length) % images.length);
  }

  return (
    <dialog
      ref={dialog}
      className="project-gallery"
      aria-labelledby="gallery-title"
      onClose={() => {
        if (!dialog.current?.open) onClose();
      }}
      data-lenis-prevent
    >
      <header className="gallery-header">
        <div>
          <p className="eyebrow">PROJECT {project.index} / GALLERY</p>
          <h2 id="gallery-title">{project.name}</h2>
        </div>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close gallery"
        >
          <X />
        </button>
      </header>
      <figure className="gallery-image">
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
      <footer className="gallery-controls">
        <button
          className="button"
          onClick={() => move(-1)}
          disabled={images.length < 2}
          aria-label="Previous image"
        >
          <ArrowLeft />
        </button>
        <span aria-live="polite">
          {index + 1} / {images.length}
        </span>
        <button
          className="button"
          onClick={() => move(1)}
          disabled={images.length < 2}
          aria-label="Next image"
        >
          <ArrowRight />
        </button>
      </footer>
      {images.length > 1 && (
        <div className="gallery-thumbnails">
          {images.map((item, imageIndex) => (
            <button
              key={item.src}
              onClick={() => setIndex(imageIndex)}
              aria-label={`Show image ${imageIndex + 1}`}
              aria-pressed={imageIndex === index}
            >
              <img src={item.src} alt="" />
            </button>
          ))}
        </div>
      )}
    </dialog>
  );
}
