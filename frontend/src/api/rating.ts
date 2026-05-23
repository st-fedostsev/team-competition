// api/endpoints/rating.ts
import { apiClient } from './client';
import type {
  LeaderboardRequest,
  LeaderboardResponse,
} from '../types/rating.types';

export const ratingApi = {
  // Получить лидерборд
  getLeaderboard: (params: LeaderboardRequest) =>
    apiClient.post<LeaderboardResponse>('/api/users/leaderboard', params),
};
