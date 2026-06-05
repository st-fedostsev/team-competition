// types/knowledge.types.ts

export interface KnowledgePost {
  id: number;
  type: 'offer' | 'request';
  title: string;
  description: string;
  tags: string;
  author_id?: number;
  author_name?: string;
  created_at?: string;
  comments_count?: number;
}

export interface CreateKnowledgePostData {
  type: 'offer' | 'request';
  title: string;
  description: string;
  tags: string;
}

export interface KnowledgeListRequest {
  offset: number;
  limit: number;
}

export interface KnowledgeListResponse {
  count: number;
  result: KnowledgePost[];
}