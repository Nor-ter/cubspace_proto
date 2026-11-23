import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import './MissionVideos.css';

const VIDEOS = [
  {
    id: '56UR1ie7Zwc',
    title: 'Rocket launch',
    url: 'https://www.youtube.com/shorts/56UR1ie7Zwc',
    portrait: true,
  },
  {
    id: 'nfe4dQdXhLY',
    title: 'CubeSat deployment 1',
    url: 'https://www.youtube.com/shorts/nfe4dQdXhLY',
    portrait: true,
  },
  {
    id: 'RPGgk9BlMVg',
    title: 'CubeSat deployment 2',
    url: 'https://www.youtube.com/watch?v=RPGgk9BlMVg',
    portrait: false,
  },
  {
    id: 'IlqKxhct4ic',
    title: 'Rocket catch',
    url: 'https://www.youtube.com/shorts/IlqKxhct4ic',
    portrait: true,
  },
] as const;

export function MissionVideoPreview() {
  return (
    <img
      className="mission-video-thumbnail"
      src="/images/cubesat/launch-thumbnail.png"
      alt="Rocket lifting off beside the launch tower"
      loading="lazy"
    />
  );
}

export function MissionVideos() {
  const [selected, setSelected] = useState(0);
  const video = VIDEOS[selected];
  return (
    <section
      className="mission-videos"
      aria-label="Launch and deployment videos"
    >
      <fieldset className="mission-video-picker" aria-label="Choose a video">
        {VIDEOS.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={selected === index}
            aria-controls="cubesat-mission-video"
            onClick={() => setSelected(index)}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            {item.title}
          </button>
        ))}
      </fieldset>
      <div id="cubesat-mission-video" className="mission-video-stage">
        <iframe
          key={video.id}
          className={video.portrait ? 'is-portrait' : 'is-landscape'}
          src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0&playsinline=1`}
          title={video.title}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <div className="mission-video-caption">
        <strong>{video.title}</strong>
        <a href={video.url} target="_blank" rel="noreferrer">
          Watch on YouTube <ExternalLink size={15} aria-hidden="true" />
        </a>
      </div>
      <p className="mission-video-note">
        Separate real-world examples of launch, deployment and booster recovery.
        These clips do not show one continuous mission.
      </p>
    </section>
  );
}
