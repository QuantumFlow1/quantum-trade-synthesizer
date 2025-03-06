
import { LeaderboardData, LeaderboardEntry } from '@/types/gamification';
import { EnvironmentType } from '@/types/virtual-environment';

// Utility function to create a mock user entry
export const createMockUser = (
  id: string,
  username: string,
  totalPoints: number,
  level: number,
  badgeCount: number,
  environmentMastery: EnvironmentType[],
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
