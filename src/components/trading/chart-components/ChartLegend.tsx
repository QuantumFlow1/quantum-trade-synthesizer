
import React from 'react';

interface LegendItem {
  label: string;
  color: string;
  type: 'line' | 'bar' | 'area' | 'dashed' | 'dotted';
}

interface ChartLegendProps {
  items: LegendItem[];
  className?: string;
}

export const ChartLegend = ({ items, className = '' }: ChartLegendProps) => {
  return (
    <div className={`bg-card/90 backdrop-blur-sm border rounded-md p-2 text-xs ${className}`}>
      <div className="flex flex-wrap gap-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {item.type === 'line' && (
              <div className="w-4 h-[2px]" style={{ backgroundColor: item.color }}></div>
            )}
            {item.type === 'bar' && (
              <div className="w-4 h-3" style={{ backgroundColor: item.color }}></div>
            )}
            {item.type === 'area' && (
              <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: `${item.color}40`, borderColor: item.color, borderWidth: '1px' }}></div>
            )}
            {item.type === 'dashed' && (
              <div className="w-4 h-[2px] border-t-[2px] border-dashed" style={{ borderColor: item.color }}></div>
            )}
            {item.type === 'dotted' && (
              <div className="w-4 h-[2px] border-t-[2px] border-dotted" style={{ borderColor: item.color }}></div>
            )}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
