export type PageId = 'home' | 'mission' | 'anatomy' | 'model' | 'handoff';

export type QuizSection = Exclude<PageId, 'home'>;

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
