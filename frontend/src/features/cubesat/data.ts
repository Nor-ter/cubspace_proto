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
  ['1–12U', 'Configurations covered by CDS Rev. 14.1'],
  [
    '~1.33\u00a0Kg/U',
    'Historical mass approximation in NASA CubeSat 101 (2017)',
  ],
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
      src: '/images/cubesat/1u-cp1.png',
      alt: 'CP1, a black 1U CubeSat from Cal Poly, about a 10 cm cube.',
      credit: 'CP1, Cal Poly; in NASA CubeSat 101 (2017), Figure 2',
      sourceUrl:
        'https://www.nasa.gov/wp-content/uploads/2017/03/nasa_csli_cubesat_101_508.pdf',
    },
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
  '~1.33\u00a0Kg/U': [
    {
      label: 'Mass vs size',
      src: '/images/cubesat/mass-and-size.png',
      alt: 'Comparison of satellite mass classes and CubeSat configurations from 1U to 27U.',
      credit:
        'State-of-the-Art of Small Spacecraft Technology (2024), Figure 1.3. Credit: NASA',
      sourceUrl: 'https://www.nasa.gov/wp-content/uploads/2025/02/soa-2024.pdf',
    },
  ],
  '1–12U': [
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
    {
      label: '12U',
      src: '/images/cubesat/12u-capstone.jpg',
      alt: 'Engineers in a cleanroom fitting the solar panels to CAPSTONE, a 12U CubeSat.',
      credit: 'NASA/Dominic Hart, public domain',
      sourceUrl: commons('Capstone_spacecraft_0.jpg'),
    },
  ],
};

/** How to build a CubeSat at a glance, in the order of its steps. */
export const BUILD_STATS: readonly (readonly [string, string])[] = [
  ['Specify', 'Phase A–B · The CDS sets dimensions, constraints and safety'],
  ['Build', 'Phase C · Components, structure, electronics, software'],
  ['Test', 'Phase D · Integrate, test and pass flight acceptance'],
  ['Operate', 'Phase D–F · Launch, deploy, operate and close out'],
];

/** CubeSat Design Specification Rev. 14.1 (9 February 2022), Cal Poly. */
export const CDS_PDF =
  'https://static1.squarespace.com/static/5418c831e4b0fa4ecac1bacd/t/62193b7fc9e72e0053f00910/1645820809779/CDS+REV14_1+2022-02-09.pdf';

const CUBESAT_101 =
  'https://www.nasa.gov/wp-content/uploads/2017/03/nasa_csli_cubesat_101_508.pdf';

/** Requirements and flight approval, from NASA CubeSat 101 (as in v1.4). */
export const BUILD_FIGURES: Partial<Record<string, readonly StatFigure[]>> = {
  // BurstCube, a NASA Goddard CubeSat, from its build to its release.
  Build: [
    {
      label: 'Instrument',
      src: '/images/cubesat/build-burstcube-instrument.jpg',
      alt: 'An engineer presses aluminised tape onto the BurstCube instrument on a workbench.',
      credit: 'NASA/Sophia Roberts, public domain',
      sourceUrl: commons(
        'BurstCube_Assembly_and_Testing_(SVS14167_-_Julie_Cox_Light_Tights_BurstCube_Instruments).jpg',
      ),
    },
    {
      label: 'Interior',
      src: '/images/cubesat/build-burstcube-interior.jpg',
      alt: 'BurstCube with its lid open: circuit boards, wiring and four round detectors packed inside.',
      credit: 'NASA, public domain',
      sourceUrl: commons(
        'BurstCube_Integration_(SVS14167_-_BurstCube_No_Lid).jpg',
      ),
    },
    {
      label: 'Solar panels',
      src: '/images/cubesat/build-burstcube-panels.jpg',
      alt: 'Two engineers fit a solar panel to BurstCube in a cleanroom.',
      credit: 'NASA/Sophia Roberts, public domain',
      sourceUrl: commons(
        'BurstCube_Gets_Its_Solar_Panels_(SVS14488_-_BurstCube_SolarPanels-08).jpg',
      ),
    },
  ],
  Operate: [
    {
      label: 'Deployment',
      src: '/images/cubesat/operate-burstcube-deploy-early.jpg',
      alt: 'BurstCube leaving the Nanoracks deployer on the International Space Station, above the Earth.',
      credit: 'NASA/Matthew Dominick, public domain',
      sourceUrl: commons(
        'BurstCube_Deploys_from_International_Space_Station_(SVS14608_-_Deployment_Early).jpg',
      ),
    },
    {
      label: 'In orbit',
      src: '/images/cubesat/operate-burstcube-deploy-late.jpg',
      alt: 'BurstCube and SNOOPI drifting apart over the clouds as they enter low Earth orbit.',
      credit: 'NASA/Matthew Dominick, public domain',
      sourceUrl: commons(
        'BurstCube_Deploys_from_International_Space_Station_(SVS14608_-_Deployment_Late).jpg',
      ),
    },
  ],
  Test: [
    {
      label: 'Flight certification documents',
      src: '/images/cubesat/flight-documentation.png',
      alt: 'Eleven typical flight certification documents, from orbital debris assessment through safety package inputs.',
      credit:
        'NASA CubeSat 101 (2017), Chapter 6. An illustrative list; confirm mission-specific deliverables',
      sourceUrl: CUBESAT_101,
    },
    {
      label: 'Acceptance checklist',
      src: '/images/cubesat/acceptance-checklist.png',
      alt: 'Historical 1U acceptance checklist with rail diagrams, dimensional measurements and deployment safety checks.',
      credit:
        'NASA CubeSat 101 (2017), Chapter 6. A historical example; use your provider’s current checklist',
      sourceUrl: CUBESAT_101,
    },
    {
      label: 'Technical references',
      src: '/images/cubesat/technical-references.png',
      alt: 'CubeSat 101 Appendix D table of range, NASA, testing, electromagnetic compatibility and battery standards.',
      credit:
        'NASA CubeSat 101 (2017), Appendix D. Historical references, not a current compliance baseline',
      sourceUrl: CUBESAT_101,
    },
  ],
};

type Topic = {
  title: string;
  /** [short label, the guide's own sentence] */
  points: readonly (readonly [string, string])[];
  /**
   * Points that are steps in order, by label, with the life-cycle phase
   * each falls in. They show as a numbered sequence after the other points.
   */
  phases?: Readonly<Record<string, string>>;
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
        '~1.33\u00a0kg/U',
        'NASA CubeSat 101 (2017) uses approximately 1 to 1.33\u00a0kg per unit as a historical mass reference. Actual mass limits depend on the applicable deployer and mission requirements.',
      ],
      [
        'Launcher',
        'The launcher is the vehicle that transports spacecraft into space. CubeSats often travel as secondary payloads within compatible dispensers.',
      ],
      [
        'Deployer',
        'The precise dimensions must match the deployer, the device that secures and releases the spacecraft.',
      ],
    ],
  },
  {
    title: 'How to build a CubeSat?',
    // NASA's project life cycle; the steps overlap and repeat in practice.
    phases: {
      'Design specification': 'Phase A–B',
      'Design & fabrication': 'Phase C',
      'System integration': 'Phase D',
      'Verification & acceptance': 'Phase D',
      'Launch & deployment': 'Phase D',
      'Mission sustainability': 'Phase E–F',
    },
    points: [
      [
        'Mission lifecycle',
        'A CubeSat mission progresses through seven phases, from Pre-Phase A concept studies to Phase F mission closeout.',
      ],
      [
        'Design specification',
        'The CubeSat Design Specification (CDS) defines standard physical dimensions, mechanical and electrical constraints, and safety requirements to support deployer compatibility.',
      ],
      [
        'Design & fabrication',
        "Mission objectives guide component selection, procurement, structural fabrication, electronics assembly, and onboard software development within the CubeSat's physical constraints.",
      ],
      [
        'System integration',
        'Structure, power, attitude control, computing, communications, and payload subsystems must work together as one integrated spacecraft to achieve mission objectives.',
      ],
      [
        'Verification & acceptance',
        'Functional and environmental testing, supported by engineering documentation, demonstrates that the CubeSat meets applicable safety, interface, and flight acceptance requirements.',
      ],
      [
        'Launch & deployment',
        'CubeSats are placed into orbit through compatible dispensers, either directly from a launch vehicle or through the International Space Station (ISS) deployment route.',
      ],
      [
        'Mission sustainability',
        'Sustained operation depends on power availability, thermal control, hardware reliability, and fault recovery, alongside appropriate end-of-mission planning.',
      ],
    ],
  },
];
