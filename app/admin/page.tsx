import Link from 'next/link';
import { ArrowUpRight, Box, CheckCircle2, ShieldCheck } from 'lucide-react';

const pages = [
  ['home', 'Overview', '3D orbit simulator and live mission state'],
  ['mission', 'Mission', 'Mission context and continuity problem'],
  ['anatomy', '3D Anatomy', 'Interactive 1U CubeSat subsystem explorer'],
  ['model', 'System Model', 'System modeling fundamentals and traceability'],
  ['made', 'MADE Explorer', 'ADCS functional flow and flow properties'],
  ['prolog', 'Prolog', 'Knowledge representation and query tutorial'],
  ['handoff', 'Your First Task', 'Documentation network and handoff task'],
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
          <ShieldCheck /> Admin access
        </span>
      </header>
      <section className="admin-content">
        <div className="admin-intro">
          <p className="eyebrow">TRAINING CONTROL</p>
          <h1>All onboarding pages</h1>
          <p>
            학습 진행도와 잠금 상태에 관계없이 각 페이지를 검토할 수 있습니다.
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
            <strong>Preview mode</strong> — 이 페이지에서 연 세션은 퀴즈 잠금을
            우회하지만 학습자의 완료 기록은 변경하지 않습니다.
          </p>
        </div>
      </section>
    </main>
  );
}
