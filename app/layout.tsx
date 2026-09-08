import type { Metadata } from 'next';
import 'katex/dist/katex.min.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'CubSpace | ACRUX-II Engineer Onboarding',
  description:
    'ACRUX-II 1U CubeSat, ADCS system modeling, MADE and Prolog onboarding.',
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
