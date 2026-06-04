// hooks/useTechAdmin.ts
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/techadmin';
import type { RegisterUserData, BanUserData, EditRatingData, SearchUsersParams, UserRole} from '../types/techadmin.types';

export const adminKeys = {
  all: ['admin'] as const,
  users: ['admin', 'users'] as const,
};

// Хук для поиска пользователей (с пагинацией)
export function useAdminUsers(searchQuery?: string, roles?: UserRole[]) {
  return useInfiniteQuery({
    queryKey: [...adminKeys.users, searchQuery, roles],
    queryFn: async ({ pageParam = 0 }) => {
      const params: SearchUsersParams = {
        limit: 20,
        offset: pageParam as number,
        query: searchQuery || ''
      };
      
      if (roles && roles.length > 0) {
        params.roles = roles;
      } else {
        params.roles = ['student', 'content_manager', 'game_admin', 'technical_admin'];
      }
      
      const response = await adminApi.searchUsers(params);
      
      // response.data - это массив пользователей
      const users = response.data;
      
      return {
        users: users,
        hasMore: users.length === 20,
        total: users.length,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasMore) {
        return allPages.length * 20;
      }
      return undefined;
    },
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