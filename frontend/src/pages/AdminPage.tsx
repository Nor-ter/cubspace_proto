import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';

const PAGES = [
  ['home', 'Overview', 'Educational orbital footage and mission overview'],
  ['about', 'About', 'Melbourne Space Program, CubSpace and MSP projects'],
  [
    'cubesat',
    'CubeSat Mission',
    'What a CubeSat is, the mission objective and its subsystems',
  ],
  ['acrux', 'ACRUX-II', 'Mission introduction, success steps and video'],
  [
    'subsystems',
    'Subsystems',
    'The six subsystems on the interactive 1U model',
  ],
  ['quiz', 'Quiz', 'Five questions on the CubeSat mission and subsystems'],
  [
    'mission-tree',
    'Mission Tree',
    'The 80 Task Cards and the way into Mission Tree',
  ],
] as const;

export function AdminPage() {
  return (
    <main className="admin-shell">
      <header className="admin-header">
        <a href="/app" className="admin-brand">
          <BrandLogo />
          <span>CubSpace</span>
        </a>
        <span className="admin-badge">
          <ShieldCheck /> All pages
        </span>
      </header>
      <section className="admin-content">
        <div className="admin-intro">
          <p className="eyebrow">Review Learning Screen</p>
          <h1>Full onboarding screen</h1>
          <p>
            Open any onboarding page directly. Every page is open; there is no
            required order.
          </p>
        </div>
        <div className="admin-grid">
          {PAGES.map(([id, title, description], index) => (
            <a
              key={id}
              href={id === 'home' ? '/app' : `/app#${id}`}
              className="admin-card"
            >
              <span className="admin-index">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h2>{title}</h2>
                <p>{description}</p>
              </div>
              <ArrowUpRight />
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
