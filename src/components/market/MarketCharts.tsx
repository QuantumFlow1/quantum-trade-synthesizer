
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

  const commonProps = {
    data,
    width: "100%",
    height: "100%",
    children: (
      <>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="name" stroke="#888888" />
        <YAxis stroke="#888888" />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend />
      </>
    ),
  };

  switch (type) {
    case 'overview':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart {...commonProps}>
            {commonProps.children}
            <Bar dataKey="volume" fill="#4ade80" name="Volume" />
            <Bar dataKey="price" fill="#8b5cf6" name="Price" />
          </BarChart>
        </ResponsiveContainer>
      );

    case 'volume':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart {...commonProps}>
            {commonProps.children}
            <Area type="monotone" dataKey="volume" fill="#4ade80" stroke="#4ade80" name="Volume" fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      );

    case 'price':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart {...commonProps}>
            {commonProps.children}
            <Line type="monotone" dataKey="price" stroke="#8b5cf6" name="Price" />
            <Line type="monotone" dataKey="high" stroke="#4ade80" name="High" />
            <Line type="monotone" dataKey="low" stroke="#ef4444" name="Low" />
          </LineChart>
        </ResponsiveContainer>
      );
  }
};
