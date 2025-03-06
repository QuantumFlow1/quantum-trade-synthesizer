
import React from 'react';
import { VirtualEnvironment } from './environment/VirtualEnvironment';
import { EnvironmentProvider } from '@/contexts/EnvironmentContext';
import { UserProgressDisplay } from './user-progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const VirtualEnvironmentDemo: React.FC = () => {
  return (
    <EnvironmentProvider>
      <div className="grid grid-cols-4 gap-6 col-span-full">
        <Card className="col-span-3 backdrop-blur-xl bg-secondary/10 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
          <CardHeader>
            <CardTitle>Virtual Trading Environment</CardTitle>
            <CardDescription>
              Choose from different environments to interact with AI trading agents and complete learning paths
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VirtualEnvironment />
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Select an environment using the settings button in the top-right corner of the visualization.</p>
              <p className="mt-2">Switch between "Explore" and "Learn" modes to interact with the environment or complete educational modules.</p>
            </div>
          </CardContent>
        </Card>
        
        <div className="col-span-1">
          <UserProgressDisplay />
        </div>
      </div>
    </EnvironmentProvider>
  );
};
