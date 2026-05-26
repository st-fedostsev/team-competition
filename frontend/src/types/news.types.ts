// types/news.types.ts
export interface News {
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
