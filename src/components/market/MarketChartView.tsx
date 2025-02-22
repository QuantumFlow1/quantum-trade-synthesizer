
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend } from 'recharts';
import { ChartData } from './types';

interface MarketChartViewProps {
  data: ChartData[];
  type: 'overview' | 'volume' | 'price';
}

const tooltipStyle = {
  backgroundColor: "rgba(0,0,0,0.8)",
  border: "none",
  borderRadius: "8px",
  color: "white",
  padding: "8px",
};

export const MarketChartView = ({ data, type }: MarketChartViewProps) => {
  const commonProps = {
    data: data,
    margin: { top: 20, right: 30, left: 20, bottom: 20 }
  };

  return (
    <div className="h-full w-full backdrop-blur-xl bg-secondary/20 border border-white/10 rounded-lg p-4 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'overview' ? (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#888888" />
            <YAxis stroke="#888888" />
            <Tooltip contentStyle={{...tooltipStyle, backdropFilter: "blur(16px)"}} />
            <Legend />
            <Bar dataKey="volume" fill="#4ade80" name="Volume" />
            <Bar dataKey="price" fill="#8b5cf6" name="Price" />
          </BarChart>
        ) : type === 'volume' ? (
          <AreaChart {...commonProps}>
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
        ) : (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#888888" />
            <YAxis stroke="#888888" />
            <Tooltip contentStyle={{...tooltipStyle, backdropFilter: "blur(16px)"}} />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="#8b5cf6" name="Price" strokeWidth={2} />
            <Line type="monotone" dataKey="high" stroke="#4ade80" name="High" strokeWidth={2} />
            <Line type="monotone" dataKey="low" stroke="#ef4444" name="Low" strokeWidth={2} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
