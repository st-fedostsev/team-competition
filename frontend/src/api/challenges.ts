// api/challenges.ts
import { apiClient } from './client';
import type { Challenge, ChallengesListRequest, ChallengesListResponse, CreateChallengeData } from '../types/challenge.types';

export const challengesApi = {
  // Создать челлендж (только контент-менеджер)
  createChallenge: (data: CreateChallengeData) =>
    apiClient.post<Challenge>('/api/challenges/create', data),

  // Получить список челленджей
  getChallengesList: (params: ChallengesListRequest) =>
    apiClient.post<ChallengesListResponse>('/api/challenges/list', params),

   // Отправить отчёт по челленджу (студент)
  sendReport: (challengeId: number, comment: string, fileUrl: string) => {
    return apiClient.post('/api/challenges/send_report', {
      challenge_id: challengeId,
      file_url: fileUrl,
      comment: comment,
    });
  },
};