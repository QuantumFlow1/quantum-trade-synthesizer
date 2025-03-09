
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Trash2 } from "lucide-react";

interface StockbotHeaderProps {
  isSimulationMode: boolean;
  setIsSimulationMode: (isSimulation: boolean) => void;
  clearChat: () => void;
}

export const StockbotHeader: React.FC<StockbotHeaderProps> = ({
  isSimulationMode,
  setIsSimulationMode,
  clearChat
}) => {
  return (
    <CardHeader className="py-3 px-4 border-b flex flex-row items-center justify-between space-y-0">
      <CardTitle className="text-lg font-medium flex items-center">
        <Bot className="w-5 h-5 mr-2 text-blue-500" />
        Stockbot Trading Assistant
      </CardTitle>
      <div className="flex space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsSimulationMode(!isSimulationMode)}
          className={isSimulationMode ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : ""}
        >
          {isSimulationMode ? "Demo Mode" : "Live Mode"}
        </Button>
        <Button variant="ghost" size="icon" onClick={clearChat}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );
};
