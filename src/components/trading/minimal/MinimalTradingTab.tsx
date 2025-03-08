
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MinimalPriceChart } from "./MinimalPriceChart";
import { MinimalTradingControls } from "./MinimalTradingControls";
import { tradingDataService } from "@/services/trading/tradingDataService";
import { TradingDataPoint } from "@/utils/tradingData";

export const MinimalTradingTab = () => {
  const [data, setData] = useState<TradingDataPoint[]>([]);
  const [timeframe, setTimeframe] = useState<"1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w">("1h");
  const [isLoading, setIsLoading] = useState(true);

  // Function to refresh data
  const refreshData = () => {
    setIsLoading(true);
    const newData = tradingDataService.refreshData(timeframe);
    setData(newData);
    setIsLoading(false);
  };

  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe: "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w") => {
    setTimeframe(newTimeframe);
    setIsLoading(true);
    const newData = tradingDataService.refreshData(newTimeframe);
    setData(newData);
    setIsLoading(false);
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
    </div>
  );
};
