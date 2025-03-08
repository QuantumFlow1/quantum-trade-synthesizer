
import { useEffect, useRef } from "react";
import { TradingDataPoint } from "@/utils/tradingData";
import { Card } from "@/components/ui/card";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useThemeDetection } from "@/hooks/use-theme-detection";

interface MinimalPriceChartProps {
  data: TradingDataPoint[];
}

export const MinimalPriceChart = ({ data }: MinimalPriceChartProps) => {
  const theme = useThemeDetection();
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Log for debugging
  useEffect(() => {
    console.log("Rendering MinimalPriceChart with data:", data.length);
  }, [data]);
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };
  
  // Format data for the chart
  const chartData = data.map(point => ({
    time: point.timestamp,
    price: point.close,
    volume: point.volume,
    timeFormatted: formatDate(point.timestamp),
    trend: point.close > point.open ? "up" : "down"
  }));
  
  // Calculate min and max for better axis scaling
  const prices = chartData.map(d => d.price);
  const minPrice = Math.min(...prices) * 0.995; // 0.5% lower
  const maxPrice = Math.max(...prices) * 1.005; // 0.5% higher
  
  const lineColor = theme === 'dark' ? '#4ade80' : '#10b981';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const tooltipBg = theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)';
  const textColor = theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';
  
  // If no data, show placeholder
  if (!data.length) {
    return (
      <Card className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </Card>
    );
  }
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className={`p-2 rounded shadow-md ${theme === 'dark' ? 'bg-black/80 text-white' : 'bg-white/80 text-black'} border border-white/10`}>
          <p className="font-medium">{dataPoint.timeFormatted}</p>
          <p>Price: ${dataPoint.price.toFixed(2)}</p>
          <p>Volume: {dataPoint.volume.toLocaleString()}</p>
          <p className={dataPoint.trend === "up" ? "text-green-500" : "text-red-500"}>
            Trend: {dataPoint.trend === "up" ? "↑ Up" : "↓ Down"}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="h-full w-full flex flex-col" ref={chartRef}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="timeFormatted" 
            stroke={textColor}
            tick={{ fill: textColor }}
            tickLine={{ stroke: gridColor }}
          />
          <YAxis 
            domain={[minPrice, maxPrice]}
            stroke={textColor}
            tick={{ fill: textColor }}
            tickLine={{ stroke: gridColor }}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ stroke: gridColor }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={lineColor}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: lineColor, stroke: 'white', strokeWidth: 2 }}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
