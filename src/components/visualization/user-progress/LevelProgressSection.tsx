
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { UserProgress } from '@/types/virtual-environment';

interface LevelProgressSectionProps {
  userProgress: UserProgress;
}

export const LevelProgressSection: React.FC<LevelProgressSectionProps> = ({ userProgress }) => {
  // Calculate experience needed for next level
  const currentLevelThreshold = (userProgress.level - 1) * 100;
  const nextLevelThreshold = userProgress.level * 100;
  const pointsToNextLevel = nextLevelThreshold - userProgress.totalPoints;
  const levelProgress = ((userProgress.totalPoints - currentLevelThreshold) / 100) * 100;
  
  return (
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
  );
};
