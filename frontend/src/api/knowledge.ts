// api/knowledge.ts
import { apiClient } from './client';
import type {
  KnowledgePost,
  CreateKnowledgePostData,
  KnowledgeListRequest,
  KnowledgeListResponse,
} from '../types/knowledge.types';

export const knowledgeApi = {
  // Создать объявление
  createPost: (data: CreateKnowledgePostData) =>
    apiClient.post<KnowledgePost>('/api/knowledge_posts/create', data),

  // Получить список объявлений
  getPostsList: (params: KnowledgeListRequest) =>
    apiClient.post<KnowledgeListResponse>('/api/knowledge_posts/list', params),
};
