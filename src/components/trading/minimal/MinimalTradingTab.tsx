
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins, LineChart } from "lucide-react";
import MarketOverview from "@/components/MarketOverview";
import { TradingView } from "./components/trading-view";
import { Button } from "@/components/ui/button";

interface MinimalTradingTabProps {
  initialOpenAgentsTab?: boolean;
}

export const MinimalTradingTab = ({ initialOpenAgentsTab = false }: MinimalTradingTabProps) => {
  const [activeTab, setActiveTab] = useState("market");

  // Set active tab to trading if initialOpenAgentsTab is true
  useEffect(() => {
    if (initialOpenAgentsTab) {
      setActiveTab("trading");
    }
  }, [initialOpenAgentsTab]);

  return (
    <Card className="col-span-4">
      <CardContent className="pl-2 pb-2 pt-2 pr-2 h-full">
        <div className="flex items-center justify-between mb-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="market" className="col-span-1">
                <LineChart className="h-4 w-4 mr-2" />
                Market Overview
              </TabsTrigger>
              <TabsTrigger value="trading" className="col-span-1">
                <Coins className="h-4 w-4 mr-2" />
                Trading Tools
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <TabsContent value="market" className="h-[calc(100%-48px)] p-2 mt-0">
          <MarketOverview />
        </TabsContent>
        <TabsContent value="trading" className="h-[calc(100%-48px)] p-2 mt-0">
          <TradingView apiStatus="available" chartData={[]} />
        </TabsContent>
      </CardContent>
    </Card>
  );
};
