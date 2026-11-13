import { useState } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import { MISSION_VIDEO } from '../data';

// The YouTube player loads only after the viewer presses play. Every page of
// the course stays in the document, so an autoplaying embed would play while
// its page is hidden; the parent remounts this component when the page closes.
export function MissionVideo() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <figure className="mission-video">
      <div className="mission-video-frame">
        {isPlaying ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${MISSION_VIDEO.id}?autoplay=1&playsinline=1&rel=0`}
            title={MISSION_VIDEO.title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            className="mission-video-poster"
            onClick={() => setIsPlaying(true)}
            aria-label={`Play ${MISSION_VIDEO.title}`}
          >
            <img
              src={`https://i.ytimg.com/vi/${MISSION_VIDEO.id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
            />
            <span className="mission-video-play">
              <Play aria-hidden="true" />
              Play video
            </span>
          </button>
        )}
      </div>
      <figcaption>
        <span>{MISSION_VIDEO.title}</span>
        <a href={MISSION_VIDEO.url} target="_blank" rel="noreferrer">
          Watch on YouTube <ArrowUpRight aria-hidden="true" />
        </a>
      </figcaption>
    </figure>
  );
}
