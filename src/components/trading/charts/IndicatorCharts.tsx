
import { TradingDataPoint } from "@/utils/tradingData";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Cell,
  ReferenceLine
} from "recharts";

interface IndicatorChartsProps {
  data: TradingDataPoint[];
  indicator: "sma" | "ema" | "rsi" | "macd" | "bollinger" | "stochastic" | "adx";
}

const baseTooltipStyle = {
  contentStyle: {
    backgroundColor: "rgba(0,0,0,0.8)",
    border: "none",
    borderRadius: "8px",
    color: "white",
    backdropFilter: "blur(16px)"
  }
};

export const IndicatorCharts = ({ data, indicator }: IndicatorChartsProps) => {
  switch (indicator) {
    case "bollinger":
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#888888" />
            <YAxis stroke="#888888" />
            <Tooltip {...baseTooltipStyle} />
            <Line type="monotone" dataKey="close" stroke="#4ade80" strokeWidth={2} />
            <Line type="monotone" dataKey="bollingerUpper" stroke="#8b5cf6" strokeWidth={1} strokeDasharray="3 3" />
            <Line type="monotone" dataKey="bollingerLower" stroke="#8b5cf6" strokeWidth={1} strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>
      );

    case "macd":
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#888888" />
            <YAxis stroke="#888888" />
            <Tooltip {...baseTooltipStyle} />
            <Line type="monotone" dataKey="macd" stroke="#4ade80" strokeWidth={2} />
            <Line type="monotone" dataKey="macdSignal" stroke="#8b5cf6" strokeWidth={2} />
            <Bar dataKey="macdHistogram">
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={entry.macdHistogram >= 0 ? "#4ade80" : "#ef4444"}
                />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      );

    case "rsi":
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#888888" />
            <YAxis domain={[0, 100]} stroke="#888888" />
            <Tooltip {...baseTooltipStyle} />
            <Line type="monotone" dataKey="rsi" stroke="#8b5cf6" strokeWidth={2} />
            <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" />
            <ReferenceLine y={30} stroke="#4ade80" strokeDasharray="3 3" />
          </ComposedChart>
        </ResponsiveContainer>
      );

    case "stochastic":
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#888888" />
            <YAxis domain={[0, 100]} stroke="#888888" />
            <Tooltip {...baseTooltipStyle} />
            <Line type="monotone" dataKey="stochastic" stroke="#8b5cf6" strokeWidth={2} />
            <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="3 3" />
            <ReferenceLine y={20} stroke="#4ade80" strokeDasharray="3 3" />
          </ComposedChart>
        </ResponsiveContainer>
      );

    case "ema":
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#888888" />
            <YAxis stroke="#888888" />
            <Tooltip {...baseTooltipStyle} />
            <Line type="monotone" dataKey="close" stroke="#4ade80" strokeWidth={2} />
            <Line type="monotone" dataKey="ema" stroke="#8b5cf6" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      );

    default:
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#888888" />
            <YAxis stroke="#888888" />
            <Tooltip {...baseTooltipStyle} />
            <Line
              type="monotone"
              dataKey={indicator}
              stroke="#8b5cf6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      );
  }
};

