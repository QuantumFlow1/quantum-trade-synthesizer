
import { TradingDataPoint } from "@/utils/tradingData";
import { 
  ComposedChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  Brush
} from "recharts";

interface PriceChartProps {
  data: TradingDataPoint[];
}

export const PriceChart = ({ data }: PriceChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
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
        <Area
          type="monotone"
          dataKey="close"
          stroke="#4ade80"
          fillOpacity={1}
          fill="url(#colorValue)"
          name="Price"
        />
        <Line
          type="monotone"
          dataKey="sma"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={false}
          name="SMA"
        />
        <ReferenceLine
          y={data[0].close}
          stroke="rgba(255,255,255,0.2)"
          strokeDasharray="3 3"
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

