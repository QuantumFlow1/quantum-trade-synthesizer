
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

// Custom tooltip to replace the default white background
const CustomMACDTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/80 backdrop-blur-sm border border-muted p-2 rounded shadow-md text-xs">
        <p className="text-cyan-500">{`MACD: ${payload[0].value.toFixed(2)}`}</p>
        <p className="text-fuchsia-500">{`Signal: ${payload[1].value.toFixed(2)}`}</p>
        <p className={payload[2]?.value > 0 ? "text-green-500" : "text-red-500"}>
          {`Histogram: ${payload[2]?.value.toFixed(2) || payload[3]?.value.toFixed(2)}`}
        </p>
      </div>
    );
  }
  return null;
};

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
    <div className="border rounded-lg p-4 bg-background/60 backdrop-blur-sm">
      <h3 className="text-sm font-medium mb-2">MACD</h3>
      <div className="h-[100px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10 }}
              interval="preserveStartEnd"
              tickFormatter={(value) => value}
            />
            <YAxis 
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => value.toFixed(1)}
            />
            <Tooltip content={<CustomMACDTooltip />} />
            <ReferenceLine y={0} stroke="#888888" />
            <Line
              type="monotone"
              dataKey="macd"
              stroke="#06b6d4"
              dot={false}
              name="MACD"
              activeDot={{ r: 6, stroke: "#06b6d4", strokeWidth: 2, fill: "#06b6d4" }}
            />
            <Line
              type="monotone"
              dataKey="macdSignal"
              stroke="#d946ef"
              dot={false}
              name="Signal"
              activeDot={{ r: 6, stroke: "#d946ef", strokeWidth: 2, fill: "#d946ef" }}
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
