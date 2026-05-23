// types/auth.types.ts

export enum UserRole {
  STUDENT = 'student',
  CONTENT_MANAGER = 'content_manager',
  GAME_ADMIN = 'game_admin',
  TECH_ADMIN = 'technical_admin', 
}

// Креденшелы для входа студента
export interface StudentLoginCredentials {
  last_name: string;
  first_name: string;
  student_id: number;
}

// Ответ от сервера при успешном входе
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

// Обновленный тип User под реальный ответ сервера
export interface User {
  id: number;
  student_id: number;
  last_name: string;
  first_name: string;
  patronymic: string | null;
  role: 'student' | 'content_manager' | 'game_admin' | 'technical_admin';
  team_id: number | null;
  is_captain: boolean;
  personal_rating: number;
  is_blocked: boolean;
  login: string | null;
  created_at: string;
}