export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
  numericAnswers?: { label: string; value: number }[];
};

export type Quiz = {
  title: string;
  questions: QuizQuestion[];
};
