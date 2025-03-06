
import React from 'react';
import { OverviewStats } from './OverviewStats';
import { LeaderboardSection } from '@/components/gamification/LeaderboardSection';
import { AchievementsSection } from '@/components/gamification/AchievementsSection';
import { LeaderboardData } from '@/types/gamification';
import { UserProgress } from '@/types/virtual-environment';
import { TradeAchievement, GamificationReward } from '@/types/gamification';

interface OverviewTabContentProps {
  userProgress: UserProgress;
  leaderboardData: LeaderboardData;
  achievements: TradeAchievement[];
  rewards: GamificationReward[];
  completedAchievements: string[];
  inProgressAchievements: Array<{ id: string; progress: number }>;
  unlockedRewards: string[];
}

export const OverviewTabContent: React.FC<OverviewTabContentProps> = ({
  userProgress,
  leaderboardData,
  achievements,
  rewards,
  completedAchievements,
  inProgressAchievements,
  unlockedRewards
}) => {
  return (
    <div className="space-y-6">
      <OverviewStats userProgress={userProgress} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LeaderboardSection 
          leaderboardData={leaderboardData} 
          currentUserId="current-user"
        />
        
        <AchievementsSection 
          achievements={achievements} 
          rewards={rewards}
          completedAchievements={completedAchievements}
          inProgressAchievements={inProgressAchievements}
          unlockedRewards={unlockedRewards}
          userPoints={userProgress.totalPoints}
        />
      </div>
    </div>
  );
};
