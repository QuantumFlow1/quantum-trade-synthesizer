
import React from 'react';
import { ResponsiveContainer, Legend } from 'recharts';
import { ChartData } from './types';
import { BarChartView } from './chart/BarChartView';
import { AreaChartView } from './chart/AreaChartView';
import { LineChartView } from './chart/LineChartView';

interface MarketChartViewProps {
  data: ChartData[];
  type: 'overview' | 'volume' | 'price';
}

export const MarketChartView = ({ data, type }: MarketChartViewProps) => {
  // Find where projected data starts (if any)
  const projectionStartIndex = data.findIndex(item => item.projected);
  const hasProjections = projectionStartIndex !== -1;

  return (
    <div className="h-[350px] backdrop-blur-xl bg-secondary/20 border border-white/10 rounded-lg p-4 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'overview' ? (
          <BarChartView data={data} />
        ) : type === 'volume' ? (
          <AreaChartView data={data} />
        ) : (
          <LineChartView 
            data={data} 
            hasProjections={hasProjections} 
            projectionStartIndex={projectionStartIndex} 
          />
        )}
      </ResponsiveContainer>
    </div>
  );
};
