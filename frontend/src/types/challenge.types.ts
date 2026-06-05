// types/challenge.types.ts
export interface Challenge {
  id: number;
  title: string;
  description: string;
  deadline: string
}

export interface CreateChallengeData {
  title: string;
  description: string;
  deadline: string;
  points: number;
}

export interface SendReportData {
  challenge_id: number;
  file_url: string;
  comment: string;
}

export interface ChallengesListRequest {
  offset: number;
  limit: number;
}

export interface ChallengesListResponse {
  result: Challenge[];
  count: number;
}