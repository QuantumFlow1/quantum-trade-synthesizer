
import { TradingDataPoint } from "@/utils/tradingData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine, Bar, ComposedChart } from "recharts";

interface ChartViewsProps {
  data: TradingDataPoint[];
  view: "price" | "volume" | "indicators";
  indicator: "sma" | "ema" | "rsi" | "macd" | "bollinger" | "stochastic" | "adx";
}

export const ChartViews = ({ data, view, indicator }: ChartViewsProps) => {
  const baseChartProps = {
    data,
    width: "100%",
    height: "100%"
  };

  const baseTooltipStyle = {
    contentStyle: {
      backgroundColor: "rgba(0,0,0,0.8)",
      border: "none",
      borderRadius: "8px",
      color: "white",
      backdropFilter: "blur(16px)"
    }
  };

  if (view === "price") {
    return (
      <ResponsiveContainer {...baseChartProps}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="#888888" />
          <YAxis stroke="#888888" />
          <Tooltip {...baseTooltipStyle} />
          <Area
            type="monotone"
            dataKey="close"
            stroke="#4ade80"
            fillOpacity={1}
            fill="url(#colorValue)"
          />
          <ReferenceLine
            y={data[0].close}
            stroke="rgba(255,255,255,0.2)"
            strokeDasharray="3 3"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  if (view === "volume") {
    return (
      <ResponsiveContainer {...baseChartProps}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="#888888" />
          <YAxis stroke="#888888" />
          <Tooltip {...baseTooltipStyle} />
          <Area
            type="monotone"
            dataKey="volume"
            stroke="#8b5cf6"
            fillOpacity={1}
            fill="url(#colorVolume)"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  if (view === "indicators") {
    switch (indicator) {
      case "bollinger":
        return (
          <ResponsiveContainer {...baseChartProps}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip {...baseTooltipStyle} />
              <Line type="monotone" dataKey="close" stroke="#4ade80" strokeWidth={2} />
              <Line type="monotone" dataKey="bollingerUpper" stroke="#8b5cf6" strokeWidth={1} strokeDasharray="3 3" />
              <Line type="monotone" dataKey="bollingerLower" stroke="#8b5cf6" strokeWidth={1} strokeDasharray="3 3" />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case "macd":
        return (
          <ResponsiveContainer {...baseChartProps}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip {...baseTooltipStyle} />
              <Line type="monotone" dataKey="macd" stroke="#4ade80" strokeWidth={2} />
              <Line type="monotone" dataKey="macdSignal" stroke="#8b5cf6" strokeWidth={2} />
              <Bar dataKey="macdHistogram" fill={data.map(d => d.macdHistogram >= 0 ? "#4ade80" : "#ef4444")} />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case "rsi":
        return (
          <ResponsiveContainer {...baseChartProps}>
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
          <ResponsiveContainer {...baseChartProps}>
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

      default:
        return (
          <ResponsiveContainer {...baseChartProps}>
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
  }

  return null;
};
