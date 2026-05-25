// types/news.types.ts
export interface News {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at?: string;
}

export interface CreateNewsData {
  title: string;
  content: string;
  image_url?: string;
}