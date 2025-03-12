
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchMarketData, validateMarketData } from "@/hooks/trading-chart/market-data-service";
import { ArrowUp, ArrowDown, BarChart2 } from "lucide-react";

interface MarketTrendProps {
  symbol: string;
  timeframe?: string;
}

export const MarketTrend: React.FC<MarketTrendProps> = ({ 
  symbol = "BTCUSD",
  timeframe = "1D"
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [marketData, setMarketData] = useState<any>(null);
  
  // Format the symbol for API requests
  const formattedSymbol = symbol.replace('BINANCE:', '').replace(':', '_');
  
  useEffect(() => {
    const loadMarketData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch market data
        const interval = timeframe === "1D" ? "4h" : 
                         timeframe === "1W" ? "1d" : 
                         timeframe === "1M" ? "1d" : "1h";
                       
        const limit = timeframe === "1D" ? 6 : 
                      timeframe === "1W" ? 7 : 
                      timeframe === "1M" ? 30 : 24;
                    
        const data = await fetchMarketData({
          symbol: formattedSymbol,
          interval,
          limit
        });
        
        // Validate the data
        const validationResult = validateMarketData(data);
        
        if (!validationResult.valid) {
          throw new Error(validationResult.message || "Invalid market data");
        }
        
        setMarketData(validationResult.data);
      } catch (err) {
        console.error("Error loading market data:", err);
        setError(err instanceof Error ? err.message : "Failed to load market data");
        
        // Generate fallback data
        setMarketData(generateFallbackData(formattedSymbol));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMarketData();
  }, [formattedSymbol, timeframe]);
  
  if (isLoading) {
    return (
      <Card className="w-full bg-card border border-border">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-12" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !marketData) {
    return (
      <Card className="w-full bg-card border border-border">
        <CardContent className="p-4">
          <div className="flex items-center text-amber-600 mb-2">
            <BarChart2 className="h-5 w-5 mr-2" />
            <h3 className="font-medium">Market Trend Data Unavailable</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {error || "Could not load market data. Using simulated data instead."}
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate market statistics
  const latestPrice = marketData[marketData.length - 1]?.close || 0;
  const previousPrice = marketData[0]?.close || 0;
  const priceChange = latestPrice - previousPrice;
  const percentChange = previousPrice ? (priceChange / previousPrice) * 100 : 0;
  const isPositive = percentChange >= 0;
  
  // Calculate average, high and low values
  const highPrice = Math.max(...marketData.map((d: any) => d.high));
  const lowPrice = Math.min(...marketData.map((d: any) => d.low));
  const avgVolume = marketData.reduce((sum: number, d: any) => sum + (d.volume || 0), 0) / marketData.length;
  
  return (
    <Card className="w-full bg-card border border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BarChart2 className="h-5 w-5 mr-2 text-primary" />
            <h3 className="font-medium">{symbol} Market Trend</h3>
          </div>
          <div className={`flex items-center px-2 py-1 rounded ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            <span className="text-xs font-medium">{Math.abs(percentChange).toFixed(2)}%</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-muted-foreground text-xs">Current Price</div>
            <div className="font-medium">${latestPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Change</div>
            <div className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{priceChange.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">24h High</div>
            <div className="font-medium">${highPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">24h Low</div>
            <div className="font-medium">${lowPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div className="col-span-2">
            <div className="text-muted-foreground text-xs">Volume</div>
            <div className="font-medium">{avgVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-muted-foreground border-t border-border pt-2">
          {timeframe === "1D" ? "24-hour" : timeframe === "1W" ? "7-day" : "30-day"} trend · Updated {new Date().toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};

// Generate fallback data when API fails
const generateFallbackData = (symbol: string) => {
  // Use the symbol string to generate a consistent but pseudo-random price
  const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const basePrice = (hash % 1000) + 10; // Price between $10 and $1010
  
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(now);
    timestamp.setHours(now.getHours() - i);
    
    // Generate price with some random variation that follows a trend
    const priceVariation = Math.sin(i / 5) * (hash % 10) + ((Math.random() - 0.5) * 5);
    const price = basePrice + priceVariation;
    
    data.push({
      timestamp: timestamp.getTime(),
      date: timestamp,
      open: price - (Math.random() * 2),
      high: price + (Math.random() * 3),
      low: price - (Math.random() * 3),
      close: price,
      volume: Math.floor(Math.random() * 100000) + 50000
    });
  }
  
  return data.reverse(); // Return in chronological order
};
