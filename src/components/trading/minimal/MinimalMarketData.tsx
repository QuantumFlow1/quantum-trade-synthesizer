
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { tradingDataService } from "@/services/trading/tradingDataService";
import { TradingDataPoint } from "@/utils/tradingData";
import { useMarketSentiment } from "@/hooks/use-market-sentiment";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, Sigma, Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  // Format a number with commas and fixed decimal places
  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals 
    });
  };

  // Format time since last update
  const getTimeSinceUpdate = () => {
    const seconds = Math.floor((new Date().getTime() - marketStats.lastUpdated.getTime()) / 1000);
    return seconds < 60 ? `${seconds}s ago` : `${Math.floor(seconds / 60)}m ago`;
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Market Summary</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{getTimeSinceUpdate()}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Last data update</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {!isLoading && (
          <div className="flex items-center mt-1">
            <Badge 
              variant="outline" 
              className={`
                ${marketSentiment === 'bullish' ? 'bg-green-500/10 text-green-500 border-green-500/30' : 
                  marketSentiment === 'bearish' ? 'bg-red-500/10 text-red-500 border-red-500/30' : 
                  'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'}
              `}
            >
              {marketSentiment === 'bullish' ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : marketSentiment === 'bearish' ? (
                <TrendingDown className="h-3 w-3 mr-1" />
              ) : (
                <BarChart3 className="h-3 w-3 mr-1" />
              )}
              {marketSentiment.charAt(0).toUpperCase() + marketSentiment.slice(1)} T.S.A.A. Signal
            </Badge>
            
            <Badge 
              variant="outline" 
              className={`ml-2 ${Math.abs(marketStats.changePercent) > 2 ? 
                (marketStats.changePercent > 0 ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-red-500/10 text-red-500 border-red-500/30') : 
                'bg-blue-500/10 text-blue-500 border-blue-500/30'}`}
            >
              <Sigma className="h-3 w-3 mr-1" />
              Volatility: {marketStats.volatility.toFixed(2)}%
            </Badge>
          </div>
        )}
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-secondary/20 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">24h High</div>
                      <div className="font-semibold">${formatNumber(marketStats.high)}</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Highest price in the last 24 hours</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-secondary/20 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">24h Low</div>
                      <div className="font-semibold">${formatNumber(marketStats.low)}</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Lowest price in the last 24 hours</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-secondary/20 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Price Change</div>
                      <div className={`font-semibold flex items-center ${marketStats.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {marketStats.changePercent >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {marketStats.changePercent >= 0 ? '+' : ''}{formatNumber(marketStats.changePercent)}%
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Price change percentage over the period</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-secondary/20 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Volume</div>
                      <div className="font-semibold">${formatNumber(marketStats.volume, 0)}</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total trading volume</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
        
        {!isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-secondary/10 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Avg. Price</div>
                    <div className="font-semibold">${formatNumber(marketStats.avgPrice)}</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Average price over the period</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-secondary/10 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Price Range</div>
                    <div className="font-semibold">${formatNumber(marketStats.priceRange)}</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Difference between high and low prices</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-secondary/10 p-3 rounded-lg hidden md:block">
                    <div className="text-xs text-muted-foreground mb-1">T.S.A.A. Sentiment</div>
                    <div className={`font-semibold capitalize ${
                      marketSentiment === 'bullish' ? 'text-green-500' : 
                      marketSentiment === 'bearish' ? 'text-red-500' : 
                      'text-yellow-500'
                    }`}>
                      {marketSentiment}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Overall market sentiment based on price movements</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
