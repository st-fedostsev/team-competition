// hooks/useAchievements.ts
import { useQuery } from '@tanstack/react-query';
import { achievementsApi } from '../api/achievements';
import type { AchievementWithStatus } from '../types/achievement.types';

// Тип для полученного достижения пользователя
interface UserAchievementItem {
  id?: number;
  user_id?: number;
  title: string;
  description: string;
  earned_at?: string;
}

export const achievementKeys = {
  all: ['achievements'] as const,
  my: ['achievements', 'my'] as const,
  allTemplates: ['achievements', 'all'] as const,
  rating: ['achievements', 'rating'] as const,
};

// Хук для получения достижений пользователя (полученные)
export function useMyAchievements() {
  return useQuery({
    queryKey: achievementKeys.my,
    queryFn: async () => {
      const response = await achievementsApi.getMyAchievements();
      const data = response.data;
      // Если ответ - объект, преобразуем в массив
      return Array.isArray(data) ? data : Object.values(data);
    },
    staleTime: 1000 * 60 * 5,
  });
}

// Хук для получения всех достижений (шаблоны)
export function useAllAchievements() {
  return useQuery({
    queryKey: achievementKeys.allTemplates,
    queryFn: async () => {
      const response = await achievementsApi.getAllAchievements();
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}


// Объединяем полученные достижения с шаблонами
export function useAchievementsWithStatus() {
  const { data: userAchievements, isLoading: userLoading } = useMyAchievements();
  const { data: allAchievements, isLoading: allLoading } = useAllAchievements();

  const isLoading = userLoading || allLoading;

  const achievementsWithStatus: AchievementWithStatus[] = [];

  if (!isLoading && userAchievements && allAchievements) {
    const userAchievementsArray = userAchievements as UserAchievementItem[];
    const allAchievementsObj = allAchievements as Record<string, { title: string; description: string }>;
    
    // Создаём Set полученных достижений
    const receivedSet = new Set(userAchievementsArray.map((a) => a.title));
    
    // Проходим по всем шаблонам
    for (const [key, template] of Object.entries(allAchievementsObj)) {
      const isReceived = receivedSet.has(template.title);
      const userAchievement = userAchievementsArray.find((a) => a.title === template.title);
      
      achievementsWithStatus.push({
        key,
        title: template.title,
        description: template.description,
        is_received: isReceived,
        earned_at: userAchievement?.earned_at,
        earned_at_formatted: userAchievement?.earned_at 
          ? new Date(userAchievement.earned_at).toLocaleDateString()
          : undefined,
      });
    }
  }

  return { data: achievementsWithStatus, isLoading };
}