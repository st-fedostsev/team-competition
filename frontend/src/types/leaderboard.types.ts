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
  id: number;
  name: string;
  crc: number;
  league: 'novice' | 'pro' | 'legend';
  captain_id: number;
  members?: number[];
}

export interface LeaderboardPage<T> {
  items: T[];
  hasMore: boolean;
  total: number;
}

export interface LeaderboardResponse {
    count: number,
    result: LeaderboardTeam[] | LeaderboardUser[];
}