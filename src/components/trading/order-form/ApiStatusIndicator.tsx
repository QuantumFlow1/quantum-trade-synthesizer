
import { AlertTriangle } from "lucide-react";

interface ApiStatusIndicatorProps {
  apiAvailable: boolean;
}

export const ApiStatusIndicator = ({ apiAvailable }: ApiStatusIndicatorProps) => {
  if (apiAvailable) return null;
  
  return (
    <div className="flex items-center text-xs text-red-400 gap-1 mr-2">
      <AlertTriangle className="w-3 h-3" />
      <span>Offline</span>
    </div>
  );
};
