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
  /** A small, faint lead-in station: name only, in a narrower column. */
  minor?: boolean;
};

// A Mission Tree style trunk: hollow CAD circles joined by one line, with the
// names below the line so it never runs through text. Horizontal on wide
// screens, vertical on narrow ones. The line ends at the last station.
export function StationTrack({ stations }: { stations: readonly Station[] }) {
  return (
    <ol
      className="station-track"
      style={
        {
          '--track-columns': stations
            .map((station) => `minmax(0, ${station.minor ? 0.45 : 1}fr)`)
            .join(' '),
        } as React.CSSProperties
      }
    >
      {stations.map((station) => (
        <li
          key={station.key}
          className={
            [station.pending && 'is-pending', station.minor && 'is-minor']
              .filter(Boolean)
              .join(' ') || undefined
          }
        >
          <span className="station" aria-hidden="true">
            {station.mark}
          </span>
          <div className="station-body">
            {station.label && <p className="station-label">{station.label}</p>}
            <h4>{station.title}</h4>
            {station.text && <p>{station.text}</p>}
            {station.pending && (
              <span className="station-pending">Pending</span>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
