
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 animate-in fade-in duration-700">
      {data.map((item, index) => (
        <Card 
          key={item.name} 
          className="p-4 backdrop-blur-xl bg-secondary/30 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300 hover:translate-y-[-2px] animate-in fade-in duration-700"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex flex-col relative overflow-hidden">
            {/* Glow effect for positive/negative changes */}
            <div className={`absolute inset-0 opacity-20 blur-xl ${
              Number(item.change) >= 0 ? 'bg-green-500' : 'bg-red-500'
            }`} />
            
            <span className="text-sm font-medium text-gradient">{item.name}</span>
            <span className="text-lg font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              {formatNumber(item.price)}
            </span>
            <div className="flex items-center gap-1 mt-1">
              {Number(item.change) >= 0 ? (
                <ArrowUpIcon className="w-4 h-4 text-green-500 animate-pulse" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 text-red-500 animate-pulse" />
              )}
              <span className={`text-sm ${Number(item.change) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {item.change}%
              </span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between items-center">
                <span>Vol:</span>
                <span className="font-medium">{formatNumber(item.volume)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>H:</span>
                <span className="font-medium text-green-400">{formatNumber(item.high)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>L:</span>
                <span className="font-medium text-red-400">{formatNumber(item.low)}</span>
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
    <div className="h-full w-full space-y-6 animate-in fade-in duration-1000">
      <MarketMetrics />
      
      <div className="h-[350px] backdrop-blur-xl bg-secondary/20 border border-white/10 rounded-lg p-4 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'overview' ? (
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip 
                contentStyle={{
                  ...tooltipStyle,
                  backdropFilter: "blur(16px)",
                  backgroundColor: "rgba(0,0,0,0.8)",
                }} 
              />
              <Legend />
              <Bar dataKey="volume" fill="#4ade80" name="Volume" />
              <Bar dataKey="price" fill="#8b5cf6" name="Price" />
            </BarChart>
          ) : type === 'volume' ? (
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip 
                contentStyle={{
                  ...tooltipStyle,
                  backdropFilter: "blur(16px)",
                  backgroundColor: "rgba(0,0,0,0.8)",
                }} 
              />
              <Legend />
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="volume" 
                fill="url(#volumeGradient)" 
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
              <Tooltip 
                contentStyle={{
                  ...tooltipStyle,
                  backdropFilter: "blur(16px)",
                  backgroundColor: "rgba(0,0,0,0.8)",
                }} 
              />
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
