
import { LeaderboardData, LeaderboardEntry } from '@/types/gamification';

// Utility function to create a mock user entry
export const createMockUser = (
  id: string,
  username: string,
  totalPoints: number,
  level: number,
  badgeCount: number,
  environmentMastery: string[],
  tradingSuccess: number,
  learningCompletion: number
): LeaderboardEntry => ({
  userId: id,
  username,
  totalPoints,
  level,
  badgeCount,
  environmentMastery,
  tradingSuccess,
  learningCompletion
});
