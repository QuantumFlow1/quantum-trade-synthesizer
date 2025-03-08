
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tradingDataService } from "@/services/trading/tradingDataService";
import { TradingDataPoint } from "@/utils/tradingData";
import { useMarketSentiment } from "@/hooks/use-market-sentiment";
import { SentimentBadge } from "./market-data/SentimentBadge";
import { VolatilityBadge } from "./market-data/VolatilityBadge";
import { MarketMetricItem } from "./market-data/MarketMetricItem";
import { PriceChangeMetric } from "./market-data/PriceChangeMetric";
import { LastUpdateIndicator } from "./market-data/LastUpdateIndicator";
import { MarketDataSkeleton } from "./market-data/MarketDataSkeleton";
import { formatNumber } from "./market-data/utils";

export const MinimalMarketData = () => {
  const [marketStats, setMarketStats] = useState<{
    high: number;
    low: number;
    avgPrice: number;
    volume: number;
    changePercent: number;
    volatility: number;
    lastUpdated: Date;
    priceRange: number;
  }>({
    high: 0,
    low: 0,
    avgPrice: 0,
    volume: 0,
    changePercent: 0,
    volatility: 0,
    lastUpdated: new Date(),
    priceRange: 0,
  });
  const [tradingData, setTradingData] = useState<TradingDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get market sentiment using our hook
  const marketSentiment = useMarketSentiment(tradingData);

  useEffect(() => {
    const calculateStats = (data: TradingDataPoint[]) => {
      if (!data.length) return;
      
      const high = Math.max(...data.map(point => point.high));
      const low = Math.min(...data.map(point => point.low));
      const avgPrice = data.reduce((sum, point) => sum + point.close, 0) / data.length;
      const volume = data.reduce((sum, point) => sum + point.volume, 0);
      
      // Enhanced metrics
      const firstPrice = data[0].close;
      const lastPrice = data[data.length - 1].close;
      const changePercent = ((lastPrice - firstPrice) / firstPrice) * 100;
      
      // Calculate volatility (standard deviation of price changes)
      const priceChanges = data.slice(1).map((point, i) => 
        ((point.close - data[i].close) / data[i].close) * 100
      );
      const meanChange = priceChanges.reduce((sum, change) => sum + change, 0) / priceChanges.length;
      const volatility = Math.sqrt(
        priceChanges.reduce((sum, change) => sum + Math.pow(change - meanChange, 2), 0) / priceChanges.length
      );
      
      const priceRange = high - low;
      
      setMarketStats({ 
        high, 
        low, 
        avgPrice, 
        volume, 
        changePercent, 
        volatility, 
        lastUpdated: new Date(),
        priceRange
      });
      setIsLoading(false);
    };

    // Get initial data
    const data = tradingDataService.getData();
    setTradingData(data);
    calculateStats(data);

    // Listen for data updates
    const intervalId = setInterval(() => {
      const freshData = tradingDataService.getData();
      setTradingData(freshData);
      calculateStats(freshData);
    }, 10000); // Update every 10 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Market Summary</CardTitle>
          {!isLoading && <LastUpdateIndicator lastUpdated={marketStats.lastUpdated} />}
        </div>
        
        {!isLoading && (
          <div className="flex items-center mt-1">
            <SentimentBadge sentiment={marketSentiment} />
            <VolatilityBadge 
              volatility={marketStats.volatility} 
              changePercent={marketStats.changePercent} 
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading ? (
            <MarketDataSkeleton />
          ) : (
            <>
              <MarketMetricItem
                label="24h High"
                value={`$${formatNumber(marketStats.high)}`}
                tooltip="Highest price in the last 24 hours"
              />
              
              <MarketMetricItem
                label="24h Low"
                value={`$${formatNumber(marketStats.low)}`}
                tooltip="Lowest price in the last 24 hours"
              />
              
              <PriceChangeMetric 
                changePercent={marketStats.changePercent} 
                formatNumber={formatNumber} 
              />
              
              <MarketMetricItem
                label="Volume"
                value={`$${formatNumber(marketStats.volume, 0)}`}
                tooltip="Total trading volume"
              />
            </>
          )}
        </div>
        
        {!isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <MarketMetricItem
              label="Avg. Price"
              value={`$${formatNumber(marketStats.avgPrice)}`}
              tooltip="Average price over the period"
              className="bg-secondary/10"
            />
            
            <MarketMetricItem
              label="Price Range"
              value={`$${formatNumber(marketStats.priceRange)}`}
              tooltip="Difference between high and low prices"
              className="bg-secondary/10"
            />
            
            <MarketMetricItem
              label="T.S.A.A. Sentiment"
              value={
                <span className={`capitalize ${
                  marketSentiment === 'bullish' ? 'text-green-500' : 
                  marketSentiment === 'bearish' ? 'text-red-500' : 
                  'text-yellow-500'
                }`}>
                  {marketSentiment}
                </span>
              }
              tooltip="Overall market sentiment based on price movements"
              className="bg-secondary/10 hidden md:block"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
