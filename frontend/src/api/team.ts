// api/endpoints/team.ts
import { apiClient } from './client';
import type {
  Team,
  CreateTeamData,
  JoinTeamData,
  SearchTeamsResponse,
  SearchTeamsRequest,
} from '../types/team.types';

// Тип для ответа голосов
export interface MyVote {
  id: number;
  team_id: number;
  voter_id: number;
  target_id: number;
  score: number;
  voted_at: string;
}

// Тип для заявки на вступление
export interface JoinRequest {
  id: number;
  team_id: number;
  from_id: number;
  status: 'awaiting' | 'approved' | 'rejected';
  created_at: string;
}

export interface ReviewRequestData {
  id: number;
  new_status: 'awaiting' | 'approved' | 'rejected';
}

export const teamApi = {
  // Создать команду
  createTeam: (data: CreateTeamData) =>
    apiClient.post<Team>('/api/team/create', data),

  // Получить свою команду
  getMyTeam: () => apiClient.get<Team>('/api/team/get_my'),

   // Получить команду по ID
  getTeamById: (teamId: number) =>
    apiClient.post<Team>('/api/team/get_by_id', { id: teamId }),

  // Сгенерировать новый код приглашения (только капитан)
  regenerateCode: () =>
    apiClient.post<{ secret_code: string }>('/api/team/regenerate_code'),

  // Выйти из команды
  leaveTeam: () => apiClient.post('/api/team/leave'),

  // Присоединиться к команде
  joinTeam: (data: JoinTeamData) =>
    apiClient.post<Team>('/api/team/join', data),

  // Поиск команды
  searchTeam: (data: SearchTeamsRequest) =>
    apiClient.post<SearchTeamsResponse>('/api/team/search', data),

  // Получить список команд
  getLeaderboard: () =>
    apiClient.post<SearchTeamsResponse>('/api/team/leaderboard'),

  // Для капитана кикнуть участника
  kickMember: (userId: number) =>
    apiClient.post('/api/team/kick', { id: userId }),

  // Передать капитанство другому участнику
  transferCaptain: (userId: number) =>
    apiClient.post('/api/team/transfer_captain', { id: userId }),

  // Переименовать команду
  renameTeam: (newName: string) =>
    apiClient.post<Team>('/api/team/rename', { new_name: newName }),

  // Оценить участника команды (голосование)
  voteUser: (userId: number, score: number) =>
    apiClient.post('/api/team/vote', { user_id: userId, score }),

  getMyVotes: () => apiClient.get<MyVote[]>('/api/team/get_my_votes'),

  // Получить заявки на вступление в команду (только для капитана)
  getJoinRequests: () => apiClient.get<JoinRequest[]>('/api/team/get_requests'),

  // Рассмотреть заявку (сменить статус на approved или rejected)
  reviewJoinRequest: (data: ReviewRequestData) => 
    apiClient.post('/api/team/review_request', data),

   // Отправить заявку на вступление в команду
  requestJoin: (teamId: number) =>
    apiClient.post('/api/team/request_join', { id: teamId }),

  // Отменить заявку на вступление
  cancelJoinRequest: () =>
    apiClient.post('/api/team/cancel_request'),

  // Получить текущую заявку (команду, куда подана заявка)
  getAwaitingRequest: () =>
    apiClient.get<JoinRequest>('/api/team/get_awaiting_request'),
};
