// api/endpoints/rating.ts
import { apiClient } from './client';
import type {
  LeaderboardRequest,
  LeaderboardResponse,
} from '../types/rating.types';

export const ratingApi = {
  // Получить лидерборд пользователей
  getUsersLeaderboard: (params: LeaderboardRequest & { query?: string; top_only?: boolean }) =>
    apiClient.post<LeaderboardResponse>('/api/users/leaderboard', params),
  
  // Получить лидерборд команд
  getTeamsLeaderboard: (params: LeaderboardRequest & { query?: string; top_only?: boolean }) =>
    apiClient.post<LeaderboardResponse>('/api/team/leaderboard', params),
};
