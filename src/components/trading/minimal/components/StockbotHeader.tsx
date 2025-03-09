
import { Settings, RefreshCw, Key } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface StockbotHeaderProps {
  isSimulationMode: boolean;
  setIsSimulationMode: (mode: boolean) => void;
  clearChat: () => void;
  showApiKeyDialog: () => void;
  hasApiKey: boolean;
}

export const StockbotHeader: React.FC<StockbotHeaderProps> = ({
  isSimulationMode,
  setIsSimulationMode,
  clearChat,
  showApiKeyDialog,
  hasApiKey
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b">
      <div className="flex items-center space-x-2">
        <h3 className="font-medium">Stockbot</h3>
        <span className={`text-xs px-1.5 py-0.5 rounded ${hasApiKey ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
          {hasApiKey ? 'Live' : 'Limited'}
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center mr-2">
          <span className="text-xs mr-2">Simulation</span>
          <Switch
            checked={isSimulationMode}
            onCheckedChange={setIsSimulationMode}
            className="h-4 w-7"
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
