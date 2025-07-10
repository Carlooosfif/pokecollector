import { IAlbum, ICreateAlbum } from '../../models/interfaces/IAlbum';

export interface IAlbumService {
  getAlbumById(id: string): Promise<IAlbum | null>;
  getAlbumsByGeneration(generation: number): Promise<IAlbum[]>;
  createAlbum(albumData: ICreateAlbum): Promise<IAlbum>;
  updateAlbum(id: string, albumData: Partial<ICreateAlbum>): Promise<IAlbum | null>;
  deleteAlbum(id: string): Promise<boolean>;
  getAllAlbums(): Promise<IAlbum[]>;
}