
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

export const SimulationAlert: React.FC = () => {
  return (
    <Alert variant="success" className="bg-green-500/10">
      <CheckCircle className="h-4 w-4 text-green-500" />
      <AlertDescription>
        Simulation mode active. Trade decisions will not affect real balances.
      </AlertDescription>
    </Alert>
  );
};
