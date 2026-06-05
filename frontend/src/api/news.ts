// api/news.ts
import { apiClient } from './client';
import type { New, NewsListResponse, CreateNewsData, NewsListRequest } from '../types/news.types';

export const newsApi = {
  // Создать новость (только контент-менеджер)
  createNews: (data: CreateNewsData) =>
    apiClient.post<New>('/api/news/create', data),

  // Получить список новостей
  getNewsList: (params: NewsListRequest) =>
    apiClient.post<NewsListResponse>('/api/news/list', params),
};