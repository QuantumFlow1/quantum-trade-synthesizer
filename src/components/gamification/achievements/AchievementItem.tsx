
import React from 'react';
import { CheckCircle2, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TradeAchievement } from '@/types/gamification';

interface AchievementItemProps {
  achievement: TradeAchievement;
  isCompleted: boolean;
  progress: number;
}

export const AchievementItem: React.FC<AchievementItemProps> = ({
  achievement,
  isCompleted,
  progress
}) => {
  return (
    <div 
      className={`p-3 rounded-lg border ${
        isCompleted 
          ? 'border-green-500/30 bg-green-500/5' 
          : 'border-secondary/20 bg-secondary/10'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <h3 className="font-medium">{achievement.name}</h3>
            {isCompleted && (
              <CheckCircle2 className="h-4 w-4 ml-2 text-green-500" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">{achievement.description}</p>
          
          {!isCompleted && progress > 0 && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
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
  );
};
