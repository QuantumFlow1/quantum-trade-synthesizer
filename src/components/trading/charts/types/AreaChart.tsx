
import { TradingDataPoint } from "@/utils/tradingData";
import { 
  ComposedChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  Brush,
  Area,
  Line
} from "recharts";
import { ChartTooltip } from "./ChartTooltip";
import { BaseChartProps } from "./types";

export const AreaChart = ({ data }: BaseChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="name" stroke="#888888" />
        <YAxis stroke="#888888" domain={['auto', 'auto']} />
        <ChartTooltip />
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
          y={data[0]?.close}
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
