
import { ReactNode } from "react";
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
  ReferenceLine,
  Area,
  Brush,
  Legend
} from "recharts";
import { DrawingToolsOverlay } from "./DrawingToolsOverlay";
import { useRef } from "react";
import { IndicatorType } from "./types/types";

interface IndicatorChartsProps {
  data: TradingDataPoint[];
  indicator: IndicatorType;
  chartType?: "candles" | "line" | "area" | "bars";
  showDrawingTools?: boolean;
  children?: ReactNode;
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

export const IndicatorCharts = ({ 
  data, 
  indicator, 
  chartType = "line", 
  showDrawingTools = false,
  children 
}: IndicatorChartsProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  switch (indicator) {
    case "bollinger":
      return (
        <div className="relative h-full" ref={chartContainerRef}>
          {showDrawingTools && (
            <DrawingToolsOverlay containerRef={chartContainerRef} />
          )}
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip {...baseTooltipStyle} />
              <Legend />
              
              {chartType === "area" ? (
                <Area 
                  type="monotone" 
                  dataKey="close" 
                  stroke="#4ade80" 
                  fill="rgba(74, 222, 128, 0.1)"
                  fillOpacity={0.3}
                  name="Price"
                />
              ) : (
                <Line 
                  type="monotone" 
                  dataKey="close" 
                  stroke="#4ade80" 
                  strokeWidth={2} 
                  name="Price"
                />
              )}
              
              <Line type="monotone" dataKey="bollingerUpper" stroke="#8b5cf6" strokeWidth={1} strokeDasharray="3 3" name="Upper Band" />
              <Line type="monotone" dataKey="bollingerLower" stroke="#8b5cf6" strokeWidth={1} strokeDasharray="3 3" name="Lower Band" />
              <Brush 
                dataKey="name"
                height={30}
                stroke="#666666"
                fill="rgba(0,0,0,0.2)"
              />
              {children}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      );

    case "macd":
      return (
        <div className="relative h-full" ref={chartContainerRef}>
          {showDrawingTools && (
            <DrawingToolsOverlay containerRef={chartContainerRef} />
          )}
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip {...baseTooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey="macd" stroke="#4ade80" strokeWidth={2} name="MACD" />
              <Line type="monotone" dataKey="macdSignal" stroke="#8b5cf6" strokeWidth={2} name="Signal" />
              <Bar dataKey="macdHistogram" name="Histogram">
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={entry.macdHistogram >= 0 ? "#4ade80" : "#ef4444"}
                  />
                ))}
              </Bar>
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
              <Brush 
                dataKey="name"
                height={30}
                stroke="#666666"
                fill="rgba(0,0,0,0.2)"
              />
              {children}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      );

    case "rsi":
      return (
        <div className="relative h-full" ref={chartContainerRef}>
          {showDrawingTools && (
            <DrawingToolsOverlay containerRef={chartContainerRef} />
          )}
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis domain={[0, 100]} stroke="#888888" />
              <Tooltip {...baseTooltipStyle} />
              <Legend />
              
              {chartType === "area" ? (
                <Area 
                  type="monotone" 
                  dataKey="rsi" 
                  stroke="#8b5cf6"
                  fill="rgba(139, 92, 246, 0.1)"
                  fillOpacity={0.3}
                  name="RSI"
                />
              ) : (
                <Line 
                  type="monotone" 
                  dataKey="rsi" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="RSI"
                />
              )}
              
              <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Overbought', position: 'right', fill: '#ef4444' }} />
              <ReferenceLine y={30} stroke="#4ade80" strokeDasharray="3 3" label={{ value: 'Oversold', position: 'right', fill: '#4ade80' }} />
              <Brush 
                dataKey="name"
                height={30}
                stroke="#666666"
                fill="rgba(0,0,0,0.2)"
              />
              {children}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      );

    case "stochastic":
      return (
        <div className="relative h-full" ref={chartContainerRef}>
          {showDrawingTools && (
            <DrawingToolsOverlay containerRef={chartContainerRef} />
          )}
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis domain={[0, 100]} stroke="#888888" />
              <Tooltip {...baseTooltipStyle} />
              <Legend />
              
              {chartType === "area" ? (
                <Area 
                  type="monotone" 
                  dataKey="stochastic" 
                  stroke="#8b5cf6"
                  fill="rgba(139, 92, 246, 0.1)"
                  fillOpacity={0.3}
                  name="Stochastic"
                />
              ) : (
                <Line 
                  type="monotone" 
                  dataKey="stochastic" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="Stochastic"
                />
              )}
              
              <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Overbought', position: 'right', fill: '#ef4444' }} />
              <ReferenceLine y={20} stroke="#4ade80" strokeDasharray="3 3" label={{ value: 'Oversold', position: 'right', fill: '#4ade80' }} />
              <Brush 
                dataKey="name"
                height={30}
                stroke="#666666"
                fill="rgba(0,0,0,0.2)"
              />
              {children}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      );

    case "ema":
      return (
        <div className="relative h-full" ref={chartContainerRef}>
          {showDrawingTools && (
            <DrawingToolsOverlay containerRef={chartContainerRef} />
          )}
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip {...baseTooltipStyle} />
              <Legend />
              
              {chartType === "area" ? (
                <Area 
                  type="monotone" 
                  dataKey="close" 
                  stroke="#4ade80"
                  fill="rgba(74, 222, 128, 0.1)"
                  fillOpacity={0.3}
                  name="Price"
                />
              ) : (
                <Line 
                  type="monotone" 
                  dataKey="close" 
                  stroke="#4ade80" 
                  strokeWidth={2}
                  name="Price"
                />
              )}
              
              <Line type="monotone" dataKey="ema" stroke="#8b5cf6" strokeWidth={2} name="EMA" />
              <Brush 
                dataKey="name"
                height={30}
                stroke="#666666"
                fill="rgba(0,0,0,0.2)"
              />
              {children}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      );

    default:
      return (
        <div className="relative h-full" ref={chartContainerRef}>
          {showDrawingTools && (
            <DrawingToolsOverlay containerRef={chartContainerRef} />
          )}
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip {...baseTooltipStyle} />
              <Legend />
              
              {chartType === "area" ? (
                <Area 
                  type="monotone" 
                  dataKey="close" 
                  stroke="#4ade80"
                  fill="rgba(74, 222, 128, 0.1)"
                  fillOpacity={0.3}
                  name="Price"
                />
              ) : (
                <Line 
                  type="monotone" 
                  dataKey="close" 
                  stroke="#4ade80" 
                  strokeWidth={2}
                  name="Price"
                />
              )}
              
              <Line type="monotone" dataKey="sma" stroke="#8b5cf6" strokeWidth={2} name="SMA" />
              <Brush 
                dataKey="name"
                height={30}
                stroke="#666666"
                fill="rgba(0,0,0,0.2)"
              />
              {children}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      );
  }
};
