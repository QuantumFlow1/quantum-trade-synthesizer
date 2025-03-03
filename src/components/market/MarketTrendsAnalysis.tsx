
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarketTrend, MarketData } from './types';
import { TrendingUp, TrendingDown, Percent, DollarSign, BarChart3 } from 'lucide-react';

interface MarketTrendsAnalysisProps {
  marketData: MarketData[];
}

export const MarketTrendsAnalysis: React.FC<MarketTrendsAnalysisProps> = ({ marketData }) => {
  const [activeTab, setActiveTab] = useState('24h');

  // Generate trends based on market data
  const generateTrends = (): MarketTrend[] => {
    // In a real app, this would analyze the data more thoroughly
    // For now, we'll create some mock trends
    
    // Find top gainers and losers
    const sortedByChange = [...marketData].sort((a, b) => {
      const changeA = a.change24h || 0;
      const changeB = b.change24h || 0;
      return changeB - changeA;
    });
    
    const topGainers = sortedByChange.slice(0, 3).map(coin => ({
      symbol: coin.symbol,
      change: coin.change24h || 0
    }));
    
    const topLosers = sortedByChange.slice(-3).reverse().map(coin => ({
      symbol: coin.symbol,
      change: coin.change24h || 0
    }));
    
    // Calculate average performance by market
    const marketPerformance: Record<string, { total: number, count: number }> = {};
    
    marketData.forEach(coin => {
      if (coin.market && coin.change24h !== undefined) {
        if (!marketPerformance[coin.market]) {
          marketPerformance[coin.market] = { total: 0, count: 0 };
        }
        marketPerformance[coin.market].total += coin.change24h;
        marketPerformance[coin.market].count += 1;
      }
    });
    
    const trends: MarketTrend[] = [];
    
    Object.entries(marketPerformance).forEach(([market, data]) => {
      trends.push({
        category: market,
        performance: data.total / data.count,
        topGainers,
        topLosers
      });
    });
    
    return trends;
  };
  
  const trends = generateTrends();
  
  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <BarChart3 className="mr-2 h-5 w-5" />
          Market Trends Analysis
        </CardTitle>
        <CardDescription>
          Analyze current market trends and performance by category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="24h">24H</TabsTrigger>
            <TabsTrigger value="7d">7D</TabsTrigger>
            <TabsTrigger value="30d">30D</TabsTrigger>
            <TabsTrigger value="90d">90D</TabsTrigger>
          </TabsList>
          
          <TabsContent value="24h" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Top Performing Markets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trends
                      .sort((a, b) => b.performance - a.performance)
                      .slice(0, 3)
                      .map((trend, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="font-medium">{trend.category}</span>
                          </div>
                          <div className={`flex items-center ${trend.performance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {trend.performance >= 0 ? (
                              <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                              <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            {formatPercentage(trend.performance)}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Top Gainers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trends[0]?.topGainers.map((coin, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="font-medium">{coin.symbol}</span>
                        <span className="text-green-500 flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {formatPercentage(coin.change)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Market Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-center p-4 flex-1">
                      <div className="text-green-500 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 mr-1" />
                        <span className="text-lg font-bold">
                          {marketData.filter(d => (d.change24h || 0) > 0).length}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Bullish</p>
                    </div>
                    <div className="text-center p-4 flex-1 border-l border-r">
                      <div className="text-gray-500 flex items-center justify-center">
                        <Percent className="h-5 w-5 mr-1" />
                        <span className="text-lg font-bold">
                          {marketData.filter(d => (d.change24h || 0) === 0).length}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Neutral</p>
                    </div>
                    <div className="text-center p-4 flex-1">
                      <div className="text-red-500 flex items-center justify-center">
                        <TrendingDown className="h-5 w-5 mr-1" />
                        <span className="text-lg font-bold">
                          {marketData.filter(d => (d.change24h || 0) < 0).length}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Bearish</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Top Losers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trends[0]?.topLosers.map((coin, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="font-medium">{coin.symbol}</span>
                        <span className="text-red-500 flex items-center">
                          <TrendingDown className="h-4 w-4 mr-1" />
                          {formatPercentage(coin.change)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="7d">
            <div className="p-8 text-center text-gray-500">
              7-day trend data will be available soon
            </div>
          </TabsContent>
          
          <TabsContent value="30d">
            <div className="p-8 text-center text-gray-500">
              30-day trend data will be available soon
            </div>
          </TabsContent>
          
          <TabsContent value="90d">
            <div className="p-8 text-center text-gray-500">
              90-day trend data will be available soon
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
