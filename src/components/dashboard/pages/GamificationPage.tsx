
import React, { useState } from 'react';
import { Trophy, Award, Clock, TrendingUp, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { LeaderboardSection } from '@/components/gamification/LeaderboardSection';
import { AchievementsSection } from '@/components/gamification/AchievementsSection';
import { EnvironmentType } from '@/types/virtual-environment';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  
  // Calculate environment completion
  const getEnvironmentCompletion = (environmentId: EnvironmentType) => {
    const path = userProgress.learningPaths[environmentId];
    if (!path) return 0;
    return Math.round((path.completedModules / path.totalModules) * 100);
  };
  
  // Get all environments
  const environments: EnvironmentType[] = [
    'trading-floor',
    'office-tower',
    'financial-garden',
    'command-center',
    'educational-campus',
    'personal-office',
    'trading-hub'
  ];
  
  // Format environment name
  const formatEnvironmentName = (name: string) => {
    return name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Gamification Dashboard</h1>
        <p className="text-muted-foreground">
          Track your progress, achievements, and compete with other traders
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-secondary/5 border-secondary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  Your Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="text-5xl font-bold mb-2">{userProgress.level}</div>
                  <div className="text-sm text-muted-foreground mb-4">
                    {userProgress.totalPoints} total points
                  </div>
                  <div className="w-full space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Level {userProgress.level}</span>
                      <span>Level {userProgress.level + 1}</span>
                    </div>
                    <Progress 
                      value={userProgress.totalPoints % 100} 
                      className="h-2" 
                      indicatorClassName="bg-yellow-500"
                    />
                    <div className="text-xs text-center text-muted-foreground">
                      {100 - (userProgress.totalPoints % 100)} points until next level
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-secondary/5 border-secondary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Award className="h-5 w-5 mr-2 text-purple-500" />
                  Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-full">
                  <div className="text-center py-6">
                    <div className="text-5xl font-bold mb-2">{userProgress.badges.length}</div>
                    <p className="text-sm text-muted-foreground">Badges Earned</p>
                    
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {userProgress.badges.slice(0, 5).map(badge => (
                        <div 
                          key={badge.id} 
                          className="flex flex-col items-center w-16"
                          title={badge.name}
                        >
                          <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <Trophy className="h-5 w-5 text-purple-500" />
                          </div>
                          <span className="text-xs mt-1 truncate w-full">{badge.name}</span>
                        </div>
                      ))}
                      
                      {userProgress.badges.length === 0 && (
                        <div className="text-sm text-muted-foreground">
                          Complete achievements to earn badges!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-secondary/5 border-secondary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Star className="h-5 w-5 mr-2 text-blue-500" />
                  Trading Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 py-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Trading Activity</span>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
                        <Clock className="h-3 w-3 mr-1" />
                        Last 30 days
                      </Badge>
                    </div>
                    <div className="h-24 flex items-center justify-center bg-secondary/10 rounded-lg">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-6">
                          <div>
                            <div className="text-2xl font-bold">12</div>
                            <div className="text-xs text-muted-foreground">Trades</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-500">75%</div>
                            <div className="text-xs text-muted-foreground">Win Rate</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold">3</div>
                            <div className="text-xs text-muted-foreground">Days Streak</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Learning Progress</span>
                      <span className="text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3 inline mr-1" />
                        {completedAchievements.length}/{mockAchievements.length} achievements
                      </span>
                    </div>
                    <div className="space-y-2">
                      {environments.slice(0, 3).map(env => (
                        <div key={env} className="text-xs">
                          <div className="flex justify-between mb-1">
                            <span>{formatEnvironmentName(env)}</span>
                            <span>{getEnvironmentCompletion(env)}%</span>
                          </div>
                          <Progress 
                            value={getEnvironmentCompletion(env)} 
                            className="h-1" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LeaderboardSection 
              leaderboardData={mockLeaderboardData} 
              currentUserId="current-user"
            />
            
            <AchievementsSection 
              achievements={mockAchievements} 
              rewards={mockRewards}
              completedAchievements={completedAchievements}
              inProgressAchievements={inProgressAchievements}
              unlockedRewards={unlockedRewards}
              userPoints={userProgress.totalPoints}
            />
          </div>
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
      </Tabs>
    </div>
  );
};
