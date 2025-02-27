
import { ReactNode } from "react";
import { 
  ComposedChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  Brush
} from "recharts";
import { BaseChartProps } from "./types";
import { ChartTooltip } from "./ChartTooltip";

interface AreaChartProps extends BaseChartProps {
  children?: ReactNode;
}

export const AreaChart = ({ data, children }: AreaChartProps) => {
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
          fill="url(#colorValue)" 
          fillOpacity={0.3}
          name="Price"
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
        {children}
      </ComposedChart>
    </ResponsiveContainer>
  );
};
