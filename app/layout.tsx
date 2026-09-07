import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'CubSpace | ACRUX-2 온보딩',
  description: '임무에서 기능 모델까지, ACRUX-2 Phase 1 학습 워크스페이스',
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
