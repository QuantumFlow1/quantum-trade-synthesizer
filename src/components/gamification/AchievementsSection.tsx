
import React, { useState } from 'react';
import { Award, Lock, Check, Star, TrendingUp, CheckCircle2, GraduationCap } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TradeAchievement, GamificationReward } from '@/types/gamification';

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
  
  const isAchievementCompleted = (id: string) => completedAchievements.includes(id);
  
  const getAchievementProgress = (id: string) => {
    const achievement = inProgressAchievements.find(a => a.id === id);
    return achievement ? achievement.progress : 0;
  };
  
  const isRewardUnlocked = (id: string) => unlockedRewards.includes(id);
  
  const canUnlockReward = (pointsRequired: number) => userPoints >= pointsRequired;
  
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
            <div className="max-h-[320px] overflow-y-auto p-3 space-y-3">
              {achievements.map(achievement => (
                <div 
                  key={achievement.id} 
                  className={`p-3 rounded-lg border ${
                    isAchievementCompleted(achievement.id) 
                      ? 'border-green-500/30 bg-green-500/5' 
                      : 'border-secondary/20 bg-secondary/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="font-medium">{achievement.name}</h3>
                        {isAchievementCompleted(achievement.id) && (
                          <CheckCircle2 className="h-4 w-4 ml-2 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      
                      {!isAchievementCompleted(achievement.id) && inProgressAchievements.some(a => a.id === achievement.id) && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{getAchievementProgress(achievement.id)}%</span>
                          </div>
                          <Progress value={getAchievementProgress(achievement.id)} className="h-2" />
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex flex-col items-end">
                      <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/20">
                        +{achievement.pointsAwarded} pts
                      </Badge>
                      {achievement.requirements.totalTrades && (
                        <span className="text-xs text-muted-foreground mt-1 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {achievement.requirements.totalTrades} trades
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="rewards" className="mt-0">
            <div className="max-h-[320px] overflow-y-auto p-3 space-y-3">
              {rewards.map(reward => (
                <div 
                  key={reward.id} 
                  className={`p-3 rounded-lg border ${
                    isRewardUnlocked(reward.id) 
                      ? 'border-purple-500/30 bg-purple-500/5' 
                      : 'border-secondary/20 bg-secondary/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="font-medium">{reward.name}</h3>
                        {isRewardUnlocked(reward.id) ? (
                          <Check className="h-4 w-4 ml-2 text-green-500" />
                        ) : (
                          <Lock className="h-4 w-4 ml-2 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                    </div>
                    <div className="ml-3 flex flex-col items-end">
                      <Badge className={`${
                        isRewardUnlocked(reward.id) ? 'bg-purple-500/20 text-purple-500 border-purple-500/20' : 
                        canUnlockReward(reward.pointsRequired) ? 'bg-green-500/20 text-green-500 border-green-500/20' : 
                        'bg-secondary/20 text-muted-foreground'
                      }`}>
                        {reward.pointsRequired} pts
                      </Badge>
                      
                      {!isRewardUnlocked(reward.id) && canUnlockReward(reward.pointsRequired) && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2 text-xs h-8 bg-primary/10"
                        >
                          Unlock Reward
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
