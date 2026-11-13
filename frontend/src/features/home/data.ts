export const MISSION_STATES = [
  {
    code: '01',
    name: 'RELEASE',
    detail: 'Launch → orbit insertion → spacecraft deployment',
  },
  {
    code: '02',
    name: 'DETUMBLE',
    detail: 'Fast body rotation → B-dot damping',
  },
  {
    code: '03',
    name: 'CONTACT',
    detail: 'Antenna deployment → communication with ground station',
  },
] as const;
