import './StationTrack.css';

type Station = {
  key: string;
  /** Short text inside the circle, such as a step number. */
  mark?: string;
  /** Line above the title, such as a year. */
  label?: string;
  title: string;
  text: string;
  pending?: boolean;
};

// A Mission Tree style trunk: hollow CAD circles joined by one line, with the
// names below the line so it never runs through text. Horizontal on wide
// screens, vertical on narrow ones. The line ends at the last station.
export function StationTrack({ stations }: { stations: readonly Station[] }) {
  return (
    <ol
      className="station-track"
      style={{ '--stations': stations.length } as React.CSSProperties}
    >
      {stations.map((station) => (
        <li
          key={station.key}
          className={station.pending ? 'is-pending' : undefined}
        >
          <span className="station" aria-hidden="true">
            {station.mark}
          </span>
          <div className="station-body">
            {station.label && <p className="station-label">{station.label}</p>}
            <h4>{station.title}</h4>
            <p>{station.text}</p>
            {station.pending && (
              <span className="station-pending">Pending</span>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
