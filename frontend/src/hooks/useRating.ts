// hooks/useRating.ts
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ratingApi } from '../api/rating';
import { useCurrentUser } from './useAuth';

export const ratingKeys = {
  all: ['rating'] as const,
  leaderboard: ['rating', 'leaderboard'] as const,
};

interface LeaderboardUser {
  id: number;
  student_id: number | null;
  last_name: string;
  first_name: string;
  patronymic: string | null;
  role: string;
  team_id: number | null;
  is_captain: boolean;
  personal_rating: number;
  is_blocked: boolean;
  login: string | null;
  created_at: string;
}

interface LeaderboardPage {
  users: LeaderboardUser[];
  hasMore: boolean;
  total: number;
}

// Хук для бесконечной загрузки лидерборда
export function useLeaderboard(search?: string) {
  return useInfiniteQuery<LeaderboardPage>({
    queryKey: [...ratingKeys.leaderboard, search],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await ratingApi.getLeaderboard({
        offset: pageParam as number,
        limit: 20,
        search: search || undefined,
      });
      
      const users = response.data as unknown as LeaderboardUser[];
      
      const usersWithPosition = users.map((user, index) => ({
        ...user,
        position: (pageParam as number) + index + 1,
      }));
      
      return {
        users: usersWithPosition,
        hasMore: users.length === 20,
        total: usersWithPosition.length,
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
    queryKey: ratingKeys.leaderboard,
    queryFn: async () => {
      const response = await ratingApi.getLeaderboard({ offset: 0, limit: 1000 });
      const users = response.data as unknown as LeaderboardUser[];
      
      const sorted = [...users].sort((a, b) => b.personal_rating - a.personal_rating);
      
      const userPosition = sorted.findIndex(u => u.id === user?.id) + 1;
      
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