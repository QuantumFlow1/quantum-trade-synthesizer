
import { useState } from 'react';
import { MarketData } from '../types';
import { MarketChartView } from '../MarketChartView';
import { AIEnhancedChartView } from '../AIEnhancedChartView';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BrainCircuit, BarChart } from 'lucide-react';

interface MarketPriceChartProps {
  marketData: MarketData;
}

export const MarketPriceChart = ({ marketData }: MarketPriceChartProps) => {
  const [chartType, setChartType] = useState<'standard' | 'ai'>('standard');
  
  // Generate sample chart data
  const generateChartData = () => {
    const basePrice = marketData.price;
    const baseVolume = marketData.volume || 1000000;
    const data = [];
    
    // Generate 30 days of data
    for (let i = 30; i >= 0; i--) {
      const dayFactor = i / 30; // 0-1 factor for day position
      const randomFactor = Math.random() * 0.1 - 0.05; // Random -5% to +5%
      const priceChange = basePrice * (randomFactor * (1 + dayFactor)); // More volatility in the past
      
      const dayPrice = basePrice + priceChange * (i < 5 ? 1 : -1); // Trending up in recent days
      const high = dayPrice * (1 + Math.random() * 0.03);
      const low = dayPrice * (1 - Math.random() * 0.03);
      
      data.push({
        name: `Day-${i}`,
        price: dayPrice,
        high,
        low,
        volume: baseVolume * (0.7 + Math.random() * 0.6) // Random volume 70%-130% of base
      });
    }
    
    return data;
  };
  
  const chartData = generateChartData();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Tabs value={chartType} onValueChange={(value) => setChartType(value as 'standard' | 'ai')}>
          <TabsList>
            <TabsTrigger value="standard" className="flex items-center gap-1.5">
              <BarChart className="h-4 w-4" />
              Standard
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-1.5">
              <BrainCircuit className="h-4 w-4" />
              AI Enhanced
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="transition-all duration-300 ease-in-out">
        {chartType === 'standard' ? (
          <MarketChartView data={chartData} type="price" />
        ) : (
          <AIEnhancedChartView data={chartData} symbol={marketData.symbol} />
        )}
      </div>
    </div>
  );
};
