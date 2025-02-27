
import { TradingDataPoint } from "@/utils/tradingData";
import { 
  ComposedChart, 
  Area, 
  Line, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  Brush,
  Scatter
} from "recharts";
import { CandlestickSeries } from "./CandlestickSeries";

interface PriceChartProps {
  data: TradingDataPoint[];
  chartType?: "candles" | "line" | "area" | "bars";
}

export const PriceChart = ({ data, chartType = "candles" }: PriceChartProps) => {
  const renderChart = () => {
    const baseProps = {
      data,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    };

    switch (chartType) {
      case "candles":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart {...baseProps}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  backdropFilter: "blur(16px)"
                }}
                labelFormatter={(label) => `Time: ${label}`}
                formatter={(value, name) => {
                  // Convert value to string before returning
                  return [value.toString(), name];
                }}
              />
              <Legend />
              <CandlestickSeries
                data={data}
                xAxisDataKey="name"
                openDataKey="open"
                highDataKey="high"
                lowDataKey="low"
                closeDataKey="close"
                upColor="#4ade80"
                downColor="#ef4444"
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
      
      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart {...baseProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" domain={['auto', 'auto']} />
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
              <Line
                type="monotone"
                dataKey="close"
                stroke="#4ade80"
                strokeWidth={2}
                dot={false}
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
        
      case "area":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart {...baseProps}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" domain={['auto', 'auto']} />
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
        
      case "bars":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart {...baseProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" domain={['auto', 'auto']} />
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
              <Bar
                dataKey="close"
                name="Price"
                fill="transparent"
                stroke="#4ade80"
              >
                {data.map((entry, index) => (
                  <Bar 
                    key={`cell-${index}`}
                    dataKey="close"
                    fill={entry.trend === "up" ? "#4ade80" : "#ef4444"}
                  />
                ))}
              </Bar>
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
        
      default:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart {...baseProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" domain={['auto', 'auto']} />
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
              <Line
                type="monotone"
                dataKey="close"
                stroke="#4ade80"
                strokeWidth={2}
                name="Price"
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
    }
  };

  return renderChart();
};
