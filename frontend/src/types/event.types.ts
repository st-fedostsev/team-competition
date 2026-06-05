// types/event.types.ts

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string; // ISO формат "2026-05-25T17:41:54.096000"
  format: 'offline' | 'online';
  is_official: boolean;
  created_by?: number;
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
  result: Event[];
  count: number;
}