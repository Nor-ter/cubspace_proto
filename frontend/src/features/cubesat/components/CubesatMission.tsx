import { useState } from 'react';
import { FigureDialog, type DialogFigure } from '@/components/FigureDialog';
import { STAT_FIGURES, STATS, TOPICS } from '../data';
import { EarthOrbits, OrbitTable } from './EarthOrbits';
import './CubesatMission.css';

/**
 * The CubeSat page body, under its hero: the format in four numbers and the
 * guide's sentences as labelled rows in two topics. A number with pictures
 * behind it opens them, with their sources, in a dialog.
 */
// Every box's pictures: the photos from the data, and for LEO a drawing of
// the three orbits followed by a table comparing them.
const FIGURES: Partial<Record<string, readonly DialogFigure[]>> = {
  ...STAT_FIGURES,
  LEO: [
    { label: 'LEO, MEO and GEO', content: <EarthOrbits /> },
    { label: 'Compared', content: <OrbitTable /> },
  ],
};

export function CubesatMission() {
  const [open, setOpen] = useState<string | null>(null);
  const figures = open ? FIGURES[open] : undefined;

  return (
    <>
      <section className="intro-block cubesat-mission" aria-label="CubeSat">
        <dl className="cubesat-stats grip-frame">
          {STATS.map(([value, label]) => (
            <div
              key={value}
              className={FIGURES[value] ? 'has-figure' : undefined}
            >
              <dt>
                {FIGURES[value] ? (
                  // Stretched over the whole box, so the box is the button.
                  <button
                    className="cubesat-stat-open"
                    onClick={() => setOpen(value)}
                    aria-haspopup="dialog"
                  >
                    {value}
                  </button>
                ) : (
                  value
                )}
              </dt>
              <dd>{label}</dd>
            </div>
          ))}
        </dl>
        <div className="cubesat-topics">
          {TOPICS.map((topic) => (
            <section key={topic.title} aria-label={topic.title}>
              <h4>{topic.title}</h4>
              <dl>
                {topic.points.map(([label, text]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{text}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </section>

      {open && figures && (
        <FigureDialog
          title={open}
          figures={figures}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
