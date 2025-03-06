
import React from 'react';
import { Trophy, Award } from 'lucide-react';
import { UserProgress } from '@/types/virtual-environment';

interface StatsCardsProps {
  userProgress: UserProgress;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ userProgress }) => {
  return (
    <div className="grid grid-cols-2 gap-4 pt-2">
      <StatCard 
        icon={<Trophy className="h-5 w-5 text-blue-500" />}
        iconBgColor="bg-blue-500/20"
        label="Total Points"
        value={userProgress.totalPoints}
      />
      
      <StatCard 
        icon={<Award className="h-5 w-5 text-purple-500" />}
        iconBgColor="bg-purple-500/20"
        label="Badges"
        value={userProgress.badges.length}
      />
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  iconBgColor: string;
  label: string;
  value: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, iconBgColor, label, value }) => {
  return (
    <div className="bg-secondary/20 p-3 rounded-lg border border-secondary/30 flex items-center gap-3">
      <div className={`h-10 w-10 rounded-full ${iconBgColor} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
};
