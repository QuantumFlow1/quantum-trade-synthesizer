
import React, { useState } from 'react';
import { Trophy, Award, Users, Layers } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LeaderboardEntry, LeaderboardData } from '@/types/gamification';
import { EnvironmentType } from '@/types/virtual-environment';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

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
  
  const renderLeaderboardEntries = (entries: LeaderboardEntry[] = []) => {
    if (isLoading) {
      return Array(5).fill(0).map((_, index) => (
        <div key={index} className="flex items-center p-3 border-b border-secondary/20">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="ml-3 space-y-1 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      ));
    }
    
    if (!entries || entries.length === 0) {
      return (
        <div className="p-6 text-center text-muted-foreground">
          <div className="flex justify-center mb-3">
            <Trophy className="h-12 w-12 text-muted-foreground opacity-30" />
          </div>
          <p>No leaderboard data available yet</p>
          <p className="text-sm mt-2">Complete learning modules and trades to appear on the leaderboard!</p>
        </div>
      );
    }
    
    return entries.slice(0, 10).map((entry, index) => (
      <div 
        key={entry.userId} 
        className={`flex items-center p-3 border-b border-secondary/20 ${
          entry.userId === currentUserId ? 'bg-primary/10' : ''
        }`}
      >
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary/30 text-sm font-bold">
          {index + 1}
        </div>
        <div className="ml-3 flex-1">
          <p className="font-medium">{entry.username}</p>
          <div className="flex items-center text-xs text-muted-foreground">
            <Trophy className="h-3 w-3 mr-1 text-yellow-500" />
            <span>{entry.totalPoints} pts</span>
            <Award className="h-3 w-3 mx-1 text-purple-500" />
            <span>{entry.badgeCount} badges</span>
          </div>
        </div>
        <div className="text-right">
          <Badge variant="outline" className="bg-primary/20 text-primary">
            Level {entry.level}
          </Badge>
        </div>
      </div>
    ));
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
              {renderLeaderboardEntries(leaderboardData?.global)}
            </div>
          </TabsContent>
          
          <TabsContent value="environments" className="mt-0">
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
                    {renderLeaderboardEntries(
                      leaderboardData?.byEnvironment[env.id as EnvironmentType]
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
