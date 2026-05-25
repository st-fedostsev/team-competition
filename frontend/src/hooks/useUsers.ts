// hooks/useUsers.ts
import { useQuery, useQueries } from '@tanstack/react-query';
import { usersApi } from '../api/users';

export const userKeys = {
  all: ['users'] as const,
  byId: (id: number) => ['users', id] as const,
};

// Хук для получения одного пользователя по ID
export function useUserById(userId: number | null) {
  return useQuery({
    queryKey: userKeys.byId(userId!),
    queryFn: async () => {
      const response = await usersApi.getUserById(userId!);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}

// Хук для получения нескольких пользователей по ID
export function useUsersByIds(userIds: number[]) {
  return useQueries({
    queries: userIds.map((id) => ({
      queryKey: userKeys.byId(id),
      queryFn: async () => {
        const response = await usersApi.getUserById(id);
        return response.data;
      },
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
    })),
  });
}