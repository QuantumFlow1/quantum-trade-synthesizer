
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area } from 'recharts';
import { ChartData } from '../types';
import { CustomTooltip } from './CustomTooltip';
import { renderCustomLegend } from './CustomLegend';

interface LineChartViewProps {
  data: ChartData[];
  hasProjections: boolean;
  projectionStartIndex: number;
}

export const LineChartView: React.FC<LineChartViewProps> = ({ 
  data, 
  hasProjections, 
  projectionStartIndex 
}) => {
  return (
    <LineChart 
      data={data}
      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
      <XAxis dataKey="name" stroke="#888888" />
      <YAxis stroke="#888888" />
      <Tooltip content={<CustomTooltip />} />
      <Legend 
        payload={[
          { value: 'Price', color: '#8b5cf6', type: 'line' as const },
          { value: 'High', color: '#4ade80', type: 'line' as const },
          { value: 'Low', color: '#ef4444', type: 'line' as const },
          ...(hasProjections ? [
            { value: 'Projection', color: '#f59e0b', type: 'line' as const },
            { value: 'Confidence Band', color: '#f59e0b', type: 'area' as const }
          ] : [])
        ]}
        content={renderCustomLegend} 
      />
      
      {/* Current price line */}
      <Line 
        type="monotone" 
        dataKey="price" 
        stroke="#8b5cf6" 
        name="Price" 
        strokeWidth={2}
        dot={{ r: 2 }}
        activeDot={{ r: 4 }}
      />
      
      {/* High and low lines */}
      <Line type="monotone" dataKey="high" stroke="#4ade80" name="High" strokeWidth={1.5} />
      <Line type="monotone" dataKey="low" stroke="#ef4444" name="Low" strokeWidth={1.5} />
      
      {/* Projected price line (if available) */}
      {hasProjections && (
        <>
          {/* Main projected price line */}
          <Line
            type="monotone"
            dataKey="projectedPrice"
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Projection"
            connectNulls={true}
            dot={{ r: 3, fill: "#f59e0b", strokeWidth: 1, stroke: "#fff" }}
          />
          
          {/* Confidence band - upper bound */}
          <Line
            type="monotone"
            dataKey="upperBand"
            stroke="#f59e0b"
            strokeWidth={1}
            strokeOpacity={0.4}
            strokeDasharray="3 3"
            name="Upper Bound"
            connectNulls={true}
            dot={false}
          />
          
          {/* Confidence band - lower bound */}
          <Line
            type="monotone"
            dataKey="lowerBand"
            stroke="#f59e0b"
            strokeWidth={1}
            strokeOpacity={0.4}
            strokeDasharray="3 3"
            name="Lower Bound"
            connectNulls={true}
            dot={false}
          />
          
          {/* Confidence band area */}
          <defs>
            <linearGradient id="confidenceBandGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="upperBand"
            stroke="none"
            fillOpacity={1}
            fill="url(#confidenceBandGradient)"
            name="Confidence Band"
            connectNulls={true}
          />
          
          {/* Divider line between actual and projected data */}
          <ReferenceLine 
            x={data[projectionStartIndex].name} 
            stroke="#f59e0b" 
            strokeDasharray="3 3"
            strokeWidth={1.5}
            label={{ 
              value: "AI Projections →", 
              position: "insideTopRight", 
              fill: "#f59e0b", 
              fontSize: 10,
              fontWeight: "bold",
              offset: 5
            }}
          />
        </>
      )}
    </LineChart>
  );
};
