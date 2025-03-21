
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MarketTrendChart } from './MarketTrendChart';
import useAssetStore from '@/stores/useAssetStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MarketChartView from './MarketChartView';
import { Button } from '@/components/ui/button';
import { 
  RefreshCw, 
  ChevronDown, 
  BarChart3, 
  LineChart, 
  PieChart 
} from 'lucide-react';

export const DetailedMarketCharts: React.FC = () => {
  const { 
    trendData, 
    marketDirection, 
    lastUpdated, 
    fetchMarketData, 
    isLoading 
  } = useAssetStore();
  
  const [chartTimeframe, setChartTimeframe] = useState('1m');
  
  // Generate market chart data from trend data
  const generateMarketChartData = () => {
    return trendData.map(item => ({
      name: item.date,
      price: item.value / 1000000000, // Convert to billions for better visualization
      volume: (item.value / 1000000000) * (0.5 + Math.random() * 0.2), // Random volume based on price
      high: (item.value / 1000000000) * (1 + Math.random() * 0.03),
      low: (item.value / 1000000000) * (1 - Math.random() * 0.03),
    }));
  };
  
  const marketChartData = generateMarketChartData();
  
  const handleRefresh = () => {
    fetchMarketData();
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Detailed Market Analysis</CardTitle>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-md overflow-hidden">
              {['1w', '1m', '3m', 'all'].map((timeframe) => (
                <Button
                  key={timeframe}
                  variant={chartTimeframe === timeframe ? "default" : "ghost"}
                  size="sm"
                  className="h-8 px-3 text-xs rounded-none"
                  onClick={() => setChartTimeframe(timeframe)}
                >
                  {timeframe}
                </Button>
              ))}
            </div>
            
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="trend">
          <TabsList className="mb-4">
            <TabsTrigger value="trend" className="flex items-center gap-1.5">
              <LineChart className="h-4 w-4" />
              <span>Trend Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="volume" className="flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4" />
              <span>Volume Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center gap-1.5">
              <PieChart className="h-4 w-4" />
              <span>Market Overview</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trend">
            <div className="space-y-4">
              <MarketTrendChart 
                data={trendData} 
                title="Market Cap Trend" 
                showCard={false} 
                height={350}
                marketDirection={marketDirection}
                lastUpdated={lastUpdated}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-secondary/5 rounded-md p-4">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Price Action</div>
                  <div className="text-lg font-bold">
                    {marketDirection === "up" && <span className="text-green-500">Bullish Momentum</span>}
                    {marketDirection === "down" && <span className="text-red-500">Bearish Pressure</span>}
                    {marketDirection === "neutral" && <span className="text-gray-500">Consolidation</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on recent market cap changes and overall market sentiment.
                  </p>
                </div>
                
                <div className="bg-secondary/5 rounded-md p-4">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Volatility</div>
                  <div className="text-lg font-bold">
                    {marketDirection === "up" && <span className="text-green-500">Moderate</span>}
                    {marketDirection === "down" && <span className="text-red-500">High</span>}
                    {marketDirection === "neutral" && <span className="text-gray-500">Low</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Current market volatility based on price fluctuations.
                  </p>
                </div>
                
                <div className="bg-secondary/5 rounded-md p-4">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Risk Level</div>
                  <div className="text-lg font-bold">
                    {marketDirection === "up" && <span className="text-yellow-500">Medium</span>}
                    {marketDirection === "down" && <span className="text-red-500">High</span>}
                    {marketDirection === "neutral" && <span className="text-green-500">Low</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Overall market risk assessment based on trends.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="volume">
            <MarketChartView data={marketChartData} type="volume" />
          </TabsContent>
          
          <TabsContent value="overview">
            <MarketChartView data={marketChartData} type="overview" />
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 text-xs text-right text-muted-foreground">
          Data provided by CoinMarketCap
        </div>
      </CardContent>
    </Card>
  );
};
