// hooks/useContentManager.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { contentManagerApi } from '../api/contentManager';
import type { SendNotificationData, ChallengeReportsResponse, ModerateReportData } from '../api/contentManager';
import { useCurrentUser } from './useAuth';
import type { ApiError } from '../types/error.types';

export const contentManagerKeys = {
  all: ['content-manager'] as const,
  users: ['content-manager', 'users'] as const,
  reports: ['content-manager', 'reports'] as const,
};

// Хук для отправки рассылки
export function useSendNotification() {
  return useMutation({
    mutationFn: (data: SendNotificationData) => 
      contentManagerApi.sendNotification(data),
    onSuccess: () => {
      alert('Рассылка успешно отправлена!');
    },
    onError: (error: ApiError) => {
      const message = error.response?.data?.msg || 
                      error.response?.data?.message || 
                      'Ошибка отправки рассылки';
      alert(message);
    },
  });
}

// Хук для получения списка отчётов по челленджам (с пагинацией)
export function useChallengeReports(limit: number = 10, offset: number = 0) {
  const { data: currentUser } = useCurrentUser();
  
  return useQuery({
    queryKey: [...contentManagerKeys.reports, limit, offset],
    queryFn: async () => {
      const response = await contentManagerApi.getChallengeReports({
        limit,
        offset,
      });
      const data = response.data as ChallengeReportsResponse;
      return {
        result: data.result || [],
        count: data.count || 0,
      };
    },
    enabled: !!currentUser,
    staleTime: 1000 * 60 * 2,
  });
}

// Хук для модерации отчёта (одобрить/отклонить)
export function useModerateChallengeReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ModerateReportData) => 
      contentManagerApi.moderateChallengeReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentManagerKeys.reports });
      alert('Статус отчёта обновлён!');
    },
    onError: (error: ApiError) => {
      const message = error.response?.data?.msg || 
                      error.response?.data?.message || 
                      'Ошибка обновления статуса';
      alert(message);
    },
  });
}