// hooks/useTeam.ts
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { teamApi } from '../api/team';
import { useCurrentUser } from './useAuth';
import { useAuthStore } from '../stores/authStore';

import type {
  CreateTeamData,
  JoinTeamData,
  SearchTeamsResponse,
  Team,
} from '../types/team.types';
import { useNavigate } from 'react-router-dom';

export const teamKeys = {
  all: ['team'] as const,
  my: ['team', 'my'] as const,
  byId: (id: number) => ['team', id] as const,
  leaderboard: ['team', 'leaderboard'] as const,
  search: (query: string, limit: number, offset: number) => 
    ['team', 'search', query, limit, offset] as const,
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

// Хук для получения команды по ID
export function useTeamById(teamId: number | null | undefined) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: teamKeys.byId(teamId!),
    queryFn: async () => {
      const response = await teamApi.getTeamById(teamId!);
      return response.data;
    },
    enabled: !!accessToken && !!teamId,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

// Хук для получения нескольких команд по ID
export function useTeamsByIds(teamIds: number[]) {
  return useQueries({
    queries: teamIds.map(teamId => ({
      queryKey: teamKeys.byId(teamId),
      queryFn: async () => {
        const response = await teamApi.getTeamById(teamId);
        return response.data;
      },
      enabled: !!teamId,
      staleTime: 1000 * 60 * 5,
    })),
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
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => teamApi.leaveTeam(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.my });
      refetchUser();
      navigate('/ProfileStudentPage');
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

// Хук для регенерации кода приглашения
export function useRegenerateCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => teamApi.regenerateCode(),
    onSuccess: (response) => {
      queryClient.setQueryData<Team>(teamKeys.my, (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            secret_code: response.data.secret_code,
          };
        }
        return oldData;
      });
    },
  });
}

// Хук для поиска команды
export function useSearchTeams(query: string, limit: number = 20, offset: number = 0) {
  const { data: currentUser } = useCurrentUser();
  
  return useQuery({
    queryKey: teamKeys.search(query, limit, offset),
    queryFn: async () => {
      const response = await teamApi.searchTeam({
        query,
        limit,
        offset,
      });
      const data = response.data as SearchTeamsResponse;
      return {
        result: data.result || [],
        count: data.count || 0,
      };
    },
    enabled: !!currentUser,
    staleTime: 1000 * 60 * 2,
  });
}

// Хук для получения лидерборда
export function useTeamLeaderboard(limit: number = 20, offset: number = 0) {
  const { data: currentUser } = useCurrentUser();
  
  return useQuery({
    queryKey: [...teamKeys.leaderboard, limit, offset],
    queryFn: async () => {
      const response = await teamApi.getLeaderboard();
      const data = response.data as SearchTeamsResponse;
      return {
        result: data.result || [],
        count: data.count || 0,
      };
    },
    enabled: !!currentUser,
    staleTime: 1000 * 60 * 2,
  });
}

// Хук для кика участника (только капитан)
export function useKickMember() {
  const queryClient = useQueryClient();
  const { refetch: refetchUser } = useCurrentUser();

  return useMutation({
    mutationFn: (userId: number) => teamApi.kickMember(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.my });
      refetchUser();
    },
  });
}
