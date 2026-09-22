import Link from 'next/link';
import { ArrowUpRight, Box, CheckCircle2, ShieldCheck } from 'lucide-react';

const pages = [
  ['home', '개요', '교육용 궤도 장면과 임무 개요'],
  ['mission', '임무 맥락', '임무 목표와 설계 기록 공유'],
  ['anatomy', '위성 구조', '1U CubeSat 구성요소 탐색'],
  ['model', '시스템 모델', '시스템 모델링 기초와 추적성'],
  ['made', 'MADE 탐색', 'ADCS 기능 흐름과 속성'],
  ['prolog', 'Prolog', '지식 표현과 질의 연습'],
  ['handoff', '첫 과제', '문서 연결과 작업 인계'],
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
          <ShieldCheck /> 검토용 미리보기
        </span>
      </header>
      <section className="admin-content">
        <div className="admin-intro">
          <p className="eyebrow">학습 화면 검토</p>
          <h1>전체 온보딩 화면</h1>
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
            <strong>미리보기 모드</strong>, 이 페이지에서 연 세션은 퀴즈 잠금을
            우회하지만 학습자의 완료 기록은 변경하지 않습니다.
          </p>
        </div>
      </section>
    </main>
  );
}
