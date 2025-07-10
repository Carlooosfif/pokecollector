import { IAlbum, ICreateAlbum } from '../../models/interfaces/IAlbum';

export interface IAlbumRepository {
  findById(id: string): Promise<IAlbum | null>;
  findByGeneration(generation: number): Promise<IAlbum[]>;
  create(albumData: ICreateAlbum): Promise<IAlbum>;
  update(id: string, albumData: Partial<ICreateAlbum>): Promise<IAlbum | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<IAlbum[]>;
  updateTotalCards(id: string, totalCards: number): Promise<boolean>;
}