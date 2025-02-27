
import { ReactNode } from "react";
import { TradingDataPoint } from "@/utils/tradingData";
import { 
  ComposedChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  Brush,
  Cell
} from "recharts";
import { BaseChartProps } from "./types";
import { ChartTooltip } from "./ChartTooltip";

interface BarChartProps extends BaseChartProps {
  children?: ReactNode;
}

export const BarChart = ({ data, children }: BarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="name" stroke="#888888" />
        <YAxis stroke="#888888" domain={['auto', 'auto']} />
        <ChartTooltip />
        <Legend />
        <Bar dataKey="close" name="Price">
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`}
              fill={entry.close > entry.open ? "#4ade80" : "#ef4444"}
            />
          ))}
        </Bar>
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
