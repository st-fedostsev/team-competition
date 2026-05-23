// hooks/useRating.ts
import { useQuery } from '@tanstack/react-query';
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

export function useUserRatingPosition() {
  const { data: user } = useCurrentUser();
  
  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ratingKeys.leaderboard,
    queryFn: async () => {
      const response = await ratingApi.getLeaderboard({ offset: 0, limit: 1000 });
      // response.data - это массив пользователей
      const users = response.data as unknown as LeaderboardUser[];
      
      // Сортируем по personal_rating (по убыванию)
      const sorted = [...users].sort((a, b) => b.personal_rating - a.personal_rating);
      
      // Находим позицию текущего пользователя
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