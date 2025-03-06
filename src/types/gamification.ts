
import { EnvironmentType, UserBadge } from './virtual-environment';

// Gamification types
export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatarUrl?: string;
  totalPoints: number;
  level: number;
  badgeCount: number;
  environmentMastery: EnvironmentType[];
  tradingSuccess: number; // Percentage of successful trades
  learningCompletion: number; // Percentage of completed learning modules
}

export interface LeaderboardData {
  global: LeaderboardEntry[];
  byEnvironment: Record<EnvironmentType, LeaderboardEntry[]>;
}

export interface TradeAchievement {
  id: string;
  name: string;
  description: string;
  pointsAwarded: number;
  badgeAwarded?: UserBadge;
  requirements: {
    totalTrades?: number;
    successfulTrades?: number;
    profitThreshold?: number;
    consecutiveProfits?: number;
    riskManagementScore?: number;
    timeFrame?: string; // e.g., "daily", "weekly", "monthly"
  };
}

export interface GamificationReward {
  id: string;
  name: string;
  description: string;
  type: 'content' | 'feature' | 'discount' | 'virtual-item';
  pointsRequired: number;
  unlocked: boolean;
  imageUrl?: string;
  availableAt?: string; // When this reward becomes available
  expiresAt?: string; // Optional expiration date
}

export interface UserGamificationProfile {
  userId: string;
  username: string;
  avatarUrl?: string;
  currentStreak: number; // Days in a row with activity
  longestStreak: number;
  tradingPoints: number; // Points from trading activities
  learningPoints: number; // Points from learning activities
  totalPoints: number; // Combined points
  rank: number; // Global rank position
  unlockedRewards: string[]; // IDs of unlocked rewards
  achievements: {
    completed: string[]; // IDs of completed achievements
    inProgress: Array<{
      id: string;
      progress: number; // 0-100 percentage
    }>;
  };
}
