export interface Word {
  id: string;
  word: string;
  difficulty: number;
  phoneticSpelling: string;
}

export interface WordAttempt {
  wordId: string;
  attempts: number;
  timeTaken: number;
  points: number;
}