// hooks/useKnowledge.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { knowledgeApi } from '../api/knowledge';
import type { CreateKnowledgePostData, KnowledgeListResponse } from '../types/knowledge.types';
import type { ApiErrorData } from '../types/error.types';
import { AxiosError } from 'axios';
import { useCurrentUser } from './useAuth';

export const knowledgeKeys = {
  all: ['knowledge'] as const,
  list: ['knowledge', 'list'] as const,
};

// Хук для получения списка объявлений с пагинацией
export function useKnowledgePosts(limit: number = 5, offset: number = 0) {
  const { data: currentUser } = useCurrentUser();
  
  return useQuery({
    queryKey: [...knowledgeKeys.list, limit, offset],
    queryFn: async () => {
      const response = await knowledgeApi.getPostsList({
        offset: offset,
        limit: limit,
      });

      const data = response.data as KnowledgeListResponse;
      const posts = data.result || [];
      const count = data.count || 0;

      return {
        result: posts,
        count: count,
      };
    },
    enabled: !!currentUser,
    staleTime: 1000 * 60 * 5,
  });
}

// Хук для создания объявления
export function useCreateKnowledgePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateKnowledgePostData) =>
      knowledgeApi.createPost(data),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: knowledgeKeys.list });
    },
    onError: (error: AxiosError<ApiErrorData>) => {
      let msg = 'Ошибка создания объявления';

      // Пробуем разные варианты получения сообщения
      if (error.response?.data?.msg) {
        msg = error.response.data.msg;
      } else if (error.response?.data?.message) {
        msg = error.response.data.message;
      } else if (error.response?.data?.detail) {
        msg = error.response.data.detail;
      }

      console.error('Сообщение для пользователя:', msg);
      alert(msg);
    },
  });
}
