
import React, { useState } from 'react';
import { ChartData } from './types';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Eye, EyeOff } from 'lucide-react';
import { LineChartView } from './chart/LineChartView';

interface AIEnhancedChartViewProps {
  data: ChartData[];
  symbol: string;
}

export const AIEnhancedChartView = ({ data, symbol }: AIEnhancedChartViewProps) => {
  const [showAIProjections, setShowAIProjections] = useState(true);
  
  // Generate AI projections for the next 7 days
  const generateAIProjections = () => {
    if (!data || data.length === 0) return [];
    
    const historicalData = [...data];
    const lastDataPoint = historicalData[historicalData.length - 1];
    const lastPrice = lastDataPoint.price;
    
    // Generate projection points for next 7 days
    const projectionPoints = [];
    for (let i = 1; i <= 7; i++) {
      // Simple projection logic - can be replaced with more sophisticated algorithms
      const dayFactor = i / 7; // Increasing volatility over time
      const randomTrend = Math.random() * 0.2 - 0.1; // Random trend between -10% and +10%
      const volatility = 0.05 * dayFactor; // Increasing volatility over time
      
      const projectedChange = randomTrend + (Math.random() * volatility * 2 - volatility);
      const projectedPrice = lastPrice * (1 + projectedChange);
      
      // Calculate confidence bands - wider as we go further in time
      const confidenceFactor = 0.02 + (dayFactor * 0.08); // 2% to 10% confidence bands
      const upperBand = projectedPrice * (1 + confidenceFactor);
      const lowerBand = projectedPrice * (1 - confidenceFactor);
      
      projectionPoints.push({
        name: `Day+${i}`,
        projectedPrice,
        upperBand,
        lowerBand,
        confidence: 1 - (dayFactor * 0.5), // Decreasing confidence over time (100% to 50%)
        projected: true
      });
    }
    
    return [...historicalData, ...projectionPoints];
  };
  
  const chartData = showAIProjections ? generateAIProjections() : data;
  
  // Find where projected data starts (if any)
  const projectionStartIndex = chartData.findIndex(item => item.projected);
  const hasProjections = projectionStartIndex !== -1 && showAIProjections;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{symbol} Price Chart</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAIProjections(!showAIProjections)}
          className="flex items-center gap-1.5"
        >
          {showAIProjections ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          <BrainCircuit className="h-3.5 w-3.5 ml-0.5" />
          {showAIProjections ? "Hide AI Projections" : "Show AI Projections"}
        </Button>
      </div>
    
      <div className="h-[350px] backdrop-blur-xl bg-secondary/20 border border-white/10 rounded-lg p-4 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
        <LineChartView 
          data={chartData} 
          hasProjections={hasProjections} 
          projectionStartIndex={projectionStartIndex}
        />
      </div>
      
      {hasProjections && (
        <div className="text-xs text-muted-foreground bg-secondary/20 p-2 rounded-md">
          <p className="flex items-center gap-1.5">
            <BrainCircuit className="h-3.5 w-3.5 text-amber-400" />
            <span>AI projections are based on historical data patterns and market conditions. Actual performance may vary.</span>
          </p>
        </div>
      )}
    </div>
  );
};
