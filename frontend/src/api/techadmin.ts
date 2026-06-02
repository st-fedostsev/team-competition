// api/techadmin.ts
import { apiClient } from './client';
import type { 
  User, 
  RegisterUserData, 
  BanUserData, 
  EditRatingData,
  SearchUsersRequest,
  SearchUsersResponse
} from '../types/techadmin.types';

export const adminApi = {
  // Поиск пользователей
  searchUsers: (params: SearchUsersRequest) =>
    apiClient.post<SearchUsersResponse>('/api/users/search', params),

  // Зарегистрировать пользователя
  registerUser: (data: RegisterUserData) =>
    apiClient.post<User>('/api/users/register', data),

  // Заблокировать/разблокировать пользователя
  banUser: (data: BanUserData) =>
    apiClient.post('/api/technical_admin/ban', data),

  // Редактировать рейтинг пользователя
  editRating: (data: EditRatingData) =>
    apiClient.post('/api/technical_admin/edit_rating', data),
};