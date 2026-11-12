export type PageId =
  | 'start'
  | 'about'
  | 'acrux'
  | 'theory'
  | 'mission-tree'
  | 'launch';

export type QuizQuestion = {
  prompt: string;
  options: string[];
  correct: number;
  explanation?: string;
};

/** Onboarding progress kept in this browser only. Nothing is gated on it. */
export type Progress = {
  filmWatched: boolean;
  quizzesPassed: string[];
  team: string | null;
};

export type Course = {
  activePage: PageId;
  progress: Progress;
  go: (id: PageId) => void;
  markFilmWatched: () => void;
  passQuiz: (id: string) => void;
  setTeam: (code: string) => void;
};
