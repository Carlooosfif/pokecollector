import { PrismaClient } from '@prisma/client';
import { IUserCardRepository } from '../interfaces/IUserCardRepository';
import { IUserCard, ICreateUserCard } from '../../models/interfaces/IUserCard';
import { IRankingEntry } from '../../models/interfaces/IRanking';
import DatabaseConnection from '../../config/database';

export class UserCardRepository implements IUserCardRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = DatabaseConnection.getInstance().getClient();
  }

  async findById(id: string): Promise<IUserCard | null> {
    try {
      const userCard = await this.prisma.userCard.findUnique({
        where: { id },
        include: {
          user: true,
          card: {
            include: {
              album: true
            }
          }
        }
      });
      return userCard;
    } catch (error) {
      console.error('Error finding user card by ID:', error);
      throw new Error('Failed to find user card');
    }
  }

  async findByUser(userId: string): Promise<IUserCard[]> {
    try {
      const userCards = await this.prisma.userCard.findMany({
        where: { userId },
        include: {
          card: {
            include: {
              album: true
            }
          }
        },
        orderBy: [
          { card: { album: { generation: 'asc' } } },
          { card: { number: 'asc' } }
        ]
      });
      return userCards;
    } catch (error) {
      console.error('Error finding user cards:', error);
      throw new Error('Failed to find user cards');
    }
  }

  async findByUserAndCard(userId: string, cardId: string): Promise<IUserCard | null> {
    try {
      const userCard = await this.prisma.userCard.findUnique({
        where: {
          unique_user_card: {
            userId,
            cardId
          }
        }
      });
      return userCard;
    } catch (error) {
      console.error('Error finding user card:', error);
      throw new Error('Failed to find user card');
    }
  }

  async create(userCardData: ICreateUserCard): Promise<IUserCard> {
    try {
      const userCard = await this.prisma.userCard.create({
        data: userCardData,
        include: {
          card: {
            include: {
              album: true
            }
          }
        }
      });
      return userCard;
    } catch (error) {
      console.error('Error creating user card:', error);
      throw new Error('Failed to create user card');
    }
  }

  async update(id: string, userCardData: Partial<ICreateUserCard>): Promise<IUserCard | null> {
    try {
      const userCard = await this.prisma.userCard.update({
        where: { id },
        data: userCardData,
        include: {
          card: {
            include: {
              album: true
            }
          }
        }
      });
      return userCard;
    } catch (error) {
      console.error('Error updating user card:', error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.userCard.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error('Error deleting user card:', error);
      return false;
    }
  }

  async deleteByUserAndCard(userId: string, cardId: string): Promise<boolean> {
    try {
      await this.prisma.userCard.delete({
        where: {
          unique_user_card: {
            userId,
            cardId
          }
        }
      });
      return true;
    } catch (error) {
      console.error('Error deleting user card:', error);
      return false;
    }
  }

  async getRanking(): Promise<IRankingEntry[]> {
    try {
      // Obtener estadísticas de cada usuario
      const userStats = await this.prisma.user.findMany({
        select: {
          id: true,
          username: true,
          userCards: {
            select: {
              quantity: true,
              card: {
                select: {
                  id: true
                }
              }
            }
          }
        }
      });

      // Obtener el total de cartas disponibles
      const totalAvailableCards = await this.prisma.card.count();

      // Calcular estadísticas y ranking
      const rankingData: IRankingEntry[] = userStats
        .map(user => {
          const totalCards = user.userCards.reduce((sum, uc) => sum + uc.quantity, 0);
          const uniqueCards = user.userCards.length;
          const completionPercentage = totalAvailableCards > 0 
            ? Math.round((uniqueCards / totalAvailableCards) * 100) 
            : 0;

          return {
            userId: user.id,
            username: user.username,
            totalCards,
            uniqueCards,
            completionPercentage,
            position: 0 // Se asignará después del sorting
          };
        })
        .sort((a, b) => {
          // Ordenar por porcentaje de completación descendente, luego por cartas únicas
          if (b.completionPercentage !== a.completionPercentage) {
            return b.completionPercentage - a.completionPercentage;
          }
          return b.uniqueCards - a.uniqueCards;
        })
        .map((entry, index) => ({
          ...entry,
          position: index + 1
        }));

      return rankingData;
    } catch (error) {
      console.error('Error getting ranking:', error);
      throw new Error('Failed to get ranking');
    }
  }

  async getUserStats(userId: string): Promise<{
    totalCards: number;
    uniqueCards: number;
    completionPercentage: number;
  }> {
    try {
      const userCards = await this.prisma.userCard.findMany({
        where: { userId },
        select: {
          quantity: true,
          card: {
            select: {
              id: true
            }
          }
        }
      });

      const totalCards = userCards.reduce((sum, uc) => sum + uc.quantity, 0);
      const uniqueCards = userCards.length;

      const totalAvailableCards = await this.prisma.card.count();
      const completionPercentage = totalAvailableCards > 0 
        ? Math.round((uniqueCards / totalAvailableCards) * 100) 
        : 0;

      return {
        totalCards,
        uniqueCards,
        completionPercentage
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw new Error('Failed to get user stats');
    }
  }
}