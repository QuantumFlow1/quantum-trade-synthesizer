
import React from 'react';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Award, BarChart, Trophy, Users } from 'lucide-react';

export const UserProgressDisplay: React.FC = () => {
  const { userProgress } = useEnvironment();
  
  // Calculate total progress across all environments
  const totalModules = Object.values(userProgress.learningPaths).reduce(
    (sum, path) => sum + path.totalModules, 0
  );
  
  const completedModules = Object.values(userProgress.learningPaths).reduce(
    (sum, path) => sum + path.completedModules, 0
  );
  
  const totalCompletionPercentage = totalModules > 0 
    ? Math.round((completedModules / totalModules) * 100) 
    : 0;
  
  // Calculate experience needed for next level
  const currentLevelThreshold = (userProgress.level - 1) * 100;
  const nextLevelThreshold = userProgress.level * 100;
  const pointsToNextLevel = nextLevelThreshold - userProgress.totalPoints;
  const levelProgress = ((userProgress.totalPoints - currentLevelThreshold) / 100) * 100;
  
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
        {/* Level Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span>Level Progress</span>
            <span>{userProgress.totalPoints} / {nextLevelThreshold} XP</span>
          </div>
          <Progress value={levelProgress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {pointsToNextLevel} points until Level {userProgress.level + 1}
          </p>
        </div>
        
        {/* Overall Completion */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span>Overall Completion</span>
            <span>{completedModules} / {totalModules} Modules</span>
          </div>
          <Progress value={totalCompletionPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {userProgress.completedEnvironments.length} of {Object.keys(userProgress.learningPaths).length} environments mastered
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-secondary/20 p-3 rounded-lg border border-secondary/30 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Total Points</p>
              <p className="text-xl font-bold">{userProgress.totalPoints}</p>
            </div>
          </div>
          
          <div className="bg-secondary/20 p-3 rounded-lg border border-secondary/30 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Award className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Badges</p>
              <p className="text-xl font-bold">{userProgress.badges.length}</p>
            </div>
          </div>
        </div>
        
        {/* Badges */}
        {userProgress.badges.length > 0 && (
          <div className="pt-2">
            <h3 className="text-sm font-medium mb-2">Recent Achievements</h3>
            <div className="grid grid-cols-1 gap-2">
              {userProgress.badges.slice(0, 3).map(badge => (
                <div key={badge.id} className="flex items-center gap-3 p-2 bg-secondary/10 rounded-md border border-secondary/20">
                  <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
