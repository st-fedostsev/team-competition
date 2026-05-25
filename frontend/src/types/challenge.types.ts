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
  start_date: string;
  end_date: string;
  points: number;
}

export interface SendReportData {
  challenge_id: number;
  file_url: string;
  comment: string;
}