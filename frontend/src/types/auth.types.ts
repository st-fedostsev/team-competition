// types/auth.types.ts

// Креденшелы для входа студента
export interface StudentLoginCredentials {
  last_name: string;
  first_name: string;
  student_id: number;
}

// Ответ от сервера при успешном входе (как в вашем API)
export interface AuthResponse {
  access_token: string;  // ← обратите внимание: snake_case
  refresh_token: string; // ← как в ответе сервера
}

// Пользователь (после получения данных)
export interface User {
  id: string;
  last_name: string;
  first_name: string;
  student_id: number;
  role: 'student' | 'content_manager' | 'game_admin' | 'tech_admin';
  email?: string;
  isActive: boolean;
  createdAt: string;
}