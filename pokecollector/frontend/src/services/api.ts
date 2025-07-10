import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiResponse, ApiError } from '@/types/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar token automáticamente
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('pokecollector_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para manejar respuestas y errores
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Si el token ha expirado, limpiarlo del localStorage
        if (error.response?.status === 401) {
          localStorage.removeItem('pokecollector_token');
          localStorage.removeItem('pokecollector_user');
          // Redirigir al login si estamos en el cliente
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos genéricos para llamadas HTTP
  async get<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.api.get(url);
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.api.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.api.put(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.api.delete(url);
    return response.data;
  }

  // Manejar errores de API
  handleApiError(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'Ha ocurrido un error inesperado';
  }
}

export const apiService = new ApiService();
