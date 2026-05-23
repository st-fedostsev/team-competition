// types/achievement.types.ts

// Достижение из общего списка
export interface AchievementTemplate {
  title: string;
  description: string;
}

export type AchievementsTemplateMap = {
  [key: string]: AchievementTemplate;
};

// Полученное достижение пользователя
export interface UserAchievement {
  id: number;
  user_id: number;
  title: string;
  description: string;
  earned_at: string;
}

// Для отображения с флагом получено/не получено
export interface AchievementWithStatus {
  key: string;
  title: string;
  description: string;
  is_received: boolean;
  earned_at?: string;
  earned_at_formatted?: string;
}