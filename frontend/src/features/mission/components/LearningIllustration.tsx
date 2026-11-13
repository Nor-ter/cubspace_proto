import type { ReactNode } from 'react';
import type { LEARNING_PATH } from '../data';

type IllustrationName = (typeof LEARNING_PATH)[number][1];

function Nodes({ points }: { points: readonly (readonly [number, number])[] }) {
  return points.map(([cx, cy]) => (
    <circle className="ill-node" key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.6" />
  ));
}

const ORIENT = (
  <>
    <circle className="ill-dash" cx="60" cy="60" r="46" />
    <circle className="ill-fill" cx="60" cy="60" r="30" />
    <circle className="ill-line" cx="60" cy="60" r="30" />
    <path className="ill-dash" d="M60 8V112M8 60H112" />
    <path className="ill-line" d="M60 22L68 52L98 60L68 68L60 98L52 68L22 60L52 52Z" />
    <Nodes
      points={[
        [60, 22],
        [98, 60],
        [60, 98],
        [22, 60],
        [60, 60],
      ]}
    />
  </>
);

const CUBESAT = (
  <>
    <polygon className="ill-fill" points="60,20 96,40 60,60 24,40" />
    <path
      className="ill-dash"
      d="M60 56V20M60 56L24 76M60 56L96 76M42 30L78 50M78 30L42 50M42 50V86M24 58L60 78M78 50V86M96 58L60 78"
    />
    <path
      className="ill-line"
      d="M60 20L96 40L60 60L24 40ZM24 40V76L60 96V60M96 40V76L60 96"
    />
    <Nodes
      points={[
        [60, 20],
        [96, 40],
        [60, 60],
        [24, 40],
        [24, 76],
        [60, 96],
        [96, 76],
      ]}
    />
  </>
);

const STRUCTURE = (
  <>
    <polygon className="ill-fill" points="60,48 96,64 60,80 24,64" />
    <path
      className="ill-dash"
      d="M24 28V96M96 28V96M60 44V112M42 20L78 36M78 20L42 36"
    />
    <path
      className="ill-line"
      d="M60 12L96 28L60 44L24 28ZM60 48L96 64L60 80L24 64ZM60 56L78 64L60 72L42 64ZM60 80L96 96L60 112L24 96Z"
    />
    <ellipse className="ill-line" cx="60" cy="96" rx="18" ry="8" />
    <Nodes
      points={[
        [60, 12],
        [96, 28],
        [24, 28],
        [60, 44],
        [96, 64],
        [24, 64],
        [96, 96],
        [24, 96],
        [60, 112],
      ]}
    />
  </>
);

const SYSTEM_MODEL = (
  <>
    <circle className="ill-dash" cx="60" cy="60" r="42" />
    <circle className="ill-fill" cx="60" cy="18" r="11" />
    <circle className="ill-fill" cx="102" cy="60" r="11" />
    <circle className="ill-fill" cx="60" cy="102" r="11" />
    <circle className="ill-fill" cx="18" cy="60" r="11" />
    <path className="ill-line" d="M60 29V91M29 60H91" />
    <circle className="ill-line" cx="60" cy="18" r="11" />
    <circle className="ill-line" cx="102" cy="60" r="11" />
    <circle className="ill-line" cx="60" cy="102" r="11" />
    <circle className="ill-line" cx="18" cy="60" r="11" />
    <rect className="ill-line" x="52" y="52" width="16" height="16" rx="2" />
    <Nodes
      points={[
        [60, 18],
        [102, 60],
        [60, 102],
        [18, 60],
        [60, 60],
      ]}
    />
  </>
);

const HANDOFF = (
  <>
    <rect className="ill-dash" x="20" y="14" width="44" height="60" rx="2" />
    <rect className="ill-dash" x="36" y="30" width="44" height="60" rx="2" />
    <rect className="ill-fill" x="52" y="46" width="44" height="60" rx="2" />
    <rect className="ill-line" x="52" y="46" width="44" height="60" rx="2" />
    <path className="ill-dash" d="M60 58H88M60 68H88M60 78H76" />
    <path className="ill-line" d="M66 94L72 99L84 87" />
    <Nodes
      points={[
        [52, 46],
        [96, 46],
        [52, 106],
        [96, 106],
      ]}
    />
  </>
);

const ILLUSTRATIONS: Record<IllustrationName, ReactNode> = {
  ORIENT,
  SPACECRAFT: CUBESAT,
  ANATOMY: STRUCTURE,
  'SYSTEM MODEL': SYSTEM_MODEL,
  HANDOFF,
};

export function LearningIllustration({ name }: { name: IllustrationName }) {
  return (
    <svg className="learning-illustration" viewBox="0 0 120 120" aria-hidden="true">
      {ILLUSTRATIONS[name]}
    </svg>
  );
}
