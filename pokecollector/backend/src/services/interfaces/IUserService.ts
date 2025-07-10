import { IUser, ICreateUser, IUpdateUser } from '../../models/interfaces/IUser';
import { IRankingEntry } from '../../models/interfaces/IRanking';

export interface IUserService {
  getUserById(id: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  createUser(userData: ICreateUser): Promise<IUser>;
  updateUser(id: string, userData: IUpdateUser): Promise<IUser | null>;
  deleteUser(id: string): Promise<boolean>;
  getAllUsers(): Promise<IUser[]>;
  getUserStats(userId: string): Promise<{
    totalCards: number;
    uniqueCards: number;
    completionPercentage: number;
  }>;
  getRanking(): Promise<IRankingEntry[]>;
}