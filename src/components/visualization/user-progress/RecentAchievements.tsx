
import React from 'react';
import { Trophy } from 'lucide-react';
import { UserBadge } from '@/types/virtual-environment';

interface RecentAchievementsProps {
  badges: UserBadge[];
}

export const RecentAchievements: React.FC<RecentAchievementsProps> = ({ badges }) => {
  return (
    <div className="pt-2">
      <h3 className="text-sm font-medium mb-2">Recent Achievements</h3>
      <div className="grid grid-cols-1 gap-2">
        {badges.map(badge => (
          <BadgeItem key={badge.id} badge={badge} />
        ))}
      </div>
    </div>
  );
};

interface BadgeItemProps {
  badge: UserBadge;
}

const BadgeItem: React.FC<BadgeItemProps> = ({ badge }) => {
  return (
    <div className="flex items-center gap-3 p-2 bg-secondary/10 rounded-md border border-secondary/20">
      <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
        <Trophy className="h-4 w-4 text-yellow-500" />
      </div>
      <div>
        <p className="font-medium text-sm">{badge.name}</p>
        <p className="text-xs text-muted-foreground">{badge.description}</p>
      </div>
    </div>
  );
};
