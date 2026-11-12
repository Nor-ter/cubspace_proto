import { useState } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import type { TheoryVideo } from '../data';

const stamp = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

export function ClipPlayer({ video }: { video: TheoryVideo }) {
  // The YouTube player loads only after the visitor asks for it.
  const [loaded, setLoaded] = useState(false);
  const hasWindow = video.start !== undefined && video.end !== undefined;
  const query = new URLSearchParams({ autoplay: '1', rel: '0' });
  if (hasWindow) {
    query.set('start', String(video.start));
    query.set('end', String(video.end));
  }
  const watchUrl = `https://www.youtube.com/watch?v=${video.youtubeId}${
    video.start ? `&t=${video.start}s` : ''
  }`;

  return (
    <figure className="clip">
      <div className="clip-frame">
        {loaded ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?${query}`}
            title={`${video.title} (${video.channel})`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button className="clip-poster" onClick={() => setLoaded(true)}>
            <span className="clip-play">
              <Play />
            </span>
            <strong>{video.caption}</strong>
            <small>
              {hasWindow
                ? `Plays ${stamp(video.start!)}–${stamp(video.end!)} · ${video.end! - video.start!} s clip`
                : 'Clip window not chosen yet · plays the full tutorial'}
            </small>
          </button>
        )}
      </div>
      <figcaption>
        <p>{video.why}</p>
        <p className="clip-credit">
          <a href={watchUrl} target="_blank" rel="noreferrer">
            {video.title} <ArrowUpRight />
          </a>
          {video.channel} · illustrative tutorial, not ACRUX-II hardware or test
          results.
        </p>
        {video.alternatives.length > 0 && (
          <ul className="clip-more">
            {video.alternatives.map(([label, url]) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noreferrer">
                  {label} <ArrowUpRight />
                </a>
              </li>
            ))}
          </ul>
        )}
      </figcaption>
    </figure>
  );
}
