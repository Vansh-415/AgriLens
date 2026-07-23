import api from './api';
import type { LoginCredentials, RegisterData, AuthResponse } from '../types/auth';

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },
  
  register: async (data: RegisterData) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
  
  logout: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      await api.post('/auth/logout', { refresh_token: refreshToken });
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  forgotPassword: async (email: string) => {
    // Stub for future module
    return new Promise((resolve) => setTimeout(resolve, 1000, { email }));
  }
};
