
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TradingView } from "./components/TradingView";
import { TradingAgents } from "./components/TradingAgents";
import { NewsFeed } from "./components/NewsFeed";
import { StockbotChat } from "./StockbotChat";

interface MinimalTradingTabProps {
  initialOpenAgentsTab?: boolean;
}

export const MinimalTradingTab = ({ initialOpenAgentsTab = false }: MinimalTradingTabProps) => {
  const [activeTab, setActiveTab] = useState("chart");
  
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
        <TradingView />
      </TabsContent>
      
      <TabsContent value="agents" className="space-y-4">
        <TradingAgents />
      </TabsContent>
      
      <TabsContent value="news" className="space-y-4">
        <NewsFeed />
      </TabsContent>
      
      <TabsContent value="chat" className="space-y-4">
        <StockbotChat />
      </TabsContent>
    </Tabs>
  );
};
