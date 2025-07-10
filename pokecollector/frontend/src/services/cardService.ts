import { apiService } from './api';
import { Card, CreateCardRequest, UserCard, AddCardToCollectionRequest } from '@/types/card';

export class CardService {
  async getAllCards(): Promise<Card[]> {
    try {
      const response = await apiService.get<Card[]>('/cards');
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Error obteniendo cartas');
    } catch (error: any) {
      throw new Error(apiService.handleApiError(error));
    }
  }

  async getCardsByAlbum(albumId: string): Promise<Card[]> {
    try {
      const response = await apiService.get<Card[]>(`/cards/album/${albumId}`);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Error obteniendo cartas del álbum');
    } catch (error: any) {
      throw new Error(apiService.handleApiError(error));
    }
  }

  async getUserCollection(): Promise<UserCard[]> {
    try {
      const response = await apiService.get<UserCard[]>('/cards/collection/my');
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Error obteniendo la colección');
    } catch (error: any) {
      throw new Error(apiService.handleApiError(error));
    }
  }

  async addCardToCollection(cardData: AddCardToCollectionRequest): Promise<UserCard> {
    try {
      const response = await apiService.post<UserCard>('/cards/collection', cardData);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Error agregando carta a la colección');
    } catch (error: any) {
      throw new Error(apiService.handleApiError(error));
    }
  }

  async removeCardFromCollection(cardId: string): Promise<void> {
    try {
      const response = await apiService.delete(`/cards/collection/${cardId}`);
      if (!response.success) {
        throw new Error(response.message || 'Error eliminando carta de la colección');
      }
    } catch (error: any) {
      throw new Error(apiService.handleApiError(error));
    }
  }

  async updateCardQuantity(userCardId: string, quantity: number): Promise<UserCard> {
    try {
      const response = await apiService.put<UserCard>(`/cards/collection/${userCardId}/quantity`, { quantity });
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Error actualizando cantidad');
    } catch (error: any) {
      throw new Error(apiService.handleApiError(error));
    }
  }

  // Métodos para administradores
  async createCard(cardData: CreateCardRequest): Promise<Card> {
    try {
      const response = await apiService.post<Card>('/cards', cardData);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Error creando la carta');
    } catch (error: any) {
      throw new Error(apiService.handleApiError(error));
    }
  }

  async updateCard(id: string, cardData: Partial<CreateCardRequest>): Promise<Card> {
    try {
      const response = await apiService.put<Card>(`/cards/${id}`, cardData);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Error actualizando la carta');
    } catch (error: any) {
      throw new Error(apiService.handleApiError(error));
    }
  }

  async deleteCard(id: string): Promise<void> {
    try {
      const response = await apiService.delete(`/cards/${id}`);
      if (!response.success) {
        throw new Error(response.message || 'Error eliminando la carta');
      }
    } catch (error: any) {
      throw new Error(apiService.handleApiError(error));
    }
  }
}

export const cardService = new CardService();