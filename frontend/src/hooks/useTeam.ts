// hooks/useTeam.ts
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { teamApi, type ReviewRequestData } from '../api/team';
import { useCurrentUser } from './useAuth';
import { useAuthStore } from '../stores/authStore';

import type {
  CreateTeamData,
  JoinTeamData,
  SearchTeamsResponse,
  Team,
} from '../types/team.types';
import { useNavigate } from 'react-router-dom';
import type { ApiError } from '../types/error.types';

export const teamKeys = {
  all: ['team'] as const,
  my: ['team', 'my'] as const,
  byId: (id: number) => ['team', id] as const,
  leaderboard: ['team', 'leaderboard'] as const,
  search: (query: string, limit: number, offset: number) => 
    ['team', 'search', query, limit, offset] as const,
  joinRequests: () => [...teamKeys.all, 'join-requests'] as const,
  myVotes: () => [...teamKeys.all, 'my-votes'] as const,
  awaitingRequest: () => [...teamKeys.all, 'awaiting-request'] as const, 
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

// Передать капитанство
export const useTransferCaptain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => teamApi.transferCaptain(userId),
    onSuccess: () => {
      // Инвалидируем данные команды после смены капитана
      queryClient.invalidateQueries({ queryKey: ['team'] });
      queryClient.invalidateQueries({ queryKey: ['my-team'] });
    },
  });
};

// Переименовать команду
export const useRenameTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newName: string) => teamApi.renameTeam(newName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      queryClient.invalidateQueries({ queryKey: ['my-team'] });
    },
  });
};

// Голосование за участника
export const useVoteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, score }: { userId: number; score: number }) =>
      teamApi.voteUser(userId, score),
    onSuccess: () => {
      // Обновляем данные команды после голосования
      queryClient.invalidateQueries({ queryKey: ['team'] });
      queryClient.invalidateQueries({ queryKey: ['my-team'] });
    },
  });
};

export const useMyVotes = () => {
  return useQuery({
    queryKey: ['my-votes'],
    queryFn: async () => {
      const response = await teamApi.getMyVotes();
      return response.data;
    },
    staleTime: 1000 * 60, // 1 минута
  });
}

// Получить заявки на вступление (только для капитана)
export const useJoinRequests = () => {
  const { data: currentUser } = useCurrentUser();

  return useQuery({
    queryKey: teamKeys.joinRequests(),
    queryFn: async () => {
      const response = await teamApi.getJoinRequests();
      return response.data;
    },
    enabled: !!currentUser,
    staleTime: 1000 * 30,
  });
};


// Хук для рассмотрения заявки (изменение статуса)
export const useReviewJoinRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReviewRequestData) => teamApi.reviewJoinRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['join-requests'] });
      queryClient.invalidateQueries({ queryKey: ['my-team'] });
      queryClient.invalidateQueries({ queryKey: ['team'] });
    },
  });
};

// Отправить заявку на вступление в команду
export const useRequestJoin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teamId: number) => teamApi.requestJoin(teamId),
    onSuccess: () => {
      alert('Заявка на вступление отправлена!');
      queryClient.invalidateQueries({ queryKey: ['my-team'] });
    },
    onError: (error: ApiError) => {
      const message = error.response?.data?.msg || error.response?.data?.message || 'Ошибка при отправке заявки';
      alert(message);
    },
  });
};


// Хук для отмены заявки на вступление в команду
export const useCancelJoinRequest = () => {
  const queryClient = useQueryClient();
  const { refetch: refetchUser } = useCurrentUser();

  return useMutation({
    mutationFn: async () => {
      const response = await teamApi.cancelJoinRequest();
      return response.data;
    },
    onSuccess: () => {
      // Инвалидируем связанные запросы
      queryClient.invalidateQueries({ queryKey: teamKeys.my });
      queryClient.invalidateQueries({ queryKey: teamKeys.awaitingRequest() });
      queryClient.invalidateQueries({ queryKey: ['my-team'] });
      refetchUser();
      alert('Заявка успешно отменена');
    },
    onError: (error: ApiError) => {
      const message = error.response?.data?.msg || error.response?.data?.message || 'Ошибка при отмене заявки';
      alert(message);
    },
  });
};

// Хук для получения текущей ожидающей заявки (команда, куда подана заявка)
export const useAwaitingRequest = () => {
  const { data: currentUser } = useCurrentUser();
  const accessToken = useAuthStore((state) => state.accessToken);
  
  // Проверяем, есть ли у пользователя team_id (если есть - он уже в команде)
  const hasTeam = currentUser?.team_id !== null && currentUser?.team_id !== undefined;

  return useQuery({
    queryKey: teamKeys.awaitingRequest(),
    queryFn: async () => {
      const response = await teamApi.getAwaitingRequest();
      return response.data; // Возвращает JoinRequest или null
    },
    enabled: !!accessToken && !hasTeam, // Запрос только если нет команды
    staleTime: 1000 * 30, // 30 секунд
    retry: false,
  });
};

// Optional: Хук для проверки, есть ли активная заявка (упрощенный вариант)
export const useHasActiveRequest = () => {
  const { data: awaitingRequest, isLoading } = useAwaitingRequest();
  
  return {
    hasActiveRequest: !!awaitingRequest,
    awaitingRequest,
    isLoading,
  };
};

// Optional: Хук для получения информации о команде, куда подана заявка
export const useRequestedTeam = () => {
  const { data: awaitingRequest } = useAwaitingRequest();
  
  return useQuery({
    queryKey: ['team', 'requested', awaitingRequest?.team_id],
    queryFn: async () => {
      if (!awaitingRequest?.team_id) return null;
      const response = await teamApi.getTeamById(awaitingRequest.team_id);
      return response.data;
    },
    enabled: !!awaitingRequest?.team_id,
    staleTime: 1000 * 60,
  });
};