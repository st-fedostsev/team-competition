// hooks/useNews.ts
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { newsApi } from '../api/news';
import type { CreateNewsData, News } from '../types/news.types';

export const newsKeys = {
  all: ['news'] as const,
  list: ['news', 'list'] as const,
};

// Тип для ответа API (если приходит объект с полями)
interface NewsApiResponse {
  news: News[];
  has_more: boolean;
  total: number;
}

// Тип для возвращаемого значения хука
interface NewsPage {
  news: News[];
  hasMore: boolean;
  total: number;
}

export function useNewsList() {
  return useInfiniteQuery<NewsPage>({
    queryKey: newsKeys.list,
    queryFn: async ({ pageParam = 0 }) => {
      const response = await newsApi.getNewsList({
        offset: pageParam as number,
        limit: 5,
      });

      const data = response.data;

      // Если пришёл массив
      if (Array.isArray(data)) {
        return {
          news: data,
          hasMore: data.length === 5,
          total: data.length,
        };
      }

      // Если пришёл объект
      const typedData = data as NewsApiResponse;
      return {
        news: typedData.news || [],
        hasMore: typedData.has_more || false,
        total: typedData.total || 0,
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
