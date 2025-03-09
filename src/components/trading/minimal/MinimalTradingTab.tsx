
import { useState, useEffect } from "react";
import { useTradingChartData } from "@/hooks/use-trading-chart-data";
import { StockbotHeader } from "./components/StockbotHeader";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ApiKeyDialogContent } from "@/components/chat/api-keys/ApiKeyDialogContent";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TradingView } from "./components/TradingView";
import { StockbotChat } from "./StockbotChat";
import { TradingAgents } from "./components/TradingAgents";
import { ChartLine, MessagesSquare, Bot } from "lucide-react";

export const MinimalTradingTab = () => {
  const [isSimulationMode, setIsSimulationMode] = useState(true);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [activeTab, setActiveTab] = useState("trading-view");
  
  // Use the trading chart data hook
  const { 
    data, 
    apiStatus, 
    useRealData, 
    toggleRealData 
  } = useTradingChartData(isSimulationMode);

  // Check if Groq API key is available
  useEffect(() => {
    const groqKey = localStorage.getItem('groqApiKey');
    setHasApiKey(!!groqKey);
    
    // Check if we should open the Trading Agents tab by default
    const openTradingAgentsTab = localStorage.getItem('openTradingAgentsTab');
    if (openTradingAgentsTab === 'true') {
      setActiveTab('trading-agents');
      // Clear the flag after processing
      localStorage.removeItem('openTradingAgentsTab');
    }
    
    // Listen for API key updates
    const handleApiKeyUpdate = () => {
      const updatedGroqKey = localStorage.getItem('groqApiKey');
      setHasApiKey(!!updatedGroqKey);
      
      if (updatedGroqKey) {
        toast({
          title: "API Key Configured",
          description: "Stockbot trading assistant is now ready to use",
          duration: 3000
        });
      }
    };
    
    window.addEventListener('apikey-updated', handleApiKeyUpdate);
    
    return () => {
      window.removeEventListener('apikey-updated', handleApiKeyUpdate);
    };
  }, []);
  
  const clearChat = () => {
    // Implement clear chat functionality
    toast({
      title: "Chat Cleared",
      description: "Your conversation history has been cleared",
      duration: 3000
    });
  };
  
  const openApiKeyDialog = () => {
    setShowApiKeyDialog(true);
  };
  
  const closeApiKeyDialog = () => {
    setShowApiKeyDialog(false);
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] border rounded-lg overflow-hidden">
      <StockbotHeader 
        isSimulationMode={isSimulationMode}
        setIsSimulationMode={setIsSimulationMode}
        clearChat={clearChat}
        showApiKeyDialog={openApiKeyDialog}
        hasApiKey={hasApiKey}
        isUsingRealData={useRealData}
        toggleRealData={toggleRealData}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-2 justify-start">
          <TabsTrigger value="trading-view" className="flex items-center space-x-2">
            <ChartLine className="h-4 w-4" />
            <span>Trading View</span>
          </TabsTrigger>
          <TabsTrigger value="stockbot-chat" className="flex items-center space-x-2">
            <MessagesSquare className="h-4 w-4" />
            <span>Chat</span>
          </TabsTrigger>
          <TabsTrigger value="trading-agents" className="flex items-center space-x-2">
            <Bot className="h-4 w-4" />
            <span>Trading Agents</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="trading-view" className="flex-1 p-4 overflow-auto">
          <TradingView chartData={data} apiStatus={apiStatus} useRealData={useRealData} />
        </TabsContent>
        
        <TabsContent value="stockbot-chat" className="flex-1 overflow-hidden">
          <StockbotChat hasApiKey={hasApiKey} marketData={data} />
        </TabsContent>
        
        <TabsContent value="trading-agents" className="flex-1 p-4 overflow-auto">
          <TradingAgents hasApiKey={hasApiKey} showApiKeyDialog={openApiKeyDialog} />
        </TabsContent>
      </Tabs>
      
      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent>
          <ApiKeyDialogContent 
            initialTab="groq" 
            onClose={closeApiKeyDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
