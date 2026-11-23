// Source: "CubeSat Mission and Subsystems: Contents for the onboarding web"
// (12 November 2026), section 1 "CubeSat mission".
// Sentences are quoted verbatim.

export const CUBESAT_MISSION = {
  // One sentence, shown as two lines: what to do, then what to aim for.
  objective: [
    'Develop and launch a CubeSat into LEO',
    'and maximise its useful operational lifetime.',
  ],
};

/** The CubeSat format at a glance, from the guide's first paragraph. */
export const STATS: readonly (readonly [string, string])[] = [
  ['1U', 'Approximately a 10\u00a0cm cube, selected for this project'],
  ['1–10\u00a0kg', 'Nanosatellite mass category'],
  ['×3 / ×6', '3U and 6U: nominal unit volume'],
  ['LEO', 'Low Earth orbit'],
];

export type StatFigure = {
  /** Shown over the picture, e.g. "3U". */
  label?: string;
  src: string;
  alt: string;
  /** Author and licence, as the source page gives them. */
  credit: string;
  sourceUrl: string;
  licenceUrl?: string;
};

const CC_BY_1 = 'https://creativecommons.org/licenses/by/1.0/';
const CC_BY_2 = 'https://creativecommons.org/licenses/by/2.0/';
const CC_BY_SA_4 = 'https://creativecommons.org/licenses/by-sa/4.0/';
const CC0 = 'https://creativecommons.org/publicdomain/zero/1.0/';
const commons = (file: string) =>
  `https://commons.wikimedia.org/wiki/File:${file}`;

/**
 * Pictures behind the stat boxes, keyed by the box's figure (LEO's are
 * drawn in the page, in components/EarthOrbits). From Wikimedia
 * Commons (licences checked 23 Nov 2026), resized for the web. A box without
 * an entry is not clickable.
 */
export const STAT_FIGURES: Partial<Record<string, readonly StatFigure[]>> = {
  '1U': [
    {
      src: '/images/cubesat/1u-ncube2.jpg',
      alt: 'NCUBE2, a 1U CubeSat with solar cells on its sides and top and its instruments on one face.',
      credit: 'Bjørn Pedersen, NTNU, CC BY 1.0',
      sourceUrl: commons('Ncube2.jpg'),
      licenceUrl: CC_BY_1,
    },
    {
      src: '/images/cubesat/1u-zft.jpg',
      alt: 'A 1U CubeSat, a cube with solar cells on its faces, bolted to a vibration test table.',
      credit: 'Zen4Telematik, CC BY-SA 4.0',
      sourceUrl: commons('1U_CubeSat_developed_at_ZFT.jpg'),
      licenceUrl: CC_BY_SA_4,
    },
  ],
  '×3 / ×6': [
    {
      label: '3U',
      src: '/images/cubesat/3u-iss.jpg',
      alt: 'Two long 3U CubeSats drifting above the Earth just after release.',
      credit: 'NASA, public domain',
      sourceUrl: commons('Two_3U_CubeSats.jpg'),
    },
    {
      label: '3U',
      src: '/images/cubesat/3u-seeker.jpg',
      alt: 'Seeker, a white and gold 3U CubeSat, on a plain background.',
      credit: 'NASA/Robert Markowitz, public domain',
      sourceUrl: commons('Seeker_CubeSat_(JSC2019-E-022267).jpg'),
    },
    {
      label: '3U',
      src: '/images/cubesat/3u-geoscan.jpg',
      alt: 'The Geoscan-Edelveis 3U CubeSat standing upright beside its launch container.',
      credit: 'Geoscan Group, CC BY 2.0',
      sourceUrl: commons('CubeSat_Geoscan-Edelveis.jpg'),
      licenceUrl: CC_BY_2,
    },
    {
      label: '3U',
      src: '/images/cubesat/3u-sbudnic.jpg',
      alt: 'SBUDNIC, a 3U CubeSat standing on end with its gold drag sail and antennas spread out.',
      credit: 'Dan Rapoport (uploaded by Drepso22), CC BY-SA 4.0',
      sourceUrl: commons('SBUDNIC.jpg'),
      licenceUrl: CC_BY_SA_4,
    },
    {
      label: '6U',
      src: '/images/cubesat/6u-raincube.jpg',
      alt: 'The RainCube 6U CubeSat with its umbrella-like antenna and two solar panels unfolded.',
      credit: 'NASA/JPL-Caltech, public domain',
      sourceUrl: commons('RaInCube_6U_CubeSat_(PIA22457).jpg'),
    },
    {
      label: '6U',
      src: '/images/cubesat/6u-gomx4.jpg',
      alt: 'The GomX-4A and GomX-4B 6U CubeSats on a test bench in an ESA laboratory.',
      credit: 'GomSpace/ESA, CC0',
      sourceUrl: commons(
        'Los_nanosatélites_GomX-4A_(izquierda)_y_GomX-4B_(derecha)_en_un_laboratorio_de_la_ESA.jpg',
      ),
      licenceUrl: CC0,
    },
    {
      label: '6U',
      src: '/images/cubesat/6u-asteria.jpg',
      alt: 'Engineers in clean-room suits beside ASTERIA, a 6U CubeSat with its solar panels open.',
      credit: 'NASA/JPL-Caltech, public domain',
      sourceUrl: commons('ASTERIA_CubeSat_space_telescope.jpg'),
    },
  ],
};

type Topic = {
  title: string;
  /** [short label, the guide's own sentence] */
  points: readonly (readonly [string, string])[];
};

/**
 * The guide's two paragraphs, one sentence per row with a short label. The
 * sentences are the guide's own; only the opening line of the second
 * paragraph is left out, as it repeats the objective above.
 */
export const TOPICS: readonly Topic[] = [
  {
    title: 'What a CubeSat is',
    points: [
      [
        'Standard',
        'CubeSats are small satellites built around standard physical units and a compatible deployment interface.',
      ],
      [
        'Mass',
        'Many are nanosatellites, a mass category typically covering 1 to 10\u00a0kg; larger CubeSats may fall outside this category.',
      ],
      ['Units', 'CubeSat sizes are expressed in units, or U.'],
      [
        '1U',
        'The basic 1U format, selected for this project, is approximately a 10\u00a0cm cube.',
      ],
      [
        '3U · 6U',
        'Larger formats, including 3U and 6U, provide roughly three and six times the nominal unit volume for additional hardware.',
      ],
      [
        'Deployer',
        'The precise dimensions must match the deployer, the device that secures and releases the spacecraft.',
      ],
    ],
  },
  {
    title: 'What the mission needs',
    points: [
      [
        'One system',
        'This requires the structure, power, attitude control, computing, communications and payload functions to operate as an integrated system.',
      ],
      [
        'Example',
        'A payload observation may require suitable pointing, sufficient energy and available storage, with data returned during a later ground contact.',
      ],
      [
        'Why it matters',
        'Understanding these connections provides the basis for defining subsystem tasks and evaluating design choices.',
      ],
      [
        'Lifetime',
        'Useful operational lifetime is the period during which the spacecraft meets its mission objectives.',
      ],
      [
        'Sustaining it',
        'Sustained operation depends on energy availability, temperature control, reliable hardware and fault recovery, alongside appropriate end-of-mission planning.',
      ],
    ],
  },
];
