// api/endpoints/achievements.ts
import { apiClient } from './client';
import type {
  UserAchievement,
  AchievementsTemplateMap,
} from '../types/achievement.types';

export const achievementsApi = {
  // Получить достижения пользователя (полученные)
  getMyAchievements: () =>
    apiClient.get<UserAchievement[]>('/api/users/my_achievements'),

  // Получить все достижения (шаблоны)
  getAllAchievements: () =>
    apiClient.get<AchievementsTemplateMap>('/api/users/all_achievements'),
};
