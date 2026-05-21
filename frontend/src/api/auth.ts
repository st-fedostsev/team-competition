// api/endpoints/auth.ts
import { apiClient } from './client';
import type {
  StudentLoginCredentials,
  AuthResponse,
  User,
} from '../types/auth.types';

export const authApi = {
  // Вход студента (не требует авторизации)
  loginStudent: (credentials: StudentLoginCredentials) =>
    apiClient.post<AuthResponse>('/api/users/login', credentials),

  // Получение информации о пользователе (требует авторизации - токен добавится автоматически)
  getCurrentUser: () => apiClient.get<User>('/api/users/me'),

  // Выход (не требует авторизации)
  logout: () => apiClient.post('/api/auth/logout'),

  // Обновление токена (не требует авторизации)
  refreshToken: (refreshToken: string) =>
    apiClient.post<{ access_token: string }>('/api/auth/refresh', {
      refresh_token: refreshToken,
    }),
};
