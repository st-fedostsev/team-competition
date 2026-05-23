// types/event.types.ts

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  format: 'offline' | 'online';
  is_official: boolean;
  created_at?: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  format: 'offline' | 'online';
  is_official: boolean;
}

export interface EventsListRequest {
  offset: number;
  limit: number;
}

export interface EventsListResponse {
  events: Event[];
  total: number;
  has_more: boolean;
}