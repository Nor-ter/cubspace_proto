export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
};

export type Quiz = {
  title: string;
  questions: QuizQuestion[];
};
