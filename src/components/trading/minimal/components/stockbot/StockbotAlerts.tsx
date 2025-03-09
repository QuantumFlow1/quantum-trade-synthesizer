
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface StockbotAlertsProps {
  hasApiKey: boolean;
  isSimulationMode: boolean;
  showApiKeyDialog: () => void;
  setIsSimulationMode: (value: boolean) => void;
  handleForceReload: () => void;
}

export const StockbotAlerts = ({
  hasApiKey,
  isSimulationMode,
  showApiKeyDialog,
  setIsSimulationMode,
  handleForceReload,
}: StockbotAlertsProps) => {
  return (
    <>
      {!hasApiKey && !isSimulationMode && (
        <Alert variant="warning" className="m-3">
          <AlertTitle>API Key Required</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>Please set your Groq API key to enable full Stockbot functionality.</p>
            <div className="flex flex-wrap gap-2 mt-1">
              <button 
                onClick={showApiKeyDialog}
                className="text-amber-800 underline font-medium self-start"
              >
                Configure API Key
              </button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleForceReload}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Refresh Status
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {hasApiKey && !isSimulationMode && (
        <Alert variant="default" className="bg-green-50 border-green-200 text-green-700 m-3">
          <AlertTitle>API Key Configured</AlertTitle>
          <AlertDescription className="flex flex-col gap-1">
            <p>Your Groq API key is set up and ready to use with Stockbot.</p>
            <div className="text-xs text-green-600 mt-1">
              Key length: {hasApiKey ? localStorage.getItem("groqApiKey")?.length || 0 : 0} characters
            </div>
          </AlertDescription>
        </Alert>
      )}

      {isSimulationMode && (
        <Alert variant="warning" className="m-3">
          <AlertTitle>Simulation Mode Active</AlertTitle>
          <AlertDescription>
            <p>Stockbot is using simulated responses instead of real AI analysis.</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {hasApiKey && (
                <button 
                  onClick={() => setIsSimulationMode(false)}
                  className="text-amber-800 underline font-medium"
                >
                  Switch to real AI mode
                </button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleForceReload}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Refresh API Status
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
