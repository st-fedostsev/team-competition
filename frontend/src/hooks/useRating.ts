// hooks/useRating.ts
import { useQuery } from '@tanstack/react-query';
import { ratingApi } from '../api/rating';
import { useCurrentUser } from './useAuth';
import type { LeaderboardTeam, LeaderboardUser, LeaderboardResponse } from '../types/leaderboard.types';

export const ratingKeys = {
  all: ['rating'] as const,
  users: ['rating', 'users'] as const,
  teams: ['rating', 'teams'] as const,
};


  // Хук для получения лидерборда с пагинацией
  export function useLeaderboard<T = LeaderboardUser | LeaderboardTeam>(
    type: 'users' | 'teams',
    query: string,
    limit: number = 10,
    offset: number = 0
  ) {
    const { data: currentUser } = useCurrentUser();
    const getLeaderboard = type === 'users' 
      ? ratingApi.getUsersLeaderboard 
      : ratingApi.getTeamsLeaderboard;
    
    return useQuery({
      queryKey: [type === 'users' ? 'users-leaderboard' : 'teams-leaderboard', query, limit, offset],
      queryFn: async () => {
        const params: {
          offset: number;
          limit: number;
          query: string;
        } = {
          offset: offset,
          limit: limit,
          query: query || '',
        };
        
        const response = await getLeaderboard(params);
        
        // Формат ответа: { count: number, result: T[] }
        const data = response.data as { count: number; result: T[] };
        const result = data.result || [];
        const count = data.count || 0;
        
        const itemsWithPosition = result.map((item, index) => ({
          ...item,
          position: offset + index + 1,
        }));
        
        return {
          result: itemsWithPosition,
          count: count,
        };
      },
      enabled: !!currentUser,
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
      
      const data = response.data as { count: number; result: LeaderboardUser[] };
      const users = data.result || [];
      
      // Сортируем по personal_rating (по убыванию)
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

// Хук для получения текущей позиции команды
export function useTeamPosition(teamId: number) {
  return useQuery({
    queryKey: ['team', 'position', teamId],
    queryFn: async () => {
      const response = await ratingApi.getTeamsLeaderboard({ offset: 0, limit: 1000, query: '' });
      const data = response.data as LeaderboardResponse;
      const teams = data.result || [];
      const position = teams.findIndex(t => t.id === teamId) + 1;
      return { position, total: teams.length };
    },
    enabled: !!teamId,
  });
}