import { ICard, ICreateCard } from '../../models/interfaces/ICard';
import { IUserCard, ICreateUserCard } from '../../models/interfaces/IUserCard';

export interface ICardService {
  getCardById(id: string): Promise<ICard | null>;
  getCardsByAlbum(albumId: string): Promise<ICard[]>;
  createCard(cardData: ICreateCard): Promise<ICard>;
  updateCard(id: string, cardData: Partial<ICreateCard>): Promise<ICard | null>;
  deleteCard(id: string): Promise<boolean>;
  getAllCards(): Promise<ICard[]>;
  
  // Métodos para la colección de usuarios
  getUserCards(userId: string): Promise<IUserCard[]>;
  addCardToUser(userCardData: ICreateUserCard): Promise<IUserCard>;
  removeCardFromUser(userId: string, cardId: string): Promise<boolean>;
  updateUserCard(userCardId: string, quantity: number): Promise<IUserCard | null>;
}