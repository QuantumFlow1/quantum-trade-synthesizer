
import { LeaderboardData } from '@/types/gamification';
import { globalLeaderboardEntries } from './global-leaderboard';
import { environmentLeaderboards } from './environment-leaderboards';

// Export mock leaderboard data
export const mockLeaderboardData: LeaderboardData = {
  global: globalLeaderboardEntries,
  byEnvironment: environmentLeaderboards
};
