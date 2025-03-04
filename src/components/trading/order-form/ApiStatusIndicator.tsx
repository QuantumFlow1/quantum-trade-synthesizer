
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface ApiStatusIndicatorProps {
  apiAvailable: boolean | null;
  isChecking?: boolean;
}

export const ApiStatusIndicator = ({ 
  apiAvailable, 
  isChecking = false 
}: ApiStatusIndicatorProps) => {
  if (isChecking) {
    return (
      <div className="flex items-center text-xs text-yellow-400 gap-1 mr-2">
        <div className="animate-spin w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full" />
        <span>Checking...</span>
      </div>
    );
  }
  
  if (apiAvailable === null) {
    return null;
  }
  
  if (!apiAvailable) {
    return (
      <div className="flex items-center text-xs text-red-400 gap-1 mr-2">
        <AlertTriangle className="w-3 h-3" />
        <span>Offline</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center text-xs text-green-400 gap-1 mr-2">
      <CheckCircle2 className="w-3 h-3" />
      <span>Online</span>
    </div>
  );
};
