
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CircleCheckBig, Info, Key } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApiConnectionAlertsProps {
  apiStatus: 'checking' | 'available' | 'unavailable';
  isSimulationMode: boolean;
  apiKeysAvailable: boolean;
  onConfigApiKeys: () => void;
  onEnableSimulation: () => void;
}

export const ApiConnectionAlerts = ({
  apiStatus,
  isSimulationMode,
  apiKeysAvailable,
  onConfigApiKeys,
  onEnableSimulation
}: ApiConnectionAlertsProps) => {
  // Only show alerts when not in simulation mode
  if (isSimulationMode) {
    return (
      <Alert variant="default" className="mb-4 bg-green-500/10 border-green-500">
        <CircleCheckBig className="h-4 w-4 text-green-500" />
        <AlertTitle>Simulation Mode Active</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>Trading with simulated funds. No real money will be used.</p>
          <p className="text-sm text-muted-foreground"><Info className="h-3 w-3 inline mr-1" /> All trading functions work with fake currency in this mode.</p>
        </AlertDescription>
      </Alert>
    );
  }

  if (apiStatus === 'checking') {
    return (
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Checking Trading Services</AlertTitle>
        <AlertDescription>
          Verifying connection to trading services...
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
          {!apiKeysAvailable 
            ? "No API keys configured. Please set up API keys to enable trading functionality."
            : "Trading services are currently unavailable. You can view data but trading functionality is limited."
          }
          <div className="mt-2 flex flex-wrap gap-2">
            {!apiKeysAvailable && (
              <Button 
                variant="outline" 
                size="sm" 
                id="api-keys-config-btn"
                onClick={onConfigApiKeys}
                className="bg-white/10"
              >
                <Key className="h-3.5 w-3.5 mr-1" />
                Configure API Keys
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onEnableSimulation}
              className="bg-white/10"
            >
              Enable Simulation Mode
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
