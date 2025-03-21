
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins, LineChart } from "lucide-react";
import MarketOverview from "@/components/MarketOverview";
import { TradingView } from "./components/trading-view";

interface MinimalTradingTabProps {
  initialOpenAgentsTab?: boolean;
}

export const MinimalTradingTab = ({ initialOpenAgentsTab = false }: MinimalTradingTabProps) => {
  const [activeTab, setActiveTab] = useState("market");

  // Set active tab to agents if initialOpenAgentsTab is true
  useEffect(() => {
    if (initialOpenAgentsTab) {
      setActiveTab("trading");
    }
  }, [initialOpenAgentsTab]);

  return (
    <Card className="col-span-4">
      <CardContent className="pl-2 pb-2 pt-0 pr-0 h-full">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="market" className="col-span-1">
              <LineChart className="h-4 w-4 mr-2" />
              Markt
            </TabsTrigger>
            <TabsTrigger value="trading" className="col-span-1">
              <Coins className="h-4 w-4 mr-2" />
              Trading
            </TabsTrigger>
          </TabsList>
          <TabsContent value="market" className="h-full p-2">
            <MarketOverview />
          </TabsContent>
          <TabsContent value="trading" className="h-full p-2">
            <TradingView apiStatus="available" chartData={[]} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
