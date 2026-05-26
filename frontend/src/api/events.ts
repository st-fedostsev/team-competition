// api/endpoints/events.ts
import { apiClient } from './client';
import type { Event, CreateEventData, EventsListRequest, EventsListResponse } from '../types/event.types';

export const eventsApi = {
  // Создать мероприятие
  createEvent: (data: CreateEventData) =>
    apiClient.post<Event>('/api/events/create', data),

  // Получить список мероприятий
  getEventsList: (params: EventsListRequest) =>
    apiClient.post<EventsListResponse>('/api/events/list', params),
  
   getAllEvents: () =>
    apiClient.post<Event[]>('/api/events/list', { offset: 0, limit: 1000 }),
};