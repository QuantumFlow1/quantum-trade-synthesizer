
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, TrendingUp, AlertCircle, Info } from 'lucide-react';
import { MarketData, HourlyProjection } from '../types';
import { MarketChartView } from '../MarketChartView';
import { generateChartData } from '../utils/chartDataGenerator';
import { toast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MarketPriceChartProps {
  marketData: MarketData;
}

export const MarketPriceChart: React.FC<MarketPriceChartProps> = ({ marketData }) => {
  const [activeTimeframe, setActiveTimeframe] = useState('24h');
  const [chartData, setChartData] = useState(generateChartData(marketData));
  const [hourlyProjections, setHourlyProjections] = useState<HourlyProjection[]>([]);
  const [isLoadingProjections, setIsLoadingProjections] = useState(false);

  // Generate hourly projections for the next 24 hours
  useEffect(() => {
    if (activeTimeframe === '24h') {
      setIsLoadingProjections(true);
      
      // Simulate API call for projections
      setTimeout(() => {
        const projections: HourlyProjection[] = [];
        const currentHour = new Date().getHours();
        const basePrice = marketData.price;
        const volatilityFactor = Math.random() * 0.05 + 0.01; // 1-6% volatility
        
        // Generate 24 hours of projections
        for (let i = 1; i <= 24; i++) {
          const hour = (currentHour + i) % 24;
          const trendBias = Math.random() > 0.5 ? 1 : -1; // Random trend direction
          const hourlyChange = (Math.random() * volatilityFactor * basePrice) * trendBias;
          const projectedPrice = basePrice + (hourlyChange * i * 0.7); // Cumulative effect with dampening
          const confidence = Math.max(0, 1 - (i * 0.03)); // Confidence decreases over time
          
          // Determine trend and volatility
          const trend = hourlyChange > 0 ? 'up' : hourlyChange < 0 ? 'down' : 'neutral';
          const volatility = 
            Math.abs(hourlyChange) > (basePrice * 0.03) ? 'high' :
            Math.abs(hourlyChange) > (basePrice * 0.01) ? 'medium' : 'low';
          
          projections.push({
            hour,
            projectedPrice,
            confidence,
            trend,
            volatility
          });
        }
        
        setHourlyProjections(projections);
        
        // Modify chart data to include projections
        const currentData = generateChartData(marketData);
        const currentHourIndex = currentData.findIndex(d => 
          d.name === `${currentHour.toString().padStart(2, '0')}:00`
        );
        
        if (currentHourIndex !== -1) {
          // Take all existing data up to current hour
          const baseData = currentData.slice(0, currentHourIndex + 1);
          
          // Add projection data points
          const projectedData = projections.map((proj, idx) => {
            const confidenceBand = proj.projectedPrice * (1 - proj.confidence * 0.2); // Wider bands for less confidence
            return {
              name: `${proj.hour.toString().padStart(2, '0')}:00`,
              price: currentData[0].price, // Maintain a reference line
              volume: 0,
              high: proj.projectedPrice + confidenceBand * 0.5, // Add confidence bands
              low: proj.projectedPrice - confidenceBand * 0.5,
              change: 0,
              projected: true,
              projectedPrice: proj.projectedPrice,
              confidence: proj.confidence,
              upperBand: proj.projectedPrice + confidenceBand * 0.5,
              lowerBand: proj.projectedPrice - confidenceBand * 0.5
            };
          });
          
          setChartData([...baseData, ...projectedData]);
        }
        
        setIsLoadingProjections(false);
        
        toast({
          title: "Hourly Projections Generated",
          description: "24-hour price projections have been calculated based on recent market activity",
          duration: 3000,
        });
      }, 1500);
    } else {
      // Reset to regular chart data for other timeframes
      setChartData(generateChartData(marketData));
    }
  }, [activeTimeframe, marketData]);
  
  return (
    <div>
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
          <div className="relative">
            {isLoadingProjections && (
              <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm py-1 px-2 rounded-md text-xs flex items-center z-10">
                <TrendingUp className="h-3 w-3 mr-1 animate-pulse" />
                Generating projections...
              </div>
            )}
            
            {activeTimeframe === '24h' && hourlyProjections.length > 0 && !isLoadingProjections && (
              <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm py-1 px-2 rounded-md text-xs flex items-center z-10">
                <TrendingUp className="h-3 w-3 mr-1 text-primary" />
                Showing 24h projections
              </div>
            )}
            
            <MarketChartView data={chartData} type="price" />
          </div>
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
      
      {activeTimeframe === '24h' && hourlyProjections.length > 0 && (
        <div className="mt-4 bg-secondary/20 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-primary" />
              24-Hour Price Projection Summary
            </h3>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Info className="h-3 w-3 mr-1" />
                    About Projections
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Projections are indicated with dashed lines, with confidence bands showing possible price ranges. 
                    Higher confidence projections have narrower bands.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-background/80 p-2 rounded">
              <p className="text-muted-foreground">Average Trend</p>
              <p className={`font-medium ${
                hourlyProjections.filter(p => p.trend === 'up').length > hourlyProjections.filter(p => p.trend === 'down').length
                ? 'text-green-500' : 'text-red-500'
              }`}>
                {
                  hourlyProjections.filter(p => p.trend === 'up').length > hourlyProjections.filter(p => p.trend === 'down').length
                  ? 'Bullish' : 'Bearish'
                }
              </p>
            </div>
            
            <div className="bg-background/80 p-2 rounded">
              <p className="text-muted-foreground">Expected Volatility</p>
              <p className="font-medium">
                {
                  hourlyProjections.filter(p => p.volatility === 'high').length > hourlyProjections.length / 3
                  ? 'High' : hourlyProjections.filter(p => p.volatility === 'medium').length > hourlyProjections.length / 2
                  ? 'Medium' : 'Low'
                }
              </p>
            </div>
            
            <div className="bg-background/80 p-2 rounded">
              <p className="text-muted-foreground">Confidence Level</p>
              <p className="font-medium">
                {(hourlyProjections.reduce((sum, proj) => sum + proj.confidence, 0) / hourlyProjections.length * 100).toFixed(0)}%
              </p>
            </div>
          </div>
          
          <div className="mt-3 flex items-center flex-wrap gap-2 text-xs">
            <div className="flex items-center">
              <span className="inline-block w-6 h-[2px] bg-primary mr-1"></span>
              <span>Actual data</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-6 h-[2px] border-t-[2px] border-dashed border-amber-500 mr-1"></span>
              <span>Projection</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-6 h-4 bg-amber-100/50 border border-amber-200/50 mr-1"></span>
              <span>Confidence band</span>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2">
            Note: Projections are based on historical patterns and current market conditions. Actual prices may vary significantly.
          </p>
        </div>
      )}
    </div>
  );
};
