// hooks/useChallenges.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { challengesApi } from '../api/challenges';
import type { CreateChallengeData, ChallengesListResponse } from '../types/challenge.types';
import { useCurrentUser } from './useAuth';

export const challengesKeys = {
  all: ['challenges'] as const,
  list: ['challenges', 'list'] as const,
};



export function useChallengesList(limit: number = 5, offset: number = 0) {
  const { data: currentUser } = useCurrentUser();
  
  return useQuery({
    queryKey: [...challengesKeys.list, limit, offset],
    queryFn: async () => {
      const response = await challengesApi.getChallengesList({
        offset: offset,
        limit: limit,
      });

      const data = response.data as ChallengesListResponse;
      const challenges = data.result || [];
      const count = data.count || 0;

      return {
        result: challenges,
        count: count,
      };
    },
    enabled: !!currentUser,
    staleTime: 1000 * 60 * 5,
  });
}


// Хук для создания челленджа
export function useCreateChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateChallengeData) =>
      challengesApi.createChallenge(data),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: challengesKeys.list });
    },
  });
}

// хук для отправки отчёта с файлом
export function useSendChallengeReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      challengeId,
      comment,
      fileUrl,
    }: {
      challengeId: number;
      comment: string;
      fileUrl: string;
    }) => challengesApi.sendReport(challengeId, comment, fileUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: challengesKeys.list });
    },
  });
}
