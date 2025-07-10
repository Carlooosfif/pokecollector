import { PrismaClient } from '@prisma/client';
import { ICardRepository } from '../interfaces/ICardRepository';
import { ICard, ICreateCard, Rarity } from '../../models/interfaces/ICard';
import DatabaseConnection from '../../config/database';

export class CardRepository implements ICardRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = DatabaseConnection.getInstance().getClient();
  }

  async findById(id: string): Promise<ICard | null> {
    try {
      const card = await this.prisma.card.findUnique({
        where: { id },
        include: {
          album: true
        }
      });
      return card as ICard;
    } catch (error) {
      console.error('Error finding card by ID:', error);
      throw new Error('Failed to find card');
    }
  }

  async findByAlbum(albumId: string): Promise<ICard[]> {
    try {
      const cards = await this.prisma.card.findMany({
        where: { albumId },
        orderBy: { number: 'asc' }
      });
      return cards as ICard[];
    } catch (error) {
      console.error('Error finding cards by album:', error);
      throw new Error('Failed to find cards');
    }
  }

  async findByNumber(albumId: string, number: number): Promise<ICard | null> {
    try {
      const card = await this.prisma.card.findUnique({
        where: {
          unique_card_per_album: {
            albumId,
            number
          }
        }
      });
      return card as ICard;
    } catch (error) {
      console.error('Error finding card by number:', error);
      throw new Error('Failed to find card');
    }
  }

  async create(cardData: ICreateCard): Promise<ICard> {
    try {
      const card = await this.prisma.card.create({
        data: {
          ...cardData,
          rarity: cardData.rarity as Rarity
        }
      });

      const cardsCount = await this.prisma.card.count({
        where: { albumId: cardData.albumId }
      });

      await this.prisma.album.update({
        where: { id: cardData.albumId },
        data: { totalCards: cardsCount }
      });

      return card as ICard;
    } catch (error) {
      console.error('Error creating card:', error);
      throw new Error('Failed to create card');
    }
  }

  async update(id: string, cardData: Partial<ICreateCard>): Promise<ICard | null> {
    try {
      const card = await this.prisma.card.update({
        where: { id },
        data: {
          ...cardData,
          rarity: cardData.rarity as Rarity
        }
      });
      return card as ICard;
    } catch (error) {
      console.error('Error updating card:', error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const card = await this.prisma.card.findUnique({
        where: { id }
      });

      if (!card) return false;

      await this.prisma.card.delete({
        where: { id }
      });

      const cardsCount = await this.prisma.card.count({
        where: { albumId: card.albumId }
      });

      await this.prisma.album.update({
        where: { id: card.albumId },
        data: { totalCards: cardsCount }
      });

      return true;
    } catch (error) {
      console.error('Error deleting card:', error);
      return false;
    }
  }

  async findAll(): Promise<ICard[]> {
    try {
      const cards = await this.prisma.card.findMany({
        include: {
          album: true
        },
        orderBy: [
          { album: { generation: 'asc' } },
          { number: 'asc' }
        ]
      });
      return cards as ICard[];
    } catch (error) {
      console.error('Error finding all cards:', error);
      throw new Error('Failed to find cards');
    }
  }
}
