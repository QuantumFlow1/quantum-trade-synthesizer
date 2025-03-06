
import React from 'react';
import { Check, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GamificationReward } from '@/types/gamification';

interface RewardItemProps {
  reward: GamificationReward;
  isUnlocked: boolean;
  canUnlock: boolean;
}

export const RewardItem: React.FC<RewardItemProps> = ({
  reward,
  isUnlocked,
  canUnlock
}) => {
  return (
    <div 
      className={`p-3 rounded-lg border ${
        isUnlocked 
          ? 'border-purple-500/30 bg-purple-500/5' 
          : 'border-secondary/20 bg-secondary/10'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <h3 className="font-medium">{reward.name}</h3>
            {isUnlocked ? (
              <Check className="h-4 w-4 ml-2 text-green-500" />
            ) : (
              <Lock className="h-4 w-4 ml-2 text-muted-foreground" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">{reward.description}</p>
        </div>
        <div className="ml-3 flex flex-col items-end">
          <Badge className={`${
            isUnlocked ? 'bg-purple-500/20 text-purple-500 border-purple-500/20' : 
            canUnlock ? 'bg-green-500/20 text-green-500 border-green-500/20' : 
            'bg-secondary/20 text-muted-foreground'
          }`}>
            {reward.pointsRequired} pts
          </Badge>
          
          {!isUnlocked && canUnlock && (
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
  );
};
