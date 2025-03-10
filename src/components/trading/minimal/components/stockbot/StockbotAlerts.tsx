
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
  setIsSimulationMode,
  handleForceReload
}) => {
  if (isCheckingAdminKey) {
    return (
      <div className="p-3 bg-blue-50 border-b border-blue-200 text-sm text-blue-700 flex items-center">
        <RefreshCw size={14} className="animate-spin mr-2" />
        <span>Verbinding met Groq API Wordt Gecontroleerd...</span>
      </div>
    );
  }
  
  // If has API key but in simulation mode, show option to switch to AI mode
  if (hasApiKey && isSimulationMode) {
    return (
      <div className="p-3 bg-blue-50 border-b border-blue-200 text-sm text-blue-700 flex justify-between items-center">
        <div className="flex items-center">
          <Info size={14} className="mr-2" />
          <span>API Sleutel is beschikbaar, maar simulatiemodus is actief</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-xs bg-white"
          onClick={() => setIsSimulationMode(false)}
        >
          Schakel naar AI-modus
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
          <span>Geen API sleutel beschikbaar, schakel over naar simulatiemodus</span>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-white"
            onClick={handleForceReload}
          >
            <RefreshCw size={12} className="mr-1" />
            Hercontroleer
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-white"
            onClick={() => setIsSimulationMode(true)}
          >
            Simulatiemodus
          </Button>
        </div>
      </div>
    );
  }
  
  // If no alerts needed, return null to hide the component
  return null;
};
