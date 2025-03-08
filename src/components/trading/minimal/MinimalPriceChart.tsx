
import { useEffect, useState } from "react";
import { TradingDataPoint } from "@/utils/tradingData";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

interface MinimalPriceChartProps {
  data: TradingDataPoint[];
  className?: string;
}

export const MinimalPriceChart = ({ data, className = "" }: MinimalPriceChartProps) => {
  if (!data || data.length === 0) {
    return <div className={`flex items-center justify-center ${className}`}>No data available</div>;
  }

  return (
    <div className={`bg-card border rounded-lg p-4 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="#888888" />
          <YAxis stroke="#888888" />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.8)",
              border: "none",
              borderRadius: "8px",
              color: "white",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="close"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={false}
            name="Price"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
