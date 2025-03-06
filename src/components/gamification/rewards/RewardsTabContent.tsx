
import React from 'react';
import { RewardItem } from './RewardItem';
import { GamificationReward } from '@/types/gamification';

interface RewardsTabContentProps {
  rewards: GamificationReward[];
  unlockedRewards: string[];
  userPoints: number;
}

export const RewardsTabContent: React.FC<RewardsTabContentProps> = ({
  rewards,
  unlockedRewards,
  userPoints
}) => {
  const isRewardUnlocked = (id: string) => unlockedRewards.includes(id);
  
  const canUnlockReward = (pointsRequired: number) => userPoints >= pointsRequired;

  return (
    <div className="max-h-[320px] overflow-y-auto p-3 space-y-3">
      {rewards.map(reward => (
        <RewardItem 
          key={reward.id}
          reward={reward}
          isUnlocked={isRewardUnlocked(reward.id)}
          canUnlock={canUnlockReward(reward.pointsRequired)}
        />
      ))}
    </div>
  );
};
