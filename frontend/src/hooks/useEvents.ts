// hooks/useEvents.ts
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { eventsApi } from '../api/events';
import type { CreateEventData } from '../types/event.types';

export const eventsKeys = {
  all: ['events'] as const,
  list: ['events', 'list'] as const,
};

// Хук для бесконечной загрузки списка мероприятий
export function useEventsList() {
  return useInfiniteQuery({
    queryKey: eventsKeys.list,
    queryFn: async ({ pageParam = 0 }) => {
      const response = await eventsApi.getEventsList({
        offset: pageParam,
        limit: 5,
      });

      // API возвращает массив
      const eventsData = response.data;

      // Если вернулся массив
      if (Array.isArray(eventsData)) {
        return {
          events: eventsData,
          hasMore: eventsData.length === 5, // Если пришло 5 штук
          total: eventsData.length,
        };
      }

      // Если вернулся объект с полями
      return {
        events: eventsData.events || [],
        hasMore: eventsData.has_more || false,
        total: eventsData.total || 0,
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

// Хук для создания мероприятия
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventData) => eventsApi.createEvent(data),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: eventsKeys.list });
    },
  });
}
