export type PageId =
  | 'home'
  | 'about'
  | 'cubesat'
  | 'acrux'
  | 'subsystems'
  | 'quiz'
  | 'mission-tree';

// Every page is open: there is no lock and no required order.
export type Course = {
  activePage: PageId;
  go: (id: PageId) => void;
  quizPassed: boolean;
  /** Changes when the quiz is retaken, so its card deck starts again. */
  quizGeneration: number;
  passQuiz: () => void;
  resetQuiz: () => void;
};
