// types/rating.types.ts

import type { User } from "./auth.types";

export interface LeaderboardRequest {
  query: string;
  offset: number;
  limit: number;
}

export interface LeaderboardResponse {
  count: number;
  result: User[];
}