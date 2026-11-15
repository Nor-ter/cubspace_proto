import {
  SATELLITE_POSITION,
  frame,
  nearSatellite,
  type StoryStageFrame,
} from '@/features/story/data';

/** Camera framing for the intro: the opening, then the hand-off to the course. */
export const INTRO_STAGES: readonly { stage: StoryStageFrame }[] = [
  // Opening: satellite close, lower right, Earth's limb below.
  { stage: frame(nearSatellite(0.2, 0.044, 0.45), SATELLITE_POSITION, -0.17) },
  // Hand-off (after Start): down to Earth's limb, the framing the course's
  // launch pad shot opens on.
  { stage: frame([0, 1.12, 2.15], [0, 1.32, 0], 0) },
];

/** The hand-off framing, last in INTRO_STAGES. */
export const HANDOFF_STAGE = INTRO_STAGES.length - 1;
