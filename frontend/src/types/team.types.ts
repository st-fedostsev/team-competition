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


export interface LeaderboardEntry {
  team_id: number;
  team_name: string;
  rating: number;
  members_count: number;
  rank: number;
}

export interface SearchTeamsResponse {
  count: number;
  result: Team[]
}

export interface SearchTeamsRequest {
  query: string;
  limit: number;
  offset: number;
}
