import { ICardService } from '../interfaces/ICardService';
import { ICard, ICreateCard } from '../../models/interfaces/ICard';
import { IUserCard, ICreateUserCard } from '../../models/interfaces/IUserCard';
import { ICardRepository } from '../../repositories/interfaces/ICardRepository';
import { IUserCardRepository } from '../../repositories/interfaces/IUserCardRepository';
import { IAlbumRepository } from '../../repositories/interfaces/IAlbumRepository';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import { RepositoryFactory } from '../../factories/RepositoryFactory';

export class CardService implements ICardService {
  private cardRepository: ICardRepository;
  private userCardRepository: IUserCardRepository;
  private albumRepository: IAlbumRepository;
  private userRepository: IUserRepository;

  constructor() {
    // Aplicando Dependency Inversion Principle (DIP)
    this.cardRepository = RepositoryFactory.createCardRepository();
    this.userCardRepository = RepositoryFactory.createUserCardRepository();
    this.albumRepository = RepositoryFactory.createAlbumRepository();
    this.userRepository = RepositoryFactory.createUserRepository();
  }

  // Métodos para gestión de cartas (Admin)
  async getCardById(id: string): Promise<ICard | null> {
    try {
      return await this.cardRepository.findById(id);
    } catch (error) {
      console.error('Error getting card by ID:', error);
      throw new Error('Failed to get card');
    }
  }

  async getCardsByAlbum(albumId: string): Promise<ICard[]> {
    try {
      // Verificar que el álbum existe
      const album = await this.albumRepository.findById(albumId);
      if (!album) {
        throw new Error('Album not found');
      }

      return await this.cardRepository.findByAlbum(albumId);
    } catch (error) {
      console.error('Error getting cards by album:', error);
      throw error;
    }
  }

  async createCard(cardData: ICreateCard): Promise<ICard> {
    try {
      // Validar datos de la carta
      await this.validateCardData(cardData);
      
      // Verificar que no existe una carta con el mismo número en el álbum
      const existingCard = await this.cardRepository.findByNumber(cardData.albumId, cardData.number);
      if (existingCard) {
        throw new Error(`Card number ${cardData.number} already exists in this album`);
      }

      return await this.cardRepository.create(cardData);
    } catch (error) {
      console.error('Error creating card:', error);
      throw error;
    }
  }

  async updateCard(id: string, cardData: Partial<ICreateCard>): Promise<ICard | null> {
    try {
      // Verificar que la carta existe
      const existingCard = await this.cardRepository.findById(id);
      if (!existingCard) {
        throw new Error('Card not found');
      }

      // Si se está actualizando el número, verificar que no conflicte
      if (cardData.number && cardData.number !== existingCard.number) {
        const conflictCard = await this.cardRepository.findByNumber(
          existingCard.albumId, 
          cardData.number
        );
        if (conflictCard) {
          throw new Error(`Card number ${cardData.number} already exists in this album`);
        }
      }

      return await this.cardRepository.update(id, cardData);
    } catch (error) {
      console.error('Error updating card:', error);
      throw error;
    }
  }

  async deleteCard(id: string): Promise<boolean> {
    try {
      // Verificar que la carta existe
      const existingCard = await this.cardRepository.findById(id);
      if (!existingCard) {
        throw new Error('Card not found');
      }

      return await this.cardRepository.delete(id);
    } catch (error) {
      console.error('Error deleting card:', error);
      throw error;
    }
  }

  async getAllCards(): Promise<ICard[]> {
    try {
      return await this.cardRepository.findAll();
    } catch (error) {
      console.error('Error getting all cards:', error);
      throw new Error('Failed to get cards');
    }
  }

  // Métodos para colección de usuarios
  async getUserCards(userId: string): Promise<IUserCard[]> {
    try {
      // Verificar que el usuario existe
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      return await this.userCardRepository.findByUser(userId);
    } catch (error) {
      console.error('Error getting user cards:', error);
      throw error;
    }
  }

  async addCardToUser(userCardData: ICreateUserCard): Promise<IUserCard> {
    try {
      // Verificar que el usuario existe
      const user = await this.userRepository.findById(userCardData.userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verificar que la carta existe
      const card = await this.cardRepository.findById(userCardData.cardId);
      if (!card) {
        throw new Error('Card not found');
      }

      // Verificar si el usuario ya tiene esta carta
      const existingUserCard = await this.userCardRepository.findByUserAndCard(
        userCardData.userId, 
        userCardData.cardId
      );

      if (existingUserCard) {
        // Si ya tiene la carta, actualizar la cantidad
        const newQuantity = existingUserCard.quantity + (userCardData.quantity || 1);
        return await this.userCardRepository.update(existingUserCard.id, { quantity: newQuantity }) as IUserCard;
      } else {
        // Si no tiene la carta, crear nuevo registro
        return await this.userCardRepository.create(userCardData);
      }
    } catch (error) {
      console.error('Error adding card to user:', error);
      throw error;
    }
  }

  async removeCardFromUser(userId: string, cardId: string): Promise<boolean> {
    try {
      // Verificar que el usuario tiene esta carta
      const userCard = await this.userCardRepository.findByUserAndCard(userId, cardId);
      if (!userCard) {
        throw new Error('User does not have this card');
      }

      return await this.userCardRepository.deleteByUserAndCard(userId, cardId);
    } catch (error) {
      console.error('Error removing card from user:', error);
      throw error;
    }
  }

  async updateUserCard(userCardId: string, quantity: number): Promise<IUserCard | null> {
    try {
      if (quantity < 1) {
        throw new Error('Quantity must be at least 1');
      }

      // Verificar que el registro existe
      const userCard = await this.userCardRepository.findById(userCardId);
      if (!userCard) {
        throw new Error('User card not found');
      }

      return await this.userCardRepository.update(userCardId, { quantity });
    } catch (error) {
      console.error('Error updating user card:', error);
      throw error;
    }
  }

  private async validateCardData(cardData: ICreateCard): Promise<void> {
    // Validar nombre
    if (!cardData.name || cardData.name.trim().length < 2) {
      throw new Error('Card name must be at least 2 characters long');
    }

    if (cardData.name.length > 100) {
      throw new Error('Card name cannot exceed 100 characters');
    }

    // Validar número
    if (!cardData.number || cardData.number < 1) {
      throw new Error('Card number must be a positive number');
    }

    if (cardData.number > 999) {
      throw new Error('Card number cannot exceed 999');
    }

    // Validar rareza
    const validRarities = ['COMMON', 'UNCOMMON', 'RARE', 'HOLO', 'LEGENDARY'];
    if (!validRarities.includes(cardData.rarity)) {
      throw new Error('Invalid card rarity');
    }

    // Verificar que el álbum existe
    const album = await this.albumRepository.findById(cardData.albumId);
    if (!album) {
      throw new Error('Album not found');
    }

    // Validar URL de imagen si se proporciona
    if (cardData.imageUrl) {
      const urlRegex = /^https?:\/\/.+/;
      if (!urlRegex.test(cardData.imageUrl)) {
        throw new Error('Invalid image URL format');
      }
    }

    // Validar tipo si se proporciona
    if (cardData.type && cardData.type.length > 50) {
      throw new Error('Card type cannot exceed 50 characters');
    }

    // Validar descripción si se proporciona
    if (cardData.description && cardData.description.length > 500) {
      throw new Error('Card description cannot exceed 500 characters');
    }
  }
}