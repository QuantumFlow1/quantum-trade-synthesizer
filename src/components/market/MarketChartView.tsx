
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LegendType } from 'recharts';

interface MarketChartViewProps {
  data: any[];
  type?: 'price' | 'volume' | 'overview';
}

const MarketChartView = ({ data, type = 'price' }: MarketChartViewProps) => {
  return (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend
        verticalAlign="top"
        align="right"
        content={({ payload }) => (
          <div className="flex items-center justify-end text-xs space-x-4 mb-2">
            {payload?.map((entry, index) => {
              const item = {
                value: entry.value,
                color: entry.color,
                type: entry.type as LegendType
              };
              
              return (
                <div key={`item-${index}`} className="flex items-center">
                  {item.type === "line" ? (
                    <div className="w-6 h-0.5" style={{ backgroundColor: item.color }}></div>
                  ) : (
                    <div className="w-3 h-3" style={{ backgroundColor: item.color }}></div>
                  )}
                  <span className="ml-1">{item.value}</span>
                </div>
              );
            })}
          </div>
        )}
      />
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
    </LineChart>
  );
};

export default MarketChartView;
