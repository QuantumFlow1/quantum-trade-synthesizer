
import React from 'react';
import { Settings, RefreshCw, Key, Database } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

interface StockbotHeaderProps {
  isSimulationMode: boolean;
  setIsSimulationMode: (mode: boolean) => void;
  clearChat: () => void;
  showApiKeyDialog: () => void;
  hasApiKey: boolean;
  isUsingRealData?: boolean;
  toggleRealData?: () => void;
}

export const StockbotHeader: React.FC<StockbotHeaderProps> = ({
  isSimulationMode,
  setIsSimulationMode,
  clearChat,
  showApiKeyDialog,
  hasApiKey,
  isUsingRealData = false,
  toggleRealData = () => {}
}) => {
  // Function to handle the simulation mode toggle directly
  const handleSimulationToggle = (checked: boolean) => {
    console.log("Toggling simulation mode:", checked);
    console.log("Current API key status:", { hasApiKey });
    
    // If there's no API key and user is trying to turn off simulation mode
    if (!hasApiKey && !checked) {
      console.log("Cannot turn off simulation mode without API key");
      toast({
        title: "API Key Required",
        description: "You need to configure an API key to use real AI mode",
        variant: "warning"
      });
      showApiKeyDialog(); // Show the API key dialog to let the user add their key
      return;
    }
    
    setIsSimulationMode(checked);
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b">
      <div className="flex items-center space-x-2">
        <h3 className="font-medium">Stockbot</h3>
        <span className={`text-xs px-1.5 py-0.5 rounded ${hasApiKey ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
          {hasApiKey ? 'Live' : 'Limited'}
        </span>
        {isUsingRealData && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
            Real Data
          </span>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {/* Simulation toggle outside the dropdown for direct access */}
        <div className="flex items-center mr-2 border rounded px-2 py-1 bg-gray-50">
          <span className="text-xs mr-2">Simulation</span>
          <Switch
            checked={isSimulationMode}
            onCheckedChange={handleSimulationToggle}
            aria-label="Toggle simulation mode"
            disabled={!hasApiKey && !isSimulationMode}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={clearChat}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Clear Chat
            </DropdownMenuItem>
            <DropdownMenuItem onClick={showApiKeyDialog}>
              <Key className="mr-2 h-4 w-4" />
              Configure API Key
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={toggleRealData}>
              <Database className="mr-2 h-4 w-4" />
              {isUsingRealData ? "Use Simulated Data" : "Use Real Market Data"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
