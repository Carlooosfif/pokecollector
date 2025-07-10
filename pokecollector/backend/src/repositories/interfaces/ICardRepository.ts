import { ICard, ICreateCard } from '../../models/interfaces/ICard';

export interface ICardRepository {
  findById(id: string): Promise<ICard | null>;
  findByAlbum(albumId: string): Promise<ICard[]>;
  findByNumber(albumId: string, number: number): Promise<ICard | null>;
  create(cardData: ICreateCard): Promise<ICard>;
  update(id: string, cardData: Partial<ICreateCard>): Promise<ICard | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<ICard[]>;
}