// Роли пользователей
export enum UserRole {
  STUDENT = 'student',
  CONTENT_MANAGER = 'content_manager',
  GAME_ADMIN = 'game_admin',
  TECH_ADMIN = 'tech_admin',
}

// Права доступа (для детальной проверки)
export enum Permission {
  // Новости и контент
  MANAGE_NEWS = 'manage_news',
  MANAGE_CHALLENGES = 'manage_challenges',
  MODERATE_KNOWLEDGE = 'moderate_knowledge',
  MANAGE_EVENTS = 'manage_events',
  SEND_NOTIFICATIONS = 'send_notifications',
  
  // Управление игрой
  MANAGE_TEAMS = 'manage_teams',
  ADJUST_RATINGS = 'adjust_ratings',
  CONFIGURE_CRC = 'configure_crc',
  MANAGE_LEAGUES = 'manage_leagues',
  CONFIRM_HELP = 'confirm_help',
  VIEW_TEAM_VOTES = 'view_team_votes',
  
  // Техническое администрирование
  MANAGE_INTEGRATIONS = 'manage_integrations',
  MANAGE_USERS = 'manage_users',
  MANAGE_ACCESS = 'manage_access',
  CONFIGURE_SYSTEM = 'configure_system',
  BACKUP_SYSTEM = 'backup_system',
  VIEW_SYSTEM_LOGS = 'view_system_logs',
  
  // Базовые права
  VIEW_PROFILE = 'view_profile',
  EDIT_PROFILE = 'edit_profile',
}

// Маппинг ролей на права
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.STUDENT]: [
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
    // Студенты не имеют прав на администрирование
  ],
  
  [UserRole.CONTENT_MANAGER]: [
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
    Permission.MANAGE_NEWS,
    Permission.MANAGE_CHALLENGES,
    Permission.MODERATE_KNOWLEDGE,
    Permission.MANAGE_EVENTS,
    Permission.SEND_NOTIFICATIONS,
  ],
  
  [UserRole.GAME_ADMIN]: [
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
    Permission.MANAGE_TEAMS,
    Permission.ADJUST_RATINGS,
    Permission.CONFIGURE_CRC,
    Permission.MANAGE_LEAGUES,
    Permission.CONFIRM_HELP,
    Permission.VIEW_TEAM_VOTES,
  ],
  
  [UserRole.TECH_ADMIN]: [
    // Все права
    ...Object.values(Permission),
  ],
};

// Типы для API ответов
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  studentId?: string; // Только для студентов
  createdAt: string;
  lastLogin?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}