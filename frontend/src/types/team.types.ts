// types/team.types.ts

export interface Team {
  id: number;
  name: string;
  description?: string;
  invite_code: string;
  secret_code?: string;     
  members: number[];
  created_at: string;
  captain_id: number;
  crc?: number;                 // рейтинг команды (Competitive Rating Coefficient)
  league?: 'novice' | 'amateur' | 'pro' | 'legend';  // лига команды
  total_rating?: number;       // общий балл команды
}

export interface CreateTeamData {
  name: string;
  description?: string;
}

export interface JoinTeamData {
  invite_code: string;
}

export interface SearchTeamData {
  query: string;
  limit: number;
  offset: number;
}

export interface LeaderboardEntry {
  team_id: number;
  team_name: string;
  rating: number;
  members_count: number;
  rank: number;
}