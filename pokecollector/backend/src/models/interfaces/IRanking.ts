export interface IRankingEntry {
  userId: string;
  username: string;
  totalCards: number;
  uniqueCards: number;
  completionPercentage: number;
  position: number;
}