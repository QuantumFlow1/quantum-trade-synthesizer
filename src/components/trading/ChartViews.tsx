
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import { TradingDataPoint } from "@/utils/tradingData";
import { LoadingChart } from "../market/LoadingChart";
import { AutomatedTradingPanel } from './AutomatedTradingPanel';

interface ChartViewsProps {
  data: TradingDataPoint[];
  view: "price" | "volume" | "indicators";
  indicator: "sma" | "ema" | "rsi" | "macd" | "bollinger" | "stochastic" | "adx";
}

const tooltipStyle = {
  backgroundColor: "rgba(0,0,0,0.8)",
  border: "none",
  borderRadius: "8px",
  color: "white",
  padding: "8px",
};

export const ChartViews = ({ data, view, indicator }: ChartViewsProps) => {
  if (!data || data.length === 0) {
    return <LoadingChart />;
  }

  const renderPriceChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="name" stroke="#888888" />
        <YAxis stroke="#888888" />
        <Tooltip contentStyle={{...tooltipStyle, backdropFilter: "blur(16px)"}} />
        <Legend />
        <Line type="monotone" dataKey="close" stroke="#8b5cf6" name="Price" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderVolumeChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="name" stroke="#888888" />
        <YAxis stroke="#888888" />
        <Tooltip contentStyle={{...tooltipStyle, backdropFilter: "blur(16px)"}} />
        <Legend />
        <defs>
          <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="volume" fill="url(#volumeGradient)" stroke="#4ade80" name="Volume" fillOpacity={0.2} />
      </AreaChart>
    </ResponsiveContainer>
  );

  const renderIndicatorChart = () => {
    let dataKey: string;
    let strokeColor: string;
  
    switch (indicator) {
      case "sma":
        dataKey = "sma";
        strokeColor = "#eab308";
        break;
      case "ema":
        dataKey = "ema";
        strokeColor = "#22c55e";
        break;
      case "rsi":
        dataKey = "rsi";
        strokeColor = "#6366f1";
        break;
      case "macd":
        dataKey = "macd";
        strokeColor = "#f472b6";
        break;
      case "bollinger":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip contentStyle={{...tooltipStyle, backdropFilter: "blur(16px)"}} />
              <Legend />
              <Line type="monotone" dataKey="bollingerUpper" stroke="#6b7280" name="Bollinger Upper" strokeWidth={2} />
              <Line type="monotone" dataKey="close" stroke="#8b5cf6" name="Price" strokeWidth={2} />
              <Line type="monotone" dataKey="bollingerLower" stroke="#6b7280" name="Bollinger Lower" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      case "stochastic":
        dataKey = "stochastic";
        strokeColor = "#06b6d4";
        break;
      case "adx":
        dataKey = "adx";
        strokeColor = "#ea580c";
        break;
      default:
        dataKey = "sma";
        strokeColor = "#eab308";
        break;
    }
  
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="#888888" />
          <YAxis stroke="#888888" />
          <Tooltip contentStyle={{...tooltipStyle, backdropFilter: "blur(16px)"}} />
          <Legend />
          <Line type="monotone" dataKey={dataKey} stroke={strokeColor} name={indicator.toUpperCase()} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-6">
      <div className="h-[400px]">
        {view === "price" && renderPriceChart()}
        {view === "volume" && renderVolumeChart()}
        {view === "indicators" && renderIndicatorChart()}
      </div>
      <AutomatedTradingPanel simulationMode={true} />
    </div>
  );
};
