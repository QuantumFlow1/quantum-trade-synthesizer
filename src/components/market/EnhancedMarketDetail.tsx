
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  ExternalLink, 
  Clock, 
  DollarSign, 
  BarChart2,
  Info,
  Share2
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';
import { MarketData } from './types';
import { MarketChartView } from './MarketChartView';

interface EnhancedMarketDetailProps {
  marketData: MarketData;
  onClose: () => void;
}

export const EnhancedMarketDetail: React.FC<EnhancedMarketDetailProps> = ({
  marketData,
  onClose
}) => {
  const [activeTimeframe, setActiveTimeframe] = useState('24h');
  
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(value);
  };
  
  const formatLargeNumber = (value: number | undefined) => {
    if (value === undefined) return 'N/A';
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toString();
  };
  
  const formatPercentage = (value: number | undefined) => {
    if (value === undefined) return 'N/A';
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };
  
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Generate chart data from the market data
  // In a real application, you would fetch historical price data for different timeframes
  const generateChartData = () => {
    // Mock data - in a real app this would be fetched from an API
    const basePrice = marketData.price || 100;
    const volatility = 0.05; // 5% volatility
    
    // Generate 24 data points
    return Array(24).fill(0).map((_, i) => {
      const timestamp = Date.now() - (23 - i) * 3600 * 1000; // hourly data points
      const randomFactor = 1 + (Math.random() * 2 - 1) * volatility;
      const price = basePrice * randomFactor;
      
      return {
        name: new Date(timestamp).toISOString(),
        price: price,
        volume: Math.random() * 1000000,
        high: price * 1.01,
        low: price * 0.99,
      };
    });
  };
  
  const chartData = generateChartData();

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-lg font-bold">{marketData.symbol.substring(0, 2).toUpperCase()}</span>
          </div>
          <div>
            <CardTitle className="text-xl">{marketData.name || marketData.symbol}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">{marketData.symbol}</Badge>
              <Badge variant="outline" className="text-xs bg-gray-100">Rank #{marketData.rank || 'N/A'}</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <div className="text-3xl font-bold">{formatCurrency(marketData.price)}</div>
            <div className={`flex items-center mt-1 ${
              (marketData.change24h || 0) >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {(marketData.change24h || 0) >= 0 ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              <span>{formatPercentage(marketData.change24h)}</span>
              <span className="text-gray-500 text-sm ml-2">(24h)</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Market Cap</div>
              <div className="font-semibold">${formatLargeNumber(marketData.marketCap)}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">24h Volume</div>
              <div className="font-semibold">${formatLargeNumber(marketData.totalVolume24h)}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Circulating Supply</div>
              <div className="font-semibold">{formatLargeNumber(marketData.circulatingSupply)}</div>
            </div>
          </div>
        </div>
        
        <Tabs value={activeTimeframe} onValueChange={setActiveTimeframe} className="mb-6">
          <TabsList className="grid grid-cols-7 mb-4">
            <TabsTrigger value="1h">1H</TabsTrigger>
            <TabsTrigger value="24h">24H</TabsTrigger>
            <TabsTrigger value="7d">7D</TabsTrigger>
            <TabsTrigger value="30d">30D</TabsTrigger>
            <TabsTrigger value="90d">3M</TabsTrigger>
            <TabsTrigger value="1y">1Y</TabsTrigger>
            <TabsTrigger value="all">ALL</TabsTrigger>
          </TabsList>
          
          <TabsContent value="24h" className="h-[300px]">
            <MarketChartView data={chartData} type="price" />
          </TabsContent>
          
          {['1h', '7d', '30d', '90d', '1y', 'all'].map(timeframe => (
            <TabsContent key={timeframe} value={timeframe} className="h-[300px]">
              <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>{timeframe} data coming soon</p>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Price Statistics</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span className="text-gray-600">Price</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3.5 w-3.5 ml-1 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Current price in USD</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="font-medium">{formatCurrency(marketData.price)}</span>
              </div>
              
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span className="text-gray-600">24h Low / High</span>
                </div>
                <span className="font-medium">
                  {formatCurrency(marketData.low24h)} / {formatCurrency(marketData.high24h)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span className="text-gray-600">All-Time High</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(marketData.ath)}</div>
                  <div className="text-xs text-gray-500">{formatDate(marketData.athDate)}</div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span className="text-gray-600">All-Time Low</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(marketData.atl)}</div>
                  <div className="text-xs text-gray-500">{formatDate(marketData.atlDate)}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Market Stats</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Market Cap</span>
                <span className="font-medium">${formatLargeNumber(marketData.marketCap)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Volume (24h)</span>
                <span className="font-medium">${formatLargeNumber(marketData.totalVolume24h)}</span>
              </div>
              
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span className="text-gray-600">Volume / Market Cap</span>
                </div>
                <span className="font-medium">
                  {marketData.totalVolume24h && marketData.marketCap ? 
                    (marketData.totalVolume24h / marketData.marketCap).toFixed(4) : 'N/A'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Circulating Supply</span>
                <span className="font-medium">{formatLargeNumber(marketData.circulatingSupply)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Total Supply</span>
                <span className="font-medium">{formatLargeNumber(marketData.totalSupply)}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Performance</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">24h</span>
                <span className={`font-medium ${
                  (marketData.change24h || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatPercentage(marketData.change24h)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">7d</span>
                <span className={`font-medium ${
                  (marketData.priceChange7d || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatPercentage(marketData.priceChange7d)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">30d</span>
                <span className={`font-medium ${
                  (marketData.priceChange30d || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatPercentage(marketData.priceChange30d)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium">
                  {marketData.lastUpdated ? formatDate(marketData.lastUpdated) : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center gap-4">
          <Button className="bg-green-500 hover:bg-green-600">
            <DollarSign className="h-4 w-4 mr-2" />
            Buy
          </Button>
          <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
            <DollarSign className="h-4 w-4 mr-2" />
            Sell
          </Button>
          <Button variant="outline">
            <BarChart2 className="h-4 w-4 mr-2" />
            Trade
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
