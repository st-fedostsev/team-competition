// types/techadmin.types.ts

export interface User {
  id: number;
  last_name: string;
  first_name: string;
  patronymic?: string;
  student_id?: number | null;
  login?: string | null;
  role: 'student' | 'content_manager' | 'game_admin' | 'technical_admin';
  personal_rating?: number;
  team_name?: string;
  team_id?: number | null;
  is_blocked: boolean;
  created_at: string;
}

export interface RegisterUserData {
  last_name: string;
  first_name: string;
  patronymic?: string;
  student_id?: number;
  user_role: 'student' | 'content_manager' | 'game_admin' | 'technical_admin';
  login?: string;
  password?: string;
  personal_rating?: number;
}

export interface BanUserData {
  user_id: number;
  ban: boolean;
}

export interface EditRatingData {
  user_id: number;
  new_rating: number;
}

export type UserRole = 'student' | 'content_manager' | 'game_admin' | 'technical_admin';

export interface SearchUsersRequest {
  query?: string;
  roles?: UserRole[];
  limit: number;
  offset: number;
}

export interface SearchUsersParams {
  limit: number;
  offset: number;
  query?: string;
  roles?: UserRole[];
}

export type SearchUsersResponse = User[];