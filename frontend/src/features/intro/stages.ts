import {
  EARTH,
  SATELLITE_POSITION,
  frame,
  nearSatellite,
  type StoryStageFrame,
} from '@/features/story/data';

/** Camera framing for each intro section, in order (opening → launch). */
export const INTRO_STAGES: readonly { stage: StoryStageFrame }[] = [
  // Opening: satellite close, lower right, Earth's limb below.
  { stage: frame(nearSatellite(0.16, 0.035, 0.36), SATELLITE_POSITION, -0.17) },
  // Problem: pull back to the whole planet.
  { stage: frame([0.4, 0.3, 3.6], EARTH, -0.18) },
  // Shift: high over the orbit, the path the knowledge travels.
  { stage: frame([0, 2.6, 3.1], EARTH, 0.12) },
  // Modules: back in close, spacecraft opened up.
  {
    stage: frame(nearSatellite(-0.4, 0.28, 0.62), SATELLITE_POSITION, 0.2, {
      explode: 1,
    }),
  },
  // Launch: wide, calm, centred.
  { stage: frame([0, 0.5, 4.6], [0, 0.55, 0], 0) },
];
