import { LockKeyhole } from 'lucide-react';
import { RoleIcon } from './RoleIcon';

export function LockedPanel({ previous }: { previous: string }) {
  return (
    <div className="locked-panel">
      <LockKeyhole />
      <div>
        <p className="eyebrow">LESSON LOCKED</p>
        <h3>
          <RoleIcon name="Complete the confirmation quiz from the previous lesson first." />
          Complete the confirmation quiz from the previous lesson first.
        </h3>
        <p>Complete the {previous} quiz to unlock this page.</p>
      </div>
    </div>
  );
}
