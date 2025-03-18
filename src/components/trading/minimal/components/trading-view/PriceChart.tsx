
import React from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine,
  Area 
} from 'recharts';
import { ChartLegend } from '@/components/trading/chart-components/ChartLegend';
import { ChartIndicators } from '../../hooks/useTradingViewState';

interface PriceChartProps {
  data: any[];
  chartType: string;
  visibleIndicators: ChartIndicators;
  showLegend?: boolean;
}

export const PriceChart: React.FC<PriceChartProps> = ({ 
  data, 
  chartType, 
  visibleIndicators,
  showLegend = true
}) => {
  // Check if data exists
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-muted/20">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  // Determine y-axis domain based on data
  const allValues = data.flatMap(d => [d.high, d.low, d.close, d.open].filter(Boolean));
  const minValue = Math.min(...allValues) * 0.99;
  const maxValue = Math.max(...allValues) * 1.01;

  // Generate legend items
  const legendItems = [
    { label: 'Price', color: '#3b82f6', type: chartType === 'line' ? 'line' : 'area' },
    ...(visibleIndicators.sma ? [{ label: 'SMA', color: '#ef4444', type: 'line' as const }] : []),
    ...(visibleIndicators.ema ? [{ label: 'EMA', color: '#8b5cf6', type: 'line' as const }] : []),
    ...(visibleIndicators.bollingerBands ? [
      { label: 'Bollinger Upper', color: '#84cc16', type: 'dashed' as const },
      { label: 'Bollinger Lower', color: '#84cc16', type: 'dashed' as const }
    ] : [])
  ];

  return (
    <div className="relative h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10 }}
            interval={"preserveStartEnd"}
            tickMargin={5}
          />
          <YAxis 
            domain={[minValue, maxValue]} 
            tickCount={6}
            tick={{ fontSize: 10 }}
            tickFormatter={(value) => value.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })}
            width={60}
          />
          <Tooltip />
          
          {/* Only show legend if showLegend is true */}
          {showLegend && <Legend />}
          
          {/* Render based on chart type */}
          {chartType === 'line' && (
            <Line 
              type="monotone" 
              dataKey="close" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={false} 
              activeDot={{ r: 5 }}
            />
          )}
          
          {chartType === 'area' && (
            <Area 
              type="monotone" 
              dataKey="close" 
              stroke="#3b82f6" 
              fill="#3b82f680" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          )}
          
          {chartType === 'candles' && (
            <>
              <Bar 
                dataKey="shadowHigh" 
                fill="transparent" 
                stroke="#374151" 
                strokeWidth={1} 
              />
              <Bar 
                dataKey="candle" 
                fill={(data) => data.close >= data.open ? '#22c55e' : '#ef4444'}
                stroke={(data) => data.close >= data.open ? '#22c55e' : '#ef4444'}
              />
            </>
          )}
          
          {/* Indicators */}
          {visibleIndicators.sma && (
            <Line 
              type="monotone" 
              dataKey="sma" 
              stroke="#ef4444" 
              strokeWidth={1.5} 
              dot={false} 
              strokeDasharray="3 3"
            />
          )}
          
          {visibleIndicators.ema && (
            <Line 
              type="monotone" 
              dataKey="ema" 
              stroke="#8b5cf6" 
              strokeWidth={1.5} 
              dot={false}
            />
          )}
          
          {visibleIndicators.bollingerBands && (
            <>
              <Line 
                type="monotone" 
                dataKey="bollingerUpper" 
                stroke="#84cc16" 
                strokeWidth={1} 
                dot={false} 
                strokeDasharray="3 3"
              />
              <Line 
                type="monotone" 
                dataKey="bollingerLower" 
                stroke="#84cc16" 
                strokeWidth={1} 
                dot={false} 
                strokeDasharray="3 3"
              />
            </>
          )}
        </ComposedChart>
      </ResponsiveContainer>
      
      {/* Custom legend */}
      {showLegend && (
        <ChartLegend 
          items={legendItems}
          className="absolute top-2 left-2"
        />
      )}
    </div>
  );
};
