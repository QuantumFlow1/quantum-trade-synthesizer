
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartData } from '../types';
import { CustomTooltip } from './CustomTooltip';

interface BarChartViewProps {
  data: ChartData[];
}

export const BarChartView: React.FC<BarChartViewProps> = ({ data }) => {
  return (
    <BarChart 
      data={data}
      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
      <XAxis dataKey="name" stroke="#888888" />
      <YAxis stroke="#888888" />
      <Tooltip content={<CustomTooltip />} />
      <Bar dataKey="volume" fill="#4ade80" name="Volume" />
      <Bar dataKey="price" fill="#8b5cf6" name="Price" />
    </BarChart>
  );
};
