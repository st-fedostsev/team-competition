// api/endpoints/team.ts
import { apiClient } from './client';
import type {
  Team,
  CreateTeamData,
  JoinTeamData,
  SearchTeamData,
  LeaderboardEntry,
} from '../types/team.types';

export const teamApi = {
  // Создать команду
  createTeam: (data: CreateTeamData) =>
    apiClient.post<Team>('/api/team/create', data),

  // Получить свою команду
  getMyTeam: () => apiClient.get<Team>('/api/team/get_my'),

  // Сгенерировать новый код приглашения (только капитан)
  regenerateCode: () =>
    apiClient.post<{ secret_code: string }>('/api/team/regenerate_code'),

  // Выйти из команды
  leaveTeam: () => apiClient.post('/api/team/leave'),

  // Присоединиться к команде
  joinTeam: (data: JoinTeamData) =>
    apiClient.post<Team>('/api/team/join', data),

  // Поиск команды
  searchTeam: (data: SearchTeamData) =>
    apiClient.post<Team[]>('/api/team/search', data),

  // Получить лидерборд
  getLeaderboard: () =>
    apiClient.post<LeaderboardEntry[]>('/api/team/leaderboard'),

  // Для капитана кикнуть участника
  kickMember: (userId: number) =>
    apiClient.post('/api/team/kick', { id: userId }),
};
