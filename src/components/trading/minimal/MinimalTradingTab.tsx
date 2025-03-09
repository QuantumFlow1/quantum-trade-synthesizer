
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MinimalPriceChart } from "./MinimalPriceChart";
import { MinimalMarketData } from "./MinimalMarketData";
import { MinimalTradingControls } from "./MinimalTradingControls";
import { PriceAlerts } from "./components/PriceAlerts";
import { OrderBook } from "./components/OrderBook";
import { NewsFeed } from "./components/NewsFeed";
import { TechnicalIndicators } from "./components/TechnicalIndicators";
import { TradingAgents } from "./components/TradingAgents";
import { generateTradingData, TradingDataPoint } from "@/utils/tradingData";

export const MinimalTradingTab = () => {
  const [activeTab, setActiveTab] = useState("chart");
  const [tradingData, setTradingData] = useState<TradingDataPoint[]>(generateTradingData());
  const [selectedPair, setSelectedPair] = useState("BTC/USDT");
  const [currentTimeframe, setCurrentTimeframe] = useState("1h");

  // Check if we should open the trading agents tab based on localStorage flag
  useEffect(() => {
    const shouldOpenTradingAgentsTab = localStorage.getItem('openTradingAgentsTab');
    if (shouldOpenTradingAgentsTab === 'true') {
      setActiveTab('agents');
      // Clear the flag after use
      localStorage.removeItem('openTradingAgentsTab');
    }
  }, []);

  const handleRefresh = () => {
    setTradingData(generateTradingData());
  };

  const handleTimeframeChange = (timeframe: string) => {
    setCurrentTimeframe(timeframe);
    setTradingData(generateTradingData()); // Regenerate data for the new timeframe
  };

  const handlePairChange = (pair: string) => {
    setSelectedPair(pair);
    setTradingData(generateTradingData()); // Regenerate data for the new pair
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid grid-cols-4 w-full md:w-auto">
        <TabsTrigger value="chart">Price Chart</TabsTrigger>
        <TabsTrigger value="orders">Order Book</TabsTrigger>
        <TabsTrigger value="alerts">Alerts</TabsTrigger>
        <TabsTrigger value="agents">Trading Agents</TabsTrigger>
      </TabsList>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <TabsContent value="chart" className="space-y-4">
            <MinimalMarketData />
            <MinimalPriceChart data={tradingData} />
            <MinimalTradingControls 
              onRefresh={handleRefresh}
              onTimeframeChange={handleTimeframeChange}
              currentTimeframe={currentTimeframe}
              selectedPair={selectedPair}
              onPairChange={handlePairChange}
            />
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-4">
            <MinimalMarketData />
            <OrderBook selectedPair={selectedPair} />
          </TabsContent>
          
          <TabsContent value="alerts" className="space-y-4">
            <MinimalMarketData />
            <PriceAlerts selectedPair={selectedPair} />
          </TabsContent>
          
          <TabsContent value="agents" className="space-y-4">
            <MinimalMarketData />
            <TradingAgents />
          </TabsContent>
        </div>
        
        <div className="space-y-4">
          <TechnicalIndicators />
          <NewsFeed selectedPair={selectedPair} />
        </div>
      </div>
    </Tabs>
  );
};
