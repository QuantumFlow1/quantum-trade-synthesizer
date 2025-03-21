
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon, Loader2, AlertCircle } from 'lucide-react';
import useAssetStore from '@/stores/useAssetStore';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const GlobalMarketMetrics: React.FC = () => {
  const {
    totalMarketCap,
    btcDominance,
    ethDominance,
    totalVolume,
    activeCryptocurrencies,
    activeExchanges,
    lastUpdated,
    marketDirection,
    isLoading,
    error,
    fetchMarketData
  } = useAssetStore();

  useEffect(() => {
    fetchMarketData();
    
    // Set up polling to refresh the data every 5 minutes
    const interval = setInterval(fetchMarketData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  // Format the last updated time
  const formattedLastUpdated = lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : '';
  
  if (isLoading && !totalMarketCap) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            Global Market Metrics
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-secondary/30 rounded-md h-24 p-4">
                <div className="bg-secondary/50 h-4 w-24 rounded mb-2"></div>
                <div className="bg-secondary/50 h-6 w-16 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full border-red-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center text-red-500">
            <AlertCircle className="mr-2 h-5 w-5" />
            Error Loading Market Data
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-sm text-red-500">{error}</p>
          <button 
            onClick={fetchMarketData} 
            className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 text-xs rounded-md"
          >
            Retry
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Global Market Metrics</CardTitle>
          <span className="text-xs text-muted-foreground">
            Last updated: {formattedLastUpdated}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-secondary/10 rounded-md p-4">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Total Market Cap</div>
                  <div className="text-2xl font-bold">${totalMarketCap}</div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Total cryptocurrency market capitalization</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-secondary/10 rounded-md p-4">
                  <div className="text-sm font-medium text-muted-foreground mb-1">24h Volume</div>
                  <div className="text-2xl font-bold">${totalVolume}</div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Total trading volume in the last 24 hours</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-secondary/10 rounded-md p-4">
                  <div className="text-sm font-medium text-muted-foreground mb-1">BTC Dominance</div>
                  <div className="text-2xl font-bold flex items-center">
                    {btcDominance}%
                    {marketDirection === "up" ? 
                      <ArrowUpIcon className="ml-1 h-4 w-4 text-green-500" /> : 
                      <ArrowDownIcon className="ml-1 h-4 w-4 text-red-500" />
                    }
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Bitcoin's percentage of total market capitalization</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-secondary/10 rounded-md p-4">
                  <div className="text-sm font-medium text-muted-foreground mb-1">ETH Dominance</div>
                  <div className="text-2xl font-bold">{ethDominance}%</div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ethereum's percentage of total market capitalization</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-secondary/5 rounded-md p-4">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Active Cryptocurrencies</div>
                  <div className="text-xl font-bold">{activeCryptocurrencies.toLocaleString()}</div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Number of active cryptocurrencies being tracked</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-secondary/5 rounded-md p-4">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Active Exchanges</div>
                  <div className="text-xl font-bold">{activeExchanges.toLocaleString()}</div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Number of active cryptocurrency exchanges</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="mt-4 text-xs text-right text-muted-foreground">
          Data provided by CoinMarketCap
        </div>
      </CardContent>
    </Card>
  );
};
