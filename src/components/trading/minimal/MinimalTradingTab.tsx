
import { useState, useEffect } from "react";
import { useTradingChartData } from "@/hooks/use-trading-chart-data";
import { StockbotHeader } from "./components/StockbotHeader";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ApiKeyDialogContent } from "@/components/chat/api-keys/ApiKeyDialogContent";
import { toast } from "@/hooks/use-toast";

export const MinimalTradingTab = () => {
  const [isSimulationMode, setIsSimulationMode] = useState(true);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  
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
      
      <div className="flex-1 p-4 overflow-auto">
        {/* Add your trading chart and chat components here */}
        <div className="mb-4 p-4 border rounded bg-gray-50">
          <h3 className="font-medium mb-2">Market Data Source</h3>
          <p className="text-sm text-gray-600">
            {useRealData 
              ? "Using real cryptocurrency data from CoinGecko API" 
              : "Using simulated market data"}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            API Status: {apiStatus === 'available' 
              ? "Available" 
              : apiStatus === 'checking' 
                ? "Checking..." 
                : "Unavailable"}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Data points: {data.length}
          </p>
        </div>
        
        {/* Add your other components here */}
      </div>
      
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
