// hooks/useTeam.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { teamApi } from '../api/team';
import { useCurrentUser } from './useAuth';
import { useAuthStore } from '../stores/authStore';

import type {
  CreateTeamData,
  JoinTeamData,
  SearchTeamData,
  Team,
} from '../types/team.types';

export const teamKeys = {
  all: ['team'] as const,
  my: ['team', 'my'] as const,
  leaderboard: ['team', 'leaderboard'] as const,
  search: (query: string) => ['team', 'search', query] as const,
};

// Хук для получения своей команды
export function useMyTeam() {
  const { data: user } = useCurrentUser();
  const accessToken = useAuthStore((state) => state.accessToken);

  // Проверяем, есть ли у пользователя team_id
  const hasTeam = user?.team_id !== null && user?.team_id !== undefined;

  return useQuery({
    queryKey: teamKeys.my,
    queryFn: async () => {
      const response = await teamApi.getMyTeam();
      return response.data;
    },
    retry: false,
    throwOnError: false,
    // Запрос только если есть токен И есть team_id
    enabled: !!accessToken && hasTeam,
  });
}

// Хук для создания команды
export function useCreateTeam() {
  const queryClient = useQueryClient();
  const { refetch: refetchUser } = useCurrentUser(); // Обновляем данные пользователя
  return useMutation({
    mutationFn: (data: CreateTeamData) => teamApi.createTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.my });
      refetchUser();
    },
  });
}

// Хук для выхода из команды
export function useLeaveTeam() {
  const queryClient = useQueryClient();
  const { refetch: refetchUser } = useCurrentUser();
  return useMutation({
    mutationFn: () => teamApi.leaveTeam(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.my });
      refetchUser();
    },
  });
}

// Хук для присоединения к команде
export function useJoinTeam() {
  const queryClient = useQueryClient();
  const { refetch: refetchUser } = useCurrentUser();
  return useMutation({
    mutationFn: (data: JoinTeamData) => teamApi.joinTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.my });
      refetchUser();
    },
  });
}

// Хук для регенерации кода приглашения (исправленный)
export function useRegenerateCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => teamApi.regenerateCode(),
    onSuccess: (response) => {
      queryClient.setQueryData<Team>(teamKeys.my, (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            invite_code: response.data.invite_code,
          };
        }
        return oldData;
      });
    },
  });
}

// Хук для поиска команды
export function useSearchTeam() {
  return useMutation({
    mutationFn: (data: SearchTeamData) => teamApi.searchTeam(data),
  });
}

// Хук для получения лидерборда
export function useLeaderboard() {
  return useQuery({
    queryKey: teamKeys.leaderboard,
    queryFn: async () => {
      const response = await teamApi.getLeaderboard();
      return response.data;
    },
  });
}
