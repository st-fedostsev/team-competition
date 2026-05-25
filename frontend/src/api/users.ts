// api/users.ts
import { apiClient } from './client';
import type { User } from '../types/auth.types';

export const usersApi = {
  // Получить пользователя по ID
  getUserById: (userId: number) =>
    apiClient.post<User>('/api/users/get', { id: userId }),
};