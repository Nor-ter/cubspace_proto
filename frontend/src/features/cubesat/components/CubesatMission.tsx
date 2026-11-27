import { useState } from 'react';
import { FigureDialog, type DialogFigure } from '@/components/FigureDialog';
import {
  BUILD_FIGURES,
  CDS_PDF,
  BUILD_STATS,
  STAT_FIGURES,
  STATS,
  TOPICS,
} from '../data';
import { CubeSizes } from './CubeSizes';
import { EarthOrbits, OrbitTable } from './EarthOrbits';
import { MissionEquation } from './MissionEquation';
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
  ...BUILD_FIGURES,
  // The formats drawn side by side come first, then the photos.
  '1–12U': [
    { label: '1U to 12U', content: <CubeSizes /> },
    ...(STAT_FIGURES['1–12U'] ?? []),
  ],
  // The specification itself, read in the page.
  Specify: [
    {
      label: 'CDS Rev. 14.1 (9 February 2022)',
      content: (
        <iframe
          className="cubesat-pdf"
          src={CDS_PDF}
          title="CubeSat Design Specification Rev. 14.1"
        />
      ),
      credit: 'Cal Poly, CubeSat Design Specification Rev. 14.1 (PDF)',
      sourceUrl: CDS_PDF,
    },
  ],
  LEO: [
    { label: 'LEO, MEO and GEO', content: <EarthOrbits /> },
    { label: 'Compared', content: <OrbitTable /> },
  ],
};

// Rows that link to their pictures: row label -> box figure.
const ROW_FIGURES: Partial<Record<string, string>> = {
  'Verification & acceptance': 'Test',
};

// The boxes above each topic, in TOPICS order.
const TOPIC_STATS = [STATS, BUILD_STATS];

export function CubesatMission() {
  const [open, setOpen] = useState<string | null>(null);
  // The slide the dialog opens on, for a thumbnail picked in a row.
  const [start, setStart] = useState(0);
  const figures = open ? FIGURES[open] : undefined;

  return (
    <>
      <section className="intro-block cubesat-mission" aria-label="CubeSat">
        <MissionEquation />
        {TOPICS.map((topic, t) => (
          // Each topic: its title, its four boxes, then its rows.
          <section
            key={topic.title}
            className="cubesat-topic"
            aria-label={topic.title}
          >
            <h4>{topic.title}</h4>
            <dl
              // Boxes that are steps in order get arrows between them.
              className={
                topic.phases
                  ? 'cubesat-stats grip-frame is-sequence'
                  : 'cubesat-stats grip-frame'
              }
            >
              {TOPIC_STATS[t]?.map(([value, label]) => (
                <div
                  key={value}
                  className={FIGURES[value] ? 'has-figure' : undefined}
                >
                  <dt>
                    {FIGURES[value] ? (
                      // Stretched over the whole box, so the box is the button.
                      <button
                        className="cubesat-stat-open"
                        onClick={() => {
                          setStart(0);
                          setOpen(value);
                        }}
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
            <div className="cubesat-topic-body">
              <dl className={topic.phases ? 'has-phases' : undefined}>
                {topic.points.map(([label, text]) => {
                  // A step in order shows its life-cycle phase first.
                  const phase = topic.phases?.[label];
                  const step = phase
                    ? Object.keys(topic.phases ?? {}).indexOf(label) + 1
                    : 0;
                  return (
                    <div key={label} className={step ? 'is-step' : undefined}>
                      {/* A figure such as ~1.33 kg/U keeps its case. */}
                      <dt
                        className={/\d/.test(label) ? 'is-figure' : undefined}
                      >
                        {phase && <span className="step-phase">{phase}</span>}
                        {label}
                      </dt>
                      <dd>
                        {text}
                        {ROW_FIGURES[label] && (
                          // The row's evidence as links, each opening the dialog on it.
                          <span className="row-links">
                            {FIGURES[ROW_FIGURES[label]]?.map((figure, n) => (
                              <button
                                key={figure.src}
                                onClick={() => {
                                  setStart(n);
                                  setOpen(ROW_FIGURES[label] ?? null);
                                }}
                                aria-haspopup="dialog"
                              >
                                {figure.label}
                                <span aria-hidden="true"> ↗</span>
                              </button>
                            ))}
                          </span>
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </section>
        ))}
      </section>

      {open && figures && (
        <FigureDialog
          title={open}
          start={start}
          figures={figures}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
