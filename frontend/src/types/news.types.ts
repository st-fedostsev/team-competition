// types/news.types.ts
export interface New {
  id: number;
  title: string;
  body: string;
  image_url?: string;
  created_at?: string;
}

export interface CreateNewsData {
  title: string;
  body: string;
  image_url?: string;
}

export interface NewsListRequest {
  offset: number;
  limit: number;
}

export interface NewsListResponse {
  result: New[];
  count: number;
}