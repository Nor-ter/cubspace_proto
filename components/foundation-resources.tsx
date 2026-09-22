import { ExternalLink, FileText, PlayCircle } from 'lucide-react';

const resources = [
  {
    topic: '01 · 좌표와 벡터',
    kind: 'PDF',
    title: 'Vectors, Matrices and Coordinate Transformations',
    institution: 'MIT OpenCourseWare · 16.07 Dynamics',
    location: 'pp. 1–3',
    purpose: '벡터의 크기·방향과 내적·외적을 먼저 익혀 B, m, τ를 읽습니다.',
    href: 'https://ocw.mit.edu/courses/16-07-dynamics-fall-2009/66b42ce6c35f2757ad11dc0a6e2b2896_MIT16_07F09_Lec03.pdf',
    fallback:
      'PDF가 열리지 않으면 MIT OCW 강의 페이지에서 Lecture L3를 선택하세요.',
    fallbackHref:
      'https://ocw.mit.edu/courses/16-07-dynamics-fall-2009/resources/mit16_07f09_lec03/',
  },
  {
    topic: '02 · 행렬과 좌표 변환',
    kind: 'PDF',
    title: 'Vectors, Matrices and Coordinate Transformations',
    institution: 'MIT OpenCourseWare · 16.07 Dynamics',
    location: 'pp. 9–11',
    purpose:
      '같은 벡터를 서로 다른 기준 좌표계에서 표현하는 변환 행렬을 확인합니다.',
    href: 'https://ocw.mit.edu/courses/16-07-dynamics-fall-2009/66b42ce6c35f2757ad11dc0a6e2b2896_MIT16_07F09_Lec03.pdf#page=9',
    fallback:
      '페이지 이동이 작동하지 않으면 PDF를 연 뒤 인쇄 페이지 9로 이동하세요.',
    fallbackHref:
      'https://ocw.mit.edu/courses/16-07-dynamics-fall-2009/resources/mit16_07f09_lec03/',
  },
  {
    topic: '03 · 폐루프',
    kind: 'VIDEO',
    title: 'Lecture 25: Feedback',
    institution: 'MIT OpenCourseWare · Signals and Systems',
    location: '전체 강의 · 공식 페이지에 구간 타임코드 미표기',
    purpose:
      '기준 입력, 오차, 시스템 출력이 피드백으로 다시 연결되는 이유를 파악합니다.',
    href: 'https://ocw.mit.edu/courses/res-6-007-signals-and-systems-spring-2011/resources/lecture-25-feedback/',
    fallback:
      '재생이 안 되면 같은 페이지의 Transcript 또는 Download video를 사용하세요.',
    fallbackHref: undefined,
  },
  {
    topic: '04 · B-dot',
    kind: 'PDF',
    title:
      'Drag De-Orbit Device: A New Standard Re-Entry Actuator for CubeSats',
    institution: 'NASA Technical Reports Server · Document 20170011160',
    location: 'p. 15 · Figure 11 및 식 (18)–(21)',
    purpose:
      '자기장 변화율에서 자기모멘트 명령과 토크가 만들어지는 흐름을 확인합니다.',
    href: 'https://ntrs.nasa.gov/api/citations/20170011160/downloads/20170011160.pdf#page=15',
    fallback:
      'PDF 접근에 실패하면 NASA NTRS 서지 페이지의 Available Downloads를 사용하세요.',
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
        <h2 id="foundation-resources-title">무엇을 먼저 읽어야 하나요?</h2>
        <div>
          위에서 아래 순서로 읽으세요. 전체 자료를 완독하기보다 표시된 페이지와
          학습 목적을 먼저 확인하면 ADCS 기능 흐름을 따라가기 쉽습니다.
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
                공식 자료 열기 <ExternalLink aria-hidden="true" />
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
        외부 PDF·영상은 링크로만 안내하며 화면이나 영상을 복제하지 않습니다. MIT
        OCW와 NASA NTRS의 이용 조건은 각 원문 페이지에서 확인하세요. 영상의 세부
        타임스탬프는 공식 페이지에서 확인되지 않아 임의로 표시하지 않았습니다.
      </p>
    </section>
  );
}
