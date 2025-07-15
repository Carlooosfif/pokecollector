export type UserRole = 'ADMIN' | 'COMMON';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
}

export interface UserStats {
  totalCards: number;
  uniqueCards: number;
  completionPercentage: number;
}

export interface RankingEntry {
  userId: string;
  username: string;
  totalCards: number;
  uniqueCards: number;
  completionPercentage: number;
  position: number;
}