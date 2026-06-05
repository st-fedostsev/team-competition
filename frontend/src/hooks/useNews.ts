// hooks/useNews.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { newsApi } from '../api/news';
import type { CreateNewsData, NewsListResponse } from '../types/news.types';
import { useCurrentUser } from './useAuth';

export const newsKeys = {
  all: ['news'] as const,
  list: ['news', 'list'] as const,
};

// Тип для ответа API (если приходит объект с полями)

// Хук для получения списка новостей с пагинацией (как в рейтингах)
export function useNewsList(limit: number = 5, offset: number = 0) {
  const { data: currentUser } = useCurrentUser();
  
  return useQuery({
    queryKey: [...newsKeys.list, limit, offset],
    queryFn: async () => {
      const response = await newsApi.getNewsList({
        offset: offset,
        limit: limit,
      });

      const data = response.data as NewsListResponse;
      const news = data.result || [];
      const count = data.count || 0;

      return {
        result: news,
        count: count,
      };
    },
    enabled: !!currentUser,
    staleTime: 1000 * 60 * 5,
  });
}


// Хук для создания новости
export function useCreateNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNewsData) => newsApi.createNews(data),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: newsKeys.list });
    },
  });
}
