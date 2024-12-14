export interface Player {
  id: string;
  username: string;
  displayName: string;
  email: string;
}

export interface LeaderboardEntry {
  displayName: string;
  username: string;
  totalPoints: number;
  wordsCompleted: number;
  avgAttempts: number;
  weekStart: string;
}