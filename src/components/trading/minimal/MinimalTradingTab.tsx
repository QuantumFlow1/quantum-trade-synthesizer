
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TradingView } from "./components/TradingView";
import { TradingAgents } from "./components/TradingAgents";
import { NewsFeed } from "./components/NewsFeed";
import { StockbotChat } from "./StockbotChat";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ApiStatus } from "@/hooks/trading-chart/types";

interface MinimalTradingTabProps {
  initialOpenAgentsTab?: boolean;
}

export const MinimalTradingTab = ({ initialOpenAgentsTab = false }: MinimalTradingTabProps) => {
  const [activeTab, setActiveTab] = useState("chart");
  const [selectedPair, setSelectedPair] = useState("BTC/USD");
  const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  
  // Mock chart data for demonstration
  const mockChartData = Array.from({ length: 30 }, (_, i) => ({
    timestamp: Date.now() - (29 - i) * 24 * 60 * 60 * 1000,
    open: 60000 + Math.random() * 2000,
    close: 60000 + Math.random() * 2000,
    high: 60000 + Math.random() * 3000,
    low: 60000 + Math.random() * 1000,
    volume: 10000000 + Math.random() * 5000000
  }));
  
  // Check if Groq API key exists in localStorage
  useEffect(() => {
    const checkApiKey = () => {
      const storedGroqKey = localStorage.getItem("groqApiKey");
      console.log("Groq API Key in MinimalTradingTab:", {
        exists: !!storedGroqKey,
        keyLength: storedGroqKey ? storedGroqKey.length : 0
      });
      setHasApiKey(!!storedGroqKey);
    };
    
    // Initial check
    checkApiKey();
    
    // Listen for API key updates
    const handleApiKeyUpdate = () => {
      checkApiKey();
    };
    
    window.addEventListener('apikey-updated', handleApiKeyUpdate);
    window.addEventListener('localStorage-changed', handleApiKeyUpdate);
    window.addEventListener('storage', handleApiKeyUpdate);
    
    // Set an interval to periodically check for API key updates
    const intervalId = setInterval(checkApiKey, 2000);
    
    // Simulate API status check
    setTimeout(() => {
      const storedGroqKey = localStorage.getItem("groqApiKey");
      setApiStatus(storedGroqKey ? "available" : "unavailable");
    }, 1000);
    
    return () => {
      window.removeEventListener('apikey-updated', handleApiKeyUpdate);
      window.removeEventListener('localStorage-changed', handleApiKeyUpdate);
      window.removeEventListener('storage', handleApiKeyUpdate);
      clearInterval(intervalId);
    };
  }, []);
  
  // Handle initial tab based on prop or localStorage
  useEffect(() => {
    if (initialOpenAgentsTab) {
      setActiveTab("agents");
    } else {
      // Check if there's a stored tab value in localStorage
      const storedTab = localStorage.getItem("tradingActiveTab");
      if (storedTab) {
        setActiveTab(storedTab);
      }
    }
  }, [initialOpenAgentsTab]);
  
  // Save active tab to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("tradingActiveTab", activeTab);
  }, [activeTab]);
  
  // Show API key dialog handler
  const showApiKeyDialog = () => {
    setIsApiKeyDialogOpen(true);
  };
  
  return (
    <Tabs 
      defaultValue="chart" 
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="chart">Price Chart</TabsTrigger>
        <TabsTrigger value="agents">Trading Agents</TabsTrigger>
        <TabsTrigger value="news">Market News</TabsTrigger>
        <TabsTrigger value="chat">Stockbot</TabsTrigger>
      </TabsList>
      
      <TabsContent value="chart" className="space-y-4">
        <TradingView 
          chartData={mockChartData} 
          apiStatus={apiStatus} 
          useRealData={false} 
        />
      </TabsContent>
      
      <TabsContent value="agents" className="space-y-4">
        <TradingAgents 
          hasApiKey={hasApiKey} 
          showApiKeyDialog={showApiKeyDialog} 
        />
      </TabsContent>
      
      <TabsContent value="news" className="space-y-4">
        <NewsFeed selectedPair={selectedPair} />
      </TabsContent>
      
      <TabsContent value="chat" className="space-y-4">
        <StockbotChat 
          hasApiKey={hasApiKey} 
          marketData={mockChartData} 
        />
      </TabsContent>
    </Tabs>
  );
};
