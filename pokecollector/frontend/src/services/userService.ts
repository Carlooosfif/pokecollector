import { apiService } from './api';
import { User, UpdateUserRequest, UserStats, RankingEntry } from '@/types/user';

export class UserService {
  async getProfile(): Promise<User> {
    try {
      const response = await apiService.get<User>('/users/profile');
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Error obteniendo el perfil');
    } catch (error: any) {
      throw new Error(apiService.handleApiError(error));
    }
  }

  async updateProfile(userData: UpdateUserRequest): Promise<User> {
    try {
      const response = await apiService.put<User>('/users/profile', userData);
      if (response.success && response.data) {
        // Actualizar usuario en localStorage
        localStorage.setItem('pokecollector_user', JSON.stringify(response.data));
        return response.data;
      }
      throw new Error(response.message || 'Error actualizando el perfil');
    } catch (error: any) {
      throw new Error(apiService.handleApiError(error));
    }
  }

  async getUserStats(): Promise<UserStats> {
    try {
      const response = await apiService.get<UserStats>('/users/stats');
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Error obteniendo estadísticas');
    } catch (error: any) {
      throw new Error(apiService.handleApiError(error));
    }
  }

  async getRanking(): Promise<RankingEntry[]> {
    try {
      const response = await apiService.get<RankingEntry[]>('/users/ranking');
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Error obteniendo el ranking');
    } catch (error: any) {
      throw new Error(apiService.handleApiError(error));
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const response = await apiService.get<User[]>('/users');
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Error obteniendo usuarios');
    } catch (error: any) {
      throw new Error(apiService.handleApiError(error));
    }
  }
}

export const userService = new UserService();