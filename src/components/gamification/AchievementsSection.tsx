
import React, { useState } from 'react';
import { Award, Star, GraduationCap } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TradeAchievement, GamificationReward } from '@/types/gamification';
import { AchievementsTabContent } from './achievements/AchievementsTabContent';
import { RewardsTabContent } from './rewards/RewardsTabContent';

interface AchievementsSectionProps {
  achievements: TradeAchievement[];
  rewards: GamificationReward[];
  completedAchievements: string[];
  inProgressAchievements: Array<{ id: string; progress: number }>;
  unlockedRewards: string[];
  userPoints: number;
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  achievements,
  rewards,
  completedAchievements,
  inProgressAchievements,
  unlockedRewards,
  userPoints
}) => {
  const [activeTab, setActiveTab] = useState<string>('achievements');
  
  return (
    <Card className="bg-secondary/5 border-secondary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Award className="h-5 w-5 mr-2 text-purple-500" />
            Achievements & Rewards
          </CardTitle>
          <Badge variant="outline" className="bg-primary/10">
            {completedAchievements.length}/{achievements.length} Completed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 pt-2">
            <TabsList className="w-full">
              <TabsTrigger value="achievements" className="flex-1">
                <Star className="h-4 w-4 mr-2" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex-1">
                <GraduationCap className="h-4 w-4 mr-2" />
                Rewards
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="achievements" className="mt-0">
            <AchievementsTabContent 
              achievements={achievements}
              completedAchievements={completedAchievements}
              inProgressAchievements={inProgressAchievements}
            />
          </TabsContent>
          
          <TabsContent value="rewards" className="mt-0">
            <RewardsTabContent 
              rewards={rewards}
              unlockedRewards={unlockedRewards}
              userPoints={userPoints}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
