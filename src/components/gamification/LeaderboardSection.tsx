
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeaderboardEntries } from './leaderboard/LeaderboardEntries';
import { EmptyLeaderboard } from './leaderboard/EmptyLeaderboard';
import { LoadingLeaderboard } from './leaderboard/LoadingLeaderboard';
import { EnvironmentTabs } from './leaderboard/EnvironmentTabs';
import { LeaderboardData } from '@/types/gamification';
import { EnvironmentType } from '@/types/virtual-environment';

interface LeaderboardSectionProps {
  leaderboardData: LeaderboardData;
  currentUserId: string;
}

export const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({
  leaderboardData,
  currentUserId
}) => {
  const [activeEnvironment, setActiveEnvironment] = React.useState('global');
  
  // Convert byEnvironment record to array format expected by EnvironmentTabs
  const environmentsList = Object.entries(leaderboardData.byEnvironment || {}).map(([id, entries]) => ({
    id,
    name: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    entries
  }));
  
  // Get the appropriate entries based on active environment
  const getEntries = () => {
    if (activeEnvironment === 'global') {
      return leaderboardData.global;
    }
    
    const envData = leaderboardData.byEnvironment?.[activeEnvironment as EnvironmentType];
    return envData || [];
  };
  
  const entries = getEntries();
  const isLoading = !leaderboardData || !leaderboardData.global;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Leaderboard</CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="leaderboard" className="w-full">
          <div className="border-b px-3">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
              <TabsTrigger 
                value="leaderboard" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:border-b-2 rounded-none py-2"
              >
                Leaderboard
              </TabsTrigger>
              <TabsTrigger 
                value="environments" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:border-b-2 rounded-none py-2"
              >
                Environments
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="leaderboard" className="pt-0 px-0">
            {isLoading ? (
              <LoadingLeaderboard />
            ) : entries.length === 0 ? (
              <EmptyLeaderboard />
            ) : (
              <LeaderboardEntries 
                entries={entries} 
                currentUserId={currentUserId} 
              />
            )}
          </TabsContent>
          
          <TabsContent value="environments" className="pt-0">
            <EnvironmentTabs 
              environments={environmentsList} 
              activeEnvironment={activeEnvironment}
              setActiveEnvironment={setActiveEnvironment}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
