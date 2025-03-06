
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LeaderboardEntry } from '@/types/gamification';
import { EnvironmentType } from '@/types/virtual-environment';
import { LeaderboardEntries } from './LeaderboardEntries';
import { EmptyLeaderboard } from './EmptyLeaderboard';
import { LoadingLeaderboard } from './LoadingLeaderboard';

interface EnvironmentTabsProps {
  environmentTabs: Array<{ id: string; label: string }>;
  leaderboardData?: Record<EnvironmentType, LeaderboardEntry[]>;
  isLoading: boolean;
  currentUserId?: string;
}

export const EnvironmentTabs: React.FC<EnvironmentTabsProps> = ({
  environmentTabs,
  leaderboardData,
  isLoading,
  currentUserId
}) => {
  return (
    <Tabs defaultValue={environmentTabs[0].id} className="w-full">
      <div className="px-4 pt-1">
        <TabsList className="w-full">
          {environmentTabs.map(env => (
            <TabsTrigger key={env.id} value={env.id} className="text-xs">
              {env.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      
      {environmentTabs.map(env => (
        <TabsContent key={env.id} value={env.id} className="mt-0">
          <div className="max-h-[250px] overflow-y-auto">
            {isLoading ? (
              <LoadingLeaderboard />
            ) : !leaderboardData || !leaderboardData[env.id as EnvironmentType] || leaderboardData[env.id as EnvironmentType].length === 0 ? (
              <EmptyLeaderboard />
            ) : (
              <LeaderboardEntries 
                entries={leaderboardData[env.id as EnvironmentType]} 
                currentUserId={currentUserId} 
              />
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
