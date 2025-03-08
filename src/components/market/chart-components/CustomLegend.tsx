
import { LegendProps } from 'recharts';

interface CustomLegendProps extends LegendProps {
  payload?: Array<{
    value: string;
    color: string;
    type?: 'line' | 'rect' | 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye' | 'none';
  }>;
}

export const CustomLegend = (props: CustomLegendProps) => {
  const { payload } = props;
  
  if (!payload) return null;
  
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-2 text-xs">
      {payload.map((entry, index) => {
        const isProjection = entry.value.includes('Projection') || entry.value.includes('Bound') || entry.value.includes('Band');
        return (
          <div key={`item-${index}`} className="flex items-center gap-1.5">
            <div 
              className={`w-3 h-2 ${isProjection ? 'border-t-[2px] border-dashed' : ''}`} 
              style={{ 
                backgroundColor: isProjection ? 'transparent' : entry.color,
                borderColor: isProjection ? entry.color : 'transparent'
              }}
            />
            <span style={{ color: entry.color }}>{entry.value}</span>
          </div>
        );
      })}
    </div>
  );
};
