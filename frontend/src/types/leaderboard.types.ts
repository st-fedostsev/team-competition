export interface LeaderboardUser {
  id: number;
  student_id: number | null;
  last_name: string;
  first_name: string;
  patronymic: string | null;
  role: string;
  team_id: number | null;
  is_captain: boolean;
  personal_rating: number;
  is_blocked: boolean;
  login: string | null;
  created_at: string;
}

export interface LeaderboardTeam {
  team_id: number;
  team_name: string;
  rating: number;
  members_count: number;
  rank: number;
}

export interface LeaderboardPage<T> {
  items: T[];
  hasMore: boolean;
  total: number;
}