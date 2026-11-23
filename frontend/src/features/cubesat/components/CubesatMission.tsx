import { ORBIT_SOURCES } from '../viewer/orbit';
import { MissionVideos, MissionVideoPreview } from './MissionVideos';
import { CubesatVisual } from './CubesatVisual';
import { useEffect, useRef, useState } from 'react';
import { scrollToY } from '@/lib/smoothScroll';
import { CUBESAT_PAGES, SOURCES, STATS, TOPICS } from '../data';
import { CubesatOrbitQuiz, CubesatQuizzes } from './CubesatQuizzes';
import './CubesatMission.css';

/** Preserve the four-stat header and two-column, labelled-row page layout. */
export function CubesatMission() {
  const readPage = () => new URLSearchParams(location.search).get('cubesat');
  const [pageId, setPageId] = useState(readPage);
  const heading = useRef<HTMLHeadingElement>(null);
  const selectedPage = CUBESAT_PAGES.find(
    (page) => page.id === (pageId === 'mass' ? 'formats' : pageId),
  );
  useEffect(() => {
    const sync = () => setPageId(readPage());
    addEventListener('popstate', sync);
    return () => removeEventListener('popstate', sync);
  }, []);
  useEffect(() => {
    if (pageId) heading.current?.focus({ preventScroll: true });
  }, [pageId]);
  function navigate(event: React.MouseEvent<HTMLAnchorElement>, id?: string) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    const url = new URL(location.href);
    if (id) url.searchParams.set('cubesat', id);
    else url.searchParams.delete('cubesat');
    url.hash = 'acrux';
    history.pushState(null, '', url);
    dispatchEvent(new PopStateEvent('popstate'));
    scrollToY(0, true);
  }
  function pageHref(id?: string) {
    const url = new URL(location.href);
    if (id) url.searchParams.set('cubesat', id);
    else url.searchParams.delete('cubesat');
    url.hash = 'acrux';
    return url.pathname + url.search + url.hash;
  }
  const points = TOPICS.flatMap((topic) => topic.points);
  const visibleTopics = selectedPage
    ? [
        {
          title: selectedPage.title,
          points: points.filter((point) =>
            (selectedPage.labels as readonly string[]).includes(point.label),
          ),
        },
      ]
    : [];
  return (
    <section className="intro-block cubesat-mission" aria-label="CubeSat">
      {selectedPage ? (
        <header className="cubesat-detail-head">
          <h3 ref={heading} tabIndex={-1}>
            {selectedPage.title}
          </h3>
          <p>{selectedPage.summary}</p>
        </header>
      ) : (
        <>
          <dl className="cubesat-stats grip-frame">
            {STATS.map(([value, label], index) => (
              <div key={value}>
                <dt>
                  <a
                    className="cubesat-stat-link"
                    href={pageHref(
                      (['basics', 'formats', 'formats', 'orbits'] as const)[
                        index
                      ],
                    )}
                    onClick={(event) =>
                      navigate(
                        event,
                        (['basics', 'formats', 'formats', 'orbits'] as const)[
                          index
                        ],
                      )
                    }
                  >
                    {value}
                  </a>
                </dt>
                <dd>
                  {label}
                  <span className="cubesat-card-action">Explore &#8599;</span>
                </dd>
              </div>
            ))}
          </dl>
          <div className="cubesat-gallery-intro">
            <h3>CubeSat mission = Launcher + CubeSat + Dispenser</h3>
            <p>
              Explore the spacecraft, its ride to orbit and what it takes to be
              ready for flight.
            </p>
          </div>
          <nav className="cubesat-gallery" aria-label="CubeSat topics">
            {CUBESAT_PAGES.map((page) => (
              <a
                className="cubesat-gallery-card grip-frame"
                key={page.id}
                href={pageHref(page.id)}
                onClick={(event) => navigate(event, page.id)}
              >
                {page.image === 'acceptance-checklist' ||
                page.image === 'mission-timeline' ? (
                  <img
                    src={`/images/cubesat/${page.image}.png`}
                    alt={page.title}
                    loading="lazy"
                  />
                ) : page.image === 'launch-sequence' ? (
                  <MissionVideoPreview />
                ) : (
                  <CubesatVisual kind={page.image} preview />
                )}
                <div className="cubesat-card-copy">
                  <h4>{page.title}</h4>
                  <p>{page.summary}</p>
                  <span className="cubesat-card-action">Explore &#8599;</span>
                </div>
              </a>
            ))}
          </nav>
        </>
      )}
      <div className="cubesat-topics cubesat-detail">
        {visibleTopics.map((topic) => (
          <section key={topic.title} aria-label={topic.title}>
            <dl>
              {topic.points.map(({ label, text, figure, link, linkLabel }) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>
                    {text}
                    {label === 'ISS route' && (
                      <figure className="cubesat-reference-figure">
                        <a
                          href="/images/cubesat/iss-ground-track.png"
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Open full-size ISS ground-track illustration"
                        >
                          <img
                            src="/images/cubesat/iss-ground-track.png"
                            alt="World map illustrating successive ISS ground tracks and an example ISS position."
                            loading="lazy"
                          />
                        </a>
                        <figcaption>
                          ISS ground-track illustration. Reference image
                          supplied for this page; not a live position display.
                        </figcaption>
                      </figure>
                    )}
                    {label === 'Launcher' && (
                      <figure className="cubesat-reference-figure">
                        <a
                          href="/images/cubesat/launcher-size-comparison.png"
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Open full-size launch vehicle comparison"
                        >
                          <img
                            src="/images/cubesat/launcher-size-comparison.png"
                            alt="Illustrated height comparison of V-2, R-7, Saturn V, Space Shuttle, Ariane 5, Delta IV Heavy, Proton, CZ-2F and Starship."
                            loading="lazy"
                          />
                        </a>
                        <figcaption>
                          Launch vehicle size comparison, as illustrated.
                          Credit: Encyclopaedia Britannica, Inc. Vehicle
                          versions reflect the supplied illustration.
                        </figcaption>
                      </figure>
                    )}
                    {label === 'Dispenser' && (
                      <div
                        className="cubesat-dispenser-gallery"
                        aria-label="Dispenser reference images"
                      >
                        {[
                          {
                            file: 'dispenser-p-pod',
                            caption: 'P-POD dispenser',
                            alt: 'P-POD dispenser with its front door open and external harness visible.',
                          },
                          {
                            file: 'dispenser-open-door',
                            caption: 'Door and guide rails',
                            alt: 'Dispenser illustration showing an open hinged door, side panels and internal guide rails.',
                          },
                          {
                            file: 'dispenser-configurations',
                            caption: 'Configuration examples',
                            alt: 'Three dispenser configurations with springs and spacecraft partly outside their enclosures.',
                          },
                        ].map((image) => (
                          <figure key={image.file}>
                            <a
                              href={`/images/cubesat/${image.file}.png`}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`Open full-size image: ${image.caption}`}
                            >
                              <img
                                src={`/images/cubesat/${image.file}.png`}
                                alt={image.alt}
                                loading="lazy"
                              />
                            </a>
                            <figcaption>{image.caption}</figcaption>
                          </figure>
                        ))}
                      </div>
                    )}
                    {link && (
                      <p>
                        <a
                          className={
                            link === 'cds' || link === 'cubesat'
                              ? 'cubesat-resource-button'
                              : undefined
                          }
                          href={SOURCES[link]}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {linkLabel}
                          {(link === 'cds' || link === 'cubesat') && (
                            <span aria-hidden="true">&#8599;</span>
                          )}
                        </a>
                      </p>
                    )}
                    {figure?.file === 'launch-sequence' ? (
                      <MissionVideos />
                    ) : (
                      figure && (
                        <figure className="cubesat-reference-figure">
                          {selectedPage?.id === 'requirements' ||
                          selectedPage?.id === 'timeline' ||
                          figure.file === 'mass-and-size' ||
                          figure.file === 'flight-documentation' ||
                          figure.file === 'acceptance-checklist' ? (
                            <a
                              href={`/images/cubesat/${figure.file}.png`}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`Open full-size image: ${figure.alt}`}
                            >
                              <img
                                src={`/images/cubesat/${figure.file}.png`}
                                alt={figure.alt}
                                loading="lazy"
                              />
                            </a>
                          ) : (
                            <CubesatVisual kind={figure.file} />
                          )}
                          <figcaption>
                            <a
                              href={SOURCES[figure.source]}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {selectedPage?.id === 'requirements' ||
                              selectedPage?.id === 'timeline' ||
                              figure.file === 'mass-and-size' ||
                              figure.file === 'flight-documentation' ||
                              figure.file === 'acceptance-checklist' ? (
                                figure.caption
                              ) : (
                                <>
                                  Educational 3D schematic. Reference:{' '}
                                  {figure.source === 'cds'
                                    ? 'Cal Poly CDS Rev. 14.1'
                                    : figure.source === 'soa'
                                      ? 'NASA State-of-the-Art (2024)'
                                      : figure.source === 'orbits'
                                        ? 'NASA Earth Observatory: Catalog of Earth Satellite Orbits'
                                        : 'NASA CubeSat 101 (2017)'}
                                  .{' '}
                                </>
                              )}
                            </a>
                          </figcaption>
                          {figure.file === 'cp1-cp10' && (
                            <nav
                              className="cubesat-model-links"
                              aria-label="Explore the pictured spacecraft on Gunter's Space Page"
                            >
                              <a
                                className="cubesat-resource-button"
                                href={SOURCES.cp1}
                                target="_blank"
                                rel="noreferrer"
                              >
                                CP1 (1U) <span aria-hidden="true">&#8599;</span>
                              </a>
                              <a
                                className="cubesat-resource-button"
                                href={SOURCES.exocube}
                                target="_blank"
                                rel="noreferrer"
                              >
                                CP10 (3U){' '}
                                <span aria-hidden="true">&#8599;</span>
                              </a>
                            </nav>
                          )}
                        </figure>
                      )
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
      {selectedPage?.id === 'formats' && (
        <CubesatQuizzes key={selectedPage.id} />
      )}
      {selectedPage?.id === 'orbits' && <CubesatOrbitQuiz />}
      <aside
        className="intro-source cubesat-references"
        aria-label="References"
      >
        <p>References</p>
        <ul>
          <li>
            <a href={SOURCES.nasa101} target="_blank" rel="noreferrer">
              NASA CubeSat 101 (2017), Chapters 1 and 6, Appendices D-E
            </a>
          </li>
          <li>
            <a href={SOURCES.soa} target="_blank" rel="noreferrer">
              NASA State-of-the-Art of Small Spacecraft Technology (2024),
              Chapter 1
            </a>
          </li>
          <li>
            <a href={SOURCES.cds} target="_blank" rel="noreferrer">
              Cal Poly CDS Rev. 14.1 (2022), Sections 1.2-1.3 and Table 1
            </a>
          </li>
          <li>
            <a href={SOURCES.orbits} target="_blank" rel="noreferrer">
              NASA Catalog of Earth Satellite Orbits
            </a>
          </li>
          {selectedPage?.id === 'orbits' && (
            <>
              <li>
                <a href={ORBIT_SOURCES.leo} target="_blank" rel="noreferrer">
                  NASA ARSET: Fundamentals of Remote Sensing for Public Health,
                  slide 21 (LEO altitude range)
                </a>
              </li>
              <li>
                <a href={ORBIT_SOURCES.basics} target="_blank" rel="noreferrer">
                  NASA Basics of Space Flight, Chapter 5 (GEO and polar orbits)
                </a>
              </li>
              <li>
                <a href={ORBIT_SOURCES.aqua} target="_blank" rel="noreferrer">
                  NASA/JPL AIRS: nominal Aqua orbit (Sun-synchronous example)
                </a>
              </li>
            </>
          )}
        </ul>
      </aside>
    </section>
  );
}
