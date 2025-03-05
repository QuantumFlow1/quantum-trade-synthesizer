
import React from 'react';
import { VirtualEnvironment } from './environment/VirtualEnvironment';
import { EnvironmentProvider } from '@/contexts/EnvironmentContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const VirtualEnvironmentDemo: React.FC = () => {
  return (
    <EnvironmentProvider>
      <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <CardHeader>
          <CardTitle>Virtual Trading Environment</CardTitle>
          <CardDescription>
            Choose from different environments to interact with AI trading agents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VirtualEnvironment />
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Select an environment using the settings button in the top-right corner of the visualization.</p>
            <p className="mt-2">Each environment provides a unique setting for interacting with AI agents and visualizing market data.</p>
          </div>
        </CardContent>
      </Card>
    </EnvironmentProvider>
  );
};
