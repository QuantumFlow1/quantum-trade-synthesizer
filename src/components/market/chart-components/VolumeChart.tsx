
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { ChartData } from '../types';

interface VolumeChartProps {
  data: ChartData[];
}

export const VolumeChart = ({ data }: VolumeChartProps) => {
  return (
    <AreaChart
      data={data}
      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
      <XAxis dataKey="name" stroke="#888888" />
      <YAxis stroke="#888888" />
      <Tooltip content={<CustomTooltip />} />
      <Legend formatter={(value) => value} />
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
  );
};
