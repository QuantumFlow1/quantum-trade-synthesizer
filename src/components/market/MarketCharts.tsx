
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend } from 'recharts';
import { LoadingChart } from './LoadingChart';
import { Card } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react';

interface ChartData {
  name: string;
  volume: number;
  price: number;
  change: number;
  high: number;
  low: number;
}

interface MarketChartsProps {
  data: ChartData[];
  isLoading: boolean;
  type: 'overview' | 'volume' | 'price';
}

const tooltipStyle = {
  backgroundColor: "rgba(0,0,0,0.8)",
  border: "none",
  borderRadius: "8px",
  color: "white",
  padding: "8px",
};

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}K`;
  }
  return num.toFixed(2);
};

export const MarketCharts = ({ data, isLoading, type }: MarketChartsProps) => {
  if (isLoading) return <LoadingChart />;

  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-secondary/20 rounded-lg">
        <p className="text-sm text-muted-foreground">Geen marktdata beschikbaar</p>
      </div>
    );
  }

  const MarketMetrics = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {data.map((item) => (
        <Card key={item.name} className="p-4 bg-secondary/30 backdrop-blur-sm hover:bg-secondary/40 transition-all">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">{item.name}</span>
            <span className="text-lg font-bold">{formatNumber(item.price)}</span>
            <div className="flex items-center gap-1 mt-1">
              {Number(item.change) >= 0 ? (
                <ArrowUpIcon className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm ${Number(item.change) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {item.change}%
              </span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Vol:</span>
                <span>{formatNumber(item.volume)}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>H:</span>
                <span>{formatNumber(item.high)}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>L:</span>
                <span>{formatNumber(item.low)}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const commonProps = {
    data: data,
    margin: { top: 20, right: 30, left: 20, bottom: 20 }
  };

  return (
    <div className="h-full w-full">
      <MarketMetrics />
      
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'overview' ? (
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="volume" fill="#4ade80" name="Volume" />
              <Bar dataKey="price" fill="#8b5cf6" name="Price" />
            </BarChart>
          ) : type === 'volume' ? (
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="volume" 
                fill="#4ade80" 
                stroke="#4ade80" 
                name="Volume" 
                fillOpacity={0.2} 
              />
            </AreaChart>
          ) : (
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#8b5cf6" 
                name="Price" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="high" 
                stroke="#4ade80" 
                name="High" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="low" 
                stroke="#ef4444" 
                name="Low" 
                strokeWidth={2}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
