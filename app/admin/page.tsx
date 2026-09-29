import Link from 'next/link';
import { ArrowUpRight, Box, CheckCircle2, ShieldCheck } from 'lucide-react';

const pages = [
  ['home', 'Overview', 'Teaching orbit scene and mission overview'],
  ['mission', 'Mission context', 'Mission objectives and shared design records'],
  ['anatomy', 'Satellite structure', 'Exploring 1U CubeSat components'],
  ['model', 'System model', 'System modelling fundamentals and traceability'],
  ['made', 'MADE explorer', 'ADCS functional flow and properties'],
  ['prolog', 'Prolog', 'Knowledge representation and query practice'],
  ['handoff', 'First task', 'Linking documents and handing off work'],
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
          <ShieldCheck /> Review preview
        </span>
      </header>
      <section className="admin-content">
        <div className="admin-intro">
          <p className="eyebrow">Learning screen review</p>
          <h1>All onboarding screens</h1>
          <p>
            Each page can be reviewed regardless of learning progress and lock state.
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
            <strong>Preview mode</strong>: sessions opened from this page bypass
            the quiz locks but do not change the learner’s completion records.
          </p>
        </div>
      </section>
    </main>
  );
}
