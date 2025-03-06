
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface GamificationHeaderProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const GamificationHeader: React.FC<GamificationHeaderProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold mb-2">Gamification Dashboard</h1>
        <p className="text-muted-foreground">
          Track your progress, achievements, and compete with other traders
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4 mt-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
