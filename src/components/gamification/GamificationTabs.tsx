
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { LeaderboardSection } from '@/components/gamification/LeaderboardSection';
import { AchievementsSection } from '@/components/gamification/AchievementsSection';
import { OverviewTabContent } from '@/components/gamification/overview/OverviewTabContent';
import { LeaderboardData } from '@/types/gamification';
import { UserProgress } from '@/types/virtual-environment';
import { TradeAchievement, GamificationReward } from '@/types/gamification';

interface GamificationTabsProps {
  activeTab: string;
  userProgress: UserProgress;
  leaderboardData: LeaderboardData;
  achievements: TradeAchievement[];
  rewards: GamificationReward[];
  completedAchievements: string[];
  inProgressAchievements: Array<{ id: string; progress: number }>;
  unlockedRewards: string[];
}

export const GamificationTabs: React.FC<GamificationTabsProps> = ({
  activeTab,
  userProgress,
  leaderboardData,
  achievements,
  rewards,
  completedAchievements,
  inProgressAchievements,
  unlockedRewards
}) => {
  return (
    <>
      <TabsContent value="overview" className="space-y-6">
        <OverviewTabContent 
          userProgress={userProgress}
          leaderboardData={leaderboardData}
          achievements={achievements}
          rewards={rewards}
          completedAchievements={completedAchievements}
          inProgressAchievements={inProgressAchievements}
          unlockedRewards={unlockedRewards}
        />
      </TabsContent>
      
      <TabsContent value="achievements" className="space-y-6">
        <AchievementsSection 
          achievements={achievements} 
          rewards={rewards}
          completedAchievements={completedAchievements}
          inProgressAchievements={inProgressAchievements}
          unlockedRewards={unlockedRewards}
          userPoints={userProgress.totalPoints}
        />
      </TabsContent>
      
      <TabsContent value="leaderboard" className="space-y-6">
        <LeaderboardSection 
          leaderboardData={leaderboardData} 
          currentUserId="current-user"
        />
      </TabsContent>
    </>
  );
};
