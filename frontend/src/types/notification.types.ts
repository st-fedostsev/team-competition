// types/notification.types.ts

export interface Notification {
  id: number;
  title: string;
  body: string;
  dismissed: boolean;
  created_at: string;
}

export interface GetNotificationsRequest {
  offset: number;
  limit: number;
}