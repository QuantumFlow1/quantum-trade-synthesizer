
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock } from 'lucide-react';
import { MarketData } from '../types';
import { MarketChartView } from '../MarketChartView';
import { generateChartData } from '../utils/chartDataGenerator';

interface MarketPriceChartProps {
  marketData: MarketData;
}

export const MarketPriceChart: React.FC<MarketPriceChartProps> = ({ marketData }) => {
  const [activeTimeframe, setActiveTimeframe] = useState('24h');
  const chartData = generateChartData(marketData);
  
  return (
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
  );
};
