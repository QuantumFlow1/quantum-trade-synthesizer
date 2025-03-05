
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CircleCheckBig } from "lucide-react";

interface ApiStatusIndicatorProps {
  apiStatus: 'checking' | 'available' | 'unavailable';
  isSimulationMode: boolean;
}

export const ApiStatusIndicator: React.FC<ApiStatusIndicatorProps> = ({
  apiStatus,
  isSimulationMode
}) => {
  // Skip showing status if in simulation mode
  if (isSimulationMode) {
    return null;
  }

  if (apiStatus === 'checking') {
    return (
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Checking API Connection</AlertTitle>
        <AlertDescription>
          Verifying connection to market data services...
        </AlertDescription>
      </Alert>
    );
  }

  if (apiStatus === 'unavailable') {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>API Connection Issue</AlertTitle>
        <AlertDescription>
          Could not connect to market data services. Some features may be unavailable.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="default" className="mb-4 bg-green-500/10 border-green-500">
      <CircleCheckBig className="h-4 w-4 text-green-500" />
      <AlertTitle>API Connected</AlertTitle>
      <AlertDescription>
        Successfully connected to market data services.
      </AlertDescription>
    </Alert>
  );
};
