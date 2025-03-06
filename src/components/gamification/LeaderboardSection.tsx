
import React, { useState } from 'react';
import { Trophy, Users, Layers } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LeaderboardData } from '@/types/gamification';
import { Badge } from '@/components/ui/badge';
import { LeaderboardEntries } from './leaderboard/LeaderboardEntries';
import { EmptyLeaderboard } from './leaderboard/EmptyLeaderboard';
import { LoadingLeaderboard } from './leaderboard/LoadingLeaderboard';
import { EnvironmentTabs } from './leaderboard/EnvironmentTabs';

interface LeaderboardSectionProps {
  leaderboardData?: LeaderboardData;
  isLoading?: boolean;
  currentUserId?: string;
}

export const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({
  leaderboardData,
  isLoading = false,
  currentUserId
}) => {
  const [activeTab, setActiveTab] = useState<string>('global');
  
  // Environmental tabs data
  const environmentTabs = [
    { id: 'trading-floor', label: 'Trading Floor' },
    { id: 'command-center', label: 'Command Center' },
    { id: 'financial-garden', label: 'Financial Garden' }
  ];
  
  const renderGlobalLeaderboard = () => {
    if (isLoading) {
      return <LoadingLeaderboard />;
    }
    
    if (!leaderboardData?.global || leaderboardData.global.length === 0) {
      return <EmptyLeaderboard />;
    }
    
    return (
      <LeaderboardEntries 
        entries={leaderboardData.global} 
        currentUserId={currentUserId} 
      />
    );
  };
  
  return (
    <Card className="bg-secondary/5 border-secondary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
            Leaderboard
          </CardTitle>
          <Badge variant="outline" className="bg-primary/10">
            <Users className="h-3 w-3 mr-1" />
            {leaderboardData?.global.length || 0} Traders
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 pt-2">
            <TabsList className="w-full">
              <TabsTrigger value="global" className="flex-1">
                Global
              </TabsTrigger>
              <TabsTrigger value="environments" className="flex-1">
                <Layers className="h-4 w-4 mr-2" />
                Environments
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="global" className="mt-0">
            <div className="max-h-[320px] overflow-y-auto">
              {renderGlobalLeaderboard()}
            </div>
          </TabsContent>
          
          <TabsContent value="environments" className="mt-0">
            <EnvironmentTabs 
              environmentTabs={environmentTabs}
              leaderboardData={leaderboardData?.byEnvironment}
              isLoading={isLoading}
              currentUserId={currentUserId}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
