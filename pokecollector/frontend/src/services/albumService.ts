import { apiService } from './api';
import { Album, CreateAlbumRequest } from '@/types/album';

export class AlbumService {
  async getAllAlbums(): Promise<Album[]> {
    try {
      const response = await apiService.get<Album[]>('/albums');
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Error obteniendo álbumes');
    } catch (error: any) {
      throw new Error(apiService.handleApiError(error));
    }
  }

  async getAlbumById(id: string): Promise<Album> {
    try {
      const response = await apiService.get<Album>(`/albums/${id}`);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Error obteniendo el álbum');
    } catch (error: any) {
      throw new Error(apiService.handleApiError(error));
    }
  }

  async createAlbum(albumData: CreateAlbumRequest): Promise<Album> {
    try {
      const response = await apiService.post<Album>('/albums', albumData);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Error creando el álbum');
    } catch (error: any) {
      throw new Error(apiService.handleApiError(error));
    }
  }

  async updateAlbum(id: string, albumData: Partial<CreateAlbumRequest>): Promise<Album> {
    try {
      const response = await apiService.put<Album>(`/albums/${id}`, albumData);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Error actualizando el álbum');
    } catch (error: any) {
      throw new Error(apiService.handleApiError(error));
    }
  }

  async deleteAlbum(id: string): Promise<void> {
    try {
      const response = await apiService.delete(`/albums/${id}`);
      if (!response.success) {
        throw new Error(response.message || 'Error eliminando el álbum');
      }
    } catch (error: any) {
      throw new Error(apiService.handleApiError(error));
    }
  }
}

export const albumService = new AlbumService();