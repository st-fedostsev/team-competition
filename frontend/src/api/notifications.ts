// api/notifications.ts
import { apiClient } from './client';
import type { Notification, GetNotificationsRequest } from './../types/notification.types';

export const notificationsApi = {
  // Получить уведомления
  getNotifications: (params: GetNotificationsRequest) =>
    apiClient.post<Notification[]>('/api/users/get_notifications', params),

  // Отметить уведомление как прочитанное (dismissed)
  dismissNotification: (notificationId: number) =>
    apiClient.post('/api/users/dismiss_notification', { id: notificationId }),
};