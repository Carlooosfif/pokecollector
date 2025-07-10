import { IAlbumService } from '../interfaces/IAlbumService';
import { IAlbum, ICreateAlbum } from '../../models/interfaces/IAlbum';
import { IAlbumRepository } from '../../repositories/interfaces/IAlbumRepository';
import { RepositoryFactory } from '../../factories/RepositoryFactory';

export class AlbumService implements IAlbumService {
  private albumRepository: IAlbumRepository;

  constructor() {
    // Aplicando Dependency Inversion Principle (DIP)
    this.albumRepository = RepositoryFactory.createAlbumRepository();
  }

  async getAlbumById(id: string): Promise<IAlbum | null> {
    try {
      return await this.albumRepository.findById(id);
    } catch (error) {
      console.error('Error getting album by ID:', error);
      throw new Error('Failed to get album');
    }
  }

  async getAlbumsByGeneration(generation: number): Promise<IAlbum[]> {
    try {
      return await this.albumRepository.findByGeneration(generation);
    } catch (error) {
      console.error('Error getting albums by generation:', error);
      throw new Error('Failed to get albums');
    }
  }

  async createAlbum(albumData: ICreateAlbum): Promise<IAlbum> {
    try {
      // Validar datos del álbum
      this.validateAlbumData(albumData);
      
      return await this.albumRepository.create(albumData);
    } catch (error) {
      console.error('Error creating album:', error);
      throw error;
    }
  }

  async updateAlbum(id: string, albumData: Partial<ICreateAlbum>): Promise<IAlbum | null> {
    try {
      // Verificar que el álbum existe
      const existingAlbum = await this.albumRepository.findById(id);
      if (!existingAlbum) {
        throw new Error('Album not found');
      }

      return await this.albumRepository.update(id, albumData);
    } catch (error) {
      console.error('Error updating album:', error);
      throw error;
    }
  }

  async deleteAlbum(id: string): Promise<boolean> {
    try {
      // Verificar que el álbum existe
      const existingAlbum = await this.albumRepository.findById(id);
      if (!existingAlbum) {
        throw new Error('Album not found');
      }

      return await this.albumRepository.delete(id);
    } catch (error) {
      console.error('Error deleting album:', error);
      throw error;
    }
  }

  async getAllAlbums(): Promise<IAlbum[]> {
    try {
      return await this.albumRepository.findAll();
    } catch (error) {
      console.error('Error getting all albums:', error);
      throw new Error('Failed to get albums');
    }
  }

  private validateAlbumData(albumData: ICreateAlbum): void {
    // Validar nombre
    if (!albumData.name || albumData.name.trim().length < 3) {
      throw new Error('Album name must be at least 3 characters long');
    }

    if (albumData.name.length > 100) {
      throw new Error('Album name cannot exceed 100 characters');
    }

    // Validar generación
    if (!albumData.generation || albumData.generation < 1) {
      throw new Error('Generation must be a positive number');
    }

    if (albumData.generation > 10) {
      throw new Error('Generation cannot exceed 10');
    }

    // Validar URL de imagen si se proporciona
    if (albumData.imageUrl) {
      const urlRegex = /^https?:\/\/.+/;
      if (!urlRegex.test(albumData.imageUrl)) {
        throw new Error('Invalid image URL format');
      }
    }
  }
}