
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MinimalPriceChart } from "./MinimalPriceChart";
import { MinimalTradingControls } from "./MinimalTradingControls";
import { MinimalMarketData } from "./MinimalMarketData";
import { tradingDataService } from "@/services/trading/tradingDataService";
import { TradingDataPoint } from "@/utils/tradingData";
import { PortfolioManager } from "../PortfolioManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const MinimalTradingTab = () => {
  const [data, setData] = useState<TradingDataPoint[]>([]);
  const [timeframe, setTimeframe] = useState<"1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w">("1h");
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState<any>(null);
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(true);

  // Function to refresh data
  const refreshData = () => {
    setIsLoading(true);
    const newData = tradingDataService.refreshData(timeframe);
    setData(newData);
    
    // Set current data for agent analysis
    if (newData.length > 0) {
      const latestDataPoint = newData[newData.length - 1];
      setCurrentData({
        symbol: "BTC",
        price: latestDataPoint.close,
        high: latestDataPoint.high,
        low: latestDataPoint.low,
        volume: latestDataPoint.volume
      });
    }
    
    setIsLoading(false);
  };

  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe: "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w") => {
    setTimeframe(newTimeframe);
    setIsLoading(true);
    const newData = tradingDataService.refreshData(newTimeframe);
    setData(newData);
    
    // Update current data
    if (newData.length > 0) {
      const latestDataPoint = newData[newData.length - 1];
      setCurrentData({
        symbol: "BTC",
        price: latestDataPoint.close,
        high: latestDataPoint.high,
        low: latestDataPoint.low,
        volume: latestDataPoint.volume
      });
    }
    
    setIsLoading(false);
  };

  // Handle simulation mode toggle
  const handleSimulationToggle = (enabled: boolean) => {
    setIsSimulationMode(enabled);
  };

  // Initial data load
  useEffect(() => {
    refreshData();
    
    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      refreshData();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="space-y-6">
      {/* Market Data Summary */}
      <MinimalMarketData />
      
      {/* Main content with tabs */}
      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="chart">Price Chart</TabsTrigger>
          <TabsTrigger value="agents">Trading Agents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>Trading Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <MinimalTradingControls
                onRefresh={refreshData}
                onTimeframeChange={handleTimeframeChange}
                currentTimeframe={timeframe}
              />
              
              {isLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  Loading chart data...
                </div>
              ) : (
                <MinimalPriceChart data={data} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="agents">
          <PortfolioManager 
            isSimulationMode={isSimulationMode}
            onSimulationToggle={handleSimulationToggle}
            currentData={currentData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
