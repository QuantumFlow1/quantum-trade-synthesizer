
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

// Define the EnvironmentLeaderboard interface here since it's not exported from the types
interface EnvironmentLeaderboard {
  id: string;
  name: string;
  entries: any[];
}

interface EnvironmentTabsProps {
  environments: EnvironmentLeaderboard[];
  activeEnvironment: string;
  setActiveEnvironment: (id: string) => void;
}

export const EnvironmentTabs: React.FC<EnvironmentTabsProps> = ({
  environments,
  activeEnvironment,
  setActiveEnvironment
}) => {
  return (
    <div>
      <ScrollArea className="max-h-[320px]">
        <div className="p-3 space-y-1">
          <Button
            variant={activeEnvironment === 'global' ? 'secondary' : 'ghost'}
            size="sm"
            className="w-full justify-start"
            onClick={() => setActiveEnvironment('global')}
          >
            Global Leaderboard
          </Button>
          
          {environments.map((env) => (
            <Button
              key={env.id}
              variant={activeEnvironment === env.id ? 'secondary' : 'ghost'}
              size="sm"
              className="w-full justify-start"
              onClick={() => setActiveEnvironment(env.id)}
            >
              {env.name}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
