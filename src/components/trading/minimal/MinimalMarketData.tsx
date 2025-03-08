
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { tradingDataService } from "@/services/trading/tradingDataService";
import { TradingDataPoint } from "@/utils/tradingData";

export const MinimalMarketData = () => {
  const [marketStats, setMarketStats] = useState<{
    high: number;
    low: number;
    avgPrice: number;
    volume: number;
  }>({
    high: 0,
    low: 0,
    avgPrice: 0,
    volume: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const calculateStats = (data: TradingDataPoint[]) => {
      if (!data.length) return;
      
      const high = Math.max(...data.map(point => point.high));
      const low = Math.min(...data.map(point => point.low));
      const avgPrice = data.reduce((sum, point) => sum + point.close, 0) / data.length;
      const volume = data.reduce((sum, point) => sum + point.volume, 0);
      
      setMarketStats({ high, low, avgPrice, volume });
      setIsLoading(false);
    };

    // Get initial data
    const data = tradingDataService.getData();
    calculateStats(data);

    // Listen for data updates
    const intervalId = setInterval(() => {
      const freshData = tradingDataService.getData();
      calculateStats(freshData);
    }, 10000); // Update every 10 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Market Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading ? (
            <>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </>
          ) : (
            <>
              <div className="bg-secondary/20 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">24h High</div>
                <div className="font-semibold">${marketStats.high.toFixed(2)}</div>
              </div>
              <div className="bg-secondary/20 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">24h Low</div>
                <div className="font-semibold">${marketStats.low.toFixed(2)}</div>
              </div>
              <div className="bg-secondary/20 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Avg Price</div>
                <div className="font-semibold">${marketStats.avgPrice.toFixed(2)}</div>
              </div>
              <div className="bg-secondary/20 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Volume</div>
                <div className="font-semibold">${marketStats.volume.toFixed(0)}</div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
