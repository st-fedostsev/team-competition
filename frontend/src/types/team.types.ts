// types/team.types.ts

export interface Team {
  id: number;
  name: string;
  description?: string;
  secret_code: string;  
  members: number[];
  created_at: string;
  captain_id: number;
  crc?: number;                 // рейтинг команды (Competitive Rating Coefficient)
  league?: 'novice' | 'pro' | 'legend';  // лига команды
}

export interface CreateTeamData {
  name: string;
  description?: string;
}

export interface JoinTeamData {
  secret_code: string;
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

export interface TeamLeaderboardResponse {
  teams: LeaderboardEntry[];
  total: number;
  has_more: boolean;
}