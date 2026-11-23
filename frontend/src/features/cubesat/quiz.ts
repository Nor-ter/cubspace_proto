import type { Quiz } from '@/types/quiz';

export const MASS_QUIZ: Quiz = {
  title: 'CubeSat sizes and mass',
  questions: [
    {
      id: 'format-mass-1',
      prompt:
        'Using the historical approximation of 1–1.33 kg per U, what is the estimated mass range for 1U?',
      numericAnswers: [
        { label: '1U minimum (kg)', value: 1 },
        { label: '1U maximum (kg)', value: 1.33 },
      ],
      options: ['1U: 1–1.33 kg.'],
      correct: 0,
      explanation:
        'Multiply 1 by 1 kg for the minimum and by 1.33 kg for the maximum. This historical estimate is not the actual spacecraft mass or an applicable launch limit.',
    },
    {
      id: 'format-mass-1-5',
      prompt:
        'Using the historical approximation of 1–1.33 kg per U, what is the estimated mass range for 1.5U?',
      numericAnswers: [
        { label: '1.5U minimum (kg)', value: 1.5 },
        { label: '1.5U maximum (kg)', value: 2 },
      ],
      options: ['1.5U: 1.5–2.00 kg.'],
      correct: 0,
      explanation:
        'Multiply 1.5 by 1 kg for the minimum and by 1.33 kg for the maximum. The upper estimate is rounded from 1.995 kg to 2.00 kg. This historical estimate is not the actual spacecraft mass or an applicable launch limit.',
    },
    {
      id: 'format-mass-2',
      prompt:
        'Using the historical approximation of 1–1.33 kg per U, what is the estimated mass range for 2U?',
      numericAnswers: [
        { label: '2U minimum (kg)', value: 2 },
        { label: '2U maximum (kg)', value: 2.66 },
      ],
      options: ['2U: 2–2.66 kg.'],
      correct: 0,
      explanation:
        'Multiply 2 by 1 kg for the minimum and by 1.33 kg for the maximum. This historical estimate is not the actual spacecraft mass or an applicable launch limit.',
    },
    {
      id: 'format-mass-3',
      prompt:
        'Using the historical approximation of 1–1.33 kg per U, what is the estimated mass range for 3U?',
      numericAnswers: [
        { label: '3U minimum (kg)', value: 3 },
        { label: '3U maximum (kg)', value: 3.99 },
      ],
      options: ['3U: 3–3.99 kg.'],
      correct: 0,
      explanation:
        'Multiply 3 by 1 kg for the minimum and by 1.33 kg for the maximum. This historical estimate is not the actual spacecraft mass or an applicable launch limit.',
    },
    {
      id: 'format-mass-6',
      prompt:
        'Using the historical approximation of 1–1.33 kg per U, what is the estimated mass range for 6U?',
      numericAnswers: [
        { label: '6U minimum (kg)', value: 6 },
        { label: '6U maximum (kg)', value: 7.98 },
      ],
      options: ['6U: 6–7.98 kg.'],
      correct: 0,
      explanation:
        'Multiply 6 by 1 kg for the minimum and by 1.33 kg for the maximum. This historical estimate is not the actual spacecraft mass or an applicable launch limit.',
    },
    {
      id: 'format-mass-12',
      prompt:
        'Using the historical approximation of 1–1.33 kg per U, what is the estimated mass range for 12U?',
      numericAnswers: [
        { label: '12U minimum (kg)', value: 12 },
        { label: '12U maximum (kg)', value: 15.96 },
      ],
      options: ['12U: 12–15.96 kg.'],
      correct: 0,
      explanation:
        'Multiply 12 by 1 kg for the minimum and by 1.33 kg for the maximum. This historical estimate is not the actual spacecraft mass or an applicable launch limit.',
    },
    {
      id: 'format-mass-real',
      prompt:
        'Check the CP1 and ExoCube / CP10 links. Which actual masses does Gunter’s Space Page list?',
      options: [
        'CP1: 2 kg; CP10: 6 kg.',
        'CP1: 1.33 kg; CP10: 3.99 kg.',
        'CP1: 1 kg; CP10: 4 kg.',
        'CP1: 1 kg; CP10: 3.2 kg.',
      ],
      correct: 2,
      explanation:
        'CP1 (1U) is listed at 1 kg and ExoCube 1 / CP10 (3U) at 4 kg. The 3.2 kg entry belongs to ExoCube 2 / CP12. U describes the form factor, so it does not determine actual mass.',
    },
  ],
};

export const ACRUX_QUIZ: Quiz = {
  title: 'What about ACRUX-1?',
  questions: [
    {
      id: 'acrux1-format-mass',
      prompt:
        'What about ACRUX-1? Check its mission listing. What were its configuration and actual mass?',
      options: [
        '1U and 2 kg.',
        '3U and 4 kg.',
        '1U and 1.33 kg.',
        '1U and 1 kg.',
      ],
      correct: 3,
      explanation:
        'Gunter’s Space Page lists Melbourne Space Program’s ACRUX-1 as a 1U CubeSat with a mass of 1 kg. Actual mass comes from mission data, rather than a general maximum mass allowance.',
    },
  ],
};

export const ORBIT_QUIZ: Quiz = {
  title: 'ACRUX-1: launcher and orbit',
  questions: [
    {
      id: 'acrux1-launcher',
      prompt: 'Which launch vehicle carried ACRUX-1 into space?',
      options: ['Electron.', 'Falcon 9.', 'Atlas V.', 'Minotaur I.'],
      correct: 0,
      explanation:
        'ACRUX-1 launched on Electron from New Zealand on 29 June 2019.',
    },
    {
      id: 'acrux1-orbit',
      prompt: 'Which orbit is listed for ACRUX-1?',
      options: [
        'Geostationary orbit, approximately 35,786 km above Earth.',
        'Medium Earth orbit, approximately 20,200 km above Earth.',
        'Low Earth orbit, 439 × 460 km at 45.01° inclination.',
        'Lunar orbit.',
      ],
      correct: 2,
      explanation:
        'The reported 439 × 460 km orbit at 45.01° inclination is in LEO. This earlier ACRUX-1 mission is distinct from ACRUX-II.',
    },
  ],
};
