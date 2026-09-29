import { ExternalLink, FileText, PlayCircle } from 'lucide-react';

const resources = [
  {
    topic: '01 · Coordinates and vectors',
    kind: 'PDF',
    title: 'Vectors, Matrices and Coordinate Transformations',
    institution: 'MIT OpenCourseWare · 16.07 Dynamics',
    location: 'pp. 1–3',
    purpose:
      'First learn the magnitude, direction, and inner and outer products of vectors to read B, m, and τ.',
    href: 'https://ocw.mit.edu/courses/16-07-dynamics-fall-2009/66b42ce6c35f2757ad11dc0a6e2b2896_MIT16_07F09_Lec03.pdf',
    fallback:
      "If the PDF doesn't open, select Lecture L3 on the MIT OCW Lectures page.",
    fallbackHref:
      'https://ocw.mit.edu/courses/16-07-dynamics-fall-2009/resources/mit16_07f09_lec03/',
  },
  {
    topic: '02 · Matrix and coordinate conversion',
    kind: 'PDF',
    title: 'Vectors, Matrices and Coordinate Transformations',
    institution: 'MIT OpenCourseWare · 16.07 Dynamics',
    location: 'pp. 9–11',
    purpose:
      'Check the transformation matrices that represent the same vector in different reference coordinate systems.',
    href: 'https://ocw.mit.edu/courses/16-07-dynamics-fall-2009/66b42ce6c35f2757ad11dc0a6e2b2896_MIT16_07F09_Lec03.pdf#page=9',
    fallback:
      "If page navigation doesn't work, open the PDF and go to Print page 9.",
    fallbackHref:
      'https://ocw.mit.edu/courses/16-07-dynamics-fall-2009/resources/mit16_07f09_lec03/',
  },
  {
    topic: '03 · Closed loop',
    kind: 'VIDEO',
    title: 'Lecture 25: Feedback',
    institution: 'MIT OpenCourseWare · Signals and Systems',
    location:
      'All lectures · Section time codes not indicated on the official page',
    purpose:
      'Understand why reference inputs, errors, and system outputs are connected back to feedback.',
    href: 'https://ocw.mit.edu/courses/res-6-007-signals-and-systems-spring-2011/resources/lecture-25-feedback/',
    fallback:
      'If it does not play, use Transcript or Download video on the same page.',
    fallbackHref: undefined,
  },
  {
    topic: '04 · B-dot',
    kind: 'PDF',
    title:
      'Drag De-Orbit Device: A New Standard Re-Entry Actuator for CubeSats',
    institution: 'NASA Technical Reports Server · Document 20170011160',
    location: 'p. 15 · Figure 11 and equations (18)–(21)',
    purpose:
      'Check the flow in which the magnetic moment command and torque are created from the magnetic field change rate.',
    href: 'https://ntrs.nasa.gov/api/citations/20170011160/downloads/20170011160.pdf#page=15',
    fallback:
      'If you are unable to access the PDF, use the Available Downloads on the NASA NTRS bibliography page.',
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
          Read in order from top to bottom. Rather than reading the entire
          material, The ADCS feature flow is easy to follow if you first
          identify your learning objectives.
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
                Open official resource <ExternalLink aria-hidden="true" />
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
        External PDFs and videos are provided only through links and do not
        duplicate screens or videos. MIT Please check the terms of use of OCW
        and NASA NTRS on each original page. video details The timestamp was not
        confirmed on the official page and was not displayed arbitrarily.
      </p>
    </section>
  );
}
