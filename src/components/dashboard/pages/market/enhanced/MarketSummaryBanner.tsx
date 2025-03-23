
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, BarChart3, DollarSign, LineChart } from 'lucide-react';
import useAssetStore from '@/stores/useAssetStore';
import { formatLargeNumber } from '@/components/market/utils/formatters';
import { MarketData } from '@/components/market/types';

interface MarketSummaryBannerProps {
  marketData: MarketData[];
  isLoading: boolean;
}

export const MarketSummaryBanner: React.FC<MarketSummaryBannerProps> = ({
  marketData,
  isLoading
}) => {
  const {
    totalMarketCap,
    btcDominance,
    ethDominance,
    totalVolume,
    marketDirection,
    lastUpdated
  } = useAssetStore();

  const getMarketTrend = () => {
    if (!marketData.length) return 0;
    return marketData.reduce((sum, item) => sum + (item.change24h || 0), 0) / marketData.length;
  };

  const marketTrend = getMarketTrend();
  const formattedDate = new Date(lastUpdated).toLocaleString();
  
  return (
    <Card className="mb-6 overflow-hidden border-none shadow-md bg-secondary/20 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <div className="flex items-center">
            <LineChart className="h-5 w-5 mr-2 text-primary" />
            <h2 className="text-lg font-semibold">Market Overview</h2>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              variant="outline" 
              className={`${marketDirection === 'up' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 
                marketDirection === 'down' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' : 
                'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'} px-2 py-1`}
            >
              {marketDirection === 'up' ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : marketDirection === 'down' ? (
                <TrendingDown className="h-3 w-3 mr-1" />
              ) : (
                <BarChart3 className="h-3 w-3 mr-1" />
              )}
              {marketDirection === 'up' ? 'Bullish' : marketDirection === 'down' ? 'Bearish' : 'Neutral'} Market
            </Badge>
            
            <span className="text-xs text-muted-foreground">
              Updated: {formattedDate}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Total Market Cap</span>
            {isLoading ? (
              <Skeleton className="h-6 w-24 mt-1" />
            ) : (
              <span className="font-semibold">${totalMarketCap}</span>
            )}
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">24h Volume</span>
            {isLoading ? (
              <Skeleton className="h-6 w-24 mt-1" />
            ) : (
              <span className="font-semibold">${totalVolume}</span>
            )}
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">BTC Dominance</span>
            {isLoading ? (
              <Skeleton className="h-6 w-24 mt-1" />
            ) : (
              <span className="font-semibold">{btcDominance}%</span>
            )}
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">ETH Dominance</span>
            {isLoading ? (
              <Skeleton className="h-6 w-24 mt-1" />
            ) : (
              <span className="font-semibold">{ethDominance}%</span>
            )}
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Market Trend (24h)</span>
            {isLoading ? (
              <Skeleton className="h-6 w-24 mt-1" />
            ) : (
              <span className={`font-semibold flex items-center ${marketTrend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {marketTrend >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {marketTrend >= 0 ? '+' : ''}{marketTrend.toFixed(2)}%
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
