import { ArrowUpRight, FileCheck2 } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { SOURCE_CARDS } from '@/features/handoff/data';

const TICKER_COPIES = 2;

export function CourseFooter({ visible }: { visible: boolean }) {
  return (
    <footer className={visible ? 'course-footer' : 'course-footer page-hidden'}>
      <section className="footer-sources" aria-labelledby="footer-sources-title">
        <p id="footer-sources-title">SOURCE DESK / THIS ONBOARDING</p>
        <ul>
          {SOURCE_CARDS.map(([name]) => (
            <li key={name}>
              <FileCheck2 aria-hidden="true" />
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </section>
      <div className="footer-ticker">
        <div className="footer-ticker-label">
          <BrandLogo />
          <strong>CubSpace</strong>
        </div>
        <div className="footer-ticker-window">
          <div className="footer-ticker-track">
            {Array.from({ length: TICKER_COPIES }, (_, copy) => (
              <p key={copy} aria-hidden={copy > 0 ? true : undefined}>
                <span>Educational model · Human engineering review required</span>
                Engineers may leave. The mission carries on.
              </p>
            ))}
          </div>
        </div>
        <a className="footer-ticker-link" href="/story">
          Storytelling
          <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
