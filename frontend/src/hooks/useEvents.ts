// hooks/useEvents.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { eventsApi } from '../api/events';
import type { CreateEventData, EventsListResponse } from '../types/event.types';
import { useCurrentUser } from './useAuth';

export const eventsKeys = {
  all: ['events'] as const,
  list: ['events', 'list'] as const,
  calendar: ['events', 'calendar'] as const,
};

// Хук для получения списка мероприятий с пагинацией
export function useEventsList(limit: number = 5, offset: number = 0) {
  const { data: currentUser } = useCurrentUser();
  
  return useQuery({
    queryKey: [...eventsKeys.list, limit, offset],
    queryFn: async () => {
      const response = await eventsApi.getEventsList({
        offset: offset,
        limit: limit,
      });

      const data = response.data as EventsListResponse;
      const events = data.result || [];
      const total = data.count || 0;

      return {
        result: events,
        count: total,
      };
    },
    enabled: !!currentUser,
    staleTime: 1000 * 60 * 5,
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


export function useCalendarEvents(startDate: string | null, endDate: string | null) {
  const { data: currentUser } = useCurrentUser();
  
  return useQuery({
    queryKey: [...eventsKeys.calendar, startDate, endDate],
    queryFn: async () => {
      if (!startDate || !endDate) {
        return [];
      }
      const response = await eventsApi.getCalendarEventsList(startDate, endDate);
      return response.data || [];
    },
    enabled: !!currentUser && !!startDate && !!endDate,
    staleTime: 1000 * 60 * 5, // 5 минут
  });
}
