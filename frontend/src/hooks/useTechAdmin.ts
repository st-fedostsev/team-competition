// hooks/useTechAdmin.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/techadmin';
import type { RegisterUserData, BanUserData, EditRatingData, SearchUsersParams, UserRole} from '../types/techadmin.types';
import { useCurrentUser } from './useAuth';

export const adminKeys = {
  all: ['admin'] as const,
  users: ['admin', 'users'] as const,
};

// Хук для получения пользователей с пагинацией
export function useAdminUsers(searchQuery?: string, roles?: UserRole[], limit: number = 5, offset: number = 0) {
    const { data: user } = useCurrentUser();
  return useQuery({
    queryKey: [...adminKeys.users, searchQuery, roles, limit, offset],
    queryFn: async () => {
      const params: SearchUsersParams = {
        limit: limit,
        offset: offset,
        query: searchQuery || ''
      };
      
      if (roles && roles.length > 0) {
        params.roles = roles;
      } else {
        params.roles = ['student', 'content_manager', 'game_admin', 'technical_admin'];
      }
      
      const response = await adminApi.searchUsers(params);
      
      // Формат ответа: { count: number, users: User[] }
      const data = response.data
      
      return {
        users: data.result || [],
        count: data.count || 0,
      };
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2,
  });
}


// Хук для регистрации пользователя
export function useRegisterUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterUserData) => adminApi.registerUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users });
    },
  });
}

// Хук для блокировки/разблокировки пользователя
export function useBanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BanUserData) => adminApi.banUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users });
    },
  });
}

// Хук для редактирования рейтинга
export function useEditRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EditRatingData) => adminApi.editRating(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users });
    },
  });
}

export function useImportUsers() {
  return useMutation({
    mutationFn: (file: File) => adminApi.importUsers(file),
  });
}