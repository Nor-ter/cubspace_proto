const image = (name: string) =>
  `${import.meta.env.BASE_URL}images/projects/${name}`;
const source = 'https://www.melbournespace.com.au/projects';

export type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
  source?: string;
};

export const PROJECT_IMAGES: Record<string, readonly GalleryImage[]> = {
  '01': [
    {
      src: image('acrux-msp.jpg'),
      alt: 'MSP CubeSat hardware with solar cells and an aluminium frame',
      caption:
        'ACRUX flight heritage. MSP uses this ACRUX-1 hardware photograph on its ACRUX-2 project page.',
      source,
    },
  ],
  '02': [
    {
      src: image('humanoid-msp.png'),
      alt: 'MSP robotics demonstration with a robot torso, articulated hand and engineering laptop',
      caption:
        'Robotics hardware and a project demonstration from the MSP projects page.',
      source,
    },
  ],
  '03': [
    {
      src: image('companion-robot-msp.jpg'),
      alt: 'An animal companion robot under development with exposed actuators and test equipment',
      caption:
        'An animatronic companion prototype with its mechanical and electrical test setup.',
      source,
    },
  ],
  '04': [
    {
      src: `${import.meta.env.BASE_URL}favicon.svg`,
      alt: 'CubSpace silver CubeSat and gold orbit mark',
      caption:
        'CubSpace identity: a modular satellite, silver surfaces and a gold orbit.',
    },
    {
      src: image('cubspace-start.png'),
      alt: 'CubSpace continuous 3D mission landing page',
      caption:
        'CubSpace Onboarding Web: the continuous launch-to-contact learning experience.',
    },
    {
      src: image('cubspace-theory.png'),
      alt: 'CubSpace interactive CubeSat anatomy viewer',
      caption:
        'CubSpace Theory: explore subsystem roles, tools and skills through the 1U model.',
    },
  ],
};
