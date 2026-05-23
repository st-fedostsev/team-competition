// types/team.types.ts

export interface TeamMember {
  id: number;
  user_id: number;
  last_name: string;
  first_name: string;
  patronymic?: string;
  role: 'captain' | 'member';
  rating?: number;
}

export interface Team {
  id: number;
  name: string;
  description?: string;
  invite_code: string;
  members: TeamMember[];
  created_at: string;
  captain_id: number;
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