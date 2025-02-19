
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend } from 'recharts';
import { LoadingChart } from './LoadingChart';

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

  const commonProps = {
    width: "100%",
    height: "100%",
    data: data,
    margin: { top: 10, right: 30, left: 0, bottom: 0 }
  };

  switch (type) {
    case 'overview':
      return (
        <div className="h-full">
          <ResponsiveContainer {...commonProps}>
            <BarChart>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="volume" fill="#4ade80" name="Volume" />
              <Bar dataKey="price" fill="#8b5cf6" name="Price" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );

    case 'volume':
      return (
        <div className="h-full">
          <ResponsiveContainer {...commonProps}>
            <AreaChart>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Area type="monotone" dataKey="volume" fill="#4ade80" stroke="#4ade80" name="Volume" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      );

    case 'price':
      return (
        <div className="h-full">
          <ResponsiveContainer {...commonProps}>
            <LineChart>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey="price" stroke="#8b5cf6" name="Price" />
              <Line type="monotone" dataKey="high" stroke="#4ade80" name="High" />
              <Line type="monotone" dataKey="low" stroke="#ef4444" name="Low" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
  }
};
