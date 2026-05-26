// hooks/useKnowledge.ts
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { knowledgeApi } from '../api/knowledge';
import type { CreateKnowledgePostData } from '../types/knowledge.types';
import type { ApiErrorData } from '../types/error.types';
import { AxiosError } from 'axios';

export const knowledgeKeys = {
  all: ['knowledge'] as const,
  list: ['knowledge', 'list'] as const,
};

// Хук для бесконечной загрузки списка объявлений
export function useKnowledgePosts() {
  return useInfiniteQuery({
    queryKey: knowledgeKeys.list,
    queryFn: async ({ pageParam = 0 }) => {
      const response = await knowledgeApi.getPostsList({
        offset: pageParam,
        limit: 5,
      });

      const data = response.data;

      // Если вернулся массив
      if (Array.isArray(data)) {
        return {
          posts: data,
          hasMore: data.length === 5,
          total: data.length,
        };
      }

      // Если вернулся объект с полями
      return {
        posts: data.posts || [],
        hasMore: data.has_more || false,
        total: data.total || 0,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasMore) {
        return allPages.length * 5;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
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
