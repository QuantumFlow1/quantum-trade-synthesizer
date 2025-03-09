
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface SimulationAlertProps {
  onToggleSimulation: (enabled: boolean) => void;
}

export const SimulationAlert: React.FC<SimulationAlertProps> = ({ onToggleSimulation }) => {
  return (
    <Alert variant="warning" className="border-amber-500 bg-amber-500/10">
      <AlertCircle className="h-4 w-4 text-amber-500" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-sm text-amber-600 dark:text-amber-400">
          You are in simulation mode. No real trades will be executed.
        </span>
        <Button 
          size="sm" 
          variant="outline" 
          className="ml-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white" 
          onClick={() => onToggleSimulation(false)}
        >
          Exit Simulation
        </Button>
      </AlertDescription>
    </Alert>
  );
};
