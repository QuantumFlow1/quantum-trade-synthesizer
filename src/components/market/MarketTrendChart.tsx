
import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface MarketTrendChartProps {
  data: { date: string; value: number }[];
  title?: string;
  showCard?: boolean;
  height?: number;
  marketDirection: "up" | "down" | "neutral";
  lastUpdated?: string;
}

export const MarketTrendChart: React.FC<MarketTrendChartProps> = ({
  data,
  title = "Market Trend",
  showCard = true,
  height = 200,
  marketDirection,
  lastUpdated
}) => {
  // Format data for display
  const chartData = data.map(item => ({
    date: item.date,
    value: item.value / 1000000000000, // Convert to trillions
  }));
  
  // Calculate percent change
  const calculatePercentChange = () => {
    if (data.length < 2) return 0;
    
    const firstValue = data[0].value;
    const lastValue = data[data.length - 1].value;
    
    return ((lastValue - firstValue) / firstValue) * 100;
  };
  
  const percentChange = calculatePercentChange();
  const isPositive = percentChange >= 0;
  
  // Format the tooltip value
  const formatTooltipValue = (value: number) => {
    return `$${value.toFixed(2)}T`;
  };
  
  // Format the y-axis labels
  const formatYAxis = (value: number) => {
    return `$${value.toFixed(1)}T`;
  };
  
  // Format last updated time
  const getLastUpdatedText = () => {
    if (!lastUpdated) return '';
    
    try {
      const date = new Date(lastUpdated);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return '';
    }
  };
  
  // Determine colors based on market direction
  const getChartColor = () => {
    switch (marketDirection) {
      case 'up': return '#22c55e'; // green
      case 'down': return '#ef4444'; // red
      default: return '#94a3b8'; // gray
    }
  };
  
  const chartColor = getChartColor();
  
  // Render the chart
  const renderChart = () => (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <h3 className="text-sm font-medium text-muted-foreground mr-2">{title}</h3>
          {marketDirection === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
          {marketDirection === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
          {marketDirection === 'neutral' && <Minus className="h-4 w-4 text-gray-500" />}
        </div>
        <div className="flex items-center">
          <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{percentChange.toFixed(2)}%
          </span>
          {lastUpdated && (
            <span className="text-xs text-muted-foreground ml-2">
              Updated {getLastUpdatedText()}
            </span>
          )}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => {
              // Show only first day of month or every 10th day
              const day = parseInt(value.split('-')[2]);
              if (day === 1 || day % 10 === 0) {
                return value.split('-').slice(1).join('/'); // MM/DD format
              }
              return '';
            }}
          />
          <YAxis 
            tickFormatter={formatYAxis} 
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            domain={['dataMin - 0.1', 'dataMax + 0.1']}
          />
          <Tooltip
            formatter={formatTooltipValue}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <ReferenceLine y={chartData[0]?.value} stroke="#666" strokeDasharray="3 3" />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={chartColor} 
            fillOpacity={1}
            fill="url(#colorValue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
  
  // Return with or without card wrapper
  return showCard ? (
    <Card>
      <CardHeader className="py-2">
        <CardTitle className="text-lg">Market Cap Trend</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {renderChart()}
      </CardContent>
    </Card>
  ) : (
    renderChart()
  );
};
