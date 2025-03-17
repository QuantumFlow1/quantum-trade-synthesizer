
import { RefreshCw, Trash2, Key, Bolt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardHeader } from "@/components/ui/card";

interface StockbotHeaderProps {
  clearChat: () => void;
  showApiKeyDialog: () => void;
  hasApiKey: boolean;
  isUsingRealData: boolean;
  toggleRealData: () => void;
}

export const StockbotHeader = ({
  clearChat,
  showApiKeyDialog,
  hasApiKey,
  isUsingRealData,
  toggleRealData
}: StockbotHeaderProps) => {
  return (
    <CardHeader className="p-3 border-b flex flex-row items-center justify-between">
      <div className="flex items-center">
        <h3 className="font-semibold mr-2">Stockbot</h3>
        {hasApiKey ? (
          <Badge className="bg-green-500">API Connected</Badge>
        ) : (
          <Badge variant="outline" className="border-amber-500 text-amber-500">
            API Key Required
          </Badge>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="ml-2"
          onClick={toggleRealData}
          title={`Toggle to ${isUsingRealData ? 'simplified' : 'detailed'} data display`}
        >
          <Bolt className={`h-4 w-4 ${isUsingRealData ? 'text-blue-500' : 'text-gray-500'}`} />
        </Button>
      </div>
      
      <div className="flex space-x-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={showApiKeyDialog}
          title="Configure API Key"
        >
          <Key className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={clearChat}
          title="Clear Chat"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );
}
