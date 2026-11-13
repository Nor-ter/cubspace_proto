// Source: "CubeSat Mission and Subsystems: Contents for the onboarding web"
// (12 November 2026), section 3 "Quiz" and its answer key (1 C, 2 B, 3 D,
// 4 A, 5 C). The guide gives no explanations, so each explanation quotes the
// guide's own sentences that the answer rests on, with the cited reference.
import type { Quiz } from '@/types/quiz';

export const QUIZ_INTRO = 'Select one answer for each question.';

export const MISSION_QUIZ: Quiz = {
  title: 'CubeSat mission and subsystems',
  questions: [
    {
      id: 'cubesat-q1',
      prompt: 'What does 1U identify?',
      options: [
        'Its orbital height and how it is launched.',
        'Its exact mass and electrical power.',
        'Its standard physical size format.',
        'The arrangement of its electronics and payload.',
      ],
      correct: 2,
      explanation:
        'CubeSat sizes are expressed in units, or U. The basic 1U format, selected for this project, is approximately a 10 cm cube. [1]',
    },
    {
      id: 'cubesat-q2',
      prompt: 'What is the main objective of this CubeSat mission?',
      options: [
        'Extend the period between deployment and atmospheric re-entry.',
        'Develop and launch the satellite into LEO and maximise its useful operational lifetime.',
        'Run the payload for as much of every orbit as possible.',
        'Store the largest possible amount of data onboard.',
      ],
      correct: 1,
      explanation:
        'Objective: develop and launch a CubeSat into LEO and maximise its useful operational lifetime. Useful operational lifetime is the period during which the spacecraft meets its mission objectives. [4]',
    },
    {
      id: 'cubesat-q3',
      prompt:
        'Which function is primarily assigned to the onboard computer (OBC)?',
      options: [
        'Generate and distribute electrical power.',
        'Measure and control the spacecraft’s orientation.',
        'Send radio signals through the antenna.',
        'Coordinate spacecraft activities, handle commands and manage data.',
      ],
      correct: 3,
      explanation:
        'The onboard computer (OBC) coordinates spacecraft activities and manages commands and data. [10]',
    },
    {
      id: 'cubesat-q4',
      prompt:
        'A CubeSat changes its pointing direction while continuing along essentially the same orbit. Which quantity has changed?',
      options: [
        'Its attitude, or orientation.',
        'Its height above Earth.',
        'Its speed along the orbit.',
        'Its orbital path around Earth.',
      ],
      correct: 0,
      explanation:
        'ADCS determines and controls spacecraft orientation, called attitude. Attitude control concerns spacecraft rotation and is distinct from changing its orbital trajectory. [8]',
    },
    {
      id: 'cubesat-q5',
      prompt:
        'The payload is proposed to operate more frequently. Which assessment best supports the mission’s lifetime objective?',
      options: [
        'Review battery energy and retain the existing operating schedule.',
        'Review payload performance and select a suitable measurement rate.',
        'Review power, thermal conditions, storage and data return within a shared operating schedule.',
        'Review memory and radio capacity using the existing power budget.',
      ],
      correct: 2,
      explanation:
        'Payload requirements can influence the design and operation of every subsystem: a payload observation must be coordinated with power availability, attitude control, data storage and communications, and sustained operation depends on energy availability and temperature control. [15]',
    },
  ],
};
