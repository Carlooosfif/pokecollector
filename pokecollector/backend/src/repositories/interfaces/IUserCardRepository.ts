import { IUserCard, ICreateUserCard } from '../../models/interfaces/IUserCard';
import { IRankingEntry } from '../../models/interfaces/IRanking';

export interface IUserCardRepository {
  findById(id: string): Promise<IUserCard | null>;
  findByUser(userId: string): Promise<IUserCard[]>;
  findByUserAndCard(userId: string, cardId: string): Promise<IUserCard | null>;
  create(userCardData: ICreateUserCard): Promise<IUserCard>;
  update(id: string, userCardData: Partial<ICreateUserCard>): Promise<IUserCard | null>;
  delete(id: string): Promise<boolean>;
  deleteByUserAndCard(userId: string, cardId: string): Promise<boolean>;
  getRanking(): Promise<IRankingEntry[]>;
  getUserStats(userId: string): Promise<{
    totalCards: number;
    uniqueCards: number;
    completionPercentage: number;
  }>;
}