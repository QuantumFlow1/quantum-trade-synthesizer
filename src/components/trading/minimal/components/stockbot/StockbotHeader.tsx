
import React from "react";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

interface StockbotHeaderProps {
  clearChat: () => void;
  showApiKeyDialog: () => void;
  hasApiKey: boolean;
  isUsingRealData: boolean;
  toggleRealData: () => void;
  isSimulationMode: boolean;
  setIsSimulationMode: (value: boolean) => void;
}

export const StockbotHeader: React.FC<StockbotHeaderProps> = ({
  clearChat,
  showApiKeyDialog,
  hasApiKey,
  isUsingRealData,
  toggleRealData,
  isSimulationMode,
  setIsSimulationMode
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
        <Bot className="h-5 w-5 mr-2 text-primary" />
        <h3 className="font-semibold">Stockbot</h3>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleRealData}
          disabled={!hasApiKey}
        >
          {isUsingRealData ? "Simulatie" : "Live data"}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={showApiKeyDialog}
        >
          API sleutel
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setIsSimulationMode(!isSimulationMode)}
        >
          {isSimulationMode ? "Simulatie uit" : "Simulatie aan"}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearChat}
        >
          Wissen
        </Button>
      </div>
    </div>
  );
};
