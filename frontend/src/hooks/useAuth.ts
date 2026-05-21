// hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuthStore } from '../stores/authStore';
import type { StudentLoginCredentials } from '../types/auth.types';

// Ключи для кеширования
export const authKeys = {
  user: ['auth', 'user'] as const,
};

// Хук для входа студента
export function useStudentLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (credentials: StudentLoginCredentials) => 
      authApi.loginStudent(credentials),
    
    onSuccess: async (response) => {
      const { access_token, refresh_token } = response.data;
      
      // Получаем данные пользователя
      try {
        const userResponse = await authApi.getCurrentUser();
        const user = userResponse.data;
        
        // Сохраняем в store
        setAuth(user, access_token, refresh_token);
        
        // Сохраняем в кеш React Query
        queryClient.setQueryData(authKeys.user, user);
        
        // Редирект на профиль
        navigate('/ProfileStudentPage');
      } catch (error) {
        console.error('Ошибка получения пользователя:', error);
      }
    },
    
    onError: (error: Error) => {
      console.error('Ошибка входа:', error.message);
      alert(error.message || 'Ошибка авторизации');
    },
  });
}

// Хук для получения текущего пользователя
export function useCurrentUser() {
  const accessToken = useAuthStore((state) => state.accessToken);
  
  return useQuery({
    queryKey: authKeys.user,
    queryFn: async () => {
      const response = await authApi.getCurrentUser();
      return response.data;
    },
    enabled: !!accessToken, // Запрос только если есть токен
    staleTime: 1000 * 60 * 15, // 15 минут
    retry: false,
  });
}

// Хук для выхода
export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: () => authApi.logout(),
    
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      navigate('/login-student');
    },
    
    onError: () => {
      // Даже при ошибке очищаем локальные данные
      clearAuth();
      queryClient.clear();
      navigate('/login-student');
    },
  });
}