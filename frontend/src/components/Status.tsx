import type { ReactNode } from 'react';

export function Status({
  children,
  tone = 'cyan',
}: {
  children: ReactNode;
  tone?: 'cyan' | 'lime' | 'amber';
}) {
  return <span className={`status status-${tone}`}>{children}</span>;
}
