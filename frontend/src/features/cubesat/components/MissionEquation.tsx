import { ExternalLink } from 'lucide-react';

// Real-world clips (YouTube embeds), from v1.4's mission videos.
const LAUNCH = {
  id: '56UR1ie7Zwc',
  title: 'Rocket launch',
  url: 'https://www.youtube.com/shorts/56UR1ie7Zwc',
};
const DEPLOY = {
  id: 'nfe4dQdXhLY',
  title: 'CubeSat deployment 1',
  url: 'https://www.youtube.com/shorts/nfe4dQdXhLY',
};

function Clip({ clip }: { clip: typeof LAUNCH }) {
  return (
    <figure className="mission-eq-clip">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${clip.id}?rel=0&playsinline=1`}
        title={clip.title}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
      <figcaption>
        {clip.title}
        <a href={clip.url} target="_blank" rel="noreferrer">
          YouTube <ExternalLink size={13} aria-hidden="true" />
        </a>
      </figcaption>
    </figure>
  );
}

/**
 * CubeSat mission = Launcher + CubeSat + Dispenser. A clip sits under the
 * launcher and the dispenser; under CubeSat a line runs down the page to the
 * CubeSat facts below.
 */
export function MissionEquation() {
  return (
    <section className="mission-eq" aria-labelledby="mission-eq-title">
      <h3 id="mission-eq-title">CubeSat mission</h3>
      <p className="mission-eq-equals" aria-hidden="true">
        =
      </p>
      <div className="mission-eq-grid">
        <p className="mission-eq-term">Launcher</p>
        <span className="mission-eq-sign" aria-hidden="true">
          +
        </span>
        <p className="mission-eq-term is-cubesat">CubeSat</p>
        <span className="mission-eq-sign" aria-hidden="true">
          +
        </span>
        <p className="mission-eq-term">Dispenser</p>

        <Clip clip={LAUNCH} />
        <span className="mission-eq-arrow" aria-hidden="true" />
        <Clip clip={DEPLOY} />
      </div>
    </section>
  );
}
