import type { ReactNode } from 'react';

export function Status({ children }: { children: ReactNode }) {
  return <span className="status status-amber">{children}</span>;
}
