
import { TradingDataPoint } from "@/utils/tradingData";
import { 
  ComposedChart, 
  Bar,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  Legend,
  Brush,
  Area
} from "recharts";

interface VolumeChartProps {
  data: TradingDataPoint[];
  chartType?: "candles" | "line" | "area" | "bars";
}

export const VolumeChart = ({ data, chartType = "bars" }: VolumeChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data}>
        <defs>
          <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="name" stroke="#888888" />
        <YAxis stroke="#888888" />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(0,0,0,0.8)",
            border: "none",
            borderRadius: "8px",
            color: "white",
            backdropFilter: "blur(16px)"
          }}
        />
        <Legend />
        
        {chartType === "line" ? (
          <Line
            type="monotone"
            dataKey="volume"
            stroke="#8b5cf6"
            strokeWidth={2}
            name="Volume"
            dot={false}
          />
        ) : chartType === "area" ? (
          <Area
            type="monotone"
            dataKey="volume"
            stroke="#8b5cf6"
            fill="url(#colorVolume)"
            name="Volume"
          />
        ) : (
          <Bar
            dataKey="volume"
            fill="url(#colorVolume)"
            name="Volume"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`}
                fill={entry.trend === "up" ? "#4ade80" : "#ef4444"}
              />
            ))}
          </Bar>
        )}
        
        <Line
          type="monotone"
          dataKey="sma"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={false}
          name="Volume SMA"
        />
        <Brush 
          dataKey="name"
          height={30}
          stroke="#666666"
          fill="rgba(0,0,0,0.2)"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
