
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Bar
} from "recharts";
import { TradingDataPoint } from "@/utils/tradingData";

interface MACDChartProps {
  data: TradingDataPoint[];
}

export const MACDChart = ({ data }: MACDChartProps) => {
  // Create separate arrays for positive and negative histogram values
  const positiveData = data.map(item => ({
    ...item,
    positiveHistogram: item.macdHistogram >= 0 ? item.macdHistogram : 0
  }));
  
  const negativeData = data.map(item => ({
    ...item,
    negativeHistogram: item.macdHistogram < 0 ? item.macdHistogram : 0
  }));

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-sm font-medium mb-2">MACD</h3>
      <div className="h-[100px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" hide />
            <YAxis />
            <Tooltip />
            <ReferenceLine y={0} stroke="#888888" />
            <Line
              type="monotone"
              dataKey="macd"
              stroke="#06b6d4"
              dot={false}
              name="MACD"
            />
            <Line
              type="monotone"
              dataKey="macdSignal"
              stroke="#d946ef"
              dot={false}
              name="Signal"
            />
            <Bar
              dataKey="positiveHistogram"
              name="Histogram"
              fill="#22c55e"
              stackId="histogram"
              data={positiveData}
            />
            <Bar
              dataKey="negativeHistogram"
              name="Histogram"
              fill="#ef4444"
              stackId="histogram"
              data={negativeData}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
