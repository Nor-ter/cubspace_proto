import Link from 'next/link';
import { ArrowUpRight, Box, CheckCircle2, ShieldCheck } from 'lucide-react';

const pages = [
  ['home', 'Overview', 'Educational orbital footage and mission overview'],
  ['mission', 'mission context', 'Share mission goals and design history'],
  ['anatomy', 'satellite structure', 'Explore 1U CubeSat Components'],
  ['model', 'system model', 'System Modeling Fundamentals and Traceability'],
  ['made', 'Explore MADE', 'ADCS function flow and properties'],
  ['prolog', 'Prolog', 'Practice expressing knowledge and asking questions'],
  ['handoff', 'first assignment', 'Document linking and task handover'],
] as const;

export default function AdminPage() {
  return (
    <main className="admin-shell">
      <header className="admin-header">
        <Link href="/?admin=1" className="admin-brand">
          <Box />
          <span>CubSpace</span>
        </Link>
        <span className="admin-badge">
          <ShieldCheck /> Preview for review
        </span>
      </header>
      <section className="admin-content">
        <div className="admin-intro">
          <p className="eyebrow">Review Learning Screen</p>
          <h1>Full onboarding screen</h1>
          <p>
            You can review each page regardless of your progress or lock status.
          </p>
        </div>
        <div className="admin-grid">
          {pages.map(([id, title, description], index) => (
            <Link key={id} href={`/?admin=1#${id}`} className="admin-card">
              <span className="admin-index">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h2>{title}</h2>
                <p>{description}</p>
              </div>
              <ArrowUpRight />
            </Link>
          ))}
        </div>
        <div className="admin-note">
          <CheckCircle2 />
          <p>
            <strong>Preview mode</strong> bypasses quiz locks for sessions
            opened from this page, but it does not change the learner’s
            completion record.
          </p>
        </div>
      </section>
    </main>
  );
}
