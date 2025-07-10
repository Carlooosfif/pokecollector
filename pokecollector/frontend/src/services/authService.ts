import { apiService } from './api';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth';

export class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/login', credentials);
      if (response.success && response.data) {
        // Guardar token y datos del usuario en localStorage
        localStorage.setItem('pokecollector_token', response.data.token);
        localStorage.setItem('pokecollector_user', JSON.stringify(response.data.user));
        return response.data;
      }
      throw new Error(response.message || 'Error en el login');
    } catch (error: any) {
      throw new Error(apiService.handleApiError(error));
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/register', userData);
      if (response.success && response.data) {
        // Guardar token y datos del usuario en localStorage
        localStorage.setItem('pokecollector_token', response.data.token);
        localStorage.setItem('pokecollector_user', JSON.stringify(response.data.user));
        return response.data;
      }
      throw new Error(response.message || 'Error en el registro');
    } catch (error: any) {
      throw new Error(apiService.handleApiError(error));
    }
  }

  async validateToken(): Promise<{ userId: string; role: string } | null> {
    try {
      const response = await apiService.get<{ userId: string; role: string }>('/auth/validate');
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      this.logout();
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('pokecollector_token');
    localStorage.removeItem('pokecollector_user');
  }

  getStoredUser(): any {
    const user = localStorage.getItem('pokecollector_user');
    return user ? JSON.parse(user) : null;
  }

  getStoredToken(): string | null {
    return localStorage.getItem('pokecollector_token');
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
}

export const authService = new AuthService();