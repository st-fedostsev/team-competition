// api/contentManager.ts
import { apiClient } from './client';

export interface SendNotificationData {
  user_ids?: number[];
  send_all?: boolean;
  title: string;
  body: string;
}

export interface ChallengeReport {
  id: number;
  team_id: number;
  challenge_id: number;
  comment: string;
  file_url: string;
  status: 'on_moderation' | 'approved' | 'rejected';
  moderated_by: number | null;
  moderated_at: string | null;
}

export interface ChallengeReportsResponse {
  count: number;
  result: ChallengeReport[];
}

export interface ModerateReportData {
  report_id: number;
  status: 'approved' | 'rejected';
  moderator_comment?: string;
}

export const contentManagerApi = {
  // Отправить рассылку
  sendNotification: (data: SendNotificationData) =>
    apiClient.post('/api/content_manager/send_notification', data),

  // Получить список отчётов по челленджам
  getChallengeReports: (params: { offset: number; limit: number }) =>
    apiClient.post<ChallengeReportsResponse>('/api/content_manager/get_challenge_reports', params),

  // Одобрить/отклонить отчёт
  moderateChallengeReport: (data: ModerateReportData) =>
    apiClient.post('/api/content_manager/moderate_challenge_report', data),
};