import {
  MISSION_PHASE_MARKS,
  MISSION_PHASE_SECONDS,
} from '@/lib/missionAnimation';

export function PhaseProgress({ phase }: { phase: number }) {
  return (
    <i className="phase-progress" aria-hidden="true">
      <b style={{ animationDuration: `${MISSION_PHASE_SECONDS}s` }} />
      {MISSION_PHASE_MARKS[phase].map((mark) => (
        <em
          key={mark}
          style={{ left: `${(mark / MISSION_PHASE_SECONDS) * 100}%` }}
        />
      ))}
    </i>
  );
}
