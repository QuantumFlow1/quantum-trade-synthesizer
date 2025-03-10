
import React from 'react';
import { AlertTriangle, Info, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StockbotAlertsProps {
  hasApiKey: boolean;
  isSimulationMode: boolean;
  isCheckingAdminKey?: boolean;
  showApiKeyDialog: () => void;
  setIsSimulationMode: (mode: boolean) => void;
  handleForceReload: () => Promise<void>;
}

export const StockbotAlerts: React.FC<StockbotAlertsProps> = ({
  hasApiKey,
  isSimulationMode,
  isCheckingAdminKey,
  showApiKeyDialog,
  setIsSimulationMode,
  handleForceReload
}) => {
  if (isCheckingAdminKey) {
    return (
      <div className="p-3 bg-blue-50 border-b border-blue-200 text-sm text-blue-700 flex items-center">
        <RefreshCw size={14} className="animate-spin mr-2" />
        <span>Checking Groq API connection...</span>
      </div>
    );
  }
  
  // If has API key but in simulation mode, show option to switch to AI mode
  if (hasApiKey && isSimulationMode) {
    return (
      <div className="p-3 bg-blue-50 border-b border-blue-200 text-sm text-blue-700 flex justify-between items-center">
        <div className="flex items-center">
          <Info size={14} className="mr-2" />
          <span>API key is available, but simulation mode is active</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-xs bg-white"
          onClick={() => setIsSimulationMode(false)}
        >
          Switch to AI mode
        </Button>
      </div>
    );
  }
  
  // If no API key, show fallback to simulation mode
  if (!hasApiKey && !isSimulationMode) {
    return (
      <div className="p-3 bg-amber-50 border-b border-amber-200 text-sm text-amber-700 flex justify-between items-center">
        <div className="flex items-center">
          <AlertTriangle size={14} className="mr-2" />
          <span>No API key available, switch to simulation mode</span>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-white"
            onClick={handleForceReload}
          >
            <RefreshCw size={12} className="mr-1" />
            Check Again
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-white"
            onClick={() => setIsSimulationMode(true)}
          >
            Simulation Mode
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-white"
            onClick={showApiKeyDialog}
          >
            Configure API Key
          </Button>
        </div>
      </div>
    );
  }
  
  // If no alerts needed, return null to hide the component
  return null;
};
