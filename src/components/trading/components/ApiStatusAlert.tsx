
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApiStatusAlertProps {
  isChecking: boolean;
  isAvailable: boolean;
  onRetryConnection: () => void;
  simulationMode: boolean;
}

export const ApiStatusAlert = ({ 
  isChecking, 
  isAvailable, 
  onRetryConnection,
  simulationMode
}: ApiStatusAlertProps) => {
  if (isChecking && !simulationMode) {
    return (
      <div className="mb-4 p-2 bg-blue-500/10 rounded-md flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center">
          <RefreshCw className="h-4 w-4 mr-2 text-blue-500 animate-spin" />
          Controleren van verbinding met trading services...
        </div>
      </div>
    );
  }

  if (!isAvailable && !isChecking && !simulationMode) {
    return (
      <div className="mb-4 p-2 bg-red-500/10 rounded-md flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center">
          <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
          Trading services niet beschikbaar. Activeer simulatiemodus om toch te kunnen handelen met nepgeld.
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRetryConnection}
          className="text-xs"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Opnieuw proberen
        </Button>
      </div>
    );
  }

  return null;
};
