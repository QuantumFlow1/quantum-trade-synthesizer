
import React from 'react';
import { AchievementItem } from './AchievementItem';
import { TradeAchievement } from '@/types/gamification';

interface AchievementsTabContentProps {
  achievements: TradeAchievement[];
  completedAchievements: string[];
  inProgressAchievements: Array<{ id: string; progress: number }>;
}

export const AchievementsTabContent: React.FC<AchievementsTabContentProps> = ({
  achievements,
  completedAchievements,
  inProgressAchievements
}) => {
  const isAchievementCompleted = (id: string) => completedAchievements.includes(id);
  
  const getAchievementProgress = (id: string) => {
    const achievement = inProgressAchievements.find(a => a.id === id);
    return achievement ? achievement.progress : 0;
  };

  return (
    <div className="max-h-[320px] overflow-y-auto p-3 space-y-3">
      {achievements.map(achievement => (
        <AchievementItem 
          key={achievement.id}
          achievement={achievement}
          isCompleted={isAchievementCompleted(achievement.id)}
          progress={getAchievementProgress(achievement.id)}
        />
      ))}
    </div>
  );
};
