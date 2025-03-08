
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar
} from "recharts";
import { TradingDataPoint } from "@/utils/tradingData";
import { CustomTooltip } from "./CustomTooltip";

interface MainPriceChartProps {
  data: TradingDataPoint[];
  showVolume: boolean;
  showIndicators: boolean;
}

export const MainPriceChart = ({ data, showVolume, showIndicators }: MainPriceChartProps) => {
  // Calculate min and max values for better axis scaling
  const minPrice = Math.min(...data.map(d => d.low)) * 0.99;
  const maxPrice = Math.max(...data.map(d => d.high)) * 1.01;
  
  return (
    <div className="h-[400px] bg-card border rounded-lg p-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="#888888" />
          <YAxis 
            yAxisId="price" 
            domain={[minPrice, maxPrice]} 
            stroke="#888888"
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          {showVolume && (
            <YAxis
              yAxisId="volume"
              orientation="right"
              stroke="#888888"
              tickFormatter={(value) => `${value.toFixed(0)}`}
            />
          )}
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="close"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={false}
            name="Price"
            yAxisId="price"
          />
          {showIndicators && (
            <>
              <Line
                type="monotone"
                dataKey="sma"
                stroke="#22c55e"
                strokeWidth={1.5}
                dot={false}
                name="SMA"
                yAxisId="price"
              />
              <Line
                type="monotone"
                dataKey="ema"
                stroke="#3b82f6"
                strokeWidth={1.5}
                dot={false}
                name="EMA"
                yAxisId="price"
              />
              {data[0].bollingerUpper && (
                <>
                  <Line
                    type="monotone"
                    dataKey="bollingerUpper"
                    stroke="#94a3b8"
                    strokeDasharray="5 5"
                    strokeWidth={1}
                    dot={false}
                    name="Upper Band"
                    yAxisId="price"
                  />
                  <Line
                    type="monotone"
                    dataKey="bollingerLower"
                    stroke="#94a3b8"
                    strokeDasharray="5 5"
                    strokeWidth={1}
                    dot={false}
                    name="Lower Band"
                    yAxisId="price"
                  />
                </>
              )}
            </>
          )}
          {showVolume && (
            <Bar
              dataKey="volume"
              fill="#4f46e5"
              opacity={0.5}
              yAxisId="volume"
              name="Volume"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
