// hooks/useChallenges.ts
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { challengesApi } from '../api/challenges';
import type { CreateChallengeData, Challenge } from '../types/challenge.types';

export const challengesKeys = {
  all: ['challenges'] as const,
  list: ['challenges', 'list'] as const,
};

interface ChallengesApiResponse {
  challenges: Challenge[];
  has_more: boolean;
  total: number;
}

interface ChallengesPage {
  challenges: Challenge[];
  hasMore: boolean;
  total: number;
}

export function useChallengesList() {
  return useInfiniteQuery<ChallengesPage>({
    queryKey: challengesKeys.list,
    queryFn: async ({ pageParam = 0 }) => {
      const response = await challengesApi.getChallengesList({
        offset: pageParam as number,
        limit: 5,
      });

      const data = response.data;

      if (Array.isArray(data)) {
        return {
          challenges: data,
          hasMore: data.length === 5,
          total: data.length,
        };
      }

      const typedData = data as ChallengesApiResponse;
      return {
        challenges: typedData.challenges || [],
        hasMore: typedData.has_more || false,
        total: typedData.total || 0,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasMore) {
        return allPages.length * 5;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
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
