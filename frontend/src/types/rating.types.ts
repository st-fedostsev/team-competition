// types/rating.types.ts

export interface LeaderboardEntry {
  user_id: number;
  last_name: string;
  first_name: string;
  student_id: number;
  personal_rating: number;
  position: number;
}

export interface LeaderboardRequest {
  offset: number;
  limit: number;
}

export interface LeaderboardResponse {
  users: LeaderboardEntry[];
  total: number;
  has_more: boolean;
  current_user?: LeaderboardEntry;
}