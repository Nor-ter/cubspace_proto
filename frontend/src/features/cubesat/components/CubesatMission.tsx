import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { TypewriterText } from '@/components/TypewriterText';
import { FigureDialog, type DialogFigure } from '@/components/FigureDialog';
import {
  BUILD_FIGURES,
  BUILD_STATS,
  CDS_PDF,
  CUBESAT_101,
  STAT_FIGURES,
  STATS,
  TOPICS,
} from '../data';
import { CubeSizes } from './CubeSizes';
import { CubesatText } from './CubesatText';
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

const FLIGHT_FIGURES = 'Test & Launch';

const CUBESAT_REFERENCES = [
  [
    1,
    'NASA Systems Engineering Handbook',
    'https://www.nasa.gov/reference/3-0-nasa-program-project-life-cycle/',
  ],
  [2, 'NASA CubeSat 101 (2017)', CUBESAT_101],
  [3, 'CubeSat Design Specification Rev. 14.1', CDS_PDF],
  [
    4,
    'NASA State-of-the-Art Small Spacecraft Technology (2024)',
    'https://ntrs.nasa.gov/citations/20250000142',
  ],
] as const;

// The boxes above each topic, in TOPICS order.
const TOPIC_STATS = [STATS, BUILD_STATS];

export function CubesatMission({ isActive }: { isActive: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  // The slide the dialog opens on, for a thumbnail picked in a row.
  const [start, setStart] = useState(0);
  const [titleFollowsSlide, setTitleFollowsSlide] = useState(false);
  const figures = open ? FIGURES[open] : undefined;

  return (
    <>
      <section className="intro-block cubesat-mission" aria-label="CubeSat">
        <MissionEquation isActive={isActive} />
        {TOPICS.map((topic, t) => (
          // Each topic: its title, its four boxes, then its rows.
          <section
            key={topic.title}
            className="cubesat-topic"
            aria-label={topic.title}
          >
            <h4>
              {isActive && (
                <TypewriterText
                  text={topic.title}
                  when="view"
                  highlightWord="CubeSat"
                />
              )}
            </h4>
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
                          setTitleFollowsSlide(false);
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
                  <dd>
                    <CubesatText text={label} />
                  </dd>
                </div>
              ))}
            </dl>
            <div className="cubesat-topic-body">
              <dl className={topic.phases ? 'has-phases' : undefined}>
                {topic.points.map(([label, text, details]) => {
                  const phase = topic.phases?.[label];
                  return (
                    <div key={label} className={phase ? 'is-step' : undefined}>
                      <dt>
                        {phase && <span className="step-phase">{phase}</span>}
                        {label}
                      </dt>
                      <dd>
                        {text && (
                          <p>
                            <CubesatText text={text} />
                          </p>
                        )}
                        {details && (
                          <ul className="cubesat-phase-details">
                            {details.map(([name, description]) => (
                              <li key={name}>
                                <strong>{name}</strong>
                                <p>
                                  <CubesatText text={description} />
                                </p>
                              </li>
                            ))}
                          </ul>
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </section>
        ))}
        <section
          className="guide-references cubesat-references"
          aria-label="References"
        >
          <h4>References</h4>
          <ol>
            {CUBESAT_REFERENCES.map(([id, label, url]) => (
              <li key={id}>
                <span className="cubesat-reference-number">[{id}]</span>
                <div className="cubesat-reference-content">
                  <a href={url} target="_blank" rel="noreferrer">
                    {label}
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                </div>
              </li>
            ))}
            {FIGURES[FLIGHT_FIGURES]?.map((figure, n) => (
              <li key={figure.label}>
                <span className="cubesat-reference-number">[{n + 5}]</span>
                <button
                  className="cubesat-reference-content cubesat-reference-button"
                  onClick={() => {
                    setStart(n);
                    setTitleFollowsSlide(true);
                    setOpen(FLIGHT_FIGURES);
                  }}
                  aria-haspopup="dialog"
                >
                  {figure.label}
                  <ArrowUpRight aria-hidden="true" />
                </button>
              </li>
            ))}
          </ol>
        </section>
      </section>

      {open && figures && (
        <FigureDialog
          title={open}
          start={start}
          titleFollowsSlide={titleFollowsSlide}
          figures={figures}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
