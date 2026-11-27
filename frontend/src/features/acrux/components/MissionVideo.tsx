import { MISSION_VIDEO } from '../data';
import './MissionVideo.css';

/* oxlint-disable jsx-a11y/media-has-caption -- The supplied MP4 has no separate caption track. */
export function MissionVideo() {
  return (
    <figure className="mission-video">
      <div className="mission-video-frame">
        <video
          src={MISSION_VIDEO.src}
          aria-label={MISSION_VIDEO.title}
          controls
          playsInline
          preload="metadata"
        />
      </div>
      <figcaption>
        <span>{MISSION_VIDEO.title}</span>
        <a href={MISSION_VIDEO.youtubeUrl} target="_blank" rel="noreferrer">
          Watch the full video on YouTube <ArrowUpRight aria-hidden="true" />
        </a>
      </figcaption>
    </figure>
  );
}
import { ArrowUpRight } from 'lucide-react';
