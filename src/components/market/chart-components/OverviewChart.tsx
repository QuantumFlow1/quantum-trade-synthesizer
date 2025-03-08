
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { CustomLegend } from './CustomLegend';
import { ChartData } from '../types';

interface OverviewChartProps {
  data: ChartData[];
}

export const OverviewChart = ({ data }: OverviewChartProps) => {
  return (
    <BarChart
      data={data}
      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
      <XAxis dataKey="name" stroke="#888888" />
      <YAxis stroke="#888888" />
      <Tooltip content={<CustomTooltip />} />
      <Legend formatter={(value) => value} />
      <Bar dataKey="volume" fill="#4ade80" name="Volume" />
      <Bar dataKey="price" fill="#8b5cf6" name="Price" />
    </BarChart>
  );
};
