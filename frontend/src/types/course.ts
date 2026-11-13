export type PageId =
  | 'home'
  | 'about'
  | 'cubesat'
  | 'acrux'
  | 'subsystems'
  | 'mission'
  | 'anatomy'
  | 'model'
  | 'handoff'
  | 'mission-tree';

// Pages that end with a quiz. Other pages are introductions and never lock.
export type QuizSection = 'mission' | 'anatomy' | 'model' | 'handoff';

export type Course = {
  activePage: PageId;
  completed: QuizSection[];
  adminMode: boolean;
  resetGeneration: number;
  isUnlocked: (id: PageId) => boolean;
  go: (id: PageId) => void;
  passQuiz: (id: QuizSection) => void;
  resetFrom: (id: QuizSection) => void;
  requestReset: () => void;
};
