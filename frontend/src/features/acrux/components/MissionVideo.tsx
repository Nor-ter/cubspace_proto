import { ArrowUpRight } from 'lucide-react';

export function MissionVideo() {
  return (
    <section className="mission-video" aria-label="ACRUX-II mission video">
      <div className="mission-video-frame">
        <iframe
          src="https://www.youtube-nocookie.com/embed/cCGppiJOoZY?autoplay=1&mute=1&playsinline=1&rel=0"
          title="ACRUX-II mission video"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
      <a
        className="text-link"
        href="https://www.youtube.com/watch?v=cCGppiJOoZY"
        target="_blank"
        rel="noreferrer"
      >
        Watch on YouTube <ArrowUpRight />
      </a>
    </section>
  );
}
