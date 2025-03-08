
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { MarketData } from '../types';
import { MarketChartView } from '../MarketChartView';
import { TimeframeSelector } from './chart/TimeframeSelector';
import { ProjectionStatusIndicator } from './chart/ProjectionStatusIndicator';
import { PlaceholderTimeframe } from './chart/PlaceholderTimeframe';
import { ProjectionSummary } from './chart/ProjectionSummary';
import { useProjections } from './chart/useProjections';

interface MarketPriceChartProps {
  marketData: MarketData;
}

export const MarketPriceChart: React.FC<MarketPriceChartProps> = ({ marketData }) => {
  const [activeTimeframe, setActiveTimeframe] = useState('24h');
  
  const {
    chartData,
    hourlyProjections,
    isLoadingProjections,
    hasProjections
  } = useProjections(marketData, activeTimeframe);
  
  return (
    <div>
      <Tabs value={activeTimeframe} onValueChange={setActiveTimeframe} className="mb-6">
        <TimeframeSelector activeTimeframe={activeTimeframe} />
        
        <TabsContent value="24h" className="h-[300px]">
          <div className="relative">
            <ProjectionStatusIndicator 
              isLoading={isLoadingProjections} 
              hasProjections={hasProjections}
            />
            
            <MarketChartView data={chartData} type="price" />
          </div>
        </TabsContent>
        
        {['1h', '7d', '30d', '90d', '1y', 'all'].map(timeframe => (
          <TabsContent key={timeframe} value={timeframe} className="h-[300px]">
            <PlaceholderTimeframe timeframe={timeframe} />
          </TabsContent>
        ))}
      </Tabs>
      
      {activeTimeframe === '24h' && hourlyProjections.length > 0 && (
        <ProjectionSummary hourlyProjections={hourlyProjections} />
      )}
    </div>
  );
};
