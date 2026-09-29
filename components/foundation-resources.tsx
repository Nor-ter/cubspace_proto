import { ExternalLink, FileText, PlayCircle } from 'lucide-react';

const resources = [
  {
    topic: '01 · Coordinates and vectors',
    kind: 'PDF',
    title: 'Vectors, Matrices and Coordinate Transformations',
    institution: 'MIT OpenCourseWare · 16.07 Dynamics',
    location: 'pp. 1–3',
    purpose: 'Learn vector magnitude and direction and the dot and cross products first, to read B, m and τ.',
    href: 'https://ocw.mit.edu/courses/16-07-dynamics-fall-2009/66b42ce6c35f2757ad11dc0a6e2b2896_MIT16_07F09_Lec03.pdf',
    fallback:
      'If the PDF does not open, select Lecture L3 on the MIT OCW course page.',
    fallbackHref:
      'https://ocw.mit.edu/courses/16-07-dynamics-fall-2009/resources/mit16_07f09_lec03/',
  },
  {
    topic: '02 · Matrices and coordinate transformations',
    kind: 'PDF',
    title: 'Vectors, Matrices and Coordinate Transformations',
    institution: 'MIT OpenCourseWare · 16.07 Dynamics',
    location: 'pp. 9–11',
    purpose:
      'Examine the transformation matrix that expresses the same vector in different reference frames.',
    href: 'https://ocw.mit.edu/courses/16-07-dynamics-fall-2009/66b42ce6c35f2757ad11dc0a6e2b2896_MIT16_07F09_Lec03.pdf#page=9',
    fallback:
      'If page navigation does not work, open the PDF and go to printed page 9.',
    fallbackHref:
      'https://ocw.mit.edu/courses/16-07-dynamics-fall-2009/resources/mit16_07f09_lec03/',
  },
  {
    topic: '03 · Closed loop',
    kind: 'VIDEO',
    title: 'Lecture 25: Feedback',
    institution: 'MIT OpenCourseWare · Signals and Systems',
    location: 'Full lecture · no segment timecodes on the official page',
    purpose:
      'Understand why the reference input, error and system output are linked back through feedback.',
    href: 'https://ocw.mit.edu/courses/res-6-007-signals-and-systems-spring-2011/resources/lecture-25-feedback/',
    fallback:
      'If playback fails, use Transcript or Download video on the same page.',
    fallbackHref: undefined,
  },
  {
    topic: '04 · B-dot',
    kind: 'PDF',
    title:
      'Drag De-Orbit Device: A New Standard Re-Entry Actuator for CubeSats',
    institution: 'NASA Technical Reports Server · Document 20170011160',
    location: 'p. 15 · Figure 11 and Eqs. (18)–(21)',
    purpose:
      'Follow how the magnetic moment command and torque are produced from the magnetic field rate.',
    href: 'https://ntrs.nasa.gov/api/citations/20170011160/downloads/20170011160.pdf#page=15',
    fallback:
      'If PDF access fails, use Available Downloads on the NASA NTRS citation page.',
    fallbackHref: 'https://ntrs.nasa.gov/citations/20170011160',
  },
] as const;

export function FoundationResources() {
  return (
    <section
      className="foundation-resources"
      aria-labelledby="foundation-resources-title"
    >
      <header>
        <p>FOUNDATION PATH · VERIFIED LINKS</p>
        <h2 id="foundation-resources-title">What should I read first?</h2>
        <div>
          Read from top to bottom. Rather than reading every source in full,
          checking the indicated pages and learning purpose first makes the
          ADCS functional flow easier to follow.
        </div>
      </header>

      <div className="foundation-resource-grid">
        {resources.map((resource) => {
          const ResourceIcon =
            resource.kind === 'VIDEO' ? PlayCircle : FileText;
          return (
            <article key={resource.topic}>
              <div className="foundation-resource-meta">
                <span>{resource.topic}</span>
                <small>
                  <ResourceIcon aria-hidden="true" /> {resource.kind}
                </small>
              </div>
              <h3>{resource.title}</h3>
              <p className="foundation-resource-source">
                {resource.institution}
              </p>
              <strong>{resource.location}</strong>
              <p>{resource.purpose}</p>
              <a href={resource.href} target="_blank" rel="noreferrer">
                Open official source <ExternalLink aria-hidden="true" />
              </a>
              <p className="foundation-resource-fallback">
                {resource.fallbackHref ? (
                  <a
                    href={resource.fallbackHref}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {resource.fallback}
                  </a>
                ) : (
                  resource.fallback
                )}
              </p>
            </article>
          );
        })}
      </div>

      <p className="foundation-resource-rights">
        External PDFs and videos are only linked; their pages and videos are not
        reproduced. Check the terms of use for MIT OCW and NASA NTRS on each
        original page. Detailed video timestamps could not be confirmed on the
        official pages, so none are shown.
      </p>
    </section>
  );
}
