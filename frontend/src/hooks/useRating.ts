// hooks/useRating.ts
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ratingApi } from '../api/rating';
import { useCurrentUser } from './useAuth';
import type { LeaderboardPage, LeaderboardTeam, LeaderboardUser } from '../types/leaderboard.types';

export const ratingKeys = {
  all: ['rating'] as const,
  users: ['rating', 'users'] as const,
  teams: ['rating', 'teams'] as const,
};



// Универсальный хук для бесконечной загрузки лидерборда
export function useLeaderboard<T = LeaderboardUser | LeaderboardTeam>(
  type: 'users' | 'teams',
  query?: string,
  topOnly?: boolean
) {
  const getLeaderboard = type === 'users' 
    ? ratingApi.getUsersLeaderboard 
    : ratingApi.getTeamsLeaderboard;
  
  return useInfiniteQuery<LeaderboardPage<T>>({
    queryKey: [type === 'users' ? 'users-leaderboard' : 'teams-leaderboard', query, topOnly],
    queryFn: async ({ pageParam = 0 }) => {
      const params: {
        offset: number;
        limit: number;
        query: string;
        top_only?: boolean;
      } = {
        offset: pageParam as number,
        limit: 20,
        query: query || '', // ✅ Всегда передаём строку (пустую или с текстом)
      };
      
      if (topOnly) {
        params.top_only = true;
      }
      
      const response = await getLeaderboard(params);
      const items = response.data as unknown as T[];
      
      const itemsWithPosition = items.map((item, index) => ({
        ...item,
        position: (pageParam as number) + index + 1,
      }));
      
      return {
        items: itemsWithPosition,
        hasMore: items.length === 20,
        total: itemsWithPosition.length,
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

// Хук для получения позиции текущего пользователя
export function useUserRatingPosition() {
  const { data: user } = useCurrentUser();

  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ratingKeys.users,
    queryFn: async () => {
      const response = await ratingApi.getUsersLeaderboard({
        offset: 0,
        limit: 1000,
        query: '', 
      });
      const users = response.data as unknown as LeaderboardUser[];

      const sorted = [...users].sort(
        (a, b) => b.personal_rating - a.personal_rating,
      );

      const userPosition = sorted.findIndex((u) => u.id === user?.id) + 1;

      return {
        position: userPosition > 0 ? userPosition : null,
        total: sorted.length,
      };
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2,
  });

  return {
    position: leaderboardData?.position || null,
    total: leaderboardData?.total || 0,
    rating: user?.personal_rating || 0,
    isLoading,
  };
}