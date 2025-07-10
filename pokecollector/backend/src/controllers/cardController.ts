import { Request, Response } from 'express';
import { ICardService } from '../services/interfaces/ICardService';
import { CardService } from '../services/implementations/CardService';

export class CardController {
  private cardService: ICardService;

  constructor() {
    this.cardService = new CardService();
  }

  async getAllCards(req: Request, res: Response): Promise<Response> {
    try {
      const cards = await this.cardService.getAllCards();
      return res.status(200).json({ success: true, message: 'Cards retrieved successfully', data: cards });
    } catch (error: any) {
      console.error('Get all cards error:', error);
      return res.status(500).json({ success: false, message: 'Failed to get cards' });
    }
  }

  async getCardById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ success: false, message: 'Card ID is required' });

      const card = await this.cardService.getCardById(id);
      if (!card) return res.status(404).json({ success: false, message: 'Card not found' });

      return res.status(200).json({ success: true, message: 'Card retrieved successfully', data: card });
    } catch (error: any) {
      console.error('Get card by ID error:', error);
      return res.status(500).json({ success: false, message: 'Failed to get card' });
    }
  }

  async getCardsByAlbum(req: Request, res: Response): Promise<Response> {
    try {
      const { albumId } = req.params;
      if (!albumId) return res.status(400).json({ success: false, message: 'Album ID is required' });

      const cards = await this.cardService.getCardsByAlbum(albumId);
      return res.status(200).json({ success: true, message: 'Cards retrieved successfully', data: cards });
    } catch (error: any) {
      console.error('Get cards by album error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to get cards' });
    }
  }

  async createCard(req: Request, res: Response): Promise<Response> {
    try {
      const { name, number, rarity, type, albumId, imageUrl, description } = req.body;

      const cardData = { name, number, rarity, type, albumId, imageUrl, description };
      const card = await this.cardService.createCard(cardData);

      return res.status(201).json({ success: true, message: 'Card created successfully', data: card });
    } catch (error: any) {
      console.error('Create card error:', error);
      return res.status(400).json({ success: false, message: error.message || 'Failed to create card' });
    }
  }

  async updateCard(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ success: false, message: 'Card ID is required' });

      const { name, number, rarity, type, imageUrl, description } = req.body;
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (number !== undefined) updateData.number = number;
      if (rarity !== undefined) updateData.rarity = rarity;
      if (type !== undefined) updateData.type = type;
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
      if (description !== undefined) updateData.description = description;

      const updatedCard = await this.cardService.updateCard(id, updateData);
      if (!updatedCard) return res.status(404).json({ success: false, message: 'Card not found' });

      return res.status(200).json({ success: true, message: 'Card updated successfully', data: updatedCard });
    } catch (error: any) {
      console.error('Update card error:', error);
      return res.status(400).json({ success: false, message: error.message || 'Failed to update card' });
    }
  }

  async deleteCard(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ success: false, message: 'Card ID is required' });

      const deleted = await this.cardService.deleteCard(id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Card not found' });

      return res.status(200).json({ success: true, message: 'Card deleted successfully' });
    } catch (error: any) {
      console.error('Delete card error:', error);
      return res.status(400).json({ success: false, message: error.message || 'Failed to delete card' });
    }
  }

  async getUserCollection(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

      const userCards = await this.cardService.getUserCards(userId);
      return res.status(200).json({ success: true, message: 'User collection retrieved successfully', data: userCards });
    } catch (error: any) {
      console.error('Get user collection error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to get user collection' });
    }
  }

  async addCardToCollection(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.userId;
      const { cardId, quantity = 1 } = req.body;

      if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });
      if (!cardId) return res.status(400).json({ success: false, message: 'Card ID is required' });

      const userCard = await this.cardService.addCardToUser({ userId, cardId, quantity });
      return res.status(201).json({ success: true, message: 'Card added to collection successfully', data: userCard });
    } catch (error: any) {
      console.error('Add card to collection error:', error);
      return res.status(400).json({ success: false, message: error.message || 'Failed to add card to collection' });
    }
  }

  async removeCardFromCollection(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.userId;
      const { cardId } = req.params;

      if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });
      if (!cardId) return res.status(400).json({ success: false, message: 'Card ID is required' });

      const removed = await this.cardService.removeCardFromUser(userId, cardId);
      if (!removed) return res.status(404).json({ success: false, message: 'Card not found in user collection' });

      return res.status(200).json({ success: true, message: 'Card removed from collection successfully' });
    } catch (error: any) {
      console.error('Remove card from collection error:', error);
      return res.status(400).json({ success: false, message: error.message || 'Failed to remove card from collection' });
    }
  }

  async updateCardQuantity(req: Request, res: Response): Promise<Response> {
  try {
    const userCardId = req.params.userCardId;
    const { quantity } = req.body;

    if (!userCardId) {
      return res.status(400).json({
        success: false,
        message: 'UserCard ID is required'
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const updatedUserCard = await this.cardService.updateUserCard(userCardId, quantity);

        if (!updatedUserCard) {
          return res.status(404).json({
            success: false,
            message: 'User card not found'
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Card quantity updated successfully',
          data: updatedUserCard
        });
      } catch (error: any) {
        console.error('Update card quantity error:', error);
        return res.status(400).json({
          success: false,
          message: error.message || 'Failed to update card quantity'
        });
      }
    }
}
