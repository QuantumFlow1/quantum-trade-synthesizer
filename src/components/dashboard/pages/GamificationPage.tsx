
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { GamificationHeader } from '@/components/gamification/GamificationHeader';
import { LeaderboardSection } from '@/components/gamification/LeaderboardSection';
import { AchievementsSection } from '@/components/gamification/AchievementsSection';
import { OverviewTabContent } from '@/components/gamification/overview/OverviewTabContent';
import { mockLeaderboardData } from '@/utils/mock-leaderboard-data';
import { mockAchievements, mockRewards } from '@/utils/mock-achievements-data';

export const GamificationPage: React.FC = () => {
  const { userProgress } = useEnvironment();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for in-progress achievements
  const inProgressAchievements = [
    { id: 'trade-streak-5', progress: 60 },
    { id: 'profit-master', progress: 25 },
    { id: 'market-analyzer', progress: 80 }
  ];
  
  // Mock data for completed achievements
  const completedAchievements = ['first-trade', 'learning-starter', 'environment-explorer'];
  
  // Mock data for unlocked rewards
  const unlockedRewards = ['basic-analytics', 'trading-guide-101'];
  
  return (
    <div className="space-y-6">
      <GamificationHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <TabsContent value="overview" className="space-y-6">
        <OverviewTabContent 
          userProgress={userProgress}
          leaderboardData={mockLeaderboardData}
          achievements={mockAchievements}
          rewards={mockRewards}
          completedAchievements={completedAchievements}
          inProgressAchievements={inProgressAchievements}
          unlockedRewards={unlockedRewards}
        />
      </TabsContent>
      
      <TabsContent value="achievements" className="space-y-6">
        <AchievementsSection 
          achievements={mockAchievements} 
          rewards={mockRewards}
          completedAchievements={completedAchievements}
          inProgressAchievements={inProgressAchievements}
          unlockedRewards={unlockedRewards}
          userPoints={userProgress.totalPoints}
        />
      </TabsContent>
      
      <TabsContent value="leaderboard" className="space-y-6">
        <LeaderboardSection 
          leaderboardData={mockLeaderboardData} 
          currentUserId="current-user"
        />
      </TabsContent>
    </div>
  );
};
