
import { ChartData } from '../types';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    const isProjected = dataPoint.projected;
    
    return (
      <div className="bg-black/80 backdrop-blur-xl text-white p-2 rounded-lg border border-white/10 shadow-xl">
        <p className="text-sm font-medium">{label}</p>
        
        {isProjected ? (
          <>
            <p className="text-xs text-white/80 flex items-center justify-between">
              <span>Projected Price:</span>
              <span className="font-bold text-amber-400">${dataPoint.projectedPrice?.toFixed(2) || 'N/A'}</span>
            </p>
            <p className="text-xs text-white/80 flex items-center justify-between">
              <span>Confidence:</span>
              <span>{dataPoint.confidence ? (dataPoint.confidence * 100).toFixed(0) : 'N/A'}%</span>
            </p>
            <p className="text-xs text-white/80 flex items-center justify-between">
              <span>Range:</span>
              <span>${dataPoint.lowerBand?.toFixed(2) || 'N/A'} - ${dataPoint.upperBand?.toFixed(2) || 'N/A'}</span>
            </p>
            <div className="mt-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded text-center">
              AI Projection
            </div>
          </>
        ) : (
          <>
            <p className="text-xs text-white/80 flex items-center justify-between">
              <span>Price:</span>
              <span className="font-bold">${payload[0].value?.toFixed(2) || 'N/A'}</span>
            </p>
            {payload[1] && (
              <p className="text-xs text-white/80 flex items-center justify-between">
                <span>High:</span>
                <span>${payload[1].value?.toFixed(2) || 'N/A'}</span>
              </p>
            )}
            {payload[2] && (
              <p className="text-xs text-white/80 flex items-center justify-between">
                <span>Low:</span>
                <span>${payload[2].value?.toFixed(2) || 'N/A'}</span>
              </p>
            )}
          </>
        )}
      </div>
    );
  }
  return null;
};
