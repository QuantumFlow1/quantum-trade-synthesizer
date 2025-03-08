
import { TradingDataPoint } from "@/utils/tradingData";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

interface MinimalPriceChartProps {
  data: TradingDataPoint[];
  className?: string;
}

export const MinimalPriceChart = ({ data, className = "" }: MinimalPriceChartProps) => {
  console.log("Rendering MinimalPriceChart with data:", data.length);
  
  if (!data || data.length === 0) {
    return <div className={`flex items-center justify-center h-full ${className}`}>No data available</div>;
  }

  // Format chart data for better readability
  const formattedData = data.map(point => ({
    ...point,
    // Format the name for better display on the X-axis
    name: typeof point.name === 'string' 
      ? point.name.length > 5 
        ? point.name.substring(0, 5) + '...' 
        : point.name
      : '',
    // Round price to 2 decimal places for display
    close: Number(point.close.toFixed(2))
  }));

  return (
    <div className={`bg-card border rounded-lg p-4 h-full ${className}`}>
      <ResponsiveContainer width="99%" height="99%">
        <ComposedChart
          data={formattedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="name" 
            stroke="#888888"
            tickFormatter={(value) => value.toString().substring(0, 5)}
          />
          <YAxis 
            stroke="#888888"
            domain={['auto', 'auto']}
            tickFormatter={(value) => value.toFixed(1)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.8)",
              border: "none",
              borderRadius: "8px",
              color: "white",
            }}
            formatter={(value) => [Number(value).toFixed(2), "Price"]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="close"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={false}
            name="Price"
            activeDot={{ r: 6, fill: "#a855f7" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
