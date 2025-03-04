
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApiUnavailableWarningProps {
  apiAvailable: boolean | null;
  onRetryConnection?: () => void;
}

export const ApiUnavailableWarning = ({ 
  apiAvailable, 
  onRetryConnection 
}: ApiUnavailableWarningProps) => {
  if (apiAvailable === true) return null;
  
  return (
    <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg mt-2">
      <div className="flex items-center text-sm text-red-400 mb-2">
        <AlertCircle className="w-4 h-4 mr-2" />
        <span>AI trading signal service is currently unavailable</span>
      </div>
      
      <p className="text-xs text-muted-foreground mb-2">
        Please check if your API key is correctly set in the settings menu or try reconnecting.
      </p>
      
      {onRetryConnection && (
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs" 
          onClick={onRetryConnection}
        >
          Try Reconnecting
        </Button>
      )}
    </div>
  );
};
