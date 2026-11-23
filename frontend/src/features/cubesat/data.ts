import { ORBIT_PRESETS } from './viewer/orbit';
export const CUBESAT_MISSION = {
  objective: [
    'Develop and launch a CubeSat into LEO',
    'and maximise its useful operational lifetime.',
  ],
};

export const SOURCES = {
  deploymentVideo: 'https://www.youtube.com/watch?v=s8hhvvOqmmk',
  launcherDimensions: 'https://www.spacex.com/vehicles/falcon-9/',
  nasa101:
    'https://www.nasa.gov/wp-content/uploads/2017/03/nasa_csli_cubesat_101_508.pdf',
  soa: 'https://www.nasa.gov/wp-content/uploads/2025/02/soa-2024.pdf',
  cds: 'https://static1.squarespace.com/static/5418c831e4b0fa4ecac1bacd/t/62193b7fc9e72e0053f00910/1645820809779/CDS+REV14_1+2022-02-09.pdf',
  cubesat: 'https://www.cubesat.org/',
  acrux1: 'https://space.skyrocket.de/doc_sdat/acrux-1.htm',
  cp1: 'https://space.skyrocket.de/doc_sdat/cp-1.htm',
  exocube: 'https://space.skyrocket.de/doc_sdat/exocube.htm',
  orbits:
    'https://science.nasa.gov/earth/earth-observatory/catalog-of-earth-satellite-orbits/',
} as const;

export const STATS: readonly (readonly [string, string])[] = [
  ['1U', 'The basic unit: approximately a 10 cm cube'],
  ['1–12U', 'Configurations covered by CDS Rev. 14.1'],
  ['~1.33 Kg/U', 'Historical mass approximation in NASA CubeSat 101 (2017)'],
  ['LEO', 'Low Earth orbit'],
];

type Point = {
  label: string;
  text: string;
  figure?: {
    file: string;
    alt: string;
    caption: string;
    source: keyof typeof SOURCES;
  };
  link?: keyof typeof SOURCES;
  linkLabel?: string;
};
type Topic = { title: string; points: readonly Point[] };

export const TOPICS: readonly Topic[] = [
  {
    title: 'What a CubeSat is',
    points: [
      {
        label: 'Definition',
        text: 'A CubeSat is a small satellite defined by a standard physical form factor and deployment interface. CubeSat 101 (2017) describes small satellites as generally below 300 kg; the 2024 State-of-the-Art report uses a broader scope of spacecraft below 180 kg. These are contextual mass classifications, not the definition of a CubeSat.',
      },
      {
        label: 'Units',
        text: 'CubeSat sizes are expressed in units (U), starting with 1U. Common configurations include 1U, 1.5U, 2U, 3U, 6U and 12U. U describes the nominal volume and form factor; it does not determine the actual spacecraft mass.',
        figure: {
          file: 'unit-configurations',
          alt: 'CubeSat family showing the relative sizes of 1U, 1.5U, 2U, 3U, 6U and 12U.',
          caption:
            'CubeSat family, 1U–12U. Source: Cal Poly, CubeSat Design Specification.',
          source: 'cds',
        },
      },
      {
        label: '1U · 3U',
        text: 'A 1U is approximately a 10 cm cube. The rounded dimensions illustrated in CubeSat 101 are 10 × 10 × 11 cm for 1U and 10 × 10 × 34 cm for 3U. Exact dimensions, rails, protrusions and tolerances must be checked against the applicable interface drawing.',
        figure: {
          file: 'cp1-cp10',
          alt: 'Cal Poly CP1 1U and CP10 3U spacecraft with rounded external dimensions.',
          caption:
            'CP1 (left) and CP10 (right). CubeSat 101, Figure 2; image credit: Cal Poly.',
          source: 'nasa101',
        },
      },
      {
        label: 'Mass',
        text: 'CubeSat 101 gives the historical 1U mass as approximately 1–1.33 kg. CDS Rev. 14.1 instead lists typical maximum masses of 2, 3, 4, 6, 12 and 24 kg for 1U, 1.5U, 2U, 3U, 6U and 12U respectively. The dispenser and launch provider determine the applicable limit.',
      },
      {
        label: 'Size vs mass',
        text: 'Nanosatellite and microsatellite describe mass classes; CubeSat describes a form factor. Larger CubeSats can therefore be microsatellites. The NASA comparison image illustrates these mass classes alongside CubeSat sizes. Its mass values are reference values, not measured spacecraft masses or universal launch limits.',
        figure: {
          file: 'mass-and-size',
          alt: 'Comparison of satellite mass classes and CubeSat configurations from 1U to 27U.',
          caption:
            'State-of-the-Art of Small Spacecraft Technology (2024), Figure 1.3. Credit: NASA. The “16U Cubesat?” label is reproduced from the source figure.',
          source: 'soa',
        },
      },
      {
        figure: {
          file: 'earth-orbits',
          alt: 'NASA diagram comparing low, medium and high Earth orbits with the distance to lunar orbit.',
          caption:
            'Earth orbit classifications. Source: NASA Earth Observatory, Catalog of Earth Satellite Orbits. Illustration by Robert Simmon.',
          source: 'orbits',
        },
        label: 'What is LEO?',
        text: ORBIT_PRESETS[0].detail,
        link: 'orbits',
        linkLabel: 'Explore NASA’s catalog of Earth satellite orbits',
      },
      {
        label: 'Orbit types',
        text: 'Altitude, inclination and shape describe different aspects of an orbit. A Sun-synchronous orbit can also be a near-polar LEO.',
      },
      {
        label: 'MEO',
        text: ORBIT_PRESETS[1].detail,
      },
      {
        label: 'GEO',
        text: ORBIT_PRESETS[2].detail,
      },
      {
        label: 'High Earth',
        text: 'Higher Earth orbits extend toward the Moon. They provide distant viewpoints and generally require more launch energy.',
      },
      {
        label: 'Polar',
        text: ORBIT_PRESETS[3].detail,
      },
      {
        label: 'Sun-sync',
        text: ORBIT_PRESETS[4].detail,
      },
      {
        label: 'Elliptical',
        text: 'Altitude varies around an elliptical orbit. Molniya orbits linger near their high point, supporting high-latitude communications.',
      },
    ],
  },
  {
    title: 'What the mission needs',
    points: [
      {
        label: 'Mission',
        text: 'CubeSat mission = Launcher + CubeSat + Dispenser. The launcher carries the system toward its target orbit; the CubeSat performs the mission; the dispenser secures the CubeSat during launch and releases it. Compatibility across these interfaces is essential.',
        figure: {
          file: 'launch-sequence',
          alt: 'Continuous 3D sequence showing launch, fairing separation, the dispenser door opening and CubeSat release.',
          caption:
            'Illustrative launcher, dispenser and CubeSat deployment sequence. Reference: NASA CubeSat 101.',
          source: 'nasa101',
        },
      },
      {
        label: 'Dispenser',
        text: 'The dispenser is the interface between the CubeSat and the launch vehicle (LV). It attaches the spacecraft to the launch system, protects and restrains it during launch, and releases it at the designated time. The P-POD is one example of a CubeSat dispenser.',
      },
      {
        label: 'Launcher',
        text: 'CubeSats often travel as secondary payloads, with their dispensers mounted where the launch vehicle can accommodate them. NASA’s CubeSat Launch Initiative (CSLI) arranges launch opportunities through multiple launch services. The launcher, dispenser and spacecraft must meet the selected mission’s integration requirements.',
      },
      {
        label: 'ISS route',
        text: 'Another route is transport as cargo on a resupply mission to the International Space Station (ISS). The CubeSat is brought aboard and subsequently released using a dedicated deployer. This pathway has its own cargo, station-safety and deployment requirements.',
      },
      {
        label: 'Authority',
        text: 'Launch-provider requirements take precedence over the CDS. Obtain the mission-specific requirements and dispenser interface documentation from the provider and integrator, and use them as the acceptance baseline.',
        link: 'cubesat',
        linkLabel: 'Open CubeSat Program specifications',
      },
      {
        label: 'CDS',
        text: 'The CubeSat Design Specification (CDS) provides a common starting point for preliminary design and dispenser compatibility. This page uses Rev. 14.1 (9 February 2022). Meeting the CDS alone does not grant flight approval.',
        link: 'cds',
        linkLabel: 'Open CDS Rev. 14.1 (PDF)',
      },
      {
        label: 'Evidence',
        text: 'Developers submit verification evidence so the mission integrator can assess compliance. Flight approval can follow after all required deliverables have been accepted. CubeSat 101 describes initial deliveries typically starting about 10 months before delivery to the integration site; your mission schedule governs.',
      },
      {
        label: 'Documents',
        text: 'Typical evidence covers orbital-debris compliance, transmitter information, materials, mass properties, batteries, dimensions, electrical design, venting, test procedures and results, a compliance letter and safety inputs. The integrator supplies the official deliverables list.',
        figure: {
          file: 'flight-documentation',
          alt: 'Eleven typical flight certification documents, from orbital debris assessment through safety package inputs.',
          caption:
            'Flight certification documentation list, CubeSat 101, Chapter 6. An illustrative list; confirm mission-specific deliverables.',
          source: 'nasa101',
        },
      },
      {
        label: 'Acceptance',
        text: 'Acceptance checks establish that the as-built spacecraft fits its dispenser and meets interface and safety requirements. They can include dimensions, mass, rails, deployment switches, remove-before-flight pins and restrained deployables. The illustrated checklist is a historical example. Use the current acceptance form and limits supplied by your mission integrator and dispenser provider.',
        figure: {
          file: 'acceptance-checklist',
          alt: 'Historical 1U acceptance checklist with rail diagrams, dimensional measurements and deployment safety checks.',
          caption:
            'Historical 1U acceptance checklist reproduced in CubeSat 101. Use your provider’s current checklist and interface drawings.',
          source: 'nasa101',
        },
      },
      {
        label: 'References',
        text: 'Requirements may draw on range safety, materials and processes, orbital debris, environmental verification, electromagnetic compatibility and battery safety standards. The 2017 guide’s reference list includes older revisions; establish the applicable documents and revisions with the mission integrator.',
        figure: {
          file: 'technical-references',
          alt: 'CubeSat 101 Appendix D table of historical range, NASA, testing, electromagnetic compatibility and battery standards.',
          caption:
            'Technical reference documents, CubeSat 101, Appendix D. Historical references, not a current compliance baseline.',
          source: 'nasa101',
        },
      },
      {
        label: 'Timeline',
        text: 'Concept development, funding, feasibility reviews and proposals lead into selection and manifesting. Coordination, licensing, documentation, ground-station work and flight-hardware development overlap before readiness reviews, dispenser integration, launch-vehicle integration and operations. This is a notional sequence, not a fixed schedule.',
        figure: {
          file: 'mission-timeline',
          alt: 'Notional timeline showing overlapping mission-development activities through integration, launch and operations.',
          caption:
            'Notional timeline of events and deliverables, CubeSat 101, Appendix E. Timing depends on the mission.',
          source: 'nasa101',
        },
      },
    ],
  },
];
export const CUBESAT_PAGES = [
  {
    id: 'basics',
    title: 'The CubeSat unit',
    summary: 'Start with 1U and explore real spacecraft.',
    image: 'cp1-cp10',
    labels: ['Definition', '1U · 3U', 'ACRUX-1 quiz'],
  },
  {
    id: 'formats',
    title: 'Sizes, mass & a quick quiz',
    summary:
      'Explore configurations, compare mass limits and test your knowledge.',
    image: 'unit-configurations',
    labels: ['Units', 'Mass', 'Size vs mass'],
  },
  {
    id: 'orbits',
    title: 'LEO & other orbits',
    summary: 'Explore low Earth orbit and other orbit types.',
    image: 'earth-orbits',
    labels: [
      'What is LEO?',
      'Orbit types',
      'MEO',
      'GEO',
      'High Earth',
      'Polar',
      'Sun-sync',
      'Elliptical',
    ],
  },
  {
    id: 'launch',
    title: 'Launcher + CubeSat + Dispenser',
    summary: 'Follow the interfaces that take a CubeSat into space.',
    image: 'launch-sequence',
    labels: ['Mission', 'Dispenser', 'Launcher', 'ISS route'],
  },
  {
    id: 'requirements',
    title: 'Requirements & flight approval',
    summary: 'Explore the CDS, verification evidence and acceptance.',
    image: 'acceptance-checklist',
    labels: [
      'CDS',
      'Authority',
      'Evidence',
      'Documents',
      'Acceptance',
      'References',
    ],
  },
  {
    id: 'timeline',
    title: 'From concept to orbit',
    summary: 'See how development and launch activities overlap.',
    image: 'mission-timeline',
    labels: ['Timeline'],
  },
] as const;
