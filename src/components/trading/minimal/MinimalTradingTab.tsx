import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins, LineChart, MessageSquare } from "lucide-react";
import { MarketOverview } from "@/components/market/MarketOverview";
import { TradingView } from "@/components/trading/TradingView";
import { StockbotChat } from "./components/stockbot/StockbotChat";

export const MinimalTradingTab = () => {
  const [activeTab, setActiveTab] = useState("market");

  return (
    <Card className="col-span-4">
      <CardContent className="pl-2 pb-2 pt-0 pr-0 h-full">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="market" className="col-span-1">
              <LineChart className="h-4 w-4 mr-2" />
              Markt
            </TabsTrigger>
            <TabsTrigger value="trading" className="col-span-1">
              <Coins className="h-4 w-4 mr-2" />
              Trading
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
            <TradingView />
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
