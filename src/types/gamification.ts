
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

export interface TradeAchievement {
  id: string;
  name: string;
  description: string;
  pointsAwarded: number;
  requirements: {
    totalTrades?: number;
    consecutiveProfits?: number;
    profitThreshold?: number;
    riskManagementScore?: number;
    timeFrame?: string;
  };
}

export interface GamificationReward {
  id: string;
  name: string;
  description: string;
  type: 'feature' | 'content' | 'discount' | 'virtual-item';
  pointsRequired: number;
  unlocked: boolean;
}
