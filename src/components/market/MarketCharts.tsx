import React from "react";
import { MarketData } from "./types";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, BarChart, Bar, Cell } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface MarketChartsProps {
  data: MarketData[];
  isLoading?: boolean;
  type?: "price" | "volume" | "overview";
}

export const MarketCharts: React.FC<MarketChartsProps> = ({ 
  data, 
  isLoading = false,
  type = "price" 
}) => {
  if (isLoading) {
    return <Skeleton className="w-full h-[300px] rounded-md" />;
  }

  if (!data || data.length === 0) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No data available</AlertTitle>
      </Alert>
    );
  }

  const formattedData = data.map(item => ({
    name: item.symbol || item.name,
    value: type === "volume" ? item.volume : item.price,
    change: item.change24h || item.change || 0,
    price: item.price || 0,
    volume: item.volume || 0,
    symbol: item.symbol || item.name,
    market: item.market,
    color: (item.change24h || item.change || 0) >= 0 ? "#4ade80" : "#f87171"
  }));

  if (type === "price") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={formattedData}>
          <defs>
            {formattedData.map((entry, index) => (
              <linearGradient key={`gradient-${index}`} id={`colorGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={entry.color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={entry.color} stopOpacity={0.1}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value, name, props) => {
              if (name === "value") return [`$${value.toLocaleString()}`, "Price"];
              return [value, name];
            }}
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: 'none',
              borderRadius: '4px',
              color: 'white'
            }}
          />
          {formattedData.map((entry, index) => (
            <Area 
              key={`area-${index}`}
              type="monotone" 
              dataKey="value"
              name="value"
              strokeWidth={2}
              stroke={entry.color}
              fill={`url(#colorGradient-${index})`}
              data={[entry]}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  if (type === "volume") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value) => [`${Number(value).toLocaleString()}`, "Volume"]}
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: 'none',
              borderRadius: '4px',
              color: 'white'
            }}
          />
          <Bar dataKey="value" name="Volume">
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // Overview type - shows both volume and price
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Price</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value) => [`$${Number(value).toLocaleString()}`, "Price"]}
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: 'none',
                borderRadius: '4px',
                color: 'white'
              }}
            />
            <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Volume</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value) => [`${Number(value).toLocaleString()}`, "Volume"]}
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: 'none',
                borderRadius: '4px',
                color: 'white'
              }}
            />
            <Bar dataKey="volume" fill="#4ade80" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
