export interface Question {
  id: string;
  question: string;
  options: Array<{
    text: string;
    points?: number;
  }>;
  showIf?: {
    questionId: string;
    answer: string[];
  };
}

export interface Answer {
  questionId: string;
  question: string;
  answer: string;
  points?: number;
}
