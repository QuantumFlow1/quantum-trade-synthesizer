
import React from 'react';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LevelProgressSection } from './LevelProgressSection';
import { CompletionProgressSection } from './CompletionProgressSection';
import { StatsCards } from './StatsCards';
import { RecentAchievements } from './RecentAchievements';
import { Badge } from '@/components/ui/badge';

export const UserProgressDisplay: React.FC = () => {
  const { userProgress } = useEnvironment();
  
  return (
    <Card className="bg-secondary/10 backdrop-blur-sm border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Trading Experience</CardTitle>
            <CardDescription>Your learning journey progress</CardDescription>
          </div>
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/30">
            Level {userProgress.level}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <LevelProgressSection userProgress={userProgress} />
        <CompletionProgressSection userProgress={userProgress} />
        <StatsCards userProgress={userProgress} />
        
        {userProgress.badges.length > 0 && (
          <RecentAchievements badges={userProgress.badges.slice(0, 3)} />
        )}
      </CardContent>
    </Card>
  );
};
