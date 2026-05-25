// api/news.ts
import { apiClient } from './client';
import type { News, CreateNewsData } from '../types/news.types';

export const newsApi = {
  // Создать новость (только контент-менеджер)
  createNews: (data: CreateNewsData) =>
    apiClient.post<News>('/api/news/create', data),

  // Получить список новостей
  getNewsList: (params: { offset: number; limit: number }) =>
    apiClient.post<News[]>('/api/news/list', params),
};