
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => {
  return (
    <Card className="h-[500px] flex flex-col items-center justify-center p-6 bg-card/50 border-border">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-xl font-medium mb-2">Visualization Error</h3>
      <p className="text-center mb-4 text-muted-foreground">
        There was a problem rendering the 3D visualization. This might be due to WebGL compatibility issues.
      </p>
      <Button onClick={onRetry} variant="outline" className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </Card>
  );
};
