
import { LeaderboardData } from '@/types/gamification';
import { globalLeaderboardData } from './global-leaderboard';
import { environmentLeaderboards } from './environment-leaderboards';

// Create mock leaderboard data that combines global and environment-specific data
export const mockLeaderboardData: LeaderboardData = {
  global: globalLeaderboardData,
  byEnvironment: environmentLeaderboards
};
