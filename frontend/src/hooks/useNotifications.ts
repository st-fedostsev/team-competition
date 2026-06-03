// hooks/useNotifications.ts
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/notifications';
import type { Notification } from '../types/notification.types';

export const notificationKeys = {
  all: ['notifications'] as const,
  list: ['notifications', 'list'] as const,
};

interface NotificationsPage {
  notifications: Notification[];
  hasMore: boolean;
  total: number;
}

// Хук для получения уведомлений с пагинацией
export function useNotifications() {
  return useInfiniteQuery<NotificationsPage>({
    queryKey: notificationKeys.list,
    queryFn: async ({ pageParam = 0 }) => {
      const response = await notificationsApi.getNotifications({
        offset: pageParam as number,
        limit: 20,
      });
      
      const notifications = response.data;
      
      return {
        notifications,
        hasMore: notifications.length === 20,
        total: notifications.length,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasMore) {
        return allPages.length * 20;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 2,
  });
}

// Хук для отметки уведомления как прочитанного
export function useDismissNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) => notificationsApi.dismissNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list });
    },
  });
}