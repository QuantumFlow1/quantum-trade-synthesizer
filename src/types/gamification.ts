import { EnvironmentType } from "./virtual-environment";

export interface LeaderboardData {
  global: LeaderboardEntry[];
  byEnvironment: Record<EnvironmentType, LeaderboardEntry[]>;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  totalPoints: number;
  level: number;
  badgeCount: number;
  environmentMastery: string[];
  tradingSuccess: number;
  learningCompletion: number;
}
