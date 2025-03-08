
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from "recharts";
import { TradingDataPoint } from "@/utils/tradingData";
import { Badge } from "@/components/ui/badge";

interface RSIChartProps {
  data: TradingDataPoint[];
}

export const RSIChart = ({ data }: RSIChartProps) => {
  // Find overbought/oversold levels in the data
  const overboughtRSI = data.some(d => d.rsi > 70);
  const oversoldRSI = data.some(d => d.rsi < 30);
  
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-sm font-medium mb-2">RSI</h3>
      <div className="h-[100px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" hide />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="3 3" />
            <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="rsi"
              stroke="#f59e0b"
              dot={false}
              name="RSI"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>Oversold &lt; 30</span>
        <span>Overbought &gt; 70</span>
      </div>
      
      {oversoldRSI && (
        <Badge className="mt-2 bg-green-500/10 text-green-500 hover:bg-green-500/20">
          Oversold Condition
        </Badge>
      )}
      
      {overboughtRSI && (
        <Badge className="mt-2 bg-red-500/10 text-red-500 hover:bg-red-500/20">
          Overbought Condition
        </Badge>
      )}
    </div>
  );
};
