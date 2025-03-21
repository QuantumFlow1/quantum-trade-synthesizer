
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins, LineChart, MessageSquare, Bot } from "lucide-react";
import MarketOverview from "@/components/MarketOverview";
import { TradingView } from "./components/trading-view";
import { StockbotChat } from "./components/stockbot/StockbotChat";
import { useAgents } from "@/hooks/use-agents";
import { AITradingAgents } from "./components/AITradingAgents";

interface MinimalTradingTabProps {
  initialOpenAgentsTab?: boolean;
}

export const MinimalTradingTab = ({ initialOpenAgentsTab = false }: MinimalTradingTabProps) => {
  const [activeTab, setActiveTab] = useState("market");
  const { agents } = useAgents();

  // Set active tab to stockbot if initialOpenAgentsTab is true
  useEffect(() => {
    if (initialOpenAgentsTab) {
      setActiveTab("stockbot");
    }
  }, [initialOpenAgentsTab]);

  return (
    <Card className="col-span-4">
      <CardContent className="pl-2 pb-2 pt-0 pr-0 h-full">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="market" className="col-span-1">
              <LineChart className="h-4 w-4 mr-2" />
              Markt
            </TabsTrigger>
            <TabsTrigger value="trading" className="col-span-1">
              <Coins className="h-4 w-4 mr-2" />
              Trading
            </TabsTrigger>
            <TabsTrigger value="agents" className="col-span-1">
              <Bot className="h-4 w-4 mr-2" />
              AI Agents
            </TabsTrigger>
            <TabsTrigger value="stockbot" className="col-span-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Stockbot
            </TabsTrigger>
          </TabsList>
          <TabsContent value="market" className="h-full p-2">
            <MarketOverview />
          </TabsContent>
          <TabsContent value="trading" className="h-full p-2">
            <TradingView apiStatus="available" chartData={[]} />
          </TabsContent>
          <TabsContent value="agents" className="h-full p-2">
            <AITradingAgents agents={agents} />
          </TabsContent>
          <TabsContent value="stockbot" className="h-full p-2">
            <div className="h-full">
              <StockbotChat />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
